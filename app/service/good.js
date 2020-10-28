/*
 * @Author: your name
 * @Date: 2020-06-23 16:03:14
 * @LastEditTime: 2020-06-24 15:02:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \family-kit-api\app\service\user.js
 */
'use strict'
const Service = require('egg').Service;

class GoodService extends Service {
  async getGood(user_id) {
    return await this.app.mysql.query(
      `
      select g.*,
      (select url from good_img where good_id = g.id and is_delete = 0 limit 1) as good_img_url
      from good as g
      where g.owner_user_id = :user_id and g.is_delete = 0
      `, {
        user_id
      }
    )
  }

  // 获取物品详情
  // 暂时的需求就是把所有物品的img列出
  async getGoodDetail(good_id) {
    let good_img_urls = await this.app.mysql.query(
      `
      select url from good_img where
      good_id = :good_id and is_delete = 0
      `,
      {
        good_id
      }
    )
    return {
      good_img_urls
    }
  }

  async createGood(goodDTO) {
    return await this.app.mysql.insert('good', goodDTO)
  }

  async editGood(goodDTO) {
    return await this.app.mysql.update('good', goodDTO)
  }

  async delGood({owner_user_id, good_id}) {
    return await this.app.mysql.update('good', {
      owner_user_id,
      id: good_id,
      is_delete: 1
    })
  }
}

module.exports = GoodService;
