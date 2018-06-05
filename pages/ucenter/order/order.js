let util = require('../../../utils/util.js')
let api = require('../../../config/api.js')

Page({
  data:{
    orderList: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

    this.getOrderList()
  },
  getOrderList(){
    let that = this
    util
      .request(api.OrderList)
      .then(function (res) {
        if (res.errno === 0) {
          console.log(res.data)
          that.setData({
            orderList: res.data.data
          })
        }
      })
  },
  /* payOrder(){
     wx.redirectTo({
       url: '/pages/pay/pay',
     })
   },*/
  /*payOrder(e) {
    let that = this
    console.log('that.data:')
    console.log(that.data.orderList)
    console.log(e)
    console.log(that.data.orderList[e.currentTarget.dataset.orderIndex].id)
    console.log(e.currentTarget.dataset.orderIndex)
    util
      .request(api.PayPrepayId, {
        orderId: that.data.orderList[e.currentTarget.dataset.orderIndex].id
      })
      .then(function (res) {
        if (res.errno === 0) {
          const payParam = res.data
          wx.requestPayment({
            'timeStamp': payParam.timeStamp,
            'nonceStr': payParam.nonceStr,
            'package': payParam.package,
            'signType': payParam.signType,
            'paySign': payParam.paySign,
            'success': function (res) {
              console.log(res)
            },
            'fail': function (res) {
              console.log(res)
            }
          })
        }
      })

  },*/
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})