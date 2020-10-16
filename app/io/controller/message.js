// {app_root}/app/io/controller/nsp.js
const Controller = require('egg').Controller;

class MessageController extends Controller {

  async index() {
    const {ctx, app} = this,
      nsp = app.io.of('/'),
      message = ctx.args[0] || {},
      socket = ctx.socket,
      client = socket.id

    const {session: {userInfo: {id: userId}}} = ctx
    const socketId = await app.redis.get(userId)

    if (!socketId) {
      await app.redis.set(userId, client)
    }

    console.log('event', socket.event)

    try {
      nsp.emit(client, '登录成功')
    } catch (err) {
      app.logger.error(err.stack)
    }

  }

  async addFriend() {
    const {ctx, app} = this,
      nsp = app.io.of('/'),
      message = ctx.args[0] || {},
      socket = ctx.socket,
      client = socket.id

    const {session: {userInfo: {id: userId}}} = ctx,
      socketId = await app.redis.get(userId),
      {target_user_id} = message

    if (!socketId) {
      await app.redis.set(userId, client)
    }


    try {
      nsp.emit(client, '登录成功')
    } catch (err) {
      app.logger.error(err.stack)
    }

  }
}

module.exports = MessageController;
