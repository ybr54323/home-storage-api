'use strict'
const BaseController = require('./baseController')

class GoodController extends BaseController {
  async index() {
  }

  async new() {
  }

  /**
   * 创建物品
   */
  async create() {
    const {
      ctx: {
        request: {
          body: {
            name,
            desc,
            group_id,
            img_list
          }
        }
      }
    } = this;
    this.ctx.validate({
      name: {type: 'string', required: true},
      desc: {type: 'string', required: true},
      group_id: {type: 'id', required: true},
    }, {name, desc, group_id})

    const {id} = await this.ctx.service.good.create({
      user_id: this.ctx.session.userInfo.id,
      name,
      desc,
    });
    await this.ctx.service.goodGroup.create({
      good_id: id,
      group_id,
    })
    if (Array.isArray(img_list)) {
      img_list.forEach(url => {
        this.ctx.service.imgGood.create({
          url,
          good_id: id
        })
      })
    }
    this.success({
      msg: '创建成功',
      loggerMsg: `[创建物品成功]\n user_id: ${this.ctx.session.userInfo.id}\n good_id: ${id}`
    })
  }

  async show() {
  }

  async edit() {
  }

  /**
   * 更新物品的信息
   */
  async update() {
    const {ctx, ctx: {session: {id}, request: {body: {good_info}}}} = this;
    ctx.validate({id: {type: 'userId', required: true}, good_info: {type: 'jsonString', required: true}}, {
      id,
      good_info
    })
    const goodInfo = JSON.parse(good_info);
    // good_name必须有
    // good_description 为字符串或者为空
    // file_path 为数组或者为空
    const {good_id, good_name, good_description, file_list} = goodInfo;
    ctx.validate({
      good_id: {type: 'myId', required: true}, good_name: {type: 'string', required: true},
      good_description: {type: 'string', required: false}, file_list: {type: 'array', required: false}
    }, {good_id, good_name, good_description, file_list});
    await ctx.service.good.update({user_id: id, good_id, good_name, good_description, file_list});
    this.success({good_info: goodInfo}, ctx.SUCCESS_CODE, '添加成功');
  }

  async destroy() {
  }
}

module.exports = GoodController;

