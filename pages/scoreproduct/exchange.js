// pages/scoreproduct/exchange.js
var app = getApp();
var site_url = app.globaldata.site_url;
const fetch = require("../../util/fetch");
const promise = require("../../util/wxRequest");
const wxRequest = promise.wxPromisify(wx.request);
var getLocationPromisified = promise.wxPromisify(wx.getLocation); //获取当前定位

Page({

  /**
   * 页面的初始数据
   */
    data: {
        addr_picker: 0,
        mendian_picker: 0,
        fapiao_picker: 0,
        postpay: '',
        pro_msg: [],
        reciever: '',
        recievers: [],
        yunfei: 0,
        ziti: 0,
        mendian_list: [],
        mendian: '',
        fapiao_list: [],
        fapiao: '',
        fapiao_default: { title: '不开发票', id: 0 },
        note: ''
    },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        var that = this,
            postpay = options.postpay,
            recievers,
            reciever,
            pro_msg,
            mendian_list,
            mendian;
        that.setData({
            postpay: postpay,
            user_id: app.globaldata.uid
        });
        //进入首先获取当前定位
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                var latitude = res.latitude;
                var longitude = res.longitude;
                // console.log(latitude, longitude);
                that.setData({
                    latitude: latitude,
                    longitude: longitude
                });
                wxRequest({
                    url: site_url + "order/getUserAddressList",
                    data: { user_id: app.globaldata.uid },
                    method: 'GET',
                    header: {
                        'Content-Type': 'application/json'
                    },
                }).then(function (res) {
                    if (res.data.code == 1) {
                        if (res.data.data.length == 0) {
                            setTimeout(function () {
                                wx.showToast({
                                    title: '请添加收货地址',
                                    icon: 'none'
                                });
                            }, 2000);
                        } else {
                            that.setData({
                                recievers: res.data.data,//所有收货信息
                                reciever: res.data.data[0] //默认收获地址 后台排好序 取第一个就是默认地址
                            });
                        }
                    }
                }).then(function () {
                    return wxRequest({
                        url: site_url + "order/getStoreList",
                        data: { latitude: that.data.latitude, longitude: that.data.longitude },
                        method: 'GET',
                        header: {
                            'Content-Type': 'application/json'
                        },
                    }).then(function (res) {
                        if (res.data.code == 1) {
                            var mendian_list = res.data.data.mendian_list, //数据已排好序
                                mendian = mendian_list[0];
                            that.setData({
                                mendian: mendian,
                                mendian_list: mendian_list
                            })
                        }
                    }).then(function () {
                        return wxRequest({
                            url: site_url + "score_order/goods",
                            data: { user_id: that.data.user_id, postpay: that.data.postpay },
                            method: 'GET',
                            header: {
                                'Content-Type': 'application/json'
                            },
                        }).then(function (res) {
                            if (res.data.code == 1) {
                                var pro_msg = res.data.data;
                                that.setData({
                                    pro_msg: pro_msg
                                });
                            }
                        }).then(function () {
                            return wxRequest({
                                url: site_url + "order/getUserFapiaoList",
                                data: { user_id: that.data.user_id},
                                method: 'GET',
                                header: {
                                    'Content-Type': 'application/json'
                                },
                            }).then(function (res) {
                                if (res.data.code == 1) {
                                    that.setData({
                                        fapiao_list: res.data.data,
                                        //fapiao: res.data.data[0],
                                        fapiao: that.data.fapiao_default
                                    });
                                }
                            }).then(function () {
                                return that.cal_yunfei();
                            });
                        })
                    });
                });
            }
        });
    },

    // 收货信息
    chooseaddr: function () {
        var that = this;
        that.setData({
            addr_picker: 1,
        });
    },

    //设置收货地址
    setaddr: function (e) {
        var that = this, index = e.currentTarget.dataset.index;
        var reciever = that.data.recievers[index];
        that.setData({
            reciever: reciever,
            addr_picker: 0
        });
        that.cal_yunfei();
    },

    //新增收货地址
    add_addr: function () {
        var that = this, reciever;
        wx.chooseAddress({
            success: function (res) {
                //console.log(res);
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
                fetch("order/addAddress", request_data).then((res) => {
                    //console.log(res);return;
                    if (res.data.code == 1) {
                        that.setData({
                            recievers: res.data.data
                        });
                    }
                });
            }
        });
    },

    // 计算
    cal_yunfei: function () {
        var that = this,
            reciever = that.data.reciever,
            postpay = that.data.postpay;
        //console.log(that.data.reciever, that.data.recievers, reciever);return;
        //console.log(reciever, postpay);return;
        // 传参数reciever(收货人信息)与postpay(产品信息)到后台，获取运费
        wxRequest({
            url: site_url + "score_freight/calculateFreight",
            data: { addrId: reciever.addr_id, goodsArr: postpay },
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            }
        }).then(function (res) {
            //console.log(res);return;
            if (res.data.code == 1) {
                var yunfei = res.data.data.freight;
                //console.log(yunfei);return;
                if (that.data.ziti == 1 || that.data.reciever == '') {
                    yunfei = 0;
                }
                that.setData({
                    yunfei: yunfei,
                });
                that.cal_total();
            }
        });
    },

    cal_total: function () {
        var that = this, pro_msg = that.data.pro_msg, totalscore = 0, yunfei = that.data.yunfei;
        for (var i in pro_msg) {
            totalscore += pro_msg[i].score * pro_msg[i].goods_num;
        }
        that.setData({
            totalscore: totalscore
        });
    },

    // 门店信息
    showmendian: function () {
        this.setData({
            mendian_picker: 1,
        });
    },
    setmendian: function (e) {
        var that = this, index = e.currentTarget.dataset.index;
        var mendian = that.data.mendian_list[index];
        that.setData({
            mendian: mendian,
            mendian_picker: 0
        });
        // console.log(that.data);
    },

    //买家留言
    user_note: function (e) {
        var that = this;
        var note = e.detail.value;
        that.setData({
            note: note
        });
    },


    radioChange: function (e) {
        var that = this, ziti = e.detail.value;
        that.setData({
            ziti: ziti
        });
        that.cal_yunfei();
    },

    //选择定位
    selectPosition: function () {
        var that = this;
        wx.chooseLocation({
            success: function (res) {
                var latitude = res.latitude;
                var longitude = res.longitude;
                that.setData({
                    latitude: latitude,
                    longitude: longitude
                });
                that.getStoreList(); //调用获取 门店列表
            }
        });
    },

    //获取发货门店
    getStoreList: function () {
        var that = this;
        var latitude = that.data.latitude;
        var longitude = that.data.longitude;
        var request_data = { latitude: latitude, longitude: longitude };
        fetch("order/getStoreList", request_data).then((res) => {
            if (res.data.code == 1) {
                var mendian_list = res.data.data.mendian_list, //数据已排好序
                    mendian = mendian_list[0];
                that.setData({
                    mendian: mendian,
                    mendian_list: mendian_list
                })
            }
        });
    },

    //积分兑换
    exchange: function () {
        var that = this;
        var reciever = that.data.reciever;
        var mendian = that.data.mendian;
        var fapiao = that.data.fapiao;
        var pro_msg = that.data.pro_msg;
        var ziti = that.data.ziti;
        var freight = that.data.yunfei;
        var user_id = app.globaldata.uid;
        var score = that.data.totalscore;
        var note = that.data.note;

        if (!reciever) {
            wx.showToast({
                title: '请选择收货地址',
                icon: 'none'
            });
            return false;
        }

        var request_data = {
            user_id: user_id,
            reciever: reciever,
            mendian: mendian,
            ziti: ziti,
            freight: freight,
            fapiao: fapiao,
            note: note,
            pro_msg: pro_msg,
            score: score
        };
        //console.log(request_data);return;
        wxRequest({
            url: site_url + "score_order/createOrder",
            data: request_data,
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            },
        }).then(function (res) {
            if (res.data.code == 1) {
                //下单成功  判断是否需要支付运费
                var order_sn = res.data.data.order_sn;
                var order_id = res.data.data.order_id;

                if (freight > 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        success: function () {
                            setTimeout(function () {
                                wx.redirectTo({
                                    url: '/pages/scoreproduct/submitpay?money=' + freight + '&order_sn=' + order_sn + '&order_id=' + order_id,
                                })
                            }, 2000);
                        }
                    });
                    /*
                    wxRequest({
                        url: app.globaldata.site_url + "score_order/pay",
                        data: { user_id: user_id, money: freight, order_sn: order_sn },
                        method: 'GET',
                        header: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function (res) {
                        if (res.data.code == 1) {
                            var timeStamp = res.data.data.timeStamp.toString(),
                                nonceStr = res.data.data.nonceStr,
                                packages = res.data.data.package,
                                paySign = res.data.data.paySign;
                            wx.requestPayment({
                                'timeStamp': timeStamp,
                                'nonceStr': nonceStr,
                                'package': packages,
                                'signType': 'MD5',
                                'paySign': paySign,
                                'success': function (res) {
                                    wx.showToast({
                                        title: '兑换成功',
                                        icon: 'success',
                                        success: function () {
                                            return wxRequest({
                                                url: app.globaldata.site_url + "score_order/printerOrder",
                                                data: { order_id: order_id },
                                                method: 'GET',
                                                header: {
                                                    'Content-Type': 'application/json'
                                                }
                                            }).then(function (res) {
                                                if (res.data.code == 1) {
                                                    // setTimeout(function () {
                                                    //     wx.switchTab({
                                                    //         url: '/pages/user/usercenter',
                                                    //     })
                                                    // }, 2000);
                                                    console.log('订单打印成功');
                                                } else {
                                                    console.log('订单打印失败');
                                                }
                                            }).then(function () {
                                                //减用户积分  
                                                return wxRequest({
                                                    url: app.globaldata.site_url + "score_order/reduceScore",
                                                    data: { order_id: order_id },
                                                    method: 'GET',
                                                    header: {
                                                        'Content-Type': 'application/json'
                                                    }
                                                }).then(function (res) {
                                                    if (res.data.code == 1) {
                                                        app.globaldata.userinfo.score = res.data.data; //刷新用户积分
                                                        setTimeout(function () {
                                                            wx.switchTab({
                                                                url: '/pages/user/usercenter',
                                                            })
                                                        }, 2000);
                                                    }
                                                })
                                            });
                                        }
                                    })
                                }
                            });
                        }
                    });
                    */
                } else {
                    //无需运费 
                    wx.showToast({
                        title: '兑换成功',
                        icon: 'success',
                        success: function () {
                            return wxRequest({
                                url: app.globaldata.site_url + "score_order/printerOrder",
                                data: { order_id: order_id },
                                method: 'GET',
                                header: {
                                    'Content-Type': 'application/json'
                                }
                            }).then(function (res) {
                                if (res.data.code == 1) {
                                    // setTimeout(function () {
                                    //     wx.switchTab({
                                    //         url: '/pages/user/usercenter',
                                    //     })
                                    // }, 2000);
                                    console.log('订单打印成功');
                                } else {
                                    console.log('订单打印失败');
                                }
                            }).then(function () {
                                //减用户积分  
                                return wxRequest({
                                    url: app.globaldata.site_url + "score_order/reduceScore",
                                    data: { order_id: order_id },
                                    method: 'GET',
                                    header: {
                                        'Content-Type': 'application/json'
                                    }
                                }).then(function (res) {
                                    if (res.data.code == 1) {
                                        app.globaldata.userinfo.score = res.data.data; //刷新用户积分
                                        setTimeout(function () {
                                            wx.switchTab({
                                                url: '/pages/user/usercenter',
                                            })
                                        }, 2000);
                                    }
                                })
                            });
                        }
                    })                    
                }
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                });
                return false;
            }
        });
    },

    // 发票信息
    showfapiao: function () {
        this.setData({
            fapiao_picker: 1,
        });
        //console.log(this.data.fapiao_list);
    },
    setfapiao: function (e) {
        var that = this, index = e.currentTarget.dataset.index;
        var fapiao = that.data.fapiao_list[index];
        that.setData({
            fapiao: fapiao,
            fapiao_picker: 0
        });
        // console.log(that.data);
    },
    setfapiaodefault: function () {
        var that = this;
        that.setData({
            fapiao_picker: 0,
            fapiao: that.data.fapiao_default,
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