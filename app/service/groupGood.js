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

class GroupGoodService extends Service {
  async createGroupGood({good_id, group_ids}) {
    const sql =
      `
      insert into group_good (good_id, group_id) values ?
      `
    const values = []
    group_ids.forEach(group_id => {
      values.push([
        good_id,
        group_id
      ])
    })
    return await this.app.mysql.query(sql, [values])
  }

  async getGroupGood(group_id) {
    return await this.app.mysql.query(
      `
      select g.id, g.name, g.des,
      (select url from good_img where good_id = g.id and is_delete = 0 limit 1) as good_img_url
      from good as g
      where g.id in
      (select good_id from group_good where group_id = :group_id and is_delete = 0)
      and g.is_delete = 0 
      `, {
        group_id
      }
    )
  }
}

module.exports = GroupGoodService;
