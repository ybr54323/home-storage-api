/*
 * @Author: your name
 * @Date: 2020-06-19 14:27:35
 * @LastEditTime: 2020-06-29 14:31:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \family-kit-api\app\controller\user.js
 */
'use strict'
const {UnExpectError} = require('../error/error')
const BaseController = require('./baseController')


class GroupUserController extends BaseController {

  async getGroup() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const group = await this.ctx.service.groupUser.getGroup(id)
    this.success({data: {group}, loggerMsg: `[获取用户所在群组]{user_id}: ${id}`})
  }

  async joinGroup() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const {ctx: {request: {body: {group_id, source_user_id}}}} = this
    this.ctx.validate({
      group_id: {type: 'string', required: true},
      source_user_id: {type: 'string', required: true}
    }, {group_id, source_user_id})
    await this.ctx.service.groupUser.create({
      id: group_id,
      source_user_id,
      target_user_id: id
    })
    this.success({
      msg: '加入成功',
      loggerMsg: `[加入群组成功]{group_id}: ${group_id} {target_user_id}: ${id} {source_user_id}: ${source_user_id}`
    })
  }

  // 群组下的用户
  async getGroupUser() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const {ctx: {params: {group_id}}} = this
    this.ctx.validate({group_id: {type: 'string', required: true}}, {group_id})
    const users = await this.ctx.service.groupUser.getGroupUser(group_id)
    this.success({data: {users}, loggerMsg: `[获取群组下的用户]{id}: ${id} {group_id}: ${group_id}`})
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

module.exports = GroupUserController;
