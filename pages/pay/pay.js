var app = getApp();
var site_url = app.globaldata.site_url;
const fetch = require("../../util/fetch");
const promise = require("../../util/wxRequest");
const wxRequest = promise.wxPromisify(wx.request);
var getLocationPromisified = promise.wxPromisify(wx.getLocation); //获取当前定位
//
Page({
  data: {
    latitude: 0,
    longitude: 0,
    manjian: false,
    is_cart: 1,
    addr_picker: 0,
    mendian_picker: 0,
    fapiao_picker: 0,
    quan_picker: 0,
    postpay: '',
    pro_msg: [],
    user_id: 1,
    reciever: '',
    recievers: [],
    yunfei: 0,
    totalmoney: 0,
    quanmoney: 0,
    ziti: 0,
    mendian_list: [],
    mendian: '',
    fapiao_list: [],
    fapiao: '',
    fapiao_default: {
      title: '不开发票',
      id: 0
    },
    quan_list: [],
    quan: '',
    default_quan: {
      name: '不使用优惠券',
      money: 0,
      id: 0
    },
    note: ''
  },
  onShow:function(){
    console.log('222');
    var that = this;
    wxRequest({
      url: site_url + "order/getUserFapiaoList",
      data: {
        user_id: that.data.user_id
      },
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
    })
  },
  set_manjian: function() {
    var that = this;
    wx.request({
      url: 'https://www.dhdjk.net/wxapp/index/fullReduce',
      method: 'post',
      dataType: 'json',
      success: function(res) {
        var manjian = res.data.data;
        if (manjian.id > 0) {
          that.setData({
            manjian: manjian
          });
        }
      }
    })
  },
  radioChange: function(e) {
    var that = this,
      ziti = e.detail.value;
    that.setData({
      ziti: ziti
    });
    that.cal_yunfei();
  },

  add_addr: function() {
    var that = this,
      reciever;
    // wx.chooseAddress({  
    //   success: function (res) {
    //     // console.log(res);
    //     reciever = { user_id:that.data.user_id, name: res.userName, telnum: res.telNumber, address: res.provinceName + res.cityName + res.countyName + res.detailInfo};
    //     // 调用接口，将reciever存入库

    //     // 调用接口，获取用户所有收货信息。重新赋值 recievers

    //     console.log(reciever);
    //   }
    // });
    wx.chooseAddress({
      success: function(res) {
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

  // 计算价格
  cal_yunfei: function() {
    var that = this,
      reciever = that.data.reciever,
      postpay = that.data.postpay;
    //console.log(that.data.reciever, that.data.recievers, reciever);return;
    //console.log(reciever, postpay);return;
    // 传参数reciever(收货人信息)与postpay(产品信息)到后台，获取运费
    wxRequest({
      url: site_url + "freight/calculateFreight",
      data: {
        addrId: reciever.addr_id,
        goodsArr: postpay
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    }).then(function(res) {
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
    // 此处为模拟数据
    // var yunfei = Math.floor(Math.random() * 100);
    // if (that.data.ziti == 1 || that.data.reciever == '') {
    //     yunfei = 0;
    // }
    // that.setData({
    //     yunfei:yunfei,
    // });
    // that.cal_total();
  },

  cal_total: function() {
    var that = this,
      pro_msg = that.data.pro_msg,
      totalmoney = 0,
      yunfei = that.data.yunfei;
    var goodsmoney = 0,
      membermoney = 0;
    for (var i in pro_msg) {
      //totalmoney += (pro_msg[i].goods_price - pro_msg[i].member_goods_price) * 100 * pro_msg[i].goods_num / 100;
      goodsmoney += (pro_msg[i].goods_price) * 100 * pro_msg[i].goods_num;
      membermoney += (pro_msg[i].goods_price * 100 - pro_msg[i].member_goods_price * 100) * pro_msg[i].goods_num;
    }
    goodsmoney = goodsmoney / 100;
    membermoney = membermoney / 100;
    totalmoney = membermoney;
    //goodsmoney = totalmoney; //商品总计
    totalmoney = (totalmoney * 100 + yunfei * 100) / 100;
    var quan_youhui = that.data.quan.money;
    totalmoney = (totalmoney * 100 - quan_youhui * 100) / 100;
    if(totalmoney>that.data.manjian.firm_money){
      console.log(that.data.manjian)
      totalmoney -= that.data.manjian.minus_money;
    }
    that.setData({
      goodsmoney: goodsmoney,
      membermoney: membermoney,
      totalmoney: totalmoney
    });
  },

  //买家留言
  user_note: function(e) {
    var that = this;
    var note = e.detail.value;
    that.setData({
      note: note
    });
  },

  // 收货信息
  chooseaddr: function() {
    var that = this;
    that.setData({
      addr_picker: 1,
    });
  },
  setaddr: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index;
    var reciever = that.data.recievers[index];
    that.setData({
      reciever: reciever,
      addr_picker: 0
    });
    that.cal_yunfei();
  },
  // 门店信息
  showmendian: function() {
    this.setData({
      mendian_picker: 1,
    });
  },
  setmendian: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index;
    var mendian = that.data.mendian_list[index];
    that.setData({
      mendian: mendian,
      mendian_picker: 0
    });
    // console.log(that.data);
  },
  // 发票信息
  showfapiao: function() {
    this.setData({
      fapiao_picker: 1,
    });
  },
  setfapiao: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index;
    var fapiao = that.data.fapiao_list[index];
    that.setData({
      fapiao: fapiao,
      fapiao_picker: 0
    });
    // console.log(that.data);
  },
  setfapiaodefault: function() {
    var that = this;
    that.setData({
      fapiao_picker: 0,
      fapiao: that.data.fapiao_default,
    });
  },
  // 优惠券信息
  showquan: function() {
    this.setData({
      quan_picker: 1,
    });
  },
  setquan: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index;
    var quan = that.data.quan_list[index];

    that.setData({
      quan: quan,
      quan_picker: 0
    });
    that.cal_total();
    // console.log(that.data);
  },
  setquandefault: function() {
    var that = this;
    that.setData({
      quan_picker: 0,
      quan: that.data.default_quan,
    });
  },

  //生成订单
  createOrder: function() {
    var that = this;
    var reciever = that.data.reciever;
    var mendian = that.data.mendian;
    var fapiao = that.data.fapiao;
    var quan = that.data.quan;
    var pro_msg = that.data.pro_msg;
    var ziti = that.data.ziti;
    var freight = that.data.yunfei;
    var user_id = app.globaldata.uid;
    var goodsmoney = that.data.goodsmoney;
    var membermoney = that.data.membermoney;
    var totalmoney = that.data.totalmoney;
    var note = that.data.note;

    //console.log(pro_msg);return;
    if (!reciever) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      });
      return false;
    }
    // console.log(reciever);
    // console.log(mendian);
    // console.log(fapiao);
    // console.log(quan);
    // console.log(pro_msg);
    // console.log(that.data.ziti);return;
    var request_data = {
      user_id: user_id,
      reciever: reciever,
      mendian: mendian,
      ziti: ziti,
      freight: freight,
      fapiao: fapiao,
      quan: quan,
      note: note,
      pro_msg: pro_msg,
      goodsmoney: goodsmoney,
      membermoney: membermoney,
      totalmoney: totalmoney
    };
    wxRequest({
      url: site_url + "order/createOrder",
      data: request_data,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
    }).then(function(res) {
      if (res.data.code == 1) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          success: function() {
            setTimeout(function() {
              wx.redirectTo({
                url: '/pages/subpay/subpay?money=' + totalmoney + '&order_sn=' + res.data.data.order_sn + '&order_id=' + res.data.data.order_id,
              })
            }, 2000);
          }
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        });
        return false;
      }
    })
  },

  //获取收货地址列表
  getAddressList: function() {
    var that = this;
    var user_id = app.globaldata.uid;
    var request_data = {
      user_id: user_id
    };
    fetch("order/getUserAddressList", request_data).then((res) => {
      if (res.data.code == 1) {
        var recievers = res.data.data;
        if (recievers) { //返回不是一个空数组
          //console.log(recievers);
          that.setData({
            recievers: recievers, //所有收货信息
            reciever: recievers[0] //默认收获地址 后台排好序 取第一个就是默认地址
          });
        }
      }
    });
  },

  //选择定位
  selectPosition: function() {
    var that = this;
    wx.chooseLocation({
      success: function(res) {
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
  getStoreList: function() {
    var that = this;
    var latitude = that.data.latitude;
    var longitude = that.data.longitude;
    var request_data = {
      latitude: latitude,
      longitude: longitude
    };
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


  onLoad: function(options) {
    var that = this,
      postpay = options.postpay,
      recievers,
      reciever,
      pro_msg,
      totalmoney = 0,
      mendian_list,
      mendian,
      fapiao_list,
      fapiao;
    that.set_manjian();
    console.log(JSON.parse(postpay));

    that.setData({
      postpay: postpay,
      user_id: app.globaldata.uid
    });
    //进入首先获取当前定位
    wx.getLocation({
      type: 'gcj02',
      complete: function (res) {
        var latitude = res.latitude ? res.latitude : 0;
        var longitude = res.longitude ? res.longitude : 0;
        console.log(latitude, longitude);
        that.setData({
          latitude: latitude,
          longitude: longitude
        });
        wxRequest({
          url: site_url + "order/getUserAddressList",
          data: {
            user_id: app.globaldata.uid
          },
          method: 'GET',
          header: {
            'Content-Type': 'application/json'
          },
        }).then(function(res) {
          if (res.data.code == 1) {
            if (res.data.data.length == 0) {
              setTimeout(function() {
                wx.showToast({
                  title: '请添加收货地址',
                  icon: 'none'
                });
              }, 2000);
            } else {
              that.setData({
                recievers: res.data.data, //所有收货信息
                reciever: res.data.data[0] //默认收获地址 后台排好序 取第一个就是默认地址
              });
            }
          }
        }).then(function() {
          return wxRequest({
            url: site_url + "order/getStoreList",
            data: {
              latitude: that.data.latitude,
              longitude: that.data.longitude
            },
            method: 'GET',
            header: {
              'Content-Type': 'application/json'
            },
          }).then(function(res) {
            if (res.data.code == 1) {
              var mendian_list = res.data.data.mendian_list, //数据已排好序
                mendian = mendian_list[0];
              that.setData({
                mendian: mendian,
                mendian_list: mendian_list
              })
            }
          }).then(function() {
            return wxRequest({
              url: site_url + "order/PlaceOrder",
              data: {
                user_id: that.data.user_id,
                postpay: that.data.postpay
              },
              method: 'GET',
              header: {
                'Content-Type': 'application/json'
              },
            }).then(function(res) {
              if (res.data.code == 1) {
                var pro_msg = res.data.data;
                that.setData({
                  pro_msg: pro_msg
                });
              }
            }).then(function() {
              return wxRequest({
                url: site_url + "order/getUserFapiaoList",
                data: {
                  user_id: that.data.user_id
                },
                method: 'GET',
                header: {
                  'Content-Type': 'application/json'
                },
              }).then(function(res) {
                if (res.data.code == 1) {
                  that.setData({
                    fapiao_list: res.data.data,
                    //fapiao: res.data.data[0],
                    fapiao: that.data.fapiao_default
                  });
                }
              }).then(function() {
                return wxRequest({
                  url: site_url + "order/getUserCouponList",
                  data: {
                    user_id: that.data.user_id,
                    postpay: that.data.postpay
                  },
                  method: 'GET',
                  header: {
                    'Content-Type': 'application/json'
                  },
                }).then(function(res) {
                  if (res.data.code == 1) {
                    that.setData({
                      quan_list: res.data.data,
                      quan: that.data.default_quan
                      //fapiao: res.data.data[0]
                    });
                  }
                  //console.log(res);
                })
              }).then(function() {
                return that.cal_yunfei()
              })
            })
          })
        });
      }
    });

    // getLocationPromisified({
    //     type: 'gcj02'
    // }).then(function (res) {
    //     var latitude = res.latitude
    //     var longitude = res.longitude
    //     var speed = res.speed
    //     var accuracy = res.accuracy
    //     console.log(latitude, longitude);
    //     that.setData({
    //         latitude: latitude,
    //         longitude: longitude
    //     });
    // }).then(
    //     wxRequest({
    //         url: site_url + "order/getUserAddressList",
    //         data: { user_id: app.globaldata.uid },
    //         method: 'GET',
    //         header: {
    //             'Content-Type': 'application/json'
    //         },
    //     }).then(function (res) {
    //         if (res.data.code == 1) {
    //             that.setData({
    //                 recievers: recievers,//所有收货信息
    //                 reciever: recievers[0] //默认收获地址 后台排好序 取第一个就是默认地址
    //             });
    //         }
    //     })
    // ).catch(function () {
    //     console.error("get location failed")
    // });return;

    //console.log(that.data.latitude, that.data.longitude);

    //var fun1 = wxRequest(that.getAddressList());
    //console.log(wxRequest);return;


    //that.getAddressList(); //获取收货地址列表
    //that.getAddressList();
    //that.getStoreList();

    //获取商品信息 start
    /*
    var user_id = app.globaldata.uid,
        request_data = { user_id: user_id, postpay: postpay };

    fetch("order/PlaceOrder", request_data).then((res) => {
        if (res.data.code == 1) {
            var pro_msg = res.data.data;
            that.setData({
                pro_msg: pro_msg
            });
        }
    });
    // end
    that.setData({
        postpay: postpay,
        user_id: app.globaldata.uid
    });
    */
    //console.log(that.data.reciever, that.data.recievers);return;
    //that.cal_yunfei();return;


    // 模拟数据定义
    recievers = [{
        addr_id: 1,
        name: '周泡泡',
        telnum: '15581600303',
        address: '湖南省 常德市 武陵区 万达广场A座2508'
      },
      {
        addr_id: 2,
        name: '周泡泡',
        telnum: '15581600303',
        address: '湖南省 常德市 武陵区 万达广场A座2506'
      },
      {
        addr_id: 3,
        name: '周泡泡',
        telnum: '15581600303',
        address: '湖南省 常德市 武陵区 万达广场A座2504'
      },
      {
        addr_id: 4,
        name: '周泡泡',
        telnum: '15581600303',
        address: '湖南省 常德市 武陵区 万达广场A座2502'
      },
    ];
    if (recievers) {
      reciever = recievers[0];
    }
    pro_msg = [{
      goods_id: 1,
      goods_img: 'https://www.zydtest.cn/public/static/images/navipic.jpg',
      goods_name: '大湖 冷冻有机花鲢鱼头 配剁椒鱼头调料 750g 1个 袋装 ',
      spec_key_name: '5斤6两',
      spec_key_key: '1_2_3',
      goods_num: 4,
      goods_price: 59.9,
      member_goods_price: 5.99
    }, ];
    mendian_list = [{
        mendian_id: 1,
        name: '大湖万达店1',
        location: '武陵区皂果路与柳叶大道交汇处西北侧万达广场1楼',
        distance: '420m',
        telnum: '0736-7788120'
      },
      {
        mendian_id: 2,
        name: '大湖万达店2',
        location: '武陵区皂果路与柳叶大道交汇处西北侧万达广场1楼',
        distance: '4.2km',
        telnum: '0736-7788120'
      },
      {
        mendian_id: 3,
        name: '大湖万达店3',
        location: '武陵区皂果路与柳叶大道交汇处西北侧万达广场1楼',
        distance: '42km',
        telnum: '0736-7788120'
      },
      {
        mendian_id: 4,
        name: '大湖万达店4',
        location: '武陵区皂果路与柳叶大道交汇处西北侧万达广场1楼',
        distance: '420m',
        telnum: '0736-7788120'
      },
      {
        mendian_id: 5,
        name: '大湖万达店5',
        location: '武陵区皂果路与柳叶大道交汇处西北侧万达广场1楼',
        distance: '420m',
        telnum: '0736-7788120'
      },
    ];
    if (mendian_list) {
      mendian = mendian_list[0];
    }
    fapiao_list = [{
        id: 1,
        user_id: 13,
        title: '本地易购1',
        taxNumber: '123123123123123',
        type: 0,
        is_default: 1
      },
      {
        id: 2,
        user_id: 13,
        title: '本地易购2',
        taxNumber: '123123123123123',
        type: 1,
        is_default: 0
      },
    ];
    if (fapiao_list) {
      fapiao = fapiao_list[0];
    } else {
      fapiao = that.data.fapiao_default;
    }
    that.setData({
      //reciever: reciever,//当前收货人
      //recievers: recievers,//所有收货信息
      //pro_msg: pro_msg,//所有产品信息
      totalmoney: totalmoney, //产品总价
      //mendian_list: mendian_list,//门店列表
      //mendian:mendian,//选择门店
      //fapiao_list:fapiao_list,//发票列表
      //fapiao:fapiao,//选择发票
    });

    //that.cal_yunfei();
    //console.log(that.data);
  },
})