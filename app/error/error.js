class HError extends Error {
  constructor({errCode, msg, loggerMsg}) {
    super(msg);
    this.errCode = errCode
    this.loggerMsg = loggerMsg
  }
}

class ParamsError extends HError {
  constructor(params = {errCode: 402, msg: '传参错误', loggerMsg: ''}) {
    super(params)
  }
}

class NoLoginError extends HError {
  constructor(params = {errCode: 401, msg: '未登录', loggerMsg: ''}) {
    super(params)
  }
}

class UnExpectError extends HError {
  constructor(params = {errCode: 408, msg: '未知错误', loggerMsg: ''}) {
    super(params);
  }
}

module.exports = {
  ParamsError,
  NoLoginError,
  UnExpectError
}
