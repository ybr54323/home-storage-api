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

class FriendService extends Service {


  async index(id_list = []) {
    if (!id_list.length) return [];
    return this.app.mysql.query(
      `select u.*, f.path as custom_avatar_url from user as u
       join ybr_file as f on f.id = u.avatar_id
       where u.id in (:id_list) and status = 1
      `, {
        id_list
      }
    );
  }

  // TODO
  async show(userObj) {
    if (Array.isArray(userObj)) {
      const id_list = userObj;
      return await this.app.mysql.query(
        `select u.*, f.path as custom_avatar_url from user as u
       join ybr_file as f on f.id = u.avatar_id
       where u.id in (:id_list) and status = 1
      `, {
          id_list
        }
      );
    } else if (typeof userObj === 'object') {
      return await this.app.mysql.select('user', { where: userObj, limit: 1 });
    }
  }



  async create(friendDto) {
    return this.app.mysql.insert('friend', friendDto);
  }

}

module.exports = FriendService;
