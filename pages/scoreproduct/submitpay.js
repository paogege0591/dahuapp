// pages/scoreproduct/submitpay.js
const app = getApp();

const promise = require("../../util/wxRequest");
const wxRequest = promise.wxPromisify(wx.request);

Page({

  /**
   * 页面的初始数据
   */
  data: {
      pay_type: 0,
      inputpwd: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        var that = this;
        var money = options.money;
        var order_sn = options.order_sn;
        var order_id = options.order_id;
        that.setData({
            money: money,
            order_sn: order_sn,
            order_id: order_id
        });
    },

    checkpwd: function () {
        var that = this;
    },

    savepwd: function (e) {
        var that = this, inputpwd = e.detail.value;
        that.setData({
            inputpwd: inputpwd,
        });
    },

    showpwd: function () {
        this.setData({
            pay_type: 2
        })
    },

    hidepwd: function () {
        this.setData({
            pay_type: 0,
            inputpwd: ''
        })
    },

    //积分商品 不包邮 需要支付邮费
    wxpay: function () {
        var that = this, 
            user_id = app.globaldata.uid,
            money = that.data.money, 
            order_id = that.data.order_id,
            order_sn = that.data.order_sn;
        wxRequest({
            url: app.globaldata.site_url + "score_order/pay",
            data: { user_id: user_id, money: money, order_sn: order_sn },
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            }
        }).then(function (res) {
            if (res.data.code == 1) {
                var timeStamp = res.data.data.timeStamp.toString(),
                    nonceStr = res.data.data.nonceStr,
                    packages = res.data.data.package,
                    paySign = res.data.data.paySign;
                wx.requestPayment({
                    'timeStamp': timeStamp,
                    'nonceStr': nonceStr,
                    'package': packages,
                    'signType': 'MD5',
                    'paySign': paySign,
                    'success': function (res) {
                        wx.showToast({
                            title: '兑换成功',
                            icon: 'success',
                            success: function () {
                                return wxRequest({
                                    url: app.globaldata.site_url + "score_order/printerOrder",
                                    data: { order_id: order_id },
                                    method: 'GET',
                                    header: {
                                        'Content-Type': 'application/json'
                                    }
                                }).then(function (res) {
                                    if (res.data.code == 1) {
                                        // setTimeout(function () {
                                        //     wx.switchTab({
                                        //         url: '/pages/user/usercenter',
                                        //     })
                                        // }, 2000);
                                        console.log('订单打印成功');
                                    } else {
                                        console.log('订单打印失败');
                                    }
                                }).then(function () {
                                    //减用户积分  
                                    return wxRequest({
                                        url: app.globaldata.site_url + "score_order/reduceScore",
                                        data: { order_id: order_id },
                                        method: 'GET',
                                        header: {
                                            'Content-Type': 'application/json'
                                        }
                                    }).then(function (res) {
                                        if (res.data.code == 1) {
                                            app.globaldata.userinfo.score = res.data.data; //刷新用户积分
                                            setTimeout(function () {
                                                wx.switchTab({
                                                    url: '/pages/user/usercenter',
                                                })
                                            }, 2000);
                                        }
                                    })
                                });
                            }
                        })
                    }
                });
            }
        });
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})