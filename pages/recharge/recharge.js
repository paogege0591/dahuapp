var app = getApp();
const promise = require("../../util/wxRequest");
const wxRequest = promise.wxPromisify(wx.request);

Page({

    /**
     * 页面的初始数据
     */
    data: {
        num:0
    },  
    save_num: function (e) {
        var that = this,num=e.detail.value;
        that.setData({
            num: num
        });
        //console.log(that.data.num);
    },
    pay_charge: function() {
        var that = this, num = that.data.num;
        if (!num) {
            wx.showToast({
                title: '请输入充值金额',
                icon:'none'
            });
            return false;
        }
        wxRequest({
            url: app.globaldata.site_url + "user_center/placeOrder",
            data: { user_id: app.globaldata.uid, money: num, nickname: app.globaldata.userinfo.nickname },
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            }
        }).then(function (res) {
            if (res.data.code == 1) {
                var return_data = res.data.data;
                //return false;
                wxRequest({
                    url: app.globaldata.site_url + "user_center/recharge",
                    data: { user_id: return_data.user_id, money: return_data.account, order_sn: return_data.order_sn},
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
                                // wx.showToast({
                                //     title: '支付成功',
                                //     icon: 'success',
                                //     success: function () {
                                        return wxRequest({
                                            url: app.globaldata.site_url + "user_center/addConsumeAmount",
                                            data: { user_id: return_data.user_id, money: return_data.account},
                                            method: 'GET',
                                            header: {
                                                'Content-Type': 'application/json'
                                            }
                                        }).then(function (res) {
                                            if (res.data.code == 1) {
                                                //console.log('成功了');
                                                if (app.globaldata.userinfo.level_id != res.data.data.level_id) {
                                                    setTimeout(function () {
                                                        wx.showToast({
                                                            title: '恭喜您升级为' + res.data.data.level_name,
                                                            icon: 'none',
                                                        })
                                                    }, 2000);
                                                }
                                                app.globaldata.userinfo = res.data.data;
                                                //console.log(app.globaldata.userinfo);
                                                setTimeout(function () {
                                                    wx.switchTab({
                                                        url: '/pages/user/usercenter',
                                                    })
                                                }, 1500);
                                            } else {
                                                console.log('失败了');
                                            }
                                        })
                                    //}
                                //});
                            }
                        });
                    }
                });
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                });
                return false;
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            userinfo: app.globaldata.userinfo
        });

        if(app.globaldata.userinfo.level_id<2){
          wx.showModal({
            title: '温馨提示',
            content: '您的身份是游客，无法充值，请先完善个人资料升级为注册会员',
            confirmText: '去完善',
            success: function (r) {
              if (r.confirm) {
                console.log('会员资料');
                wx.navigateTo({
                  url: '/pages/user/infoset',
                })
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
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