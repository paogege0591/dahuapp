var app = getApp();
const promise = require("../../util/wxRequest");
const wxRequest = promise.wxPromisify(wx.request);

Page({
    data: {
        score: 0,
        content: '',
        img_msg: [
        '',
        '',
        ''
        ]
    },
    changescore:function(e){
        var that = this;
        var score = e.currentTarget.dataset.index;
        that.setData({
            score:score
        });
    },

    sub_article: function () {
        var that = this, content = that.data.content, score = that.data.score;
        var user_id = app.globaldata.uid; 
        var rec_id = that.data.rec_id;
        var goods_id = that.data.goods_id;
        var order_id = that.data.order_id;
        if (score < 1) {
            wx.showToast({
                title: '请给商品打分',
                icon: 'none'
            }); return;
        }
        wxRequest({
            url: app.globaldata.site_url + "order/addComment",
            data: {
                user_id: user_id,
                content: content,
                order_id: order_id,
                score: score,
                rec_id: rec_id,
                goods_id: goods_id,
                imgs: JSON.stringify(that.data.img_msg)
            },
            method: 'POST',
            header: {
                'Content-Type': "application/x-www-form-urlencoded"
            }
        }).then(function (res) {
            if (res.data.code == 1) {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    success: function () {
                        setTimeout(function () {
                            // wx.switchTab({
                            //     url: '/pages/waitcomment/waitcommentgoods?status=-1',
                            // })
                            wx.switchTab({
                                url: '/pages/user/usercenter',
                            })
                        }, 500);
                    }
                })
            } else {
                console.log(res.data.msg);
            }
        });
    },

    save_title: function (e) {
        var that = this, title = e.detail.value;
        that.setData({
            title: title,
        });
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

    addimg: function (e) {
        var that = this, index = e.currentTarget.dataset.index, img_msg = that.data.img_msg;
        
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            count: 1, //每次只允许选一张
            success: function (res) {
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
    *  生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        var that = this, 
            rec_id = options.id,
            goods_id = options.goods_id,
            order_id = options.order_id,
            user_id = app.globaldata.uid;
        that.setData({
            rec_id: rec_id,
            goods_id: goods_id,
            order_id: order_id
        });
        // wxRequest({
        //     url: app.globaldata.site_url + "order/addComment",
        //     data: { rec_id: rec_id },
        //     method: 'GET',
        //     header: {
        //         'Content-Type': 'application/json'
        //     }
        // }).then(function (res) {
        //     if (res.data.code == 1) {
        //         that.setData({
        //             goods_id: res.data.data
        //         });
        //     }
        // });
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