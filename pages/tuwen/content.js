// pages/tuwen/content.js
const app = getApp();
const fetch = require("../../util/fetch");
var WxParse = require('../../wxParse/wxParse.js');

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
        var that = this,
            id = options.id,
            type_id = options.type_id,
            request_data = {id: id}
        that.setData({
            type_id: type_id
        });
        if (type_id == 1) {
            fetch("fish_garden/detail", request_data).then((res) => {
                that.setData({
                    row: res.data
                });
                that.setData({
                    'detail.title': res.data.title
                });
                var content = res.data.content;
                WxParse.wxParse('article', 'html', content, that);
            });
        } else if (type_id == 2) {
            fetch("taiji_article/detail", request_data).then((res) => {
                that.setData({
                    row: res.data
                });
                var content = res.data.content;
                WxParse.wxParse('article', 'html', content, that);
            });
        } else if (type_id == 3) {
            wx.setNavigationBarTitle({
                title: '招商加盟'
            });
            fetch("join_business/detail").then((res) => {
                that.setData({
                    row: res.data
                });
                var content = res.data.content;
                WxParse.wxParse('article', 'html', content, that);
            });
        } else if (type_id == 4) {
            wx.setNavigationBarTitle({
                title: '企业介绍'
            });
            fetch("about_us/detail").then((res) => {
                //console.log(res);return;
                that.setData({
                    row: res.data
                });
                var content = res.data.content;
                WxParse.wxParse('article', 'html', content, that);
            });
        } else if (type_id == 5) {
            var title = options.title;
            wx.setNavigationBarTitle({
                title: title
            });
            fetch("community/detail", {id: id}).then((res) => {
                //console.log(res);return;
                if (res.data.code == 1) {
                    that.setData({
                        detail: res.data.data
                    });
                }
            });
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