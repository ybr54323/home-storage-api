// {app_root}/app/io/controller/nsp.js
const Controller = require('egg').Controller;

class NspController extends Controller {
  async exchange() {
    const {ctx, app} = this;
    const nsp = app.io.of('/');
    const message = ctx.args[0] || {};
    const socket = ctx.socket;
    const client = socket.id;

    const {id} = message
    try {
      nsp.emit(id, message);
    } catch (error) {
      app.logger.error(error);
    }
  }
}

module.exports = NspController;
