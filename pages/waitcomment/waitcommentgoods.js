// pages/waitcomment/waitcommentgoods.js
const app = getApp();
const promise = require("../../util/wxRequest");
const wxRequest = promise.wxPromisify(wx.request);

Page({

  /**
   * 页面的初始数据
   */
    data: {
        status : '-1', //全部评论
        has_firm: 1,
        wuliu_picker: 0,
        wuliu_list: '',
    },

    changecur: function (e) {
        var that = this;
        var status = e.currentTarget.dataset.status;
        
        that.setData({
            status: status
        });
        that.getList();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        var status = options.curtab;
        if (status) {
            that.setData({
                status: status
            });
        }
        that.getList();
    },

    getList: function () {
        var that = this;
        wxRequest({
            url: app.globaldata.site_url + "order/waitCommentGoodsList",
            data: { status: that.data.status, user_id: app.globaldata.uid },
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            }
        }).then(function (res) {
            //console.log(res);return;
            if (res.data.code == 1) {
                that.setData({
                    list: res.data.data.result,
                    countPage: res.data.data.countPage
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