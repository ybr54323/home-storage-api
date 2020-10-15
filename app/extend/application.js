module.exports = {
  // 成功
  SUCCESS_CODE: 200,
  // 未登录
  NO_LOGIN: 401,
  // 参数错误
  PARAMETER_ERROR: 402,

  // 资源为空
  RESOURCES_NULL: 204,
  // 其他状态
  OTHER: 303,
  // 资源不存在
  RESOURCES_NOT_FOUND: 404,
  // 参数缺失
  PARAMETER_MISSING: 10001,
  PARAMETER_TYPE_ERROR: 10002,

  // sql插入或者更新失败
  INSERT_FAIL: 405,
  UPDATE_FAIL: 406,

  // 内部错误
  SERVICE_ERROR: 500,
  /**
   *
   * @param code
   * @param {*} data
   * @param message
   */
  success({code = 200, data = null, msg = '成功', loggerMsg = null}) {
    this.ctx.body = {
      code: this.ctx.SUCCESS_CODE,
      data,
      msg
    };
    this.ctx.status = 200;
    if (loggerMsg) this.logger.info(loggerMsg)

  },

  /**
   *
   * @param {*} code
   * @param {*} msg
   */
  fail({code, msg = '失败'}) {
    this.ctx.body = {
      code,
      data: null,
      msg,
    }
    this.logger.info(msg)
    this.ctx.status = 200
  }
}
