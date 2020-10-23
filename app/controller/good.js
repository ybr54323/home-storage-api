'use strict'
const BaseController = require('./baseController')

class GoodController extends BaseController {

  async getGood() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const good = await this.ctx.service.good.getGood(id)
    this.success({
      data: {good},
      loggerMsg: `[获取物品]{user_id}: ${id}`
    })
  }

  // 创建物品
  async createGood() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const {
      ctx: {
        request: {
          body: {
            name,
            des,
            imgUrls,
            groupIds
          }
        }
      }
    } = this
    this.ctx.validate({name: {type: 'string', required: true}}, {name})
    const {insertId} = await this.ctx.service.good.createGood({
      name,
      des,
      owner_user_id: id
    })
    // 物品-图片
    if (imgUrls.length) {
      await this.ctx.service.goodImg.createGoodImg({
        good_id: insertId,
        urls: imgUrls
      })
    }
    // 空间-物品
    if (groupIds.length) {
      await this.ctx.service.groupGood.createGroupGood({
        good_id: insertId,
        group_ids: groupIds
      })
    }
    this.success({msg: '创建物品成功', loggerMsg: `[创建物品]{id}: ${id} {good_id}: ${insertId}`})
  }

}

module.exports = GoodController;

