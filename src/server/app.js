// 引入模块
import Koa from 'koa'
import KoaStatic from 'koa-static'
import Router from 'koa-simple-router'
import bodyParser from 'koa-bodyparser'
import fs from 'fs'
// import ReactSSR from 'react-dom/server'
import serverRender from './utils/server-render'

import path from 'path'

// import InitController from './controllers/InitController'
import Controller from './utils/dev.static'
import config from './config/main'
// 读取模板文件

const app = new Koa()

// 使用 bodyParser 和 KoaStatic 中间件
app.use(bodyParser())

const isDev = process.env.NODE_ENV === 'development'

if (!isDev) {
  const serverEntrt = require('../../dist/server-entry')
  const template = fs.readFileSync(path.join(__dirname, '../../dist/server.ejs'), 'utf8')
  app.use(KoaStatic(path.join(__dirname, '..', '../dist/')))
  app.use(Router(_ => _.get('*', async (ctx) => {
    const tem = await serverRender(serverEntrt, template, ctx)
    ctx.body = tem
  })))

} else {
  Controller.init(app, Router)
}

app.listen(config.port)

console.log('server listen port: ' + config.port)

