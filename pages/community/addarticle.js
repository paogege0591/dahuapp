var app=getApp();
const promise = require("../../util/wxRequest");
const wxRequest = promise.wxPromisify(wx.request);

Page({
  data: {
    title: '',
    content: '',
    img_msg:[
      '',
      '',
      ''
    ],
  },
  sub_article:function(){
      var that = this, title = that.data.title, content = that.data.content;
      var latitude = that.data.latitude;
      var longitude = that.data.longitude;
      var user_id = app.globaldata.uid;
    //console.log(that.data);
    // wx.showToast({
    //     title: '发布成功，请等待审核',
    //     icon: 'none'
    // })
    if (title == '') {
        wx.showToast({
            title: '请输入标题',
            icon: 'none'
        });return;
    }
    if (content == '') {
        wx.showToast({
            title: '请输入内容',
            icon: 'none'
        }); return; 
    }
    wxRequest({
        url: app.globaldata.site_url + "community/publish",
        data: {
            user_id: user_id, 
            title: title,
            content: content,
            latitude: latitude,
            longitude: longitude,
            imgs: JSON.stringify(that.data.img_msg)
        },
        method: 'GET',
        header: {
            'Content-Type': 'application/json'
        }
    }).then(function (res) {
        if (res.data.code == 1) {
            wx.showToast({
                title: res.data.msg,
                success: function () {
                    if (res.data.data.community_level_id != app.globaldata.userinfo.community_level_id) {
                        wx.showToast({
                            title: '恭喜您升级',
                            icon: 'success'
                        });
                    }
                    setTimeout(function () {
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 2000);
                }
            })
        } else {
            wx.showToast({
                title: res.data.msg,
            });return;
        }
    });
  },
  save_title: function (e) {
    var that = this, title = e.detail.value;
    that.setData({
      title: title,
    })
    // console.log(title);
  },

  save_content: function (e) {
    var that = this, content = e.detail.value;
    that.setData({
      content: content,
    })
    // console.log(content);
  },

  delimg: function (e) {
    var that = this, index = e.currentTarget.dataset.index, img_msg = that.data.img_msg;

    img_msg[index] = '';

    that.setData({
      img_msg: img_msg
    });
    console.log(img_msg);
  },

  addimg:function(e){
    var that = this, index = e.currentTarget.dataset.index, img_msg = that.data.img_msg;

    wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        count:1, //每次只允许选一张
        success: function(res) {
            // img_msg[index] = res;
            // that.setData({
            // img_msg:img_msg,
            // });
            //console.log(res);
            var temp_path = res.tempFilePaths[0];
            wx.uploadFile({
                url: app.globaldata.site_url + 'index/uploader', //仅为示例，非真实的接口地址
                filePath: temp_path,
                name: 'file',
                formData: {
                    module: 'wxapp'
                },
                success: function (res) {
                    var result = JSON.parse(res.data);
                    if (result.code == 1) {
                        img_msg[index] = result.url;
                        //console.log(img_msg);
                        wx.showToast({
                            title: result.msg,
                            icon: 'none'
                        });
                        that.setData({
                            img_msg: img_msg
                        });
                    } else {
                        wx.showToast({
                            title: result.msg,
                            icon: 'none'
                        });
                    }
                }
            })
        },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        //发布文章获取当前定位
        var that = this;
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                var latitude = res.latitude;
                var longitude = res.longitude;
                // console.log(latitude, longitude);
                that.setData({
                    latitude: latitude,
                    longitude: longitude
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