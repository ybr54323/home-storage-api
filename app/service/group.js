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

class GroupService extends Service {

  async show(user_id) {

    return await this.app.mysql.query(
      `
      select g.id, g.name, g.desc, 
      (select url from group_avatar where group_id = g.id and is_active = 1 and is_delete = 0) as group_avatar_url
      from my_group as g
      where g.id in
      (
      select group_id from group_user where
      (source_user_id = :user_id)
      or
      (target_user_id = :user_id)
      and is_delete = 0 
      )
      `,
      {user_id}
    )
  }

  async create(groupDTO) {
    return await this.app.mysql.insert('my_group', groupDTO)
  }

  async update(groupDTO) {
    return await this.app.mysql.update('my_group', groupDTO)
  }

  // 删除群组
  async delGroup({
                   group_id, user_id
                 }) {
    return await this.app.mysql.query(
      `update my_group set is_delete = 1 where id = :group_id and owner_user_id = :user_id limit 1`, {
        group_id,
        user_id
      }
    )
  }
}

module.exports = GroupService;
