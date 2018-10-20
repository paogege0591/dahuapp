// pages/user/yue.js
const app = getApp();
const fetch = require("../../util/fetch");
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    money: '0.00',
    current1: 0,
    scrollTop: 0,
    scrollHeight: 0,
    activeTabStyle: {
      'color': '#f75b5b'
    },
    inkBarStyle: {
      'border-bottom': '1px solid #f75b5b',
      'width': '60%',
      'color': 'red'
    },
    intDetail: [],//充值
    consumeDetail: [],//消费
    list:[],
  },

  onLoad: function (options) {
    var that = this;
    if (app.globaldata.uid > 0) {
      that.setData({
        money: app.globaldata.userinfo.account_balance
      });
    }
    wx.getSystemInfo({
      success: function success(res) {
        console.log(res.windowHeight);
        that.setData({ scrollHeight: res.windowHeight - 200 });
      }
    });
    var user_id = app.globaldata.uid;
    var request_data = { user_id: user_id};
    fetch("user_center/yueList", request_data).then((res) => {
      var list = res.data.data;
      var intDetail = [], consumeDetail = [];
      for (var i in list) {
        if (list[i].t == 2) {
          intDetail.push(list[i]);
        }else{
          consumeDetail.push(list[i]);
        }
      }
      that.setData({
        consumeDetail: consumeDetail,
        intDetail: intDetail
      });
      console.log(that.data);
    })
  }, 
  handleContentChange1: function handleContentChange1(e) {
    var current = e.detail.current;
    this.setData({
      current1: current
    });
  },
  handleChange1: function handleChange1(e) {
    var index = e.detail.index;
    this.setData({
      current1: index
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