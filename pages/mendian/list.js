var app=getApp();
const fetch = require("../../util/fetch");

Page({
  data: {
    list: '',
    
  },
    /* 2018-07-28 */
    call: function (e) {
        var telnum = e.currentTarget.dataset.telnum;
        wx.makePhoneCall({
            phoneNumber: telnum
        });
    },
    map: function (e) {
        var store_id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/mendian/detail?store_id=' + store_id,
        });
    },
    daohang: function(e) {
        var location_name = e.currentTarget.dataset.location,
            latitude = e.currentTarget.dataset.latitude,
            longitude = e.currentTarget.dataset.longitude;
        wx.openLocation({
            name: location_name,
            latitude: Number(latitude),
            longitude: Number(longitude),
        })
    },

    /* 2018-07-28
    * 获取门店列表
    */
    getStores: function (latitude, longitude) {
        var that = this;
        var request_data = 
        {
            latitude: latitude,
            longitude: longitude
        };
        fetch("store/getStores", request_data).then((res) => {
            that.setData({
                list: res.data
            });
        });
    },

  onLoad: function (options) {
        var that = this;

        /* 2018-07-28 当前位置 */
        wx.getLocation({
        type: 'gcj02',
            success: function (res) {
            var latitude = res.latitude;
            var longitude = res.longitude;
                that.getStores(latitude, longitude);
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