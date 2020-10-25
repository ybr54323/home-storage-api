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


  async deleteGoodImg({urls, good_id}) {

    return await this.app.mysql.query(
      `
      update good_img set is_delete = 1 where url 
      in (:urls) and good_id = :good_id 
      `, {
        urls, good_id
      }
    )
  }

  async editGoodImgs({good_id, urls}) {
    // 先查出已有的imgUrls
    const existImgs = await this.app.mysql.query(
      `
      select url from good_img where good_id = :good_id and is_delete = 0
      `, {
        good_id
      }
    )
    // 筛选出要加入的
    // 有相同的就不加入了
    const shouldInsertImgs = urls.filter(url => {
      let shouldInsert = true
      for (let i = 0; i < existImgs.length; i++) {
        const existImg = existImgs[i]
        if (existImg.url === url) {
          shouldInsert = false
          break
        }
      }
      return shouldInsert
    })
    // 筛选出要删除的
    const shouldDeleteImgs = existImgs.filter(url => {
      let shouldDelete = true
      for (let i = 0; i < existImgs.length; i++) {
        const existImg = existImgs[i]
        if (existImg.url === url) {
          shouldDelete = false
          break
        }
      }
      return shouldDelete
    })

    if (shouldInsertImgs.length) {
      await this.createGoodImg({
        good_id,
        urls: shouldInsertImgs
      })
    }
    if (shouldDeleteImgs.length) {

    }
    return true
  }
}

module.exports = GoodImg;
