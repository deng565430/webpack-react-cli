class IndexController {
  constructor (ctx) {
    this.ctx = ctx
  }
  index () {
    return async (ctx, next) => {
      ctx.body = '123'
    }
  }
}
export default IndexController
