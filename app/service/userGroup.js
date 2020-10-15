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

class UserGroupService extends Service {
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

  // async create(field, value) {
  //   return this.app.mysql.insert('user', { [field]: value })
  // }
  async create(userObj) {
    return this.app.mysql.insert('user', userObj);
  }

  /**
   * @description 更新用户信息
   * @param {Object} userObj
   */
  async update(userObj) {
    return this.app.mysql.update('user', userObj);
  }

  async registerWidthMobile(phone) {
    return this.app.mysql.query('insert into user (phone) value(:phone)', { phone });
  }

  /**
   * 用手机号码搜索
   */
  async searchUserByPhone(phone) {
    return this.app.mysql.select('user', {
      where: {
        phone
      },
    })
  }

  /**
   * 用wx昵称搜索
   */
  async searchUserByNickName(nickname) {
    return this.app.mysql.select('user', {
      where: {
        nickname
      }
    })
  }

  /**
   * 用用户名搜索
   */
  async searchUserByUserName(username) {
    return this.app.mysql.select('user', {
      where: {
        username
      }
    })
  }
}

module.exports = UserGroupService;
