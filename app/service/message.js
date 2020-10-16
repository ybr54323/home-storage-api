'use strict'
const Service = require('egg').Service;

class MessageService extends Service {

  // 获取聊天消息
  // 发起人和接收人
  async getChatMessage(user_id) {

    const allMessage = await this.app.mysql.query(
      `
      select *
      from message where 
      (type = 1 and (source_user_id = :user_id or target_user_id = :user_id) and source_user_delete = 0 and target_user_delete = 0)
      or
      ((type = 2 or type = 3) and (target_user_id = :user_id) and target_user_delete = 0)
      and is_delete = 0
       limit 100
      `, {
        user_id
      }
    )

    // 聊天信息
    const chatMessage = [],
      friendMessage = [],
      groupMessage = [],
      cMOtherUserIds = new Set(),
      fMOtherUserIds = new Set(),
      gMOtherUserIds = new Set()

    // 分类
    for (let i = 0; i < allMessage; i++) {
      const m = allMessage[i]
      const [res, userIds] = m.type === 1 ? [chatMessage, cMOtherUserIds] : m.type === 2 ? [friendMessage, fMOtherUserIds] : [groupMessage, gMOtherUserIds]
      res.push(m) && user_id !== m.id && !userIds.has(m.id) && userIds.add(m.id)
    }

    // 找出所有消息涉及的非当前用户的基础信息

    const otherUsers = await this.app.mysql.query(
      `
      select u.id, u.name, u_a.url as avatar
      from user as u
      join user_avatar as u_a on u_a.user_id = u.id and u_a.is_active = 1 and u_a.is_delete = 0
      where u.id in (:otherUserIds)
      `, {
        otherUserIds: [...new Set([...cMOtherUserIds, ...fMOtherUserIds, ...gMOtherUserIds])]
      }
    )

    for (let i = 0; i < allMessage.length; i++) {
      const m = allMessage[i]
      for (let j = 0; j < otherUsers.length; j++) {
        const u = otherUsers[i]
        if (m.type === 1) {
          if (m.source_user_id === user_id) {
            m.target_user_name = u.name
            m.target_user_avatar = u.avatar || null
            break
          }
          if (m.target_user_id === user_id) {
            m.source_user_name = u.name
            m.source_user_avatar = u.avatar || null
            break
          }
        } else {
          if (m.source_user_id === u.id) {
            m.source_user_name = u.name
            m.source_user_avatar = u.avatar
            break
          }
        }
      }
    }

    return {
      chatMessage,
      friendMessage,
      groupMessage
    }
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
