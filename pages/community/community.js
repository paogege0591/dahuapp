// pages/community/community.js
const app = getApp();
const promise = require("../../util/wxRequest");
const wxRequest = promise.wxPromisify(wx.request);
var site_url = app.globaldata.site_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    test: [1, 2],
    list: []
  },
  dianzan:function(e){
    var that = this, article_id = e.currentTarget.dataset.aid, already = e.currentTarget.dataset.already;
    wxRequest({
      url: site_url + "community/dianzan",
      data: { user_id: app.globaldata.uid, article_id: article_id, already: already},
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    }).then(function(res){
      if(res.data.code == 1){
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
        var list = that.data.list;
        for(var i in list){
          if(list[i].id == article_id){
            list[i].already_dianzan = list[i].already_dianzan==1?0:1;
            list[i].nums.d_num = list[i].already_dianzan == 1 ? (list[i].nums.d_num + 1) : (list[i].nums.d_num - 1);
          }
        }
        that.setData({
          list:list
        });
      }else{
        wx.showToast({
          title: '网络故障，请稍后重试',
          icon:'none'
        });
      }
    });
  },
  changetab: function (e) {
    var that = this;
    that.setData({
      num: e.currentTarget.dataset.num
    });
    var type_id = e.currentTarget.dataset.typeId;
    wxRequest({
      url: site_url + "community/list",
      data: { type_id: type_id },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    }).then(function (res) {
      if (res.data.code == 1) {
        that.setData({
          list: res.data.data.list,
          //userinfo: app.globaldata.userinfo
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_id = app.globaldata.uid;
    //var userinfo = app.globaldata.userinfo;
    //console.log(userinfo);
    wxRequest({
      url: site_url + "index/getUserInfo",
      data: { user_id: user_id },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    }).then(function (res) {
      if (res.data.code == 1) {
        app.globaldata.userinfo = res.data.data;
        that.setData({
          userinfo: app.globaldata.userinfo
        });
      }
    }).then(function () {
      return wxRequest({
        url: site_url + "community/list",
        data: {user_id:app.globaldata.uid},
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        }
      }).then(function (res) {
        if (res.data.code == 1) {
          that.setData({
            list: res.data.data.list,
            top_list: res.data.data.top_list
            //userinfo: app.globaldata.userinfo
          });
        }
      })
    });
    //console.log(app.globaldata.userinfo);
  },

  showImage: function (e) {
    var url = e.currentTarget.dataset.url;
    var urls = [];
    urls.push(url);
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  sign_in: function () {
    var that = this;
    var user_id = app.globaldata.uid;
    wxRequest({
      url: site_url + "sign_in/signIn",
      data: { user_id: user_id },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    }).then(function (res) {
      if (res.data.code == 1) {
        wx.showToast({
          title: '签到成功',
          success: function () {
            if (res.data.data.community_level_id != app.globaldata.userinfo.community_level_id) {
              setTimeout(function () {
                wx.showToast({
                  title: '恭喜您升级',
                  icon: 'success'
                });
              }, 2000);
            }
            app.globaldata.userinfo.score = res.data.data.score;
            app.globaldata.userinfo.experience_value = res.data.data.experience_value;
            app.globaldata.userinfo.continue_sign_days = res.data.data.continue_sign_days;
            app.globaldata.userinfo.is_sign = 1;
            app.globaldata.userinfo.community_level_id = res.data.data.community_level_id;
            app.globaldata.userinfo.community_level_name = res.data.data.community_level_name;
            app.globaldata.userinfo.progress = res.data.data.progress;
            //console.log(app.globaldata.userinfo);
            that.setData({
              userinfo: app.globaldata.userinfo
            });
          }
        });
      } else {
        wx.showToast({
          title: '签到失败',
        });
      }
    })
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
    this.onLoad();
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