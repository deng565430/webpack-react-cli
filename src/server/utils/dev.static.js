import axios from 'axios'
import path from 'path'
import proxy from 'koa-proxy'
import webpack from 'webpack'
// 内存中读写文件
import MemoryFs from 'memory-fs'
import serverRender from './server-render'

import webpackServerConfig from '../../../build/webpack.config.server'

const NativeMoudule = require('module')
const vm = require('vm')
// const Module = module.constructor

const getModuleFromString = (bundle, filename) => {
  const m = {exports: {}}
  const wrapper = NativeMoudule.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  })
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m
}

const mfs = new MemoryFs()
// 监听文件输出内容变化
const serverCompiler = webpack(webpackServerConfig)
// webpack配置项 从内存中读取文件
serverCompiler.outputFileSystem = mfs
let serverBundle
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

  const m = getModuleFromString(bundle, "server-entry.js");
  /* const m = new Module()
  // 一定要指定文件名 不然无法再缓存中存储
  m._compile(bundle, 'server-entry.js') */
  serverBundle = m.exports
})

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/server.ejs')
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
    app.use(router(_ => {
      _.get('*', async (ctx) => {
        if (!serverBundle) {
          return ctx.body = 'waiting for compile, refresh later'
        }
        const template = await getTemplate().then(template => template)
        const html = await serverRender(serverBundle, template, ctx)
        ctx.body = html
      })
    }))
  }
}


export default InitController
