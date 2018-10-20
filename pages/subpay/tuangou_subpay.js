// pages/pay/subpay.js
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
  wxpay: function() {
    //   this.setData({
    //       pay_type: 1
    //   })
    var that = this,
      user_id = app.globaldata.uid,
      money = that.data.money,
      order_id = that.data.order_id,
      order_sn = that.data.order_sn;
    // console.log(order_id);return;
    wxRequest({
      url: app.globaldata.site_url + "order/pay",
      data: {
        user_id: user_id,
        money: money,
        order_sn: order_sn,
        order_id: order_id
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    }).then(function(res) {
      //console.log(res);return;
      if (res.data.code == 1) {
        var timeStamp = res.data.data.timeStamp.toString(),
          nonceStr = res.data.data.nonceStr,
          packages = res.data.data.package,
          paySign = res.data.data.paySign,
          prepay_id = res.data.data.prepay_id;
        wx.requestPayment({
          'timeStamp': timeStamp,
          'nonceStr': nonceStr,
          'package': packages,
          'signType': 'MD5',
          'paySign': paySign,
          'success': function(res) {
            wxRequest({
              url: app.globaldata.site_url + "group_buying/callBackReduce",
              data: {
                order_id: order_id
              },
              method: 'GET',
              header: {
                'Content-Type': 'application/json'
              }
            }).then(function(res) {
              if (res.data.code == 1) {
                //支付成功 订单发货门店 打印小票 配送
                return wxRequest({
                  url: app.globaldata.site_url + "group_buying/printerOrder",
                  data: {
                    order_id: order_id
                  },
                  method: 'GET',
                  header: {
                    'Content-Type': 'application/json'
                  }
                }).then(function(res) {
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
                    return wxRequest({
                      url: app.globaldata.site_url + "order/sendTemplateMessage",
                      data: { order_id: order_id, form_id: prepay_id },
                      method: 'GET',
                      header: {
                        'Content-Type': 'application/json'
                      }
                    }).then(function (res) {
                      if (res.data.code == 1) {
                        console.log('发送模板消息成功');
                      } else {
                        console.log(res.data.data);
                      }
                    })
                  }).then(function() {
                  return wxRequest({
                    url: app.globaldata.site_url + "group_buying/payAfterAction",
                    data: {
                      order_id: order_id
                    },
                    method: 'GET',
                    header: {
                      'Content-Type': 'application/json'
                    }
                  }).then(function(res) {
                    if (res.data.code == 1) {
                      if (app.globaldata.userinfo.level_id != res.data.data.level_id) {
                        setTimeout(function() {
                          wx.showToast({
                            title: '恭喜您升级为' + res.data.data.level_name,
                            icon: 'none',
                          })
                        }, 2000);
                      }
                      app.globaldata.userinfo = res.data.data; //刷新用户数据
                      setTimeout(function() {
                        wx.switchTab({
                          url: '/pages/user/usercenter',
                        })
                      }, 1500);
                    }
                  })
                });
              } else if (res.data.code == 0) {
                setTimeout(function() {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                  })
                }, 2000);
                return false;
              }
            })
          },
          'fail': function(res) {
            console.log(res);
          }
        });
      } else {
        setTimeout(function() {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
        }, 2000);
        return false;
      }
    });
  },

  checkpwd: function(e) {
    var that = this;
    // var user_id = app.globaldata.uid;
    // var order_sn = that.data.order_sn;
    // var money = that.data.money;
    // var pwd = that.data.inputpwd;
    var formId = e.detail.formId;
    var request_data = {
      user_id: app.globaldata.uid,
      order_sn: that.data.order_sn,
      order_id: that.data.order_id,
      money: that.data.money,
      pay_pwd: that.data.inputpwd
    };
    wxRequest({
      url: app.globaldata.site_url + "group_buying/remainMoneyPay",
      data: request_data,
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
    }).then(function(res) {
      if (res.data.code == 1) {
        //余额支付成功 
        //console.log('余额支付成功');
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          success: function() {
            return wxRequest({
              url: app.globaldata.site_url + "group_buying/callBackReduce",
              data: {
                order_id: that.data.order_id
              },
              method: 'GET',
              header: {
                'Content-Type': 'application/json'
              }
            }).then(function(res) {
              if (res.data.code == 1) {
                return wxRequest({
                  url: app.globaldata.site_url + "group_buying/printerOrder",
                  data: {
                    order_id: that.data.order_id
                  },
                  method: 'GET',
                  header: {
                    'Content-Type': 'application/json'
                  }
                }).then(function(res) {
                  if (res.data.code == 1) {
                    console.log('订单打印成功');

                  } else {
                    console.log('订单打印失败');
                  }
                }).then(function () {
                    return wxRequest({
                      url: app.globaldata.site_url + "order/sendTemplateMessage",
                      data: { order_id: that.data.order_id, form_id: formId },
                      method: 'GET',
                      header: {
                        'Content-Type': 'application/json'
                      }
                    }).then(function (res) {
                      if (res.data.code == 1) {
                        console.log('发送模板消息成功');
                      } else {
                        console.log(res.data.data);
                      }
                    })
                  }).then(function() {
                  return wxRequest({
                    url: app.globaldata.site_url + "group_buying/payAfterAction",
                    data: {
                      order_id: that.data.order_id
                    },
                    method: 'GET',
                    header: {
                      'Content-Type': 'application/json'
                    }
                  }).then(function(res) {
                    if (app.globaldata.userinfo.level_id != res.data.data.level_id) {
                      setTimeout(function() {
                        wx.showToast({
                          title: '恭喜您升级为' + res.data.data.level_name,
                          icon: 'none',
                        })
                      }, 2000);
                    }
                    app.globaldata.userinfo = res.data.data; //刷新用户数据

                    setTimeout(function() {
                      wx.switchTab({
                        url: '/pages/user/usercenter',
                      })
                    }, 1500);
                  });
                });
              } else {
                setTimeout(function() {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  });
                }, 1000);
                return false;
              }
            });
          }
        })
        // wx.showToast({
        //     title: '支付成功',
        //     icon: 'success',
        //     success: function () {
        //         return wxRequest({
        //             url: app.globaldata.site_url + "order/printerOrder",
        //             data: { order_id: that.data.order_id },
        //             method: 'GET',
        //             header: {
        //                 'Content-Type': 'application/json'
        //             }
        //         }).then(function (res) {
        //             if (res.data.code == 1) {
        //                 console.log('订单打印成功');

        //             } else {
        //                 console.log('订单打印失败');
        //             }
        //         }).then(function () {
        //             return wxRequest({
        //                 url: app.globaldata.site_url + "order/payAfterAction",
        //                 data: { order_id: that.data.order_id },
        //                 method: 'GET',
        //                 header: {
        //                     'Content-Type': 'application/json'
        //                 }
        //             }).then(function (res) {
        //                 if (app.globaldata.userinfo.level_id != res.data.data.level_id) {
        //                     setTimeout(function () {
        //                         wx.showToast({
        //                             title: '恭喜您升级为' + res.data.data.level_name,
        //                             icon: 'none',
        //                         })
        //                     }, 2000);
        //                 }
        //                 app.globaldata.userinfo = res.data.data; //刷新用户数据

        //                 setTimeout(function () {
        //                     wx.switchTab({
        //                         url: '/pages/user/usercenter',
        //                     })
        //                 }, 1500);
        //             });
        //         });
        //     }
        // })
      } else {
        setTimeout(function() {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }, 500);
        return false;
      }
    })
  },

  savepwd: function(e) {
    var that = this,
      inputpwd = e.detail.value;
    that.setData({
      inputpwd: inputpwd,
    });
  },

  showpwd: function() {
    var that = this;
    var money = that.data.money;
    var account_balance = that.data.account_balance;
    //console.log(money, account_balance);return false;
    if (Number(money) > Number(account_balance)) {
      setTimeout(function() {
        wx.showToast({
          title: '账户余额不足',
          icon: 'none'
        })
      }, 1500);
      return false;
    }
    that.setData({
      pay_type: 2
    })
  },
  hidepwd: function() {
    this.setData({
      pay_type: 0,
      inputpwd: ''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var money = options.money;
    var order_sn = options.order_sn;
    var order_id = options.order_id;
    var account_balance = app.globaldata.userinfo.account_balance;
    that.setData({
      money: money,
      order_sn: order_sn,
      order_id: order_id,
      account_balance: account_balance
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})