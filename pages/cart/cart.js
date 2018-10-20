var app=getApp();
const fetch = require("../../util/fetch");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    allchecked:false,
    totalmoney:0,
    cart_detail: [
      {
        id: 1,
        goods_id: 2,
        goods_name: '大湖小龙虾大湖小龙虾大湖小龙虾大湖小龙虾大湖小龙虾大湖小龙虾',
        spec_key_key: '1_2_3',
        spec_key_name: '5斤',
        goods_num: 3,
        goods_price: 59.9,
        member_goods_price: 5.99,
        is_failure: 0,
        img_path: 'https://www.zydtest.cn/public/static/images/navipic.jpg'
      },
      {
        id: 3,
        goods_id: 3,
        goods_name: '大湖小龙虾大湖小龙虾大湖小龙虾大湖小龙虾大湖小龙虾大湖小龙虾',
        spec_key_key: '1_2_3',
        spec_key_name: '5斤',
        goods_num: 10,
        goods_price: 59.9,
        member_goods_price: 5.99,
        is_failure: 0,
        img_path: 'https://www.zydtest.cn/public/static/images/navipic.jpg'
      },
      {
        id: 2,
        goods_id: 1,
        goods_name: '大湖小龙虾大湖小龙虾大湖小龙虾大湖小龙虾大湖小龙虾大湖小龙虾',
        spec_key_key: '1_2_3',
        spec_key_name: '5斤',
        goods_num: 10,
        goods_price: 59.9,
        member_goods_price: 5.99,
        is_failure: 1,
        img_path:'https://www.zydtest.cn/public/static/images/navipic.jpg'
      },
    ]
  },
  delcart:function(e){
    var that = this,
        cart_id = e.currentTarget.dataset.cartid,
        user_id = app.globaldata.uid,
        request_data = {cart_id: cart_id, user_id: user_id};
    // console.log(data);
    // wx.request({
    //   url: 'https://www.zydtest.cn/index.php/admin/api/test',
    //   data:data,
    //   method:'post',
    //   dataType:'json',
    //   success:function(res){
    //     if(res.data.status==1){
    //       wx.showToast({
    //         title: '删除成功!',
    //       })
    //     }
    //   }
    // })
    wx.showModal({
        title: '提示',
        content: '确定要删除吗？',
        success: function (r) {
            if (r.confirm) {
                fetch("shop_cart/del", request_data).then((res) => {
                    if (res.data.code == 1) {
                        var cart_detail = res.data.data;
                        for (var i in cart_detail) {
                            cart_detail[i].checked = false;
                        }
                        that.setData({
                            cart_detail: cart_detail
                        });
                    }
                });
            } else {
                console.log('取消了删除');
            }
        }
    });
  },

    gotopay: function () {
        var that = this, cart_detail = that.data.cart_detail, postpay = [], checked_cart_num = 0;
        if (app.globaldata.userinfo == '') {
            console.log('请先授权登录'); return;
        }
        for (var j in cart_detail) {
            if (cart_detail[j].checked) {
                checked_cart_num++; //获取选中的购物车数量
            }
        }
        if (checked_cart_num <= 0) {
            wx.showToast({
                title: '未选中购物车商品',
                icon: 'none'
            });return;
        }
        for (var i in cart_detail) {
            if (cart_detail[i].checked) {
                postpay.push({ cart_id: cart_detail[i].id, goods_id: cart_detail[i].goods_id, spec_key_key: cart_detail[i].spec_key_key, goods_num: cart_detail[i].goods_num });
            }
        }
        postpay = JSON.stringify(postpay);
        //console.log(postpay);return;
        wx.navigateTo({
            url: '/pages/pay/pay?postpay=' + postpay,
        });
    },

  changeradio:function(e){
    var that = this, cart_detail = that.data.cart_detail;
    // console.log(e);
    var index = e.currentTarget.dataset.index;
    cart_detail[index].checked = cart_detail[index].checked? false:true;
    that.setData({
      cart_detail: cart_detail
    });
    // console.log(that.data);
    that.changetotal();
  },
  changeall:function(e){
    var that = this, allchecked = that.data.allchecked;
    allchecked = allchecked?false:true;
    var cart_detail = that.data.cart_detail;
    for (var i in cart_detail){
      if (!cart_detail[i].is_failure){
        cart_detail[i].checked = allchecked;
      }      
    }
    that.setData({
      allchecked: allchecked,
      cart_detail: cart_detail
    });
    that.changetotal();
  },
  changetotal:function(){
    var that = this, totalmoney = 0, cart_detail = that.data.cart_detail;
    for (var i in cart_detail){
      if (cart_detail[i].is_failure == 0 && cart_detail[i].checked){
        totalmoney += (cart_detail[i].goods_price * 100 - cart_detail[i].member_goods_price * 100) * cart_detail[i].goods_num;
      }
    }
    that.setData({
        totalmoney: totalmoney/100
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        var that = this;
        var user_id = app.globaldata.uid;
        var request_data = {user_id: user_id};
        fetch("shop_cart/list", request_data).then((res) => {
            //console.log(res.data);
            if (res.data.code == 1) {
                var cart_detail = res.data.data;
                for (var i in cart_detail) {
                    cart_detail[i].checked = false;
                }
                that.setData({
                    cart_detail: cart_detail
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