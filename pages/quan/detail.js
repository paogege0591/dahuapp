// pages/quan/detail.js
var app = getApp();
const fetch = require("../../util/fetch");

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
    get_quan: function(e) {
        var that = this;
        var coupon_id = e.currentTarget.dataset.couponId;
        var user_id = app.globaldata.uid;
        var request_data = {user_id: user_id, coupon_id: coupon_id};
        fetch("coupon/getCoupon", request_data).then((res) => {
            //console.log(res);return;
            if (res.data.code == 1) {
                wx.showToast({
                    title: res.data.msg,
                    duration: 2000,
                    success: function () {
                        setTimeout(function () {
                            wx.redirectTo({
                                url: '/pages/quan/list?type=mine',
                            })
                        }, 1000);
                    }
                });
            } else if (res.data.code == 0) {
                wx.showToast({
                    title: res.data.msg,
                    duration: 1000
                });return;
            }
        });
    },
  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        var that = this;
        var id = options.id;
        var request_data = { id: id};
        fetch("coupon/detail", request_data).then((res) => {
            if (res.data.code == 1) {
                that.setData({
                    detail: res.data.data
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