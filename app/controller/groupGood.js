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

class GroupGoodController extends BaseController {


  async getGroupGood() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const {ctx: {params: {group_id}}} = this
    const goods = await this.ctx.service.groupGood.getGroupGood(group_id)
    this.success({
      data: {
        goods
      },
      loggerMsg: `[获取群组物品]{id}: ${id} {group_id}: ${group_id}`
    })
  }
}

module.exports = GroupGoodController;
