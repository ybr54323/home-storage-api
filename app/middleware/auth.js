/*
 * @Author: your name
 * @Date: 2020-06-23 11:01:16
 * @LastEditTime: 2020-06-29 16:03:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \family-kit-api\app\middleware\auth.js
 */
'use strict'

const {NoLoginError, CodeTimeoutError} = require('../error/error');
const r = RegExp

module.exports = (options, app) => {
  return async function auth(ctx, next) {
    const {path, method, session: {userInfo = null}} = ctx
    if (!isFreePath(path)) {
      if (!userInfo) {
        if (isVCodePath(path)) {
          throw new CodeTimeoutError()
        }
        throw new NoLoginError()
      }
      await next()
    } else {
      await next()
    }

    // 不需要鉴权的路由
    function isFreePath(path) {
      const freeRouteList = [
        /\/user\/register_or_login_code\/\d+/, // 获取 注册 / 登录 的短信验证码
        /\/user\/pwd_code\/\d+/, // 获取重设密码的短信验证码
        /\/user\/phone_pwd_login/ // 手机号码密码登录
      ]
      return freeRouteList.some(r => r.test(path))
    }

    // 同样是未登录，如果是校验验证码的路由、则抛出CodeTimeoutError, 返回msg是:请重新获取短信验证码, 当作是验证码超时
    function isVCodePath(path) {
      const interceptor = [
        /\/user\/register_or_login/, // 注册 / 登陆的校验验证码路由
        /\/user\/pwd/ // 重设登陆密码
      ]
      return interceptor.some(r => r.test(path))
    }
  };
};
