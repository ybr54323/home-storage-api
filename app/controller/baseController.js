'use strict'

const {Controller} = require('egg')

class BaseController extends Controller {

  success({code = 200, data = {}, msg = '成功', loggerMsg = null}) {
    this.ctx.body = {
      code,
      data,
      msg
    };
    this.ctx.status = 200
    if (loggerMsg) this.app.logger.info(loggerMsg)
  }

  fail({code = 200, data = {}, msg = '成功', loggerMsg = null}) {
    this.ctx.body = {
      code,
      data,
      msg,
    }
    this.ctx.status = 200
    if (loggerMsg) this.app.logger.error(loggerMsg)

  }

}

module.exports = BaseController
