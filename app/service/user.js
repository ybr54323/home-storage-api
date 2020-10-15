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

class UserService extends Service {

  // 用户账号密码登录
  async show(userDTO) {
    if (Array.isArray(userDTO)) {
      const user_id_list = userDTO;
      return await this.app.mysql.query(
        `
        select u.id, u.name, u_a.url as avatar 
        from user as u
        join user_avatar as u_a on u.id = u_a.user_id and u_a.is_active = 1
        where u.id in (:user_id_list)
        `, {
          user_id_list
        }
      );
    } else if (typeof userDTO === 'object') {
      return await this.search(userDTO)
    }
  }

  // 创建用户
  async create(userObj) {
    return this.app.mysql.insert('user', userObj);
  }

  // 更新用户信息
  async update(userObj) {
    return this.app.mysql.update('user', userObj);
  }


  // 用户属性字段搜索 {id, name, phone}
  async search(userDTO) {
    let query =
      `
      select u.id, u.name, u_a.url as avatar,
      from user as u 
      join user_avatar as u_a on u.id = u_a.user_id and u_a.is_active = 1 
      where
      `
    for (let property in userDTO) {
      if (userDTO.hasOwnProperty(property)) {
        query +=
          `
          u.${[property]} = :${[property]} and
          `
      }
    }
    query += ` u.is_delete = 0 limit 1`
    return await this.app.mysql.query(query, {...userDTO})
  }

  async searchByName(name) {
    return await this.app.mysql.query(
      `
      select u.id, u.name
      from user as u
      join user_avatar as u_a on u.id = u_a.user_id and u_a.is_active = 1
      where u.name like %:name% and is_delete = 0
      `, {
        name
      }
    )

  }
}

module.exports = UserService;
