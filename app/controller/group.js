/*
 * @Author: your name
 * @Date: 2020-06-19 14:27:35
 * @LastEditTime: 2020-06-29 14:31:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \family-kit-api\app\controller\user.js
 */
'use strict'
const BaseController = require('./baseController')
const {UnExpectError} = require('../error/error')

class GroupController extends BaseController {

  async addFriend() {
    const {ctx: {request: {body: {source_user_id, target_user_id}}}} = this
    this.ctx.validate({
      type: {type: 'number', required: true},
      source_user_id: {type: 'id', required: true}, target_user_id: {type: 'id', required: true}
    }, {source_user_id, target_user_id})

    await this.ctx.service.message.create({
      source_user_id,
      target_user_id,
      type: 2,
      is_read: 0
    })
    this.success({
      msg: '发送成功',
      loggerMsg: `[新信息]\n source_user_id: ${source_user_id}\n target_user_id: ${target_user_id}`
    })
  }



  // async handle() {
  //   const {ctx: {request: {body: {message_id, answer}}}} = this
  //   await this.ctx.service.message.update({
  //     id: message_id,
  //     answer
  //   })
  //   const [message = null] = await this.ctx.service.message.find(message_id)
  //   if (message === null) {
  //     throw new UnExpectError()
  //   }
  //   let loggerMsg, msg
  //   switch (answer) {
  //     case 0:
  //       msg = '拒绝成功'
  //       loggerMsg = `[好友申请拒绝]\n target_user_id: ${this.ctx.session.userInfo.id}`
  //       break
  //     case 1:
  //       await this.ctx.service.friend.create({
  //         source_user_id: message.source_user_id,
  //         target_user_id: message.target_user_id,
  //         is_delete: 0
  //       })
  //       msg = '通过成功'
  //       loggerMsg = `[好友申请通过]\n target_user_id: ${this.ctx.session.userInfo.id}`
  //       break
  //   }
  //   this.success({
  //     msg,
  //     loggerMsg
  //   })
  // }
}

module.exports = GroupController;
