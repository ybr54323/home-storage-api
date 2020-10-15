/*
 * @Author: your name
 * @Date: 2020-10-12 15:14:01
 * @LastEditTime: 2020-06-23 15:48:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \family-kit-api\app\extend\content.js
 */
'use strict'
module.exports = {
  // 成功
  SUCCESS_CODE: 200,
  // 未登录
  NO_LOGIN: 401,
  // 资源为空
  RESOURCES_NULL: 204,
  // 其他状态
  OTHER: 303,
  // 资源不存在
  RESOURCES_NOT_FOUND: 404,
  // 参数缺失
  PARAMETER_MISSING: 10001,
  PARAMETER_TYPE_ERROR: 10002,

  ERROR_CODE: 402,

  // sql插入或者更新失败
  INSERT_FAIL: 405,
  UPDATE_FAIL: 406,

  // 内部错误
  SERVICE_ERROR: 500,
};
