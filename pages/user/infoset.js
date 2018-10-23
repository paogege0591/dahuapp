const app = getApp();
const promise = require("../../util/wxRequest");
const wxRequest = promise.wxPromisify(wx.request);
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    region: ['湖南省', '常德市', '武陵区'],
    customItem: '全部',
    sex: '-请填写身份证号-',
    idnum: '',
    truename: '',
    birth: '',
    mobile: '',
    totaltime: 60,
    time: 0,
    code: '',
    detail: '',
    date: "-请填写身份证号-",
    addr: '',
  },
  save_idnum: function (e) {
    var that = this, idnum = e.detail.value;
    if (idnum.length == 18) {
      that.setData({
        date: idnum[6] + idnum[7] + idnum[8] + idnum[9] + '-' + idnum[10] + idnum[11] + '-' + idnum[12] + idnum[13],
        idnum: idnum,
        sex: idnum[16] % 2 == 0 ? '女' : '男'
      })
    }
    console.log(idnum.length);
  },
  suball: function (e) {
    var that = this, addr = that.data.addr, truename = that.data.truename, date = that.data.date, mobile = that.data.mobile, code = that.data.code, new_mobile = that.data.new_mobile, sex = that.data.sex, idnum = that.data.idnum,birth = that.data.idnum?date:that.data.birth;
    if(!truename||!idnum){
      wx.showToast({
        title: '请填入完整信息',
        icon: 'none'
      });
      return false;
    }
    var data = new_mobile ? { sex: sex, idnum: idnum, addr: addr, truename: truename, birth: birth, user_id: app.globaldata.uid, mobile: mobile, code: code } : { sex: sex, idnum: idnum, addr: addr, truename: truename, birth: birth, user_id: app.globaldata.uid};
    console.log(data);
    wxRequest({
      url: app.globaldata.site_url + "index/setUserInfo",
      data: data,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    }).then(function (res) {
      if (res.data.code == 1) {
        app.globaldata.userinfo = res.data.data;
        wx.showToast({
          title: '更新成功',
          icon: 'none',
          success: function () {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              }) 
            }, 1000);
          }
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        });
      }
    })
  },
  settel: function (e) {
    var that = this, mobile = e.detail.value;
    that.setData({
      mobile: mobile
    });
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
    var that = this, mobile = that.data.mobile;
    if (mobile.length != 11) {
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
      data: { mobile: mobile, type: 'new_tel' },
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
  save_birth: function (e) {
    var birth = e.detail.value, that = this;
    that.setData({
      birth: birth,
    });
  },
  save_name: function (e) {
    var truename = e.detail.value, that = this;
    that.setData({
      truename: truename,
    })
  },
  save_addr: function (e) {
    var addr = e.detail.value, that = this;
    that.setData({
      addr: addr,
    })
  },
  test: function (e) {
    //console.log(e);return false;
    var nickname = e.detail.userInfo.nickName;
    var avatar = e.detail.userInfo.avatarUrl;
    var user_id = app.globaldata.uid;
    wxRequest({
      url: app.globaldata.site_url + "index/updateUserInfo",
      data: { user_id: app.globaldata.uid, avatar: avatar, nickname: nickname },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    }).then(function (res) {
      //console.log(res);return;
      if (res.data.code == 1) {
        app.globaldata.userinfo = res.data.data;
        wx.showToast({
          title: '更新成功',
          icon: 'none',
          success: function () {
          }
        })
      } else {
        wx.showToast({
          title: '更新资料失败,请重试',
          icon: 'none'
        });
      }
    });
  },
  getUserInfo: function (e) {
    console.log(e);
  },
  save_detail: function (e) {
    var that = this, detail = e.detail.value;
    that.setData({
      detail: detail,
      addr: that.data.region[0] + '-' + that.data.region[1] + '-' + that.data.region[2] + ',' + detail
    })
  },
  bindRegionChange: function bindRegionChange(e) {
    var that = this;
    that.setData({
      region: e.detail.value
    });
    that.setData({
      addr: that.data.region[0] + '-' + that.data.region[1] + '-' + that.data.region[2] + ',' + that.data.detail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this, userinfo = app.globaldata.userinfo;
    that.setData({
      truename: userinfo.truename ? userinfo.truename : '',
      addr: userinfo.addr ? userinfo.addr : '',
      birth: userinfo.birth ? userinfo.birth : '',
      mobile: userinfo.mobile ? userinfo.mobile : '',
      new_mobile: userinfo.mobile ? false : true,
      idnum: userinfo.idnum ? userinfo.idnum : '',
      date: userinfo.birth ? userinfo.birth : that.data.date,
      sex: userinfo.sex ? userinfo.sex : that.data.sex,
    });
    var addr = that.data.addr;
    if (addr != '') {
      addr = addr.split(',');
      var region = addr[0].split('-');
      that.setData({
        region: region,
        detail: addr[1]
      });
    }
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