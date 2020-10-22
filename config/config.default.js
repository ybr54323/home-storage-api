/* eslint valid-jsdoc: "off" */

'use strict';
const {ParamsError, NoLoginError, UnExpectError, CodeTimeoutError, ResourceNoExistError} = require('../app/error/error')
const CryptoJS = require("crypto-js");
// const bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
// const originalText = bytes.toString(CryptoJS.enc.Utf8);

const en_redisHost = 'U2FsdGVkX1+V+dAicwlooUHl1tU+F1IDa23XMgdBkKY=',
  en_redisAuthPass = 'U2FsdGVkX1+BCANTxEJkZ/aKYknO2AZfJud4GOwcKIo=',
  en_zhenziyunAppId = 'U2FsdGVkX1/PWTChxASMDdQAXV2X4+5x9toJPhbdctM=',
  en_zhenziyunAppSecret = 'U2FsdGVkX18OD3ZY+mSswmCwOLh5g6qXkp7mKcfBGpzhIEc7eodpEjxmfO45VEjo\n',
  en_mysqlHost = 'U2FsdGVkX1/i1dpKgeGA0675KJG7tu0/RiMp35wJ8XTGKqXFngdR7Uy53gU40Gd09UidWfBDlY62WpjCSeQzGA==',
  en_mysqlUser = 'U2FsdGVkX1/sWBan8NrjPl3yt7hEVq6u59yN3YhhOT4=',
  en_mysqlPassword = 'U2FsdGVkX1/kCGPGuRd+UVYSTFsc76KrG0zcBFeSu9ugk4v3/2htIQTSrFYVOv/g\n',
  en_mysqlDataBase = 'U2FsdGVkX1/xgwJm9w6dnyjYJw29aDVorvzMWKRhkSU='

const redisHost = CryptoJS.AES.decrypt(en_redisHost, 'ybr').toString(CryptoJS.enc.Utf8),
  redisAuthPass = CryptoJS.AES.decrypt(en_redisAuthPass, 'ybr').toString(CryptoJS.enc.Utf8),
  zhenziyunAppId = CryptoJS.AES.decrypt(en_zhenziyunAppId, 'ybr').toString(CryptoJS.enc.Utf8),
  zhenziyunAppSecret = CryptoJS.AES.decrypt(en_zhenziyunAppSecret, 'ybr').toString(CryptoJS.enc.Utf8),
  mysqlHost = CryptoJS.AES.decrypt(en_mysqlHost, 'ybr').toString(CryptoJS.enc.Utf8),
  mysqlUser = CryptoJS.AES.decrypt(en_mysqlUser, 'ybr').toString(CryptoJS.enc.Utf8),
  mysqlPassword = CryptoJS.AES.decrypt(en_mysqlPassword, 'ybr').toString(CryptoJS.enc.Utf8),
  mysqlDataBase = CryptoJS.AES.decrypt(en_mysqlDataBase, 'ybr').toString(CryptoJS.enc.Utf8)

// console.log(process.env.MYKEY)
// console.log('redisHost' + redisHost)
// console.log('redisAuthPass' + redisAuthPass)
// console.log('zhenziyunAppId' + zhenziyunAppId)
// console.log('zhenziyunAppSecret' + zhenziyunAppSecret)
// console.log('mysqlHost' + mysqlHost)
// console.log('mysqlUser' + mysqlUser)
// console.log('mysqlPassword' + mysqlPassword)
// console.log('mysqlDataBase' + mysqlDataBase)

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1602466885227_4751';

  // add your middleware config here
  config.middleware = ['auth'];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  config.io = {
    init: {}, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
    },
    redis: {
      host: redisHost,
      port: 6379,
      auth_pass: redisAuthPass,
      db: 1,
    },
  };
  config.zhenziyun = {
    app_id: zhenziyunAppId,
    app_secret: zhenziyunAppSecret,
  }
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: mysqlHost,
      // 端口号
      port: 3306,
      // 用户名
      user: mysqlUser,
      // 密码
      password: mysqlPassword,
      // 数据库名
      database: mysqlDataBase, // 数据库名
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false
  }
  config.redis = {
    client: {
      host: redisHost,
      port: 6379,
      password: redisAuthPass,
      db: 0,
    }
  }
  // return and log
  const fail = ({ctx, code = 200, data = {}, msg = '请再试', loggerMsg = null}) => {
    ctx.body = {
      code,
      data,
      msg,
    }
    ctx.status = 200
    if (loggerMsg) ctx.app.logger.error(loggerMsg)
  }
  config.onerror = {
    json(err, ctx) {
      if (err instanceof NoLoginError || err instanceof ParamsError || err instanceof CodeTimeoutError || err instanceof ResourceNoExistError) {
        return fail({ctx, code: err.errCode, msg: err.message})
      }
      if (err.code === 'invalid_param') {
        let msg = '',
          loggerMsg = ''
        err.errors.forEach(({field, message}, index) => {
          msg += `${field} ${message}`
          index === 0 ? loggerMsg = `[参数校验失败]{field}: ${field} ${message} ` : loggerMsg += `${field} ${message} `
        })
        return fail({ctx, code: 402, msg, loggerMsg})
      }
      if (err instanceof UnExpectError) {
        return fail({code: 408, msg: '未知错误', loggerMsg: `[未知错误] ${err.stack}`})
      }
      fail({code: 500, ctx, loggerMsg: `[代码执行错误] ${err.stack}`})
    }
  }
  config.security = {
    csrf: {
      enable: true,
      ignoreJSON: true,
      headerName: 'x-csrf-token',// 自定义请求头
    },
    domainWhiteList: ['http://localhost:8080']
  }
  config.cors = {
    origin: 'http://localhost:8080',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true
  }
  config.session = {
    key: 'EGG_SESS',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: true,
  };
  return {
    ...config,
    ...userConfig,
  };
};
