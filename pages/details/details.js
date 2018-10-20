var app = getApp();
const fetch = require("../../util/fetch");
var WxParse = require('../../wxParse/wxParse.js');
const promise = require("../../util/wxRequest");
const wxRequest = promise.wxPromisify(wx.request);
var share_picker = true;
Page({
  data: {
    pro_id: 1,
    goods_picker: 0,
    quan_picker: 0,
    share_picker: false,
    price: 0,
    num: 1,
    per_price: 0,
    curoption: 0,
    optionstr: '',
    option_name: 0,
    detail: {},
    // quan: [
    //     { name: '15元通用' },
    //     { name: '20元通用' },
    //     { name: '满100减30' },
    // ]
  },
  checkdata: function () {
    // if
  },
  changeoption: function (e) {
    var that = this;
    app.changeoption(e, that);
  },
  hideguige: function () {
    this.setData({
      goods_picker: 0
    });
  },
  showquan: function () {
    this.setData({
      quan_picker: 1
    });
  },
  hidequan: function () {
    this.setData({
      quan_picker: 0
    });
  },
  showguige: function () {
    this.setData({
      goods_picker: 1
    });
  },
  minus: function () {
    var that = this;
    app.minus(that);
  },
  plus: function () {
    var that = this;
    app.plus(that);
  },
  totalShare: function () {
    console.log("啦啦啦啦啦");
    if (share_picker) {
      console.log("显示");
      share_picker = false;
      this.setData({
        share_picker: true
      });
    } else {
      console.log("隐藏");
      share_picker = true;
      this.setData({
        share_picker: false
      });
    }
  },
  hideShare: function () {
    this.setData({
      share_picker: false
    });
  },
  onLoad: function (options) {
    var that = this;
    var user_id = app.globaldata.uid;
    if (options.pro_id) {
      var pro_id = options.pro_id;
      this.setData({
        pro_id: Number(pro_id),
        user_id: user_id
      });
    }

    var request_data = { user_id: user_id, pro_id: that.data.pro_id };
    // fetch("category_goods/detail", request_data).then((res) => {
    //     wx.showToast({
    //         title: '加载中',
    //         icon: 'loading',
    //         duration: 500
    //     });
    //     //console.log(res.data);return;
    //     if (res.data.code == 1) {
    //         var curoption = {}, option_name = {};
    //         for (var i = 0; i < res.data.data.options.length; i++) {
    //             curoption[res.data.data.options[i].type_name] = res.data.data.options[i].options[0].option_id;
    //             option_name[res.data.data.options[i].type_name] = res.data.data.options[i].options[0].option_name;
    //         }
    //         that.setData({
    //             detail: res.data.data,
    //             curoption: curoption,
    //             option_name: option_name,
    //             quan_list: res.data.data.coupon
    //         });
    //         console.log(that.data.detail);
    //         var content = res.data.data.goods_content;
    //         //console.log(content);
    //         WxParse.wxParse('article', 'html', content, that);
    //         //console.log(curoption);
    //         app.changeprice(curoption, that);
    //         wx.setNavigationBarTitle({
    //             title: res.data.data.pro_name
    //         });

    //     } else {
    //         // 失败
    //     }
    // });

    wxRequest({
      url: app.globaldata.site_url + "category_goods/detail",
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
        var curoption = {}, option_name = {};
        for (var i = 0; i < res.data.data.options.length; i++) {
          curoption[res.data.data.options[i].type_name] = res.data.data.options[i].options[0].option_id;
          option_name[res.data.data.options[i].type_name] = res.data.data.options[i].options[0].option_name;
        }
        that.setData({
          detail: res.data.data,
          curoption: curoption,
          option_name: option_name,
          quan_list: res.data.data.coupon
        });
        console.log(that.data.detail);
        var content = res.data.data.goods_content;
        //console.log(content);
        WxParse.wxParse('article', 'html', content, that);
        //console.log(curoption);
        app.changeprice(curoption, that);
        wx.setNavigationBarTitle({
          title: res.data.data.pro_name
        });

      } else {
        // 失败
      }
    }).then(function () {
      return wxRequest({
        url: app.globaldata.site_url + "category_goods/getShopCartCount",
        data: { user_id: app.globaldata.uid },
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        }
      }).then(function (res) {
        if (res.data.code == 1) {
          that.setData({
            shopcart_count: res.data.data
          });
        }
      });
    });

  },
  // 关注
  attention: function (e) {
    if (app.globaldata.userinfo == '') {
      console.log('请先授权登录'); return;
    }
    var that = this;
    var pro_id = e.currentTarget.dataset.proId,
      user_id = e.currentTarget.dataset.userId;
    var request_data = { pro_id: pro_id, user_id: user_id };
    var detail = that.data.detail;
    //console.log(detail);return;
    fetch("category_goods/attentionGoods", request_data).then((res) => {
      if (res.data.code == 1) {
        if (res.data.data.status == 0) {
          detail.attention = 0;
          wx.showToast({
            title: '取消关注成功',
          });
        } else if (res.data.data.status == 1) {
          detail.attention = 1;
          wx.showToast({
            title: '关注成功',
          });
        }
      }
      that.setData({
        detail: detail
      });
    });
  },

  //加入购物车
  joinShopCart: function () {
    var that = this;
    if (app.globaldata.userinfo == '') {
      //console.log('请先授权登录'); return;
      wx.showToast({
        title: '请先授权登录',
        icon: 'none'
      }); return;
    }
    var user_id = app.globaldata.uid;
    var pro_id = that.data.pro_id;
    var optionstr = that.data.optionstr;
    var option_name = JSON.stringify(that.data.option_name);
    var num = that.data.num;
    var goods_price = that.data.price / num; //商品单价
    var request_data = { user_id: user_id, pro_id: pro_id, optionstr: optionstr, option_name: option_name, num: num, goods_price: goods_price };
    // fetch("category_goods/joinShopCart", request_data).then((res) => {
    //     if (res.data.code == 1) {
    //         wx.showToast({
    //             title: '加入购物车成功',
    //         });  
    //     } else {
    //         wx.showToast({
    //             title: '加入购物车失败',
    //         });
    //     }
    // });

    wxRequest({
      url: app.globaldata.site_url + "category_goods/joinShopCart",
      data: request_data,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    }).then(function (res) {
      if (res.data.code == 1) {
        wx.showToast({
          title: '加入购物车成功',
        });
      } else {
        wx.showToast({
          title: '加入购物车失败',
        });
      }
    }).then(function () {
      return wxRequest({
        url: app.globaldata.site_url + "category_goods/getShopCartCount",
        data: { user_id: app.globaldata.uid },
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        }
      }).then(function (res) {
        if (res.data.code == 1) {
          that.setData({
            shopcart_count: res.data.data
          });
        }
      });
    });
  },

  gotopay: function () {
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
      url: '/pages/pay/pay?postpay=' + postpay,
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