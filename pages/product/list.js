// pages/product/list.js
const app = getApp();
const fetch = require("../../util/fetch");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1, //默认第一页
    list: [],
    tab: [true, true, true, true],
    tabTxt: ['分类', '促销', '综合排序', ],//分类  
    cat_txt: '',
    catList: [],
    intro_id: 0,
    introList: [
      { 'id': 'is_new', 'title': '新品' },
      { 'id': 'is_hot', 'title': '热销' },
      { 'id': 'is_recommend', 'title': '推荐' }
    ],
    order_id:0,
    order_list: [
      { 'id': 'shop_price.asc', 'title': '价格升序' },
      { 'id': 'shop_price.desc', 'title': '价格降序' },
      { 'id': 'sales_sum.asc', 'title': '销量升序' },
      { 'id': 'sales_sum.desc', 'title': '销量降序' },
    ],
    option: {
      user_id:0,
      page: 1,
      intro: '', //促销 热卖
      type:0, //1关注  2足迹
      keyword: '',
      cat_id: 0,
      order:''
    }    
  },
  set_keyword: function (e) {
    var that = this, keyword = e.detail.value;
    that.setData({
      'option.keyword': keyword
    });
  },
  go_search: function (e) {
    var that = this, keyword = that.data.option.keyword;
    if (!keyword) {
      wx.showToast({
        title: '请先输入搜索关键词',
        icon: 'none'
      })
    } else {
      that.onLoad(that.data.options);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    fetch("category_goods/categorys", {page:1}).then((res) => {
      var catList = res.data.category_menu;
      // console.log(catList);
      that.setData({
        catList: catList
      });
    });
    if (that.data.option.user_id > 0) {
      that.setData({
        // 'option.page': options.page ? options.page : 1,
      });
    } else {
      that.setData({
        'option.user_id': app.globaldata.uid,
        // 'option.page': options.page ? options.page : 1,
        'option.intro': options.intro ? options.intro : '', //促销 热卖
        'option.type': options.type ? options.type : 0, //1关注  2足迹
        'option.keyword': options.keyword ? options.keyword : '',
        'option.cat_id': options.cat_id ? options.cat_id : 0,
      });
    }
    // console.log(that.data);
    // var option = that.data.option;
    // var intro = options.intro ? options.intro : ''; //条件 热卖 新品
    // var keyword = options.keyword ? options.keyword : ''; //条件 关键词搜索
    // var type = options.type ? options.type : 0; //区分普通商品列表 关注 浏览记录列表
    // var cat_id = that.data.cat_id ? that.data.cat_id :(options.cat_id ? options.cat_id : 0);
    // var user_id = app.globaldata.uid;
    // that.setData({
    //   page: 1, //进入列表或者刷新 始终保持 第一页
    //   intro: intro,
    //   type: type,
    //   options: options
    // });
    // var request_data = { user_id: user_id, page: 1, intro: intro, type: type, keyword: keyword, cat_id: cat_id };
    var request_data = that.data.option;
    that.list(request_data);
  },

  //获取列表数据
  list: function (request_data) {
    let that = this;
    if (that.data.option.page == 1) { //预防下拉数据重置
      that.setData({
        list: []
      });
    }
    fetch("product/list", request_data).then((res) => {
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
    // console.log(123);
    let that = this;
    if (that.data.option.page == that.data.countPage) {
      that.setData({
        end: true
      });
      return;
    }
    //console.log(that.data.page);
    that.setData({ 'option.page': that.data.option.page + 1 });
    var request_data = that.data.option;
    that.list(request_data);
  },

  // 选项卡  
  filterTab: function (e) {
    var data = [true, true, true],
      index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({ tab: data })
  },
  filter: function (e) {
    var self = this,
      id = e.currentTarget.dataset.id,
      txt = e.currentTarget.dataset.txt,
      tabTxt = this.data.tabTxt;
    switch (e.currentTarget.dataset.index) {
      case '0': tabTxt[0] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          'option.cat_id': id,
          'option.page': 1,
        }); break;
      case '1': tabTxt[1] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          'option.intro': id,
          'option.page': 1,
        }); break;
      case '2': tabTxt[2] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          'option.order':id,
          'option.page':1,
        }); break;
    }    //数据筛选   
    self.onLoad(self.data.option);
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})