// pages/user/checkmobile.js
// pages/user/bindtel.js
const app = getApp();
const promise = require("../../util/wxRequest");
const wxRequest = promise.wxPromisify(wx.request);

Page({

    /**
     * 页面的初始数据
     */
    data: {
        totaltime: 60,
        time: 0,
        tel: '0',
    },
    submit: function () {
        var that = this,
            tel = that.data.tel,
            code = that.data.code,
            user_id = app.globaldata.uid;
        wxRequest({
            url: app.globaldata.site_url + "user_center/checkMobile",
            data: { mobile: tel, code: code, user_id: user_id },
            method: 'POST',
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
        }).then(function (res) {
            if (res.data.code == 1) {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    success: function () {
                        setTimeout(function () {
                            wx.navigateTo({
                                url: '/pages/user/setpaypwd',
                            });
                        }, 1500);
                    }
                });
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                });
                return false;
            }
        })
    },

    settel: function (e) {
        var that = this, tel = e.detail.value;
        if (tel.length != 11) {
            wx.showToast({
                title: '请输入正确手机号',
                icon: 'none'
            });
        } else {
            that.setData({
                tel: tel
            });
        }
    },

    setcode: function (e) {
        var that = this, code = e.detail.value;
        if (code.length != 6) {
            wx.showToast({
                title: '验证码长度为6',
                icon: 'none'
            });
            return false;
        }
        that.setData({
            code: code
        });
    },

    get_code: function (e) {
        var that = this, tel = that.data.tel;
        // console.log(tel);
        // return false;
        if (tel.length != 11) {
            wx.showToast({
                title: '请输入正确手机号',
                icon: 'none'
            });
            return false;
        }
        wxRequest({
            url: app.globaldata.site_url + "user_center/getCode",
            data: { mobile: tel },
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            }
        }).then(function (res) {
            if (res.data.code == 1) {
                setTimeout(function () {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        success: function () {
                            var interval = setInterval(function () {
                                //console.log(that.data.time);
                                var time = (that.data.time == 0) ? that.data.totaltime : that.data.time;

                                time--;
                                that.setData({
                                    time: time,
                                });
                                if (time == 0) {
                                    clearInterval(interval);
                                }
                            }.bind(this), 1000);
                        }
                    })
                }, 1500);
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                });
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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