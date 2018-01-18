import axios from 'axios'
import path from 'path'
import proxy from 'koa-proxy'
import serialize from 'serialize-javascript'
import ejs from 'ejs'
import webpack from 'webpack'
// 内存中读写文件
import MemoryFs from 'memory-fs'
import asyncBootstrap from 'react-async-bootstrapper'
import ReactDomServer from 'react-dom/server'

import webpackServerConfig from '../../../build/webpack.config.server'

const Module = module.constructor

const mfs = new MemoryFs()
// 监听文件输出内容变化
const serverCompiler = webpack(webpackServerConfig)
// webpack配置项 从内存中读取文件
serverCompiler.outputFileSystem = mfs
let serverBundle, createStoreMap
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats.toJson()
  if (stats.errors && stats.errors.length > 0) {
    stats.errors.forEach((err) => console.error(err))
  }
  if (stats.warnings && stats.warnings.length > 0) {
    stats.warnings.forEach((warn) => console.error(warn))
  }

  const bundlePath = path.join(
    webpackServerConfig.output.path,
    webpackServerConfig.output.filename
  )

  const bundle = mfs.readFileSync(bundlePath, 'utf-8')

  const m = new Module()
  // 一定要指定文件名 不然无法再缓存中存储
  m._compile(bundle, 'server-entry.js')
  serverBundle = m.exports.default
  createStoreMap = m.exports.createStoreMap
})

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
}

const InitController = {
  init (app, router) {
    app.use(proxy({
      host: 'http://localhost:8888',     // 代理的地址
      match: /.js$/ // 代理只匹配以js结尾的
    }))
    app.use(router(_ => {
      _.get('*', async (ctx) => {
        const template = await getTemplate().then(template => template)
        const routerContext = {}
        const stores = createStoreMap && createStoreMap()
        const app = serverBundle(stores, routerContext, ctx.request.url)

        // 等数据处理完毕
        await asyncBootstrap(app)

        const state = getStoreState(stores)

        if (routerContext.url) {
          ctx.status = 302
          ctx.redirect(routerContext.url)
          ctx.body = 'Redirecting to shopping cart';
          return
        }
        const content = ReactDomServer.renderToString(app)
        const html = ejs.render(template, {
          appString: content,
          initialState: serialize(state),
        })
        ctx.body =  html
      })
    }))
  }
}


export default InitController
