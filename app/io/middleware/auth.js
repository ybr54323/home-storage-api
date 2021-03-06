// {app_root}/app/io/middleware/auth.js
'use strict'
const PREFIX = 'room';
const {NoLoginError} = require('../../error/error');

// module.exports = () => {
//   return async (ctx, next) => {
//     const {app, socket, logger, helper} = ctx;
//     const id = socket.id;
//     const nsp = app.io.of('/');
//     const query = socket.handshake.query;
//     console.log('id: ', id)
//     // 用户信息
//     const {room, userId} = query;
//     console.log('room: ', room)
//     console.log('userId: ', userId)
//     const rooms = [room];
//
//     logger.debug('#user_info', id, room, userId);
//
//     const tick = (id, msg) => {
//       logger.debug('#tick', id, msg);
//
//       // 踢出用户前发送消息
//       socket.emit(id, 'tick');
//
//       // 调用 adapter 方法踢出用户，客户端触发 disconnect 事件
//       nsp.adapter.remoteDisconnect(id, true, err => {
//         logger.error(err);
//       });
//     };
//
//     // 检查房间是否存在，不存在则踢出用户
//     // 备注：此处 app.redis 与插件无关，可用其他存储代替
//     const hasRoom = await app.redis.get(`${PREFIX}:${room}`);
//     console.log(hasRoom)
//     logger.debug('#has_exist', hasRoom);
//
//
//     // if (!hasRoom) {
//     //   setTimeout(() => {
//     //     tick(id, {
//     //       type: 'deleted',
//     //       message: 'deleted, room has been deleted.',
//     //     });
//     //   }, 1000)
//     //
//     //   return;
//     // }
//
//     // 用户加入
//     // logger.debug('#join', room);
//     // socket.join(room);
//     //
//     // // 在线列表
//     // nsp.adapter.clients(rooms, (err, clients) => {
//     //   logger.debug('#online_join', clients);
//     //
//     //   // 更新在线用户列表
//     //   nsp.to(room).emit('online', {
//     //     clients,
//     //     action: 'join',
//     //     target: 'participator',
//     //     message: `User(${id}) joined.`,
//     //   });
//     // });
//
//     await next();
//
//     // 用户离开
//     logger.debug('#leave', room);
//
//     // 在线列表
//     nsp.adapter.clients(rooms, (err, clients) => {
//       logger.debug('#online_leave', clients);
//
//       // 获取 client 信息
//       // const clientsDetail = {};
//       // clients.forEach(client => {
//       //   const _client = app.io.sockets.sockets[client];
//       //   const _query = _client.handshake.query;
//       //   clientsDetail[client] = _query;
//       // });
//
//       // 更新在线用户列表
//       nsp.to(room).emit('online', {
//         clients,
//         action: 'leave',
//         target: 'participator',
//         message: `User(${id}) leaved.`,
//       });
//     });
//
//   };
// };

// module.exports = (options, app) => {
//   return async function auth(ctx, next) {
//     const {path, method, session: {userInfo = null}} = ctx;
//     console.log(`{method}: ${method} {path}: ${path}`)
//     if (!isFreePath(path)) {
//       if (!userInfo) {
//         throw new NoLoginError();
//       }
//       await next();
//     } else {
//       await next();
//     }
//
//     /**
//      * @description 判断当前请求地址是否需要鉴权(请求头要带 Cookie)
//      * @param {string} path 传入当前请求的路径
//      */
//     function isFreePath(path) {
//       const freeRouteList = [
//         '/user/register_or_login_code', // 获取 注册 / 登录 的短信验证码
//         'user/reset_pwd_code', // 获取重设密码的短信验证码
//       ]
//       return freeRouteList.indexOf(path) >= 0
//     }
//   };
// };

