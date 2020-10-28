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
  router.get('/user/register_or_login_code/:phone', controller.user.registerOrLoginCode)
  // 短信验证码 注册 / 登录 新用户-注册 老用户-直接登录
  router.post('/user/register_or_login', controller.user.registerOrLogin)


  // 获取重设密码的短信验证码
  router.get('/user/pwd_code/:phone', controller.user.getResetCode)
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

  // 删除好友
  router.put('/friend/:user_id', controller.friend.deleteFriend)

  // 获取所有消息列表
  // router.get('/message', controller.message.getAllMessage)

  router.get('/message/chat', controller.message.getChatMessage)
  router.get('/message/friend', controller.message.getFriendMessage)
  router.get('/message/group', controller.message.getGroupMessage)

  // 创建消息
  router.post('/message/chat', controller.message.createChatMessage)
  router.post('/message/friend', controller.message.createFriendMessage)
  router.post('/message/group', controller.message.createGroupMessage)

  // view message
  router.post('/message/chat/view', controller.message.viewChatMessage)
  router.post('/message/friend/view', controller.message.viewFriendMessage)
  router.post('/message/group/view', controller.message.viewGroupMessage)

  // permit or reject
  router.post('/message/friend/handle', controller.message.handleFriendMessage)
  router.post('/message/group/handle', controller.message.handleGroupMessage)

  router.get('/assume_rule', controller.oss.getAssumeRule)

  // group
  router.post('/group', controller.group.createGroup)
  // 删除群组
  router.delete('/group/:group_id', controller.group.delGroup)


  //group_user
  router.post('/group_user/join', controller.groupUser.joinGroup)
  router.get('/group_user', controller.groupUser.getGroup)
  router.get('/group_user/:group_id', controller.groupUser.getGroupUser)


  // group good
  router.get('/group_good/:group_id',controller.groupGood.getGroupGood)

  // good
  router.get('/good', controller.good.getGood)
  router.post('/good', controller.good.createGood)
  router.delete('/good/:good_id', controller.good.delGood)

  // good detail
  router.get('/good/detail/:good_id', controller.good.getGoodDetail)
  router.post('/good/edit', controller.good.editGood)


  io.of('/').route('login', io.controller.message.index)
  io.of('/').route('addFriend', io.controller.message.addFriend)
  io.of('/').route('inviteFriend', io.controller.message.inviteFriend)
  io.of('/').route('permitJoinGroup', io.controller.message.permitJoinGroup)
  io.of('/').route('rejectJoinGroup', io.controller.message.rejectJoinGroup)


};
