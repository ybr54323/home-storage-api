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
  async createGroup() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const {ctx: {request: {body: {name, desc, avatarUrl, friendIds}}}} = this
    this.ctx.validate({name: {required: true, type: 'string'}}, {name})
    const {insertId: groupInsertId} = await this.ctx.service.group.create({owner_user_id: id, name, desc})
    if (avatarUrl) {
      const {gAInsertId} = await this.ctx.service.groupAvatar.create({url: avatarUrl, group_id: groupInsertId,})
      await this.ctx.service.group.update({id: groupInsertId, avatar_id: gAInsertId})
    }
    if (friendIds.length) {
      await this.ctx.service.message.batchCreateGroupMessage({
        source_user_id: id,
        target_user_ids: friendIds,
        group_id: groupInsertId
      })
      this.app.logger.info(`[创建群组消息]{group_id}: ${groupInsertId} {source_user_id}: ${id} {target_user_ids}: ${friendIds}`)
    }
    this.success({msg: '创建成功', loggerMsg: `[群组][创建成功]{name}: ${name} {owner_user_id}: ${id}`})
  }

  async getGroup() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const group = await this.ctx.service.group.show(id)
    this.success({data: {group}, msg: '创建成功', loggerMsg: `[搜索群组]{id}: ${id} `})
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
