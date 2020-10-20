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
  async create(userGroupDTO) {
    return this.app.mysql.insert('user_group', userGroupDTO)
  }
}

module.exports = UserGroupService;
