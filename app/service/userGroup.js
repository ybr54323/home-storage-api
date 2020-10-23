'use strict'
const Service = require('egg').Service;

class UserGroupService extends Service {

  async getGroup(user_id) {
    return await this.app.mysql.query(
      `
      select g.*,
      (select url from group_avatar where group_id = g.id and is_active = 1 and is_delete = 0) as group_avatar_url
      from my_group as g
      where g.id in 
      (select group_id from group_user where is_delete = 0 and source_user_id = :user_id or target_user_id = :user_id)
      and g.is_delete = 0
      `,
      {user_id}
    )
  }

  async create(userGroupDTO) {
    return this.app.mysql.insert('group_user', userGroupDTO)
  }

  async find(userGroupDTO) {
    return this.app.mysql.select('group_user', {
      where: {
        ...userGroupDTO
      },
      limit: 1
    })
  }
}

module.exports = UserGroupService;
