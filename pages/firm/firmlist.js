// pages/firm/firmlist.js
const app = getApp();
const promise = require("../../util/wxRequest");
const wxRequest = promise.wxPromisify(wx.request);

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curtab: 'all',
    has_firm: 1,
    wuliu_picker:0,
    wuliu_list:'',
  },
  changecur:function(e){
    var that = this;
    var tab = e.currentTarget.dataset.tab;
    // 改tab
    that.setData({
      curtab: tab
    });
    if (tab != 'dpj') {
        // 改数据
        that.getOrderList();
    } else {
        setTimeout(function () {
            wx.navigateTo({
                url: '/pages/waitcomment/waitcommentgoods?curtab=0',
            })
        }, 500);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        var that = this;
        var curtab = options.curtab;
        if (curtab) {
            that.setData({
                curtab: curtab
            });
        }
        that.getOrderList();
  },

    getOrderList: function () {
        var that = this;
        wxRequest({
            url: app.globaldata.site_url + "order/orderList",
            data: { type: that.data.curtab, user_id: app.globaldata.uid },
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            }
        }).then(function (res) {
            //console.log(res);return;
            if (res.data.code == 1) {
                that.setData({
                    list: res.data.data,
                });
            }
        });
    },

    //查看物流数据
    deliver: function (e) {
        var num = e.currentTarget.dataset.num, code = e.currentTarget.dataset.code;
        var that = this;
        wxRequest({
            url: app.globaldata.site_url + "logistics/getOrderTracesByJson",
            data: { num: num, code: code },
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            }
        }).then(function (res) {
            var wuliu_list = [{ AcceptTime: '', AcceptStation:'暂无物流信息！'}];
            if(res.data.Traces){
                wuliu_list = res.data.Traces;
            }
            that.setData({
                wuliu_picker:1,
                wuliu_list:wuliu_list
            });
            console.log(res.data);
        });

    },

    //关闭物流信息
    wl_cancle:function(){
        this.setData({
            wuliu_picker:0
        });
    },

    //取消订单  未付款情况
    cancel_order: function (e) {
        var that = this;
        var id = e.currentTarget.dataset.orderId; //订单id
        wx.showModal({
            title: '提示',
            content: '确定要取消订单吗？',
            success: function (res) {
                if (res.confirm) {
                    return wxRequest({
                        url: app.globaldata.site_url + "order/cancel_order",
                        data: { id: id, user_id: app.globaldata.uid },
                        method: 'GET',
                        header: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function (res) {
                        if (res.data.code == 1) {
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                success: function () {
                                    that.getOrderList();
                                }
                            });
                        } else {
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none'
                            });
                            return;
                        }
                    });
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    //确认收货
    sure: function (e) {
        var that = this;
        var id = e.currentTarget.dataset.orderId; //订单id
        var user_id = app.globaldata.uid;
        wxRequest({
            url: app.globaldata.site_url + "order/sure",
            data: { id: id, user_id: user_id },
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            }
        }).then(function (res) {
            if (res.data.code == 1) {
                wx.showToast({
                    title: '收货成功',
                    icon: 'success',
                    success: function () {
                        // that.setData({
                        //     curtab: 'dpj'
                        // });
                        that.getOrderList();
                    }
                })
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