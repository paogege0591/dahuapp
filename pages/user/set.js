'use strict';

const app = getApp();
const promise = require("../../util/wxRequest");
const wxRequest = promise.wxPromisify(wx.request);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    groups: [{
      title: '支付密码管理',
      link: '/pages/user/setpaypwd',
      iconfont: 'icon-mima'
    }, {
      title: '收货地址管理',
      link: '/pages/addr/addr',
      iconfont: 'icon-dizhi'
    }, {
      title: '发票信息管理',
      link: '/pages/fapiao/fapiao',
      iconfont: 'icon-fapiao'
    }, {
      title: '退出登录',
      link: 'logout',
      iconfont: 'icon-tuichu'
    }],
    user:{}
  },
  navigator: function navigator(e) {
    var link = e.currentTarget.dataset.link, that = this;
    // console.log(link);
    if (link == 'logout') {
      app.globaldata.userinfo = '';
      that.setData({
        user: ''
      });
      wx.showToast({
        title: '退出成功',
        icon:'none',
        duration:3000,
        success: function () {
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/user/usercenter',
            })
          }, 3000);
        }
      })
      
    } else {
      wx.navigateTo({
        url: link
      });
    }
  },
  onLoad:function(){
    var that = this;
    var user = JSON.parse(JSON.stringify(app.globaldata.userinfo));
    if(user.mobile){
      user.mobile = user.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    }
    that.setData({
      user:user
    });
  }
});