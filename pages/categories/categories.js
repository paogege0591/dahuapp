var app=getApp();
const fetch = require("../../util/fetch");

Page({
  data: {
    _num:0,
    detail:{},
    page: 1,
    list: [],
    types: 0, //区分进入 和 点击分类  上拉加载数据 因为请求接口不同 但是 小程序上拉确实一个微信接口
  },
  go_search: function (e) {
    var that = this, keyword = that.data.keyword;
    if (!keyword) {
      wx.showToast({
        title: '请先输入搜索关键词',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/pages/product/list?keyword=' + keyword,
      })
    }
  },
  set_keyword: function (e) {
    var that = this, keyword = e.detail.value;
    that.setData({
      keyword: keyword
    });
  },
  changeleftcur: function (e) {
    var that = this;
    that.setData({
      _num: e.currentTarget.dataset.num
    });
  },
  onLoad: function (options) {
    var that = this;
    /*
    wx.request({
      url: app.globaldata.apiurl.get_categories,
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            detail:res.data.data
          });
          that.setData({
            _num:that.data.detail[1].id
          });
          // console.log(res.data.data,that.data._num);
        } else {
          // 失败
        }
      }
    })
    */
    that.setData({
        page: 1, //进入列表或者刷新 始终保持 第一页
    });
    var request_data = { page: 1};
    that.list(request_data);
  },

    
    list: function (request_data) {
        var that = this;
        if (that.data.page == 1) { //预防下拉数据重置
            that.setData({
                list: []
            });
        }
        fetch("category_goods/categorys", request_data).then((res) => {
            wx.showToast({
                title: '加载中',
                icon: 'loading',
                duration: 500
            });
            //console.log(res.data);return;
            var lastList = that.data.list;
            var category_menu = res.data.category_menu;
            for (var i in res.data.list) {
                lastList.push(res.data.list[i]);
            }
            that.setData({
                menuid: category_menu[0].id, //默认选中第一个
                menuImage: category_menu[0].image,
                list: lastList,
                category_menu: category_menu,
                countPage: res.data.countPage
            })
        })
    },

    switchTab: function (e) {
        var that = this;
        that.setData({
            menuid: e.target.dataset.id,
            menuImage: e.target.dataset.image,
            page: 1,
            list: [],
            types: 1 //点击后 区分 操作类型 设为1
        });
        that.datas();
    },

    datas: function () {
        var that = this;
        var request_data = {
            id: that.data.menuid,
            page: that.data.page
        };
        fetch("category_goods/switchCategory", request_data).then((res) => {
            //console.log(res);
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
        var request_data = { page: that.data.page };
        if (that.data.types == 0) {
            that.list(request_data);
        } else if (that.data.types == 1) {
            that.datas(request_data);
        }
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //console.log('123');
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
  /*
  onReachBottom: function () {

  },
  */

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})