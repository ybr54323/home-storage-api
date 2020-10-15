/*
 * @Author: yangbingrui
 * @Date: 2020-06-19 14:24:29
 * @LastEditTime: 2020-06-24 17:00:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \family-kit-api\app\router.js
 */
'use strict';
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const that = this
  const {router, controller, io} = app;

  // 获取 注册 / 登录 的短信验证码
  router.get('/user/register_or_login_code', controller.user.registerOrLoginCode)
  // 短信验证码 注册 / 登录 新用户-注册 老用户-直接登录
  router.post('/user/register_or_login', controller.user.registerOrLogin)


  // 获取重设密码的短信验证码
  router.get('/user/pwd_code', controller.user.resetCode)
  // 校验短信验证码-重设密码-登录
  router.post('/user/pwd', controller.user.resetPwd)


  // 短信验证码 - 验证码通过 - 新用户 - 注册
  router.post('/user/register', controller.user.register)
  // 通过手机号码搜索用户
  router.get('/user/:phone', controller.user.searchByPhone)

  // 通过用户名搜索用户
  router.get('/users/:name', controller.user.searchByName)

  // 手机密码登录
  router.post('/user/phone_pwd_login', controller.user.phonePwdLogin)

  // 获取所有好友
  router.get('/friends', controller.friend.getFriend)

  // 添加好友
  router.post('/friend/:user_id', controller.friend.addFriend)

  // 删除好友
  router.put('/friend/:user_id', controller.friend.deleteFriend)

  // 获取聊天消息列表
  router.get('/message/chat', controller.message.getChatMessage)

  // 获取聊天消息列表
  router.get('/message/friend', controller.message.getChatMessage)

  // 获取聊天消息列表
  router.get('/message/group', controller.message.getChatMessage)

  // 消息
  router.post('/message', controller.message.createMessage)
  // 查看消息 (聊天消息)
  router.put('/message/:source_user_id', controller.message.viewMessage)
  // 处理消息
  router.put('/message/:message_id/:type/:answer', controller.message.answerMessage)


  io.of('/').route('exchange', io.controller.nsp.exchange)
};
