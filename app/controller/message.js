/*
 * @Author: your name
 * @Date: 2020-06-19 14:27:35
 * @LastEditTime: 2020-06-29 14:31:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \family-kit-api\app\controller\user.js
 */
'use strict'
const {UnExpectError} = require('../error/error')
const BaseController = require('./baseController')

class MessageController extends BaseController {

  async index() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const message = await this.ctx.service.message.getChatMessage(id)
    this.success({data: {...message}, msg: '获取消息成功', loggerMsg: `[消息][获取][成功]{id}: ${id}`})
  }


  async viewMessage() {
    const {ctx: {session: {userInfo: {id}}}} = this
    // TODO 什么时候view再想想
    // await this.ctx.service.message.view()
    this.success({data: {messages}, msg: '获取消息成功', loggerMsg: `[消息][获取][成功]{id}: ${id}`})
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
        target_user_id: {type: 'number', required: true}
      }, {type, target_user_id})
    } else if (type === 2) {
      this.ctx.validate({
        type: {type: 'message_type', required: true},
        target_user_id: {type: 'number', required: true}
      }, {type, target_user_id})
    } else if (type === 3) {
      this.ctx.validate({
        type: {type: 'message_type', required: true},
        target_user_id: {type: 'number', required: true},
        group_id: {type: 'number', required: true}
      }, {type, target_user_id, group_id})
    }

    // TODO socket end msg to target
    // 获取target_user_id 的socketId，再给socketid发消息


    await this.ctx.service.message.create({type, source_user_id: id, target_user_id, content, group_id})
    return true
  }

  async


  // type: 2.好友申请 3.进群邀请 这两种才能"answer"
  // answer 0.no 1.yes
  async answerMessage() {
    const {ctx: {session: {userInfo: {id}}}} = this
    const {ctx: {params: {message_id, type, source_user_id, answer}}} = this

    this.ctx.validate({
      message_id: {type: 'number', required: true},
      type: {type: 'message_type', required: true},
      source_user_id: {type: 'number', required: true},
      answer: {type: 'message_answer', required: true}
    }, {
      message_id,
      type,
      source_user_id,
      answer
    })

    if (type === 2) { // 好友申请 逻辑上必需 target_user_id
      await this.ctx.service.message.answer({id: message_id, target_user_id: id, is_read: 1, answer})
      if (answer === 1) { // 同意
        await this.ctx.service.friend.create({source_user_id, target_user_id: id}) // 插入好友表
        // TODO socket 通知
        this.success({
          msg: '成功通过好友申请',
          loggerMsg: `[消息处理][好友申请][添加]{source_user_id}: ${source_user_id} {target_user_id}: ${id}`
        })
      }
    } else if (type === 3) { //
      // TODO
    }
  }
}

module.exports = MessageController;
