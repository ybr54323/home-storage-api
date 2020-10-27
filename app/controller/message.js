/*
 * @Author: your name
 * @Date: 2020-06-19 14:27:35
 * @LastEditTime: 2020-06-29 14:31:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \family-kit-api\app\controller\user.js
 */
'use strict'
const {UnExpectError, RepeatError} = require('../error/error')
const BaseController = require('./baseController')

class MessageController extends BaseController {
  // 获取所有的message
  // async getAllMessage() {
  //   const {ctx: {session: {userInfo: {id}}}} = this
  //   const message = await this.ctx.service.message.getAllMessage(id)
  //   this.success({data: {...message}, msg: '获取消息成功', loggerMsg: `[消息][获取][成功]{id}: ${id}`})
  // }

  // 获取聊天信息
  async getChatMessage() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const chatMessage = await this.ctx.service.message.getChatMessage(id)
    this.success({data: {chatMessage}, msg: '获取消息成功', loggerMsg: `[获取聊天消息]{id}: ${id}`})
  }

  // 获取好友信息
  async getFriendMessage() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const friendMessage = await this.ctx.service.message.getFriendMessage(id)
    this.success({data: {friendMessage}, msg: '获取消息成功', loggerMsg: `[获取好友邀请信息]{id}: ${id}`})
  }

  // 获取群组信息
  async getGroupMessage() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const groupMessage = await this.ctx.service.message.getGroupMessage(id)
    this.success({data: {groupMessage}, msg: '获取消息成功', loggerMsg: `[获取群组邀请信息]{id}: ${id}`})
  }

  // 创建聊天信息
  async createChatMessage() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const {ctx: {request: {body: {target_user_id, content}}}} = this

    this.ctx.validate({target_user_id: {type: 'string', required: true}}, {target_user_id})

    await this.ctx.service.message.create({type: 1, source_user_id: id, target_user_id, content})
    this.success({
      msg: '请求成功',
      loggerMsg: `[创建聊天消息]{source_user_id}: ${id} {target_user_id}: ${target_user_id} {content}: ${content}`
    })
  }

  // 创建好友申请信息
  async createFriendMessage() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const {ctx: {request: {body: {target_user_id}}}} = this
    this.ctx.validate({target_user_id: {type: 'string', required: true}}, {target_user_id})
    const [message = null] = this.ctx.service.message.checkExist({
      source_user_id: id,
      target_user_id
    })
    if (!message) {
      await this.ctx.service.message.create({type: 2, source_user_id: id, target_user_id})
      this.success({
        msg: '申请成功',
        loggerMsg: `[消息][好友申请消息]{source_user_id}: ${id} {target_user_id}: ${target_user_id}`
      })
    } else {
      throw new RepeatError({msg: '请不要重复申请'})
    }
  }

  // 创建群组申请信息
  async createGroupMessage() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const {ctx: {request: {body: {target_user_id, group_id}}}} = this
    this.ctx.validate({
      target_user_id: {type: 'string', required: true},
      group_id: {type: 'string', required: true}
    }, {target_user_id, group_id})
    const [message = null] = this.ctx.service.message.checkGroupMessageExist({
      source_user_id: id,
      target_user_id
    })
    if (!message) {
      await this.ctx.service.message.create({type: 2, source_user_id: id, target_user_id, group_id})
      this.success({
        msg: '申请成功',
        loggerMsg: `[消息][群组申请信息]{source_user_id}: ${id} {target_user_id}: ${target_user_id} {group_id}: ${group_id}`
      })
    } else {

    }

  }

  // 查看聊天信息, 即已读, 一定是以target的身份来查看(已读)
  async viewChatMessage() {
    const {ctx: {session: {userInfo: {id}}}} = this
    await this.ctx.service.message.viewChatMessage(id)
    this.success({
      loggerMsg: `[消息][更新消息已读状态]{target_user_id}: ${id}`
    })
  }

  // 查看好友申请信息
  async viewFriendMessage() {
    const {ctx: {session: {userInfo: {id}}}} = this
    await this.ctx.service.message.viewFriendMessage(id)
    this.success({
      loggerMsg: `[消息][更新消息已读状态]{target_user_id}: ${id}`
    })
  }

  // 查看群组申请信息
  async viewGroupMessage() {
    const {ctx: {session: {userInfo: {id}}}} = this
    await this.ctx.service.message.viewGroupMessage(id)
    this.success({
      loggerMsg: `[更新消息已读状态]{target_user_id}: ${id}`
    })
  }

  // TODO
  // 处理聊天信息 聊天信息并不需要处理
  async handleChatMessage() {
    throw new Error('聊天信息并不需要处理')
  }

  // 处理好友申请信息
  async handleFriendMessage() {
    const {ctx: {session: {userInfo: {id: target_user_id}}}} = this
    const {ctx: {request: {body: {message_id, answer, source_user_id}}}} = this

    this.ctx.validate({
      message_id: {type: 'string', required: true},
      answer: {type: 'number', required: true},
      source_user_id: {type: 'string', required: true}
    }, {message_id, answer, source_user_id})
    // 允许
    if (answer === 1) {
      // 查重
      const [exist = null] = await this.ctx.service.friend.find({
        source_user_id,
        target_user_id,
        is_delete: 0
      })
      if (!exist) {
        await this.ctx.service.friend.create({
          source_user_id,
          target_user_id,
          is_delete: 0
        })
      }
    }
    await this.ctx.service.message.handleFriendMessage({message_id, answer})
    this.success({
      loggerMsg: `[消息][处理好友申请消息]{message_id}: ${message_id} {answer}: ${answer} {target_user_id}: ${target_user_id} `
    })
  }

  // 处理群组申请信息
  async handleGroupMessage() {
    const {ctx: {session: {userInfo: {id: target_user_id}}}} = this
    const {ctx: {request: {body: {message_id, answer, group_id, source_user_id}}}} = this
    this.ctx.validate({
      message_id: {type: 'string', required: true},
      answer: {type: 'number', required: true},
      group_id: {type: 'string', required: true},
      source_user_id: {type: 'string', required: true}
    }, {message_id, answer, group_id, source_user_id})
    if (answer === 1) {
      const [exist = null] = await this.ctx.service.groupUser.find({
        group_id,
        source_user_id,
        target_user_id,
        is_delete: 0
      })
      if (!exist) {
        await this.ctx.service.groupUser.create({
          group_id,
          source_user_id,
          target_user_id,
          is_delete: 0
        })
      }
    }
    await this.ctx.service.message.handleGroupMessage({message_id, answer})
    this.success({
      loggerMsg: `[消息][处理群组申请消息]{message_id}: ${message_id} {answer}: ${answer} {target_user_id}: ${target_user_id} `
    })
  }

  // type: 1.对话消息 2.好友申请 3.进群邀请
  async create() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const {
      ctx: {
        request: {
          body: {
            type,
            target_user_id,
            group_id = '',
            content = ''
          }
        }
      }
    } = this

    if (type === 1) {
      this.ctx.validate({
        type: {type: 'message_type', required: true},
        target_user_id: {type: 'string', required: true}
      }, {type, target_user_id})
    } else if (type === 2) {
      this.ctx.validate({
        type: {type: 'message_type', required: true},
        target_user_id: {type: 'string', required: true}
      }, {type, target_user_id})
    } else if (type === 3) {
      this.ctx.validate({
        type: {type: 'message_type', required: true},
        target_user_id: {type: 'string', required: true},
        group_id: {type: 'string', required: true}
      }, {type, target_user_id, group_id})
    }

    await this.ctx.service.message.create({type, source_user_id: id, target_user_id, content, group_id})
    this.success({
      msg: '请求成功',
      loggerMsg: `[申请添加好友]{source_user_id}: ${id} {target_user_id}: ${target_user_id}`
    })
  }

}

module.exports = MessageController;
