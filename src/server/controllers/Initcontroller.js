import IndexController from './IndexController';

const IndexControllerInx = new IndexController();

const InitController = {
  init(app, router) {
    app.use(router(_ => {
      _.get('/', IndexControllerInx.index());
      _.get('/index.html', IndexControllerInx.index())
    }))
  }
};

export default InitController;
