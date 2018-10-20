// pages/scoreproduct/details.js
var app = getApp();
const fetch = require("../../util/fetch");
var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
      pro_id: 101,
      goods_picker: 0,
      quan_picker: 0,
      score: 0,
      num: 1,
      per_price: 0,
      curoption: 0,
      optionstr: '',
      option_name: 0,
      detail: {},
      userinfo: app.globaldata.userinfo
  },

    changeoption: function (e) {
        var that = this;
        app.change_score_option(e, that);
    },
    hideguige: function () {
        this.setData({
            goods_picker: 0
        });
    },
    showguige: function () {
        this.setData({
            goods_picker: 1
        });
    },
    minus: function () {
        var that = this;
        app.minus_score(that);
    },
    plus: function () {
        var that = this;
        app.plus_score(that);
    },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        var that = this;
        if (app.globaldata.userinfo == '') {
            wx.showToast({
                title: '请先登录',
                icon: 'none',
                success: function () {
                    setTimeout(function () {
                        wx.switchTab({
                            url: '/pages/user/usercenter',
                        })
                    }, 2000);
                }
            })
        }
        that.setData({
            user_score: app.globaldata.userinfo.score
        });
        //console.log(that.data.user_score);
        if (options.pro_id) {
            var pro_id = options.pro_id;
            var user_id = app.globaldata.uid;
            this.setData({
                pro_id: Number(pro_id),
                user_id: user_id
            });
        }
        var request_data = { user_id: user_id, pro_id: that.data.pro_id };
        fetch("score_goods/detail", request_data).then((res) => {
            wx.showToast({
                title: '加载中',
                icon: 'loading',
                duration: 500
            });
            //console.log(res.data);return;
            if (res.data.code == 1) {
                var curoption = {}, option_name = {};
                for (var i = 0; i < res.data.data.options.length; i++) {
                    curoption[res.data.data.options[i].type_name] = res.data.data.options[i].options[0].option_id;
                    option_name[res.data.data.options[i].type_name] = res.data.data.options[i].options[0].option_name;
                }
                that.setData({
                    detail: res.data.data,
                    curoption: curoption,
                    option_name: option_name,
                    //quan_list: res.data.data.coupon
                });
                console.log(that.data.detail);
                var content = res.data.data.goods_content;
                //console.log(content);
                WxParse.wxParse('article', 'html', content, that);
                //console.log(curoption);
                app.changescore(curoption, that);
                wx.setNavigationBarTitle({
                    title: res.data.data.pro_name
                })
            } else {
                // 失败
            }
        });
    },

    exchange: function () {
        if (app.globaldata.userinfo == '') {
            //console.log('请先授权登录'); return;
            wx.showToast({
                title: '请先授权登录',
                icon: 'none'
            }); return;
        }
        var that = this, spec_key_key = that.data.optionstr, goods_id = that.data.pro_id, goods_num = that.data.num;
        var postpay = [{ goods_id: goods_id, spec_key_key: spec_key_key, goods_num: goods_num }];
        postpay = JSON.stringify(postpay);
        //console.log(postpay);return;
        wx.navigateTo({
            url: '/pages/scoreproduct/exchange?postpay=' + postpay,
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