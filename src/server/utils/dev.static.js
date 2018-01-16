import axios from 'axios'
import path from 'path'
import proxy from 'koa-proxy'
import webpack from 'webpack'
// 内存中读写文件
import MemoryFs from 'memory-fs'
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
    axios.get('http://localhost:8888/public/index.html')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

const InitController = {
  init (app, router) {
    app.use(proxy({
      host: 'http://localhost:8888',     // 代理的地址
      match: /.js$/ // 代理只匹配以js结尾的
    }))
    let template
    getTemplate().then((res) => template = res)
    app.use(router(_ => {
      _.get('*', async (ctx) => {
        console.log()
        await getTemplate().then(template => {
          const routerContext = {}
          const app = serverBundle(createStoreMap(), routerContext, ctx.request.url)

          const content = ReactDomServer.renderToString(app)

          if (routerContext.url) {
            ctx.status = 302
            ctx.redirect(routerContext.url)
            ctx.body = 'Redirecting to shopping cart';
            return
          }

          ctx.body = template.replace('<!-- app -->', content)
        })
      })
    }))
  }
}

export default InitController
