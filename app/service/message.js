'use strict'
const Service = require('egg').Service;

class MessageService extends Service {

  // 获取聊天消息
  // 发起人和接收人
  async getChatMessage(user_id) {

    const allChatMessage = await this.app.mysql.query(
      `
      select *
      from message where source_user_id = :user_id or target_user_id = :user_id and is_delete = 0
      `, {
        user_id
      }
    )
    // 查出非当前用户的用户的信息
    const otherUserIds = new Set()
    allChatMessage.forEach(cM => {
      cM.source_user_id === user_id ? otherUserIds.add(cM.target_user_id) : otherUserIds.add(cM.source_user_id)
    })

    const otherUsers = await this.app.mysql.query(
      `
      select u.id, u.name, u_a.url as avatar
      from user as u
      join user_avatar as u_a on u_a.user_id = u.id and u_a.is_active = 1 and u_a.is_delete = 0
      where u.id in (:otherUserIds)
      `, {
        otherUserIds
      }
    )

    allChatMessage.forEach(cM => {
      for (let i = 0; i < otherUsers.length; i++) {
        const u = otherUsers[i]
        if (cM.source_user_id === u.id) {
          cM.source_user = u
          break
        } else if (cM.target_user_id === u.id) {
          cM.target_user = u
          break
        }
      }
    })
    return allChatMessage
  }

  // “读”消息
  async view(target_user_id) {
    return await this.app.mysql.update('message', {
      target_user_id,
      is_read: 1
    })
  }

  // 通过消息
  async answer({message_id, target_user_id, answer}) {
    return await this.app.mysql.update('message', {
      id: message_id,
      target_user_id,
      answer
    })
  }

  // 创建消息
  async create(messageDTO) {
    return await this.app.mysql.insert('message', messageDTO)
  }

  async search(message_id) {
    return await this.app.mysql.select('message', {
      where: {
        id: message_id,
        is_delete: 0
      },
      limit: 1
    })
  }

  async update(messageDTO) {
    return await this.app.mysq.update('message', messageDTO)
  }
}

module.exports = MessageService;
