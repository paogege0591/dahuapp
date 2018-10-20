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
  onLoad: function (options) {
    var that = this;
    var ms_id = options.ms_id, url = 'https://www.dhdjk.net/wxapp/seckill/goods/ms_id/'+ms_id;
    wx.request({
      url: url,
      method:'post',
      dataType:'json',
      success:function(res){
        that.setData({
          list:res.data.data
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