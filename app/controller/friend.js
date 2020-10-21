'use strict'
const BaseController = require('./baseController')

const {generateCode, getDate} = require('../util/index')
const {ParamsError} = require('../error/error')

class FriendController extends BaseController {
  async getFriend() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const friend = await this.ctx.service.friend.getFriend(id)
    this.success({data: {friend}, msg: '获取成功', loggerMsg: `[获取好友信息]{id}: ${id}`})
  }

  async deleteFriend() {
    
  }

}

module.exports = FriendController;
