// pages/user/usercenter.js
var app = getApp();
const fetch = require("../../util/fetch");
const promise = require("../../util/wxRequest");
const wxRequest = promise.wxPromisify(wx.request);
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    //默认给一个游客用户数据
    is_login:true,
    userinfo: {
    },
    num:{
      mark:0,
      watched:0,
      all_quan:0,
      my_quan:0
    },
    customStyle3: {
      'background-color': '#39f',
      'position': 'absolute',
      'top': '-5px',
      'right': '-15px',
      'border': '1px solid #fff'
    },
    status_count_dfk: '0', //待付款
    status_count_dfh: '0', //待发货
    status_count_dsh: '0', // 待收货
    status_count_dpj: '0', //待评价
    status_count_tk: '0', //退款、退货
    recommend: []
  },
  /**
   * 页面的初始数据
   */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userinfo = app.globaldata.userinfo;
    if (userinfo != '') {
      //已经登录
      var user_id = app.globaldata.uid;
      wxRequest({
        url: app.globaldata.site_url + "user_center/orderStatusCount",
        data: { user_id: user_id },
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        }
      }).then(function (res) {
        if (res.data.code == 1) {
          that.setData({
            status_count_dfk: res.data.data.dfk, //待付款
            status_count_dfh: res.data.data.dfh, //待发货
            status_count_dsh: res.data.data.dsh, // 待收货
            status_count_dpj: res.data.data.thh, //待评价
          });
        }
      });
    }
    wxRequest({
      url: app.globaldata.site_url + "index/usercenter_num",
      data: { user_id: app.globaldata.uid },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    }).then(function (res) {
      that.setData({
        num: res.data
      });
    });

    wxRequest({
      url: app.globaldata.site_url + "index/getBanner",
      header: {
        'Content-Type': 'application/json'
      }
    }).then(function (res) {
      that.setData({
        recommend:res.data
      });
    });

    that.setData({
      userinfo: userinfo
    });
  },

  getUserInfo: function (e) {
    var that = this;
    var userinfo = e.detail.userInfo
    //app.globaldata.userinfo = userinfo;
    var request_data = { user_id: app.globaldata.uid, nickname: userinfo.nickName, avatar: userinfo.avatarUrl }
    //console.log(request_data);return;
    fetch("index/updateUserInfo", request_data).then((res) => {
      var results = res.data;
      if (results.code == 1) {
        app.globaldata.userinfo = results.data;
        //console.log(results, app.globaldata.userinfo);
        that.setData({
          userinfo: app.globaldata.userinfo
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
    this.onLoad();
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