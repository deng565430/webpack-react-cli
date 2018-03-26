import asyncBootstrap from "react-async-bootstrapper"
import ejs from "ejs"
import ReactDomServer from "react-dom/server"
import serialize from "serialize-javascript"
import Helmet from 'react-helmet'

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
}

export default async (bundle, template, ctx) => {
  const createStoreMap = bundle.createStoreMap && bundle.createStoreMap;
  const createApp = bundle.default;
  const routerContext = {};
  const stores = createStoreMap && createStoreMap();
  const app = createApp(stores, routerContext, ctx.request.url);

  // 等数据处理完毕
  await asyncBootstrap(app);

  const state = getStoreState(stores);

  if (routerContext.url) {
    ctx.status = 302;
    ctx.redirect(routerContext.url);
    ctx.body = "Redirecting to shopping cart";
    return;
  }

  const helmet = Helmet.rewind();
  const content = ReactDomServer.renderToString(app);
  const html = ejs.render(template, {
    appString: content,
    initialState: serialize(state),
    meta: helmet.meta.toString(),
    title: helmet.title.toString(),
    style: helmet.style.toString(),
    link: helmet.link.toString()
  });
  return html
}
