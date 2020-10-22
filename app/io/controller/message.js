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
    await app.redis.set(userId, client)

    app.logger.info(`[socket][login]{socketId}: ${client} {user_id}: ${userId}`)
    try {
      nsp.emit(client, {query: {type: 'login', msg: '登录成功'}})
    } catch (err) {
      app.logger.error(err.stack)
    }

  }

  // 获取 target_user_id 对应的 socketId, 再发送消息
  async addFriend() {
    const {ctx, app} = this,
      nsp = app.io.of('/'),
      message = ctx.args[0] || {},
      socket = ctx.socket,
      client = socket.id

    const {query: {source_user_id, target_user_id}} = message

    const targetSocketId = await app.redis.get(target_user_id)

    try {
      // 有才发
      if (targetSocketId) {
        nsp.emit(targetSocketId, {
          type: 'addFriend',
          msg: `${source_user_id}添加申请添加您为好友`
        })
      }
      app.logger.info(`
        [socket][add friend]
        {source_user_id}: ${source_user_id} 
        {source_socket_id}: ${client} 
        {target_user_id}: ${target_user_id}
        {target_socket_id}: ${targetSocketId}
        `)
    } catch (err) {
      app.logger.error(err.stack)
    }
  }

  async inviteFriend() {
    const {ctx, app} = this,
      nsp = app.io.of('/'),
      message = ctx.args[0] || {},
      socket = ctx.socket,
      client = socket.id
    const {query: {source_user_id, target_user_ids}} = message
    const targetSocketIds = await app.redis.mget(...target_user_ids)
    try {
      // 有才发
      for (let i = 0; i < targetSocketIds; i++) {
        const targetSocketId = targetSocketIds[i]
        nsp.emit(targetSocketId, {
          type: 'addFriend',
          msg: `${source_user_id}添加申请添加您为好友`
        })
        app.logger.info(`
        [socket][add friend]
        {source_user_id}: ${source_user_id} 
        {source_socket_id}: ${client} 
        {target_user_id}: ${target_user_ids[i]}
        {target_socket_id}: ${targetSocketId}
        `)
      }
    } catch (err) {
      app.logger.error(err.stack)
    }
  }
}

module.exports = MessageController;
