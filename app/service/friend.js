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
  async getFriend(user_id) {
    const friend = await this.app.mysql.query(
      `
      select u.id, u.name,
      (select url from user_avatar where user_id = u.id and is_active = 1 and is_delete = 0) as avatar_url
      from user as u
      where u.id in
      (select target_user_id from friend where source_user_id = :user_id and is_delete = 0)
      or
      (select source_user_id from friend where target_user_id = :user_id and is_delete = 0)
      `,
      {
        user_id
      }
    )
    return friend.filter(f => f.id !== user_id)
  }

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
      return await this.app.mysql.select('user', {where: userObj, limit: 1});
    }
  }


  async create(friendDto) {
    return this.app.mysql.insert('friend', friendDto);
  }

  async find(friendDTO) {
    return this.app.mysql.select('friend', {
      where: {
        ...friendDTO
      },
      limit: 1
    })
  }
}

module.exports = FriendService;
