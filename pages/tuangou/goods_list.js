const app = getApp();
const fetch = require("../../util/fetch");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1, //默认第一页
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    var url = 'https://www.dhdjk.net/wxapp/group_buying/list';
    wx.request({
      url: url,
      method: 'post',
      dataType: 'json',
      success: function (res) {
        that.setData({
          list: res.data.data
        });
        console.log(that.data.list);
      }
    })
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onShareAppMessage: function () {

  }
})