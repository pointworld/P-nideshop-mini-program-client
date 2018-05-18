/**
 * 用户相关服务
 */

const util = require('../utils/util.js')
const api = require('../config/api.js')

/**
 * 调用微信登录：当在小程序的用户中心点击登录时，会调用该函数
 */
function loginByWeixin() {
  let code = null
  return new Promise(function (resolve, reject) {
    // util.login(): {errMsg: "login:ok", code: "061AY21l1b4TAm0BVyYk13kU0l1AY21J"}
    return util.login().then((res) => {
      console.log('wechat login code: ' + res.code)
      code = res.code
      return util.getUserInfo()
    }).then((userInfo) => {
      //登录远程服务器
      // code: "061AY21l1b4TAm0BVyYk13kU0l1AY21J"
      // userInfo: {errMsg: "getUserInfo:ok", rawData: "{"nickName":".","gender":1,"language":"en","city":…OqnJ9D3paH1iapnAlCCrWJ3dUd5DtMslK48OZ8jCxyA/132"}", userInfo: {…}, signature: "ce9dfca8bd997d06ec24f6cad89ee21dff44cbc7", encryptedData: "QW+Eo+K/KJ56aZEex2CYV4SXX+thaHvhS9dTFa/Kl0cYHsqFWs…ReZTJ0vGkep13IVmR8Ffhal0s/fjeYrScrpoo1015JEkd5BDE", …}
      util
        .request(api.AuthLoginByWeixin, { code: code, userInfo: userInfo }, 'POST')
        .then(res => {
          console.log('发送请求后得到的响应数据：')
          console.log(res)
          if (res.errno === 0) {
            //存储用户信息
            wx.setStorageSync('userInfo', res.data.userInfo)
            wx.setStorageSync('token', res.data.token)

            resolve(res)
          } else {
            reject(res)
          }
        })
        .catch((err) => {
          reject(err)
        })
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {

      util.checkSession().then(() => {
        resolve(true)
      }).catch(() => {
        reject(false)
      })

    } else {
      reject(false)
    }
  })
}

module.exports = {
  loginByWeixin,
  checkLogin,
}