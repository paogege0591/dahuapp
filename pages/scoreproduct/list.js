// pages/scoreproduct/list.js
const app = getApp();
const fetch = require("../../util/fetch");

Page({

  /**
   * 页面的初始数据
   */
    data: {
        page: 1, //默认第一页
        list: [],
    },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        var that = this;
      if (app.globaldata.userinfo.level_id < 2) {
        wx.showModal({
          title: '温馨提示',
          content: '您的身份是游客，无法使用积分商城，请先完善个人资料升级为注册会员',
          confirmText: '去完善',
          success: function (r) {
            if (r.confirm) {
              console.log('会员资料');
              wx.navigateTo({
                url: '/pages/user/infoset',
              })
            } else {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
        var user_id = app.globaldata.uid;
        that.setData({
            page: 1, //进入列表或者刷新 始终保持 第一页
        });
        var request_data = { user_id: user_id, page: 1};
        
        that.list(request_data);
    },

    //获取列表数据
    list: function (request_data) {
        let that = this;
        if (that.data.page == 1) { //预防下拉数据重置
            that.setData({
                list: []
            });
        }
        fetch("score_goods/list", request_data).then((res) => {
            wx.showToast({
                title: '加载中',
                icon: 'loading',
                duration: 500
            });
            var lastList = that.data.list;
            for (var i in res.data.list) {
                lastList.push(res.data.list[i]);
            }
            that.setData({
                list: lastList,
                countPage: res.data.countPage
            })
        })
    },

    //上拉加载分页数据
    onReachBottom: function () {
        let that = this;
        if (that.data.page == that.data.countPage) {
            that.setData({
                end: true
            });
            return;
        }
        //console.log(that.data.page);
        that.setData({ page: that.data.page + 1 });
        var request_data = { user_id: app.globaldata.uid, page: that.data.page};
        that.list(request_data);
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})