const app = getApp();
const fetch = require("../../util/fetch");
const txvContext = requirePlugin("tencentvideo");


Page({
  data: {
    keyword: '祺然片',
    _num: 1,
    isShow: false,
    address: '鸿鑫旗舰店',
    current2: 0,
    dahuText: '大湖水殖股份有限公司成立于1999年1月，2000年6 月12日在上海证券交易所上市，是全国唯一采用水面权益资本化方式上市的公司“中国淡水养殖第一股”。',
    activeTabStyle: {
      'color': '#ff4949',
      'font-size': '16px'
    },
    buttonText: '关于大湖股份',
    inkBarStyle: {
      'border-bottom': '3px solid #ff4949',
      'width': '60%',
      'font-size': '16px',
      'color': '#ff4949'
    },
    videoid:'z0027hcc6iu',
    banner: [],
    items2: [],
    goodsDiscount: [],
    goodsIntegral: []
  },
  navigator: function navigator(e) {
    var catid = e.currentTarget.dataset.catid;
    wx.navigateTo({
      url: '/pages/product/list?type=0&cat_id='+catid
    });
  },
  onLoad: function () {
    var that = this, latitude = 0, longitude = 0;
    this.txvContext = txvContext.getTxvContext('txv1');
    that.setData({
      user_id: app.globaldata.uid,
    }); 

    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        latitude = res.latitude;
        longitude = res.longitude;
      },
      complete: function () {
        var request_data = {
          latitude: latitude,
          longitude: longitude
        };
        fetch("index/getRecentStore", request_data).then((res) => {
          that.setData({
            position: res.data.name
          })
        });
      }
    });
    fetch("index/get_index_videoid", {}).then((res) => {
      that.setData({
        videoid: res.data.vid
      })
    });
    
    that.getBanner();
    that.recommendSelling();
    that.pointSelling();
    that.getNews();
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

  changecur: function (e) {
    var that = this;
    that.setData({
      _num: e.currentTarget.dataset.num
    })
  },
  getBanner:function(){
    var that = this;
    fetch("index/get_index_cat", {}).then((res) => {
      that.setData({
        banner: res.data
      });
    });
  },
  recommendSelling:function(){
    var that = this;
    fetch("index/get_index_cuxiao", {}).then((res) => {
      var data = res.data,data2=[];
      for(var i=0;i<data.length;i+=3){
        data2.push(data.slice(i,i+3));
      }
      that.setData({
        goodsDiscount: data2
      });
    });
  },
  pointSelling: function () {
    var that = this;
    fetch("score_goods/list", {}).then((res) => {
      var data = res.data.list, data2 = [];
      for (var i = 0; i < data.length; i += 3) {
        data2.push(data.slice(i, i + 3));
      }
      that.setData({
        goodsIntegral: data2
      });
    });
  },
  getNews: function () {
    var that = this;
    fetch("index/get_index_article", {}).then((res) => {
      var data = res.data, data2 = [];
      for (var i = 0; i < data.length; i += 3) {
        data2.push(data.slice(i, i + 3));
      }
      that.setData({
        items2: data2
      });
    });

  },
  gotoquan:function(){
    var that = this;
    var url = '/pages/quan/list?user_id='+that.data.user_id+'&type=all';
    wx.navigateTo({
      url: url,
    })
  }
});