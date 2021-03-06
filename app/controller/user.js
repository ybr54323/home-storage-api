/*
 * @Author: your name
 * @Date: 2020-06-19 14:27:35
 * @LastEditTime: 2020-06-29 14:31:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \family-kit-api\app\controller\user.js
 */
'use strict'
const {generateCode, getDate, fillZero} = require('../util/index')
const {ParamsError, NoLoginError, UnExpectError, ResourceNoExistError} = require('../error/error')
const BaseController = require('./baseController')

class UserController extends BaseController {

  // 验证短信验证码
  // 同时验证手机号码和验证码
  vCode() {
    const {ctx: {request: {body: {phone: clientPhone, code: clientCode}}}} = this
    const {ctx: {session: {zhenziData: {phone, code}}}} = this
    this.ctx.validate({
      clientCode: {type: 'string', required: true},
      code: {type: 'string', required: true},
    }, {clientCode, code})
    if (clientPhone !== phone) {
      throw new ParamsError({
        msg: `请输入和刚刚一致的手机号码`,
        loggerMsg: `[校验验证码][失败]{phone}: ${phone} {clientPhone}: ${clientPhone}`
      })
    }
    return {
      validate: clientCode === code && clientPhone === phone,
      phone,
      code,
      clientPhone,
      clientCode
    }
  }

  // 验证手机号码-发送验证码-返回发送结果和所生成的验证码
  async gCode() {
    const {ctx: {params: {phone}}} = this
    const {app: {config: {zhenziyun: {app_id, app_secret}}}} = this
    this.ctx.validate({phone: {type: 'string', required: true}}, {phone})
    // const code = generateCode(6);
    const code = '1';
    // 初始化榛子云sms
    // const ZhenzismsClient = require('../util/zhenzisms')
    // const client = new ZhenzismsClient('sms_developer.zhenzikj.com', app_id, app_secret)
    // const {code: zhenziCode, data} = await client.send({
    //   templateId: '895',
    //   number: phone,
    //   templateParams: [code, '5分钟']
    // })
    // if (zhenziCode !== 0)
    //   throw new UnExpectError({
    //     msg: data,
    //     loggerMsg: `[榛子云短信发送失败]{code}: ${zhenziCode} {data}: ${data}`
    //   })
    return {
      code,
      phone
    }
  }


  // 注册 / 登录-短信验证码
  async registerOrLoginCode() {
    const {code, phone} = await this.gCode()
    const [user = null] = await this.ctx.service.user.search({phone})
    this.ctx.session.userInfo = user ? {...user, isNewUser: false} : {isNewUser: true} // no user so it is a new user
    this.ctx.session.zhenziData = {
      phone,
      code
    }
    this.success({
      msg: `验证码发送成功`,
      loggerMsg: `[登录/注册][验证码发送] {phone}: ${phone} {code}: ${code}`
    })
  }

  // 短信验证码登录
  async registerOrLogin() {
    const {validate, phone, code, clientPhone, clientCode} = this.vCode()
    if (!validate) {
      throw new ParamsError({
        msg: '验证码不正确',
        loggerMsg: `[短信验证码登录][验证码错误]{phone}: ${phone || '未知号码'} {clientPhone}: ${clientPhone}`
      })
    }
    const {ctx: {session: {userInfo}}} = this
    if (!userInfo.isNewUser) {
      const {id, name, avatar} = userInfo
      this.success({
        data: {user: {id, name, avatar}},
        msg: '登录成功',
        loggerMsg: `[用户登录][短信验证码登录] {id}: ${id} {name}: ${name} {date}: ${getDate()}`
      })
    } else {
      this.success({
        data: {user: {isNewUser: true}},
        msg: '验证成功'
      })
    }
  }

  // 重设密码-短信验证码
  async getResetCode() {
    const {ctx: {params: {phone}}} = this
    const [user = null] = await this.ctx.service.user.search({phone})
    if (!user) throw new ResourceNoExistError({msg: '该手机号码尚未注册，请先注册', loggerMsg: `[重设密码][手机号码未注册]{phone}: ${phone}`})
    const {code} = await this.gCode()
    this.ctx.session.userInfo = user
    this.ctx.session.zhenziData = {
      phone,
      code
    }
    this.success({msg: `验证码发送成功`, loggerMsg: `[重设密码][验证码发送][成功]{phone}: ${phone} {code}: ${code}`})
  }


  // 重设密码
  async resetPwd() {
    const {validate, phone, code, clientPhone, clientCode} = this.vCode()
    if (validate) {
      const {ctx: {request: {body: {pwd}}}} = this
      this.ctx.validate({pwd: {type: 'string', required: true}}, {pwd})
      const {ctx: {session: {userInfo}}} = this
      await this.ctx.service.user.update({id: userInfo.id, pwd})
      const {id, name, avatar_url} = userInfo
      this.success({data: {user: {id, name, avatar_url}}, msg: '重设成功', loggerMsg: `[重设密码][成功]{id}: ${userInfo.id}`})
    } else {
      throw new ParamsError({msg: '验证码不正确', loggerMsg: `[重设密码][验证码错误]{phone}: ${phone}`})
    }
  }


  // 新用户注册
  async register() {
    const {ctx: {request: {body: {username, pwd}}}} = this
    const {ctx: {session: {userInfo: {isNewUser}, zhenziData: {phone}}}} = this
    this.ctx.validate({username: {type: 'string', required: true}}, {username})
    if (!phone) {
      throw new NoLoginError({
        msg: '请重新获取验证码',
        loggerMsg: '[session中获取缓存信息失败][zhenziData]'
      })
    }
    if (!isNewUser) {
      throw new NoLoginError({
        msg: '系统出错',
        loggerMsg: '[业务逻辑错误]controller.user.register'
      })
    } else {
      const newUser = await this.ctx.service.user.create({name: username, phone, pwd})
      const user = this.ctx.session.userInfo = {
        id: newUser.insertId,
        name: username,
        phone,
        isNewUser: false
      }
      this.success({
        data: {
          user
        },
        msg: '登录成功',
        loggerMsg: `[登录][成功] {id}: ${user.id} {name}: ${user.username} {date}: ${getDate()}`
      })
    }
  }

  // 手机，密码登录
  async phonePwdLogin() {
    const {ctx: {request: {body: {phone, pwd}}}} = this
    this.ctx.validate({phone: {type: 'string', required: true}, pwd: {type: 'string', required: true}}, {
      phone,
      pwd
    })
    const [user = null] = await this.ctx.service.user.show({phone, pwd})
    this.ctx.session.userInfo = user
    this.success({
      data: {user},
      msg: user ? '登录成功' : '手机或密码错误',
      loggerMsg: user ? `[用户登录][手机密码]{phone}: ${phone}` : `[用户登录][手机或密码错误]{phone}: ${phone}`
    })
  }

  // 准确搜索
  async searchByPhone() {
    const {ctx: {params: {phone}}} = this
    this.ctx.validate({phone: {type: 'string', required: true}}, {phone})
    const [user = null] = await this.ctx.service.user.search({phone})
    this.success({
      data: {
        user
      },
      msg: '搜索成功',
      loggerMsg: `[通过手机号码搜索用户]{id}: ${this.ctx.session.userInfo.id} {search}: ${phone}`
    })
  }

  // 模糊搜索
  async searchByName() {
    const {ctx: {params: {name}}} = this
    this.ctx.validate({name: {type: 'string', required: true}}, {name})
    const users = await this.ctx.service.user.searchByName(name)
    this.success({
      data: {
        users
      },
      msg: '搜索成功',
      loggerMsg: `[通过用户名搜索用户]{id}: ${this.ctx.session.userInfo.id} {search}: ${name}`
    })
  }
}

module.exports = UserController;
