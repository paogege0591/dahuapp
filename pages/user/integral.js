const app = getApp();
const fetch = require("../../util/fetch");
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    integral: 0,
    current1: 0,
    scrollTop: 0,
    scrollHeight: 0,
    activeTabStyle: {
      'color': '#f19149'
    },
    inkBarStyle: {
      'border-bottom': '1px solid #f19149',
      'width': '60%',
      'color': 'red'
    },
    intDetail: [{
      id: 1,
      title: '充值积分奖励',
      time: '2018-09-26  10:33:29',
      Integral: '300'
    }, {
      id: 2,
      title: '充值积分奖励',
      time: '2018-09-26  10:33:29',
      Integral: '300'
    }, {
      id: 3,
      title: '充值积分奖励',
      time: '2018-09-26  10:33:29',
      Integral: '300'
    }, {
      id: 4,
      title: '充值积分奖励',
      time: '2018-09-26  10:33:29',
      Integral: '300'
    }, {
      id: 5,
      title: '充值积分奖励',
      time: '2018-09-26  10:33:29',
      Integral: '300'
    }, {
      id: 6,
      title: '充值积分奖励',
      time: '2018-09-26  10:33:29',
      Integral: '300'
    }, {
      id: 7,
      title: '充值积分奖励',
      time: '2018-09-26  10:33:29',
      Integral: '300'
    }, {
      id: 8,
      title: '充值积分奖励',
      time: '2018-09-26  10:33:29',
      Integral: '300'
    }, {
      id: 9,
      title: '充值积分奖励',
      time: '2018-09-26  10:33:29',
      Integral: '300'
    }],
    consumeDetail: []
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

  onLoad: function onLoad(options) {
    var that = this;
    if (app.globaldata.uid > 0) {
      that.setData({
        integral: app.globaldata.userinfo.score
      });
    }
    wx.getSystemInfo({
      success: function success(res) {
        console.log(res.windowHeight);
        that.setData({ scrollHeight: res.windowHeight - 199 });
      }
    });
    var user_id = app.globaldata.uid;
    var request_data = { user_id: user_id };
    fetch("user_center/jifenList", request_data).then((res) => {
      var list = res.data.data;
      var intDetail = [], consumeDetail = [];
      for (var i in list) {
        if (list[i].type == 1) {
          intDetail.push(list[i]);
        } else {
          consumeDetail.push(list[i]);
        }
      }
      that.setData({
        consumeDetail: consumeDetail,
        intDetail: intDetail
      });
      console.log(that.data);
    })
  }

});