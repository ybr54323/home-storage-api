const {ParamsError, NoLoginError, UnExpectError, ResourceNoExistError} = require('../error/error')
const BaseController = require('./baseController')
const StsClient = require("@alicloud/sts-sdk");
const CryptoJS = require("crypto-js");

const en_endpoint = 'U2FsdGVkX18bNZVAOVySdtezVZNd9+ZUHvZOjcVUiGsck5oxK6rITJSuXLxHmybL',
  en_accessKeyId = 'U2FsdGVkX19Q8+tEOVOonzvZeciSJX2dXXvAQLxdrsn9xDeQbm667Ts32Ttc/Ysb',
  en_accessKeySecret = 'U2FsdGVkX1924b6BZykqAicFjHodrpZ/d0VDUSMYIiBKWUOCTLkGfK7sZxKQWkp4',
  en_roleArn = 'U2FsdGVkX19PU65zIX4fCtG5W9GQtvJQ9TsaR+divW/7w2S+DmxD9rrk0jbrZ+tNP+PKqfvL37cpQbE37+XLjw==',
  en_roleSessionName = 'U2FsdGVkX1+Efzy3r2fiOWxwOEY7o85nk83DssOSczM='

const endpoint = CryptoJS.AES.decrypt(en_endpoint, 'ybr').toString(CryptoJS.enc.Utf8),
  accessKeyId = CryptoJS.AES.decrypt(en_accessKeyId, 'ybr').toString(CryptoJS.enc.Utf8),
  accessKeySecret = CryptoJS.AES.decrypt(en_accessKeySecret, 'ybr').toString(CryptoJS.enc.Utf8),
  roleArn = CryptoJS.AES.decrypt(en_roleArn, 'ybr').toString(CryptoJS.enc.Utf8),
  roleSessionName = CryptoJS.AES.decrypt(en_roleSessionName, 'ybr').toString(CryptoJS.enc.Utf8)

const sts = new StsClient({
  endpoint, // check this from sts console
  accessKeyId, // check this from aliyun console
  accessKeySecret, // check this from aliyun console
});

class OssController extends BaseController {
  async getAssumeRule() {
    const res1 = await sts.assumeRole(roleArn, roleSessionName);
    const {Credentials = null} = res1
    if (Credentials) {
      this.success({
        data: {
          Credentials
        }
      })
      return
    }
    throw new ResourceNoExistError({msg: '获取sts失败，请再试', loggerMsg: `[sts获取失败]`})
    // const res2 = await sts.getCallerIdentity();
  }
}

module.exports = OssController
