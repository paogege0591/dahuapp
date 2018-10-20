'use strict';
const fetch = require("./util/fetch");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _system = require('./static/utils/system.js');

var _system2 = _interopRequireDefault(_system);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

App({
  globaldata:{
    uid: 0,
    site_url: 'https://www.dhdjk.net/wxapp/',
    apiurl:{
        calmoney: 'https://www.zydtest.cn/index.php/admin/api/calmoney',
        get_one_pro: 'https://www.zydtest.cn/index.php/admin/api/get_one_pro',
        login:'https://www.zydtest.cn/index.php/admin/api/login',
        get_categories:'https://www.zydtest.cn/index.php/admin/api/get_categories',
    },
    code: '',
    userinfo: ''
  },
  onLaunch: function () {
    _system2.default.attachInfo();
    var that = this;
    // 登录
    wx.login({
      success: function(res){
        var code = res.code;
        //进入小程序登录微信服务器 获取code 
        //暂时关闭 保证第一次进入小程序
        
          fetch('index/createBackUser', { code: code }).then((res) => {
              var results = res.data;
              if (results.code == 1) {
                  that.globaldata.uid = results.data.uid; //用户id存入全局变量
                  that.globaldata.userinfo = results.data.userinfo;
              }
              console.log(that.globaldata.userinfo);
              if(that.globaldata.userinfo.level_id<2||!that.globaldata.userinfo){
                wx.showModal({
                  title: '温馨提示',
                  content: '您的身份是游客，完善个人资料后可升级至普通会员。游客无法获得或使用积分',
                  cancelText:'先等等',
                  confirmText:'去完善',
                  success: function (r) {
                    if (r.confirm) {
                      wx.navigateTo({
                        url: '/pages/user/infoset',
                      })
                    } else {
                      console.log(321);
                    }
                  }
                })
              }
          });
        
      }
    })

    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        // console.log(123);
      },
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
        // wx.login() //重新登录
        // console.log(456);
         }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  // 规格弹出层专用js区域开始
  // 如需调用此区域函数，原页面必须包含以下参数：
  // goods_picker 显示/隐藏 控制参数
  // price 总价格
  // num 数量
  // per_price 单价
  // curoption 规格参数
  // optionstr 规格参数字符串，用以获取规格价格
  // option_name 规格名，控制页面显示规格名
  // detail 详情 get_prodetail接口获取到的商品详情
  changeprice: function (curoption,that) {
    if (JSON.stringify(curoption) == '{}') {
      var per_price = that.data.detail.price;
      var cur = '';
    } else {
      var cur = [];
      for (var i in curoption) {
        cur.push(curoption[i]);
      }
      cur = cur.sort(function sortNumber(a, b) { return a - b }).join('_');
      var per_price = that.data.detail.spec_price[cur].price;
    }
    that.setData({
      optionstr: cur,
      per_price: per_price,
      price: per_price * 100 * that.data.num / 100
    });
  },
  changeoption: function (e,that) {
    var key = e.currentTarget.dataset.type;
    var curoption = that.data.curoption, option_name = that.data.option_name;
    curoption[key] = e.currentTarget.dataset.num;
    option_name[key] = e.currentTarget.dataset.name;
    this.changeprice(curoption,that);

    that.setData({
      curoption: curoption,
      option_name: option_name
    })
  },
  minus: function (that) {
    if (that.data.num > 1) {
      that.setData({
        num: that.data.num - 1
      });
      that.setData({
        price: that.data.per_price * 100 * that.data.num / 100
      });
    } else {
      wx.showToast({
        title: '至少购买1件',
        icon: 'none',
      });
    }
  },
  plus: function (that) {
    var cur = [], curoption = that.data.curoption, num = that.data.num;
    if (JSON.stringify(curoption) == '{}') {
      var maxnum = that.data.detail.spec_price[0].kucun;
    } else {
      for (var i in curoption) {
        cur.push(curoption[i]);
      }
      cur = cur.sort(function sortNumber(a, b) { return a - b }).join('_');
      var maxnum = that.data.detail.spec_price[cur].kucun;
    }
    if (num >= maxnum) {
      num = maxnum - 1;
      wx.showToast({
        title: '库存不足',
        icon: 'none',
      });
    }
    that.setData({
      num: num + 1
    });
    that.setData({
      price: that.data.per_price * 100 * that.data.num / 100
    });
  },
  // 规格弹出层结束


    //2018-08-21  积分商品 等操作  字段为score
    changescore: function (curoption, that) {
        if (JSON.stringify(curoption) == '{}') {
            var per_score = that.data.detail.score;
            var cur = '';
        } else {
            var cur = [];
            for (var i in curoption) {
                cur.push(curoption[i]);
            }
            cur = cur.sort(function sortNumber(a, b) { return a - b }).join('_');
            var per_score = that.data.detail.spec_score[cur].score;
            // console.log(per_score);
        }
        that.setData({
            optionstr: cur,
            per_score: per_score,
            score: per_score * 100 * that.data.num / 100
        });
    },

    change_score_option: function (e, that) {
        var key = e.currentTarget.dataset.type;
        var curoption = that.data.curoption, option_name = that.data.option_name;
        curoption[key] = e.currentTarget.dataset.num;
        option_name[key] = e.currentTarget.dataset.name;
        this.changescore(curoption, that);

        that.setData({
            curoption: curoption,
            option_name: option_name
        })
    },

    minus_score: function (that) {
        if (that.data.num > 1) {
            that.setData({
                num: that.data.num - 1
            });
            that.setData({
                score: that.data.per_score * 100 * that.data.num / 100
            });
        } else {
            wx.showToast({
                title: '至少购买1件',
                icon: 'none',
            });
        }
    },

    plus_score: function (that) {
        var cur = [], curoption = that.data.curoption, num = that.data.num;
        if (JSON.stringify(curoption) == '{}') {
            var maxnum = that.data.detail.spec_score[0].kucun;
        } else {
            for (var i in curoption) {
                cur.push(curoption[i]);
            }
            cur = cur.sort(function sortNumber(a, b) { return a - b }).join('_');
            var maxnum = that.data.detail.spec_score[cur].kucun;
        }
        if (num >= maxnum) {
            num = maxnum - 1;
            wx.showToast({
                title: '库存不足',
                icon: 'none',
            });
        }
        that.setData({
            num: num + 1
        });
        that.setData({
            score: that.data.per_score * 100 * that.data.num / 100
        });
    },  
})