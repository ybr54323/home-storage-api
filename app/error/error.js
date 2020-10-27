class HError extends Error {
  constructor({errCode, msg, loggerMsg}) {
    super(msg);
    this.errCode = errCode
    this.loggerMsg = loggerMsg
  }
}

class ParamsError extends HError {
  constructor({errCode = 402, msg = '传参错误', loggerMsg = ''} = {}) {
    super({errCode, msg, loggerMsg})
  }
}

class NoLoginError extends HError {
  constructor({errCode = 401, msg = '未登录，请先登陆', loggerMsg = ''} = {}) {
    super({errCode, msg, loggerMsg})
  }
}

class UnExpectError extends HError {
  constructor({errCode = 408, msg = '未知错误', loggerMsg = ''} = {}) {
    super({errCode, msg, loggerMsg})
  }
}

class CodeTimeoutError extends HError {
  constructor({errCode = 401, msg = '请重新获取短信验证码', loggerMsg = ''} = {}) {
    super({errCode, msg, loggerMsg})
  }
}

class ResourceNoExistError extends HError {
  constructor({errCode = 403, msg = '资源没找到', loggerMsg = ''} = {}) {
    super({errCode, msg, loggerMsg})
  }
}

// 重复错误
class RepeatError extends HError {
  constructor({errCode = 405, msg = '', loggerMsg = ''} = {}) {
    super({errCode, msg, loggerMsg})
  }
}

// 没权限
class PermissionDeniedError extends HError {
  constructor({errCode = 406, msg = '', loggerMsg = ''} = {}) {
    super({errCode, msg, loggerMsg})
  }
}

module.exports = {
  ParamsError,
  NoLoginError,
  UnExpectError,
  CodeTimeoutError,
  ResourceNoExistError,
  RepeatError
}
