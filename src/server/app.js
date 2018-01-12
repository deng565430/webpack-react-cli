// 引入模块
import Koa from 'koa';
import KoaStatic from 'koa-static';
import Router from 'koa-simple-router';
import bodyParser from 'koa-bodyparser';
import path from 'path';

import InitController from './controllers/InitController';
import config from './config/main';

const app = new Koa();

// 使用 bodyParser 和 KoaStatic 中间件
app.use(bodyParser());

app.use(KoaStatic(path.join(__dirname + '/assets')));

InitController.init(app, Router);
app.listen(config.port);

console.log('graphQL server listen port: ' + config.port);

