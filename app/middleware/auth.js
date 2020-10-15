/*
 * @Author: your name
 * @Date: 2020-06-23 11:01:16
 * @LastEditTime: 2020-06-29 16:03:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \family-kit-api\app\middleware\auth.js
 */
'use strict'

const {NoLoginError} = require('../error/error');

module.exports = (options, app) => {
  return async function auth(ctx, next) {
    const {path, method, session: {userInfo = null}} = ctx;
    if (!isFreePath(path)) {
      if (!userInfo) {
        throw new NoLoginError();
      }
      await next();
    } else {
      await next();
    }

    /**
     * @description 判断当前请求地址是否需要鉴权(请求头要带 Cookie)
     * @param {string} path 传入当前请求的路径
     */
    function isFreePath(path) {
      const freeRouteList = [
        '/user/register_or_login_code', // 获取 注册 / 登录 的短信验证码
        'user/reset_pwd_code', // 获取重设密码的短信验证码
      ]
      return freeRouteList.indexOf(path) >= 0
    }
  };
};
