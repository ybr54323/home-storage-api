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
const {UnExpectError, PermissionDeniedError} = require('../error/error')

class GroupController extends BaseController {
  async createGroup() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const {ctx: {request: {body: {name, desc, avatarUrl, friendIds}}}} = this
    this.ctx.validate({name: {required: true, type: 'string'}}, {name})
    const {insertId: groupInsertId} = await this.ctx.service.group.create({owner_user_id: id, name, desc})
    if (avatarUrl) {
      await this.ctx.service.groupAvatar.create({url: avatarUrl, group_id: groupInsertId})
      console.log('avatarUrl', avatarUrl)
    }
    if (friendIds.length) {
      await this.ctx.service.message.batchCreateGroupMessage({
        source_user_id: id,
        target_user_ids: friendIds,
        group_id: groupInsertId
      })
      this.app.logger.info(`[创建群组消息]{group_id}: ${groupInsertId} {source_user_id}: ${id} {target_user_ids}: ${friendIds}`)
    }
    this.success({msg: '创建成功', loggerMsg: `[群组创建成功]{name}: ${name} {owner_user_id}: ${id}`})
  }

  async getGroup() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const group = await this.ctx.service.group.show(id)
    this.success({data: {group}, msg: '创建成功', loggerMsg: `[搜索群组]{id}: ${id} `})
  }


  async delGroup() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const {ctx: {params: {group_id}}} = this
    this.ctx.validate({group_id: {type: 'string', required: true}}, {group_id})
    const {affectedRows} = await this.ctx.service.group.delGroup({user_id: id, group_id})
    if (affectedRows) {
      this.success({msg: '删除成功', loggerMsg: `[群组删除成功]{id}: ${id} {group_id}: ${group_id}`})
      return
    }
    throw new PermissionDeniedError({
      msg: '删除失败，可能并没删除该群组的权限',
      loggerMsg: `[群组删除失败]{id}: ${id} {group_id}: ${group_id}`
    });
  }

}

module.exports = GroupController;
