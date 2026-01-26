import {
  doLogin,
  updateUserConfig
} from "../../plugins/wxapi";

Component({

  properties: {
    isLandscape: {
      type: Boolean,
      value: false
    }
  },

  data: {
    logining: false,
  },

  methods: {

    hideModal: function () {
      this.selectComponent("#baseModal").hideModal()
    },
    showModal: function () {
      this.selectComponent("#baseModal").showModal()
    },
    login: function () {
      // 没有用户权限，申请
      var that = this
      that.setData({
        logining: true
      })

      that.loginByNetWork({
        nickName: '微信用户',
        avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132", // 默认头像
      })
      // 获取用户信息的接口已被回收
      // wx.getUserProfile({
      //   desc: '用于完善个人信息',
      //   success: (res) => {
      //     that.loginByNetWork(res.userInfo)
      //   },
      //   fail: () => {
      //     that.setData({
      //       logining: false
      //     })
      //   }
      // })
    },

    loginByNetWork(userInfo) {
      var that = this
      doLogin((res) => {
        console.log('loginRes', res)
        that.setData({
          logining: false
        })
        // 错误，提示
        if (res === 'fail') {
          return
        }

        // 如果用户没有初始化 然后有外部传入的step 和examType，帮助用户初始化
        if (!getApp().globalData.userConfig.isInit && wx.getStorageSync('step') && wx.getStorageSync('examType')) {
          updateUserConfig({
            isInit: true,
            step: wx.getStorageSync('step'),
            cityId: "4401", // 默认是广州
            provinceId: "44",
            examType: wx.getStorageSync('examType')
          }, () => {
            that.hideModal()
            that.triggerEvent('Success')
          })
          return
        }

        that.hideModal()
        that.triggerEvent('Success')
      }, userInfo, false)
    },
  }
})