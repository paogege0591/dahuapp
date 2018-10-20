var app=getApp();
const fetch = require("../../util/fetch");

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  set_default: function(e) {
    //console.log(e);
  },
    add_addr: function(e) {
        var that = this;
        wx.chooseAddress({
            success:function(res){
                console.log(res);
                var user_id = app.globaldata.uid,
                    consignee = res.userName,
                    consignee_tel = res.telNumber,
                    address = res.provinceName + ' ' + res.cityName + ' ' + res.countyName + '    ' + res.detailInfo;
                var request_data = { 
                    user_id: user_id,
                    consignee: consignee, 
                    consignee_tel: consignee_tel,
                    province: res.provinceName,
                    city: res.cityName,
                    area: res.countyName,
                    address: address
                };
                fetch("address/add", request_data).then((res) => {
                    if (res.data.code == 1) {
                        that.setData({
                            list: res.data.data
                        });
                    }                    
                });
            }
        })
    },

    del_addr: function (e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var user_id = app.globaldata.uid;
        var list = that.data.list;
        var request_data = {user_id: user_id, id: id};
        wx.showModal({
            title: '提示',
            content: '确定要删除吗？',
            success: function (r) {
                if (r.confirm) {
                    fetch("address/del", request_data).then((res) => {
                        if (res.data.code == 1) {
                            that.setData({
                                list: res.data.data
                            });
                        }
                    });
                } else {
                    console.log('取消了删除');
                }
            }
        })
    },

    selects: function (e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var user_id = app.globaldata.uid;
        var list = that.data.list;
        //console.log(list);return;
        var request_data = {user_id: user_id, id: id};
        fetch("address/setDefault", request_data).then((res) => {
            if (res.data.code == 1) {
                list[id]['is_default'] = 1; //设为默认收货地址
                var i = 0;
                for (var i in list) {
                    if (i != id) {
                        //console.log(i);
                        list[i]['is_default'] = 0;
                    } else {
                        continue;
                    }
                }
                that.setData({
                    list: list
                });
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        var user_id = app.globaldata.uid;
        var request_data = {user_id: user_id};
        fetch("address/index", request_data).then((res) => {
            if (res.data.code == 1) {
                that.setData({
                    list: res.data.data
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