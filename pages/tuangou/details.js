var app = getApp();
const fetch = require("../../util/fetch");
var WxParse = require('../../wxParse/wxParse.js');
const promise = require("../../util/wxRequest");
const wxRequest = promise.wxPromisify(wx.request);

Page({
  data: {
    pro_id: 101,
    goods_picker: 0,
    quan_picker: 0,
    price: 0,
    num: 1,
    per_price: 0,
    curoption: 0,
    optionstr: '',
    option_name: 0,
    detail: {},
    miaosha_status: 0, //0已结束，1未开始，2在进行
    endtime: 0,
    endtitle: '',
    endh: '00',
    endm: '00',
    ends: '00',
  },
  checkdata: function () {
    // if
  },
  onLoad: function (options) {
    var that = this;
    if (options.pro_id) {
      var pro_id = options.pro_id;
      var user_id = app.globaldata.uid;
      this.setData({
        pro_id: Number(pro_id),
        user_id: user_id
      });
    }

    var request_data = {
      tg_id: pro_id
    };

    wxRequest({
      url: app.globaldata.site_url + "group_buying/detail",
      data: request_data,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    }).then(function (res) {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 500
      });
      //console.log(res.data);return;
      if (res.data.code == 1) {
        var curoption = {},
          option_name = {};
        for (var i = 0; i < res.data.data.options.length; i++) {
          curoption[res.data.data.options[i].type_name] = res.data.data.options[i].options[0].option_id;
          option_name[res.data.data.options[i].type_name] = res.data.data.options[i].options[0].option_name;
        }
        that.setData({
          detail: res.data.data,
          curoption: curoption,
          option_name: option_name,
          starttime: Number(res.data.data.starttime),
          endtime: Number(res.data.data.endtime),
        });
        that.set_miaosha();
        console.log(that.data);
        var content = res.data.data.goods_content;
        //console.log(content);
        WxParse.wxParse('article', 'html', content, that);
        //console.log(curoption);
        wx.setNavigationBarTitle({
          title: '秒杀商品:' + res.data.data.pro_name
        });

      } else {
        // 失败
      }
    });
  },

  gotopay: function () {
    if (app.globaldata.userinfo == '') {
      //console.log('请先授权登录'); return;
      wx.showToast({
        title: '请先授权登录',
        icon: 'none'
      });
      return;
    }
    var that = this,
      spec_key_key = that.data.detail.optionstr,
      goods_id = that.data.pro_id,
      goods_num = that.data.num;
    var postpay = [{
      goods_id: goods_id,
      spec_key_key: spec_key_key,
      goods_num: goods_num
    }];
    postpay = JSON.stringify(postpay);
    //console.log(postpay);return;
    wx.navigateTo({
      url: '/pages/tuangou/pay?postpay=' + postpay,
    });
  },

  set_miaosha: function () {
    var now = Date.parse(new Date()) / 1000,
      that = this;
    if (now > that.data.endtime) {
      console.log('一结束');
      that.setData({
        miaosha_status: 0,
        endtitle: '秒杀活动已结束',
      });
      return false;
    } else  {
      that.setData({
        miaosha_status: 2,
        endtitle: false,
      })
    } 
    
    var totalSecond2 = this.data.endtime - Date.parse(new Date()) / 1000; //结束时间倒计时

    var interval2 = setInterval(function () {
      // 秒数
      var second = totalSecond2;

      // 小时位
      var hr = Math.floor((second) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        endh: hrStr,
        endm: minStr,
        ends: secStr,
      });
      totalSecond2--;
      if (totalSecond2 < 0) {
        clearInterval(interval2);
        this.setData({
          miaosha_status: 0,
          endtitle: '团购已结束',
          endh: '00',
          endm: '00',
          ends: '00',
        });
      }
    }.bind(this), 1000);
  },

  onShareAppMessage: function () {

  }
})