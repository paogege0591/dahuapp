var app = getApp();
const fetch = require("../../util/fetch");
var WxParse = require('../../wxParse/wxParse.js');
const promise = require("../../util/wxRequest");
const wxRequest = promise.wxPromisify(wx.request);

Page({
  data: {
    ms_list:'',
  },

  onLoad: function (options) {
    var that = this;
    // var ms_list = [
    //   { id: 2, starttime: '2018-09-02 20:00', endtime: '2018-09-02 22:00', comment: '大湖小龙虾低至5元1斤!', title: '20点场' },
    //   { id: 6, starttime: '2018-09-03 14:00', endtime: '2018-09-03 14:05', comment: '大湖小龙虾低至5元1斤!', title: '14点场' },
    //   { id: 8, starttime: '2018-09-04 16:00', endtime: '2018-09-04 16:05', comment: '大湖小龙虾低至5元1斤!', title: '16点场' },
    // ];
    var ms_list = '';
    // wx.request({
    //   url: 'https://www.dhdjk.net/wxapp/seckill/activityList',
    //   method:'post',
    //   dataType:'json',      
    //   success:function(res){        
    //     if(res.data.code == 1){
    //       ms_list = res.data.data;  
    //       console.log('ms_list:'+ms_list);   

    //       that.setData({
    //         ms_list: ms_list
    //       });    
    //     }
    //   }
    // })

    wxRequest({
      url: 'https://www.dhdjk.net/wxapp/seckill/activityList',
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    }).then(function (res) {
      console.log(res);
      ms_list = res.data.data;
      that.setData({
        ms_list:ms_list
      });
      console.log(that.data);
    });

    console.log(that.data);
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

  onReachBottom: function () {
  
  },


  onShareAppMessage: function () {
  
  }
})