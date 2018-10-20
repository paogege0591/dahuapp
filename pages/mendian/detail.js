// pages/mendian/detail.js
var app = getApp();
const fetch = require("../../util/fetch");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园'
    }],
    covers: [{
      latitude: 23.099994,
      longitude: 113.344520,
      iconPath: '/static/image/location.png'
    }, {
      latitude: 23.099994,
      longitude: 113.304520,
      iconPath: '/static/image/location.png'
    }]
  
  },
    daohang: function (e) {
        var location_name = e.currentTarget.dataset.position,
            latitude = e.currentTarget.dataset.latitude,
            longitude = e.currentTarget.dataset.longitude;
        wx.openLocation({
            name: location_name,
            latitude: Number(latitude),
            longitude: Number(longitude),
        })
    },

    call: function (e) {
        var telnum = e.currentTarget.dataset.telnum;
        wx.makePhoneCall({
            phoneNumber: telnum
        });
    },

  /**
   * 生命周期函数--监听页面加载
   */
  /**
   * 2018-07-28
  */
    onLoad: function (options) {
        var that = this,
            store_id = options.store_id,
            request_data = { id: store_id};
        fetch("store/detail", request_data).then((res) => {
            that.setData({
                row: res.data,
                markers: [{
                    iconPath: "/static/image/location.png",
                    width: 33,
                    height: 40,
                    latitude: res.data.latitude,
                    longitude: res.data.longitude
                }]
            });
          /*|
          that.setData({
              list: res.data
          });
          */
      });
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 23.10229,
        longitude: 113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 23.10229,
        longitude: 113.3345211,
      }, {
        latitude: 23.00229,
        longitude: 113.3345211,
      }]
    })
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