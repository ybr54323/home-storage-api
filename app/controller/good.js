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

  // 获取物品详情
  // 暂时的需求就是把所有物品的img列出
  async getGoodDetail() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const {ctx: {params: {good_id}}} = this
    const goodDetail = await this.ctx.service.good.getGoodDetail(good_id)
    this.success({
      data: {
        goodDetail
      },
      loggerMsg: `[获取物品详情]{id}: ${id} {good_id}: ${good_id}`
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

  async editGood() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const {
      ctx: {
        request: {
          body: {
            good_id,
            name,
            des,
            imgUrls,
          }
        }
      }
    } = this
    this.ctx.validate({
      good_id: {type: 'string', required: true},
      name: {type: 'string', required: true}
    }, {good_id, name})

    await this.ctx.service.good.editGood({
      id: good_id,
      name,
      des
    })
    if (imgUrls.length && Array.isArray(imgUrls)) {
      await this.ctx.service.goodImg.editGoodImgs({
        good_id,
        urls: imgUrls
      })
    }
    this.success({msg: '编辑成功', loggerMsg: `[编辑物品成功]{id}: ${id}, {good_id}: ${good_id}`})
  }

}

module.exports = GoodController;

