// pages/user/setpaypwd.js
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
    already_checked:false,
    userinfo:'',
    code:'',
  },
  get_code: function (e) {
    var that = this, tel = that.data.userinfo.mobile;
    // console.log(tel);
    // return false;
    if (tel.length != 11) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      });
      return false;
    }
    wx.showToast({
      title: '正在发送...',
      icon: 'loading'
    });
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
  check_oldmobile: function () {
    var that = this,
      mobile = that.data.userinfo.mobile,
      code = that.data.code,
      user_id = app.globaldata.uid;
    wxRequest({
      url: app.globaldata.site_url + "user_center/checkMobile",
      data: { mobile: mobile, code: code, user_id: user_id },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
    }).then(function (res) {
      if (res.data.code != 1) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        });
        return false;
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          success: function () {
            that.setData({
              already_checked: true,
            })
          }
        })
      }
    })
  },

  setpwd: function (e) {
    var that = this, pwd = e.detail.value;
    if (pwd.length != 6) {
      wx.showToast({
        title: '请输入6位支付密码',
        icon: 'none'
      });
    } else {
      that.setData({
        pwd: pwd
      });
    }
  },

  setconfirmpwd: function (e) {
    var that = this, confirm_pwd = e.detail.value, pwd = that.data.pwd;
    if (pwd != confirm_pwd) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      });
    } else {
      that.setData({
        confirm_pwd: confirm_pwd
      });
    }
  },

  submit: function () {
    var that = this,
      pwd = that.data.pwd,
      confirm_pwd = that.data.confirm_pwd,
      user_id = app.globaldata.uid;
    wxRequest({
      url: app.globaldata.site_url + "user_center/setPayPwd",
      data: { pwd: pwd, confirm_pwd: confirm_pwd, user_id: user_id },
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
              wx.switchTab({
                url: '/pages/user/usercenter',
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
    });
  },
  onLoad: function (options) {
    var that = this, userinfo = app.globaldata.userinfo;
    if(userinfo.mobile == ''){
      wx.showModal({
        title: '未绑定手机号',
        content: '设置支付密码需绑定手机号',
        cancelText: '先等等',
        confirmText: '去绑定',
        success: function (r) {
          if (r.confirm) {
            wx.navigateTo({
              url: '/pages/user/bindtel',
            })
          } else {
            wx.navigateBack({
              delta:1,
            })            
          }
        }
      })
    }else{
      that.setData({
        userinfo:userinfo
      })
    }
    
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
})