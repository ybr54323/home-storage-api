'use strict'
const Service = require('egg').Service;

class MessageService extends Service {

  // 获取聊天消息
  // 发起人和接收人
  // async getAllMessage(user_id) {
  //   const chatMessage = await this.getChatMessage(user_id)
  //   const friendMessage = []
  //   const groupMessage = []
  //
  //   const allMessage = await this.app.mysql.query(
  //     `
  //     select m.*,
  //     (select url from user_avatar where user_id = m.source_user_id and is_active = 1 and is_delete = 0) as source_user_avatar_url,
  //     (select name from user where id = m.source_user_id) as source_user_name
  //     from message as m
  //     where m.target_user_id = :user_id and m.target_user_is_delete = 0 and m.is_delete = 0
  //     limit 100
  //     `, {
  //       user_id
  //     }
  //   )
  //
  //   allMessage.forEach(message => {
  //     const {type} = message
  //     const messages = type === 1 ? chatMessage : type === 2 ? friendMessage : groupMessage
  //     messages.push(message)
  //   })
  //
  //   return {
  //     chatMessage,
  //     friendMessage,
  //     groupMessage
  //   }
  // }

  // 获取聊天信息
  async getChatMessage(user_id) {

    const message = await this.app.mysql.query(
      `
      select * from message
      where 
      (source_user_id = :user_id and source_user_is_delete = 0)
      or
      (target_user_id = :user_id and target_user_is_delete = 0)
      and type = 1
      limit 1000
      `, {
        user_id
      }
    )
    const otherUserIds = new Set()
    message.forEach(m => {
      m.source_user_id !== user_id && otherUserIds.add(m.source_user_id)
      m.target_user_id !== user_id && otherUserIds.add(m.target_user_id)
    })

    const otherUsers = await this.app.mysql.query(
      `
      select u.*, 
      (select url from user_avatar where user_id = u.id and is_active = 1 and is_delete = 0) as avatar_url
      from user as u
      where u.id in (:ids)
      `, {
        ids: [...otherUserIds]
      }
    )
    message.forEach(m => {
      for (let i = 0; i < otherUsers.length; i++) {
        const u = otherUsers[i]
        if (m.source_user_id === u.id) {
          m.target_user_name = u.name
          m.target_user_avatar_url = u.avatar_url
          break
        }
        if (m.target_user_id === u.id) {
          m.target_user_name = u.name
          m.target_user_avatar_url = u.avatar_url
          break
        }
      }
    })
    return message
  }

  async getFriendMessage(user_id) {
    return this.getMessage({type: 2, user_id})
  }

  async getGroupMessage(user_id) {
    return this.getMessage({type: 3, user_id})
  }

  /**
   *
   * @param type 1.聊天信息、2.好友邀请信息、3.群组邀请信息
   * @param user_id 当前用户的id
   * @returns {Promise<void>}
   */
  async getMessage({type, user_id}) {
    if (type === 3) {
      return await this.app.mysql.query(
        `
      select m.*,
      (select url from user_avatar where user_id = m.source_user_id and is_active = 1 and is_delete = 0) as source_user_avatar_url,
      (select name from user where id = m.source_user_id) as source_user_name,
      g.name as group_name,
      (select url from group_avatar where group_id = g.id and is_active = 1 and is_delete = 0) as group_avatar_url
      from message as m 
      join my_group as g on g.id = m.group_id  
      where m.target_user_id = :user_id and m.target_user_is_delete = 0 and m.type = :type and m.is_delete = 0
      limit 100
      `, {
          type,
          user_id
        }
      )
    } else if (type === 2) {
      // 搜索出所有聊天信息、并且带上对方的姓名、头像url
      return await this.app.mysql.query(
        `
      select m.*,
      (select url from user_avatar where user_id = m.source_user_id and is_active = 1 and is_delete = 0) as source_user_avatar_url,
      (select name from user where id = m.source_user_id) as source_user_name
      from message as m 
      where m.target_user_id = :user_id and m.target_user_is_delete = 0 and m.type = :type and m.is_delete = 0
      limit 100
      `, {
          type,
          user_id
        }
      )
    }


  }


  // 查看聊天信息
  async viewChatMessage(target_user_id) {
    return await this.batchUpdate({type: 1, target_user_id})
  }

  // 查看好友申请信息
  async viewFriendMessage(target_user_id) {
    return await this.batchUpdate({type: 2, target_user_id})

  }

  // 查看群组申请信息
  async viewGroupMessage(target_user_id) {
    return await this.batchUpdate({type: 3, target_user_id})

  }

  // 处理聊天信息
  async handleChatMessage({message_id, target_user_id, answer}) {
    return await this.update({id: message_id, type: 1, target_user_id, answer})
  }

  // 处理好友申请信息
  async handleFriendMessage({message_id, answer}) {
    return await this.update({id: message_id, answer})
  }

  // 处理群组申请信息
  async handleGroupMessage({message_id, answer}) {
    return await this.update({id: message_id, answer})
  }

  async batchUpdate({type, target_user_id}) {
    return await this.app.mysql.query(
      `
      update message set target_user_is_read = 1 
      where type = :type and target_user_is_read = 0 and target_user_id = :target_user_id
      `, {
        type,
        target_user_id,
      }
    )

  }

  // 创建消息
  async create(messageDTO) {
    return await this.app.mysql.insert('message', messageDTO)
  }

  // 批量建群组邀请信息
  async batchCreateGroupMessage({source_user_id, target_user_ids, group_id}) {
    const sql =
      `
      insert into message (source_user_id, target_user_id, group_id, type) values ?
      `
    const values = []
    target_user_ids.forEach(id => {
      values.push([
        source_user_id, id, group_id, 3
      ])
    })
    return await this.app.mysql.query(sql, [values])
  }

  // 更新消息
  async update(messageDTO) {
    return await this.app.mysql.update('message', messageDTO)
  }
}

module.exports = MessageService;
