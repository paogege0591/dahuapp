//index.js
//获取应用实例
const app = getApp();
const fetch = require("../../util/fetch");
const txvContext = requirePlugin("tencentvideo");


Page({
  data: {
    manjian: false,
    position: '',
    _num: 1,
    _num2: 1,
    footertabnum: 1,
    navipic: '',
    miaosha: {
      // changci: '18点场',
      // endtime: 1535593516,
    },
    countDownHour: '00',
    countDownMinute: '00',
    countDownSecond: '00',
    miaoshapic: '',
    quan: [{
      style: 'dahu-bg-blue',
      money: 10
    },
    {
      style: 'dahu-bg-red',
      money: 15
    },
    {
      style: 'dahu-bg-orange',
      money: 20
    }
    ],
    rmsp: '',
  },
  go_search: function (e) {
    var that = this, keyword = that.data.keyword;
    if(!keyword){
      wx.showToast({
        title: '请先输入搜索关键词',
        icon:'none'
      })
    }else{
      wx.navigateTo({
        url: '/pages/product/list?keyword='+keyword,
      })
    }
  },
  set_keyword: function (e) {
    var that = this, keyword = e.detail.value;
    that.setData({
      keyword: keyword
    });
  },
  redirect: function (e) {
    var pro_id = e.currentTarget.dataset.id;
    // console.log(e);return false;
    wx.navigateTo({
      url: '/pages/details/details?pro_id=' + pro_id,
    })
  },
  onLoad: function () {
    var that = this, latitude = 0, longitude = 0;
    this.txvContext = txvContext.getTxvContext('txv1');
    that.setData({
      user_id: app.globaldata.uid,
    });

    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        latitude = res.latitude;
        longitude = res.longitude;
      }
    });
    var request_data = {
      latitude: latitude,
      longitude: longitude
    };
    fetch("index/getRecentStore", request_data).then((res) => {
      that.setData({
        position: res.data.name + ' ( ' + res.data.distance + ' )'
      })
    });
    that.getBanner();
    that.recommendSelling();
    that.indexCategory();
    that.set_miaosha();
    that.set_manjian();
  },

  //首页选择区域 获取最近门店
  selectArea: function () {
    var that = this;
    wx.authorize({
      scope: 'scope.userLocation',
      success: function () {
        console.log('位置已授权');
        wx.chooseLocation({
          success: function (res) {
            var latitude = res.latitude;
            var longitude = res.longitude;
            var request_data = {
              latitude: latitude,
              longitude: longitude
            };
            fetch("index/getRecentStore", request_data).then((res) => {
              that.setData({
                position: res.data.name + ' ( ' + res.data.distance + ' )'
              })
            });
          }
        });
      },
      fail: function () {
        console.log('位置未授权');
        wx.openSetting({});
      },
    });

  },

  //轮播图 
  getBanner: function () {
    var that = this;
    fetch("index/getBanner", {}).then((res) => {
      that.setData({
        navipic: res.data
      });
    });
  },

  recommendSelling: function () {
    var that = this;
    fetch("index/recommendSelling", {}).then((res) => {
      that.setData({
        rmsp: res.data
      });
    });
  },

  indexCategory: function () {
    var that = this;
    fetch("index/indexCategory", {}).then((res) => {
      if (res.data.code == 1) {
        that.setData({
          cat_id: res.data.data[0].id, //初始化默认第一个栏目
          data: res.data.data[0].goods,
          category: res.data.data,
        });
        var orgin_arr = [];
        for (var i = 0; i < res.data.data.length; i++) {
          var obj = {};
          var key = res.data.data[i]['id'];
          obj[key] = res.data.data[i];
          //orgin_arr.push(obj);
          orgin_arr[key] = res.data.data[i];
        }
        //console.log(orgin_arr);return;
        that.setData({
          orgin_arr: orgin_arr
        });
      }
    });
  },

  changecur: function (e) {
    var that = this;
    that.setData({
      _num: e.currentTarget.dataset.num
    })
  },
  changecur2: function (e) {
    var that = this;
    //console.log(that.data.orgin_arr);return;
    var cat_id = e.target.dataset.id;
    that.setData({
      cat_id: cat_id,
      data: that.data.orgin_arr[cat_id].goods
    })
  },
  changecurfoot: function (e) {
    var that = this;
    that.setData({
      footertabnum: e.currentTarget.dataset.num
    })
  },

  getUserInfo: function (e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  miaosha_set: function () {
    var now = Date.parse(new Date()) / 1000, that = this;
    console.log(that.data.miaosha);
    if(that.data.miaosha.end_time=='0'||that.data.miaosha.end_time<now){

      that.setData({
        'miaosha.changci':'活动已结束',
        countDownHour:'00',
        countDownMinute:'00',
        countDownSecond:'00',
      });
      return false;
    }
    var totalSecond = ((now > that.data.miaosha.start_time) ? that.data.miaosha.end_time : that.data.miaosha.start_time) - now;
    var changci = (now < that.data.miaosha.start_time) ? '即将开始' : '正在进行';
    that.setData({
      'miaosha.changci': changci
    });
    console.log(that.data.miaosha);
    var interval = setInterval(function () {
      // 秒数
      var second = totalSecond;

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
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        var now = Date.parse(new Date()) / 1000;
        var changci2 = (now < that.data.miaosha.end_time) ? '正在进行' : '活动已结束';
        // this.setData({
        //   miaosha: {
        //     changci: changci2,
        //     end_time: this.data.miaosha.end_time,
        //   },
        //   countDownHour: '00',
        //   countDownMinute: '00',
        //   countDownSecond: '00',
        // });
        that.set_miaosha();
      }
    }.bind(this), 1000);

  },
  set_miaosha: function () {
    var that = this;
    wx.request({
      url: 'https://www.dhdjk.net/wxapp/index/miaoShaList',
      method: 'post',
      dataType: 'json',
      success: function (res) {
        var miaosha = res.data.data;
        if (!miaosha.end_time) {
          miaosha = { start_time: 0, end_time: 0, list: [] };
        }
        that.setData({
          miaosha: miaosha
        });
        that.miaosha_set();
      }
    })
  },
  set_manjian: function () {
    var that = this;
    wx.request({
      url: 'https://www.dhdjk.net/wxapp/index/fullReduce',
      method: 'post',
      dataType: 'json',
      success: function (res) {
        var manjian = res.data.data;
        if (manjian.id > 0) {
          that.setData({
            manjian: manjian
          });
        }
      }
    })
  },
  onReady: function () {
  }

})