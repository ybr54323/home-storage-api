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

class GoodImg extends Service {
  async createGoodImg({urls, good_id}) {
    const sql =
      `
      insert into good_img (url, good_id) values ? 
      `
    const values = []
    urls.forEach(url => {
      values.push([
        url,
        good_id,
      ])
    })
    return await this.app.mysql.query(sql, [values])
  }
}

module.exports = GoodImg;
