module.exports = {
  generateCode(count) { // 生成随机验证码
    let code = ''
    for (let i = 0; i < count; i++) {
      code += Math.floor(Math.random() * 10) + ''
    }
    return code
  },
  getDate() {
    const date = new Date()
    return `${date.getFullYear()}年${(date.getMonth() + 1)}月${date.getDate()}日${date.getHours()}时${date.getMinutes()}分`
  }
}
