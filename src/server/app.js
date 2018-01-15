// 引入模块
import Koa from 'koa';
import KoaStatic from 'koa-static';
import Router from 'koa-simple-router';
import bodyParser from 'koa-bodyparser';
import fs from 'fs';
import ReactSSR from 'react-dom/server';

import path from 'path';

import InitController from './controllers/InitController';
import Controller from './utils/dev.static';
import config from './config/main';

// 读取模板文件

const app = new Koa();

// 使用 bodyParser 和 KoaStatic 中间件
app.use(bodyParser());

const isDev = process.env.NODE_ENV === 'development';

if (!isDev) {
  const template = fs.readFileSync(path.join(__dirname, '../../dist/index.html'), 'utf8');
  app.use(KoaStatic(path.join(__dirname, '..', '../dist')));
  app.get('*', (ctx, next) => {
    const appString = ReactSSR.renderToString(serverEntry);
    ctx.body = appString;
  })
  app.use(Router(_ => _.get('/', (ctx) => ctx.body = template.replace('<!-- <app></app> -->', '<div>服务端渲染</div>'))))

} else {
  Controller.init(app, Router);
}

app.listen(config.port);

console.log('server listen port: ' + config.port);

