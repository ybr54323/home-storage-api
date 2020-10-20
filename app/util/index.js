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
  },

  // 填充0
  fillZero(num) {
    let tem = num + ''
    // 10位数，不足填0
    const len = 9 - tem.length
    for (let i = 0; i < len; i++) {
      tem = '0' + tem
    }
    return tem
  }
}

