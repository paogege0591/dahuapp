// pages/commentinfo/commentinfo.js
var app = getApp();
const promise = require("../../util/wxRequest");
const wxRequest = promise.wxPromisify(wx.request);

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        var that = this;
        var comment_id = options.comment_id;
        wxRequest({
            url: app.globaldata.site_url + "order/commentInfo",
            data: {
                comment_id: comment_id
            },
            method: 'POST',
            header: {
                'Content-Type': "application/x-www-form-urlencoded"
            }
        }).then(function (res) {
            if (res.data.code == 1) {
                var num = [];
                for (var i = 0 ; i < res.data.data.rating ; i ++) {
                    num.push(i);
                }
                that.setData({
                    info: res.data.data,
                    num: num
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