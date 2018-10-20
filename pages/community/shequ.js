// pages/community/community.js
const app = getApp();
const promise = require("../../util/wxRequest");
const wxRequest = promise.wxPromisify(wx.request);
var site_url = app.globaldata.site_url;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var hide = true; //记录否显示全部
var dianzan = true; //是否点赞
exports.default = Page({
  data: {
    commentHeight: '',
    textAll: '查看全部',
    comment_text: false,
    currentInput:'',
    text:'评论',
    comment_textarea_value:'',
    isOpen:0,
    info: {}
  },
  dianzan: function (e) {
    var that = this, article_id = that.data.info.id, already = that.data.info.already_dianzan;
    wxRequest({
      url: site_url + "community/dianzan",
      data: { user_id: app.globaldata.uid, article_id: article_id, already: already },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    }).then(function (res) {
      if (res.data.code == 1) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        })
        var info = that.data.info;
        info.already_dianzan = info.already_dianzan == 1 ? 0 : 1;
        info.nums.d_num = info.already_dianzan == 1 ? (info.nums.d_num + 1) : (info.nums.d_num - 1);
          
        that.setData({
          info: info
        });
      } else {
        wx.showToast({
          title: '网络故障，请稍后重试',
          icon: 'none'
        });
      }
    });
  },
  //评论高度初始化
  onLoad: function (options) {
    var that = this, showList = [],article_id = options.article_id;
    wxRequest({
      url: site_url + "community/detail",
      data: { id: article_id ,user_id:app.globaldata.uid},
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    }).then(function(res){
      if(res.data.code==1){
        that.setData({
          info: res.data.data
        });
      }
    })
  },
  //查看评论
  slide: function slide(e) {
    var that = this,isOpen = that.data.isOpen,textAll=that.data.textAll;//评论数量
    if (isOpen == 1) {
      // 打开状态，点击设为收起
      that.setData({
        textAll:'查看全部',
        isOpen:0
      })
    } else if (isOpen == 0) {
      // 收起状态，点击设为打开
      that.setData({
        textAll: '收起评论',
        isOpen:1
      })
    }
  },
  //发送评论 
  sendClick: function (e) {
    var that = this, content = that.data.currentInput ,article_id = that.data.info.id;
    wxRequest({
      url: site_url + "community/add_reply",
      data: { article_id: article_id, user_id: app.globaldata.uid, content:content,nickname:app.globaldata.userinfo.nickname },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    }).then(function(res){
      if(res.data.code == 1){
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        });
        var info = that.data.info;
        info.reply.unshift(res.data.data);
        that.setData({
          info:info
        });
        that.article_pinglun();
      }
    })    
    // 使页面滚动到底部
    wx.pageScrollTo({
      scrollTop: 10000
    })
  },
  pinglun_dianzan: function dianzan(e) {
    var that = this,
      rid = e.currentTarget.dataset.rid,
      already = e.currentTarget.dataset.already;
    wxRequest({
      url: site_url + "community/pinglun_dianzan",
      data: { reply_id: rid, user_id: app.globaldata.uid, already: already},
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    }).then(function(res){
      if(res.data.code == 1){
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        });
        var info = that.data.info;
        for(var i in info.reply){
          if(info.reply[i].id == rid){
            info.reply[i].already_dianzan = already?0:1;
            info.reply[i].dianzan.count = already ? (info.reply[i].dianzan.count - 1) : (info.reply[i].dianzan.count+1);
          }
        }
        that.setData({
          info:info
        });
      }else{
        wx.showToast({
          title: '网络错误,请稍后重试',
          icon:'none'
        });
      }
    });
  },
  article_pinglun:function(e){
      var comment_text = this.data.comment_text;
      comment_text = comment_text ? false : true;
      this.setData({
        comment_text: comment_text
      })
  },
  currentInput: function(e){
    this.setData({
      currentInput: e.detail.value
    })
  },
  showImage: function (e) {
    var url = e.currentTarget.dataset.url;
    var urls = [];
    urls.push(url);
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  
});