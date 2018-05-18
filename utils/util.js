/**
 *
 * 公用模块
 *
 * @exports {
 *   formatTime,
 *   request,
 *   redirect,
 *   showErrorToast,
 *   checkSession,
 *   login,
 *   getUserInfo,
 * }
 *
 */

let api = require('../config/api.js')

/**
 * 时间格式化
 **/
function formatTime(date) {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 格式化两位数，如果是一位数，则在前面补 0
 **/
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封装微信的 request 请求
 *
 * @param {String} url                         : 开发者服务器接口地址
 * @param {Object|String|ArrayBuffer} data     ：请求的参数
 * @param {String} method                      ：请求方法:（需大写）有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
 *
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: { //设置请求的 header，header 中不能设置 Referer
        'Content-Type': 'application/json',
        'X-Nideshop-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        console.log("success: ")
        console.log(res)

        if (res.statusCode === 200) {

          if (res.data.errno === 401) {
            //需要登录后才可以操作

            let code = null
            return login().then((res) => {
              code = res.code
              ///////////////////////
              // return getUserInfo()
              ///////////////////////
            }).then((userInfo) => {
              //登录远程服务器
              request(api.AuthLoginByWeixin, { code: code, userInfo: userInfo }, 'POST').then(res => {
                if (res.errno === 0) {
                  //存储用户信息
                  wx.setStorageSync('userInfo', res.data.userInfo)
                  wx.setStorageSync('token', res.data.token)
                  
                  resolve(res)
                } else {
                  reject(res)
                }
              }).catch((err) => {
                reject(err)
              })
            }).catch((err) => {
              reject(err)
            })
          } else {
            resolve(res.data)
          }
        } else {
          reject(res.errMsg)
        }

      },
      fail: function (err) {
        reject(err)
        console.log("failed")
      }
    })
  })
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true)
      },
      fail: function () {
        reject(false)
      }
    })
  })
}

/**
 * 封装微信登录接口，使其支持 promise 写法
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          //登录远程服务器
          console.log('login success response:')
          console.log(res)
          //发起网络请求
          resolve(res)
        } else {
          reject(res)
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

/**
 * 封装微信的 getUserInfo 方法：使其支持 promise 写法
 * 注：wx.getUserInfo 已弃用，需要迁移
 */
function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        console.log('util.js: get user info：')
        console.log(res)
        resolve(res)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

/**
 *
 * 重定向到指定的 URL
 *
 * @param {String} url: 重定向到指定的路由
 *
 **/
function redirect(url) {

  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    })
    return false
  } else {
    wx.redirectTo({
      url: url
    })
  }
}

/**
 *
 * 显示错误消息
 *
 * @param {String} msg: 错误消息
 *
 **/
function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

module.exports = {
  formatTime,
  request,
  redirect,
  showErrorToast,
  checkSession,
  login,
  getUserInfo,
}