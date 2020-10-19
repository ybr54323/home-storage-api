// {app_root}/app/io/controller/nsp.js
const Controller = require('egg').Controller;

class MessageController extends Controller {

  async index() {
    const {ctx, app} = this,
      nsp = app.io.of('/'),
      message = ctx.args[0] || {},
      socket = ctx.socket,
      client = socket.id

    const {query: {userId}} = message
    const socketId = await app.redis.get(userId)

    if (!socketId) {
      await app.redis.set(userId, client)
    }
    app.logger.info(`[socket][login]{socketId}: ${client} {user_id}: ${userId}`)
    try {
      nsp.emit(client, '登录成功')
    } catch (err) {
      app.logger.error(err.stack)
    }

  }

  // 获取 target_user_id 对应的 socketId, 再发送消息
  async addFriend(source_user_id, target_user_id) {
    const {ctx, app} = this,
      nsp = app.io.of('/'),
      socket = ctx.socket,
      client = socket.id

    const sourceUserId = await app.redis.get(client)
    const targetSocketId = await app.redis.get(target_user_id)

    try {
      // 有才发
      if (sourceUserId && targetSocketId) {
        nsp.emit(targetSocketId, {
          type: 'addFriend',
          msg: `${sourceUserId}添加申请添加您为好友`
        })
      }
      app.logger.info(`[socket][add friend]{source_user_id}:${sourceUserId} {target_user_id}: ${targetSocketId}`)
    } catch (err) {
      app.logger.error(err.stack)
    }

  }
}

module.exports = MessageController;
