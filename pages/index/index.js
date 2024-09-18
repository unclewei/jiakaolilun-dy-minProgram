// index.js
import {
  userPoolList,
  poolList,
  userSubjectGet
} from '../../utils/api'

import {
  gotoSubject,
  showNetWorkToast
} from '../../utils/util'
import {
  autoLogin
} from "../../plugins/wxapi";

Page({
  data: {
    step: wx.getStorageSync('step') || '1',
    userSubject: {}, // 用户科目数据
    mainHeight: 400,
    percentage: 0,
    cricleConfig: {},
    isCoach: false,
  },
  onLoad(options) {
    console.log(options);
    if (options.fromWho) {
      wx.setStorageSync('fromWho', options.fromWho)
    }
    if (options.source) {
      wx.setStorageSync('source', options.source)
    }
    // this.chosenAndWrong()
    this.setBodyHeight()
    autoLogin((res) => {
      if (res == 'fail') {
        return
      }
      // 请求成功，提示信息
      this.onLoginSuccess()
    })
  },
  onShow() {
    wx.setTabBarStyle({
      backgroundColor: '#fff',
    })
    this.setData({
      isLogin: !!getApp().globalData.userInfo._id,
      userInfo: getApp().globalData.userInfo,
      userConfig: getApp().globalData.userConfig,
      enumeMap: getApp().globalData.enumeMap,
      isCoach: getApp().globalData.userInfo.userType === 2
    })
    this.chosenAndWrong()
  },

  /**  登录成功*/
  onLoginSuccess() {
    console.log('laile');
    this.chosenAndWrong()
    this.setData({
      isLogin: true,
      userInfo: getApp().globalData.userInfo,
      userConfig: getApp().globalData.userConfig,
      enumeMap: getApp().globalData.enumeMap,
      isCoach: getApp().globalData.userInfo.userType === 2
    })
    if(getApp().globalData.userInfo.userType === 1&& getApp().globalData.userConfig.isInit){
      wx.navigateTo({
        url: '/pages/UserConfigInit/index',
      })
    }
  },

  chosenAndWrong() {
    const that = this
    // wx.showLoading()
    userPoolList({
      step: that.data.step,
      examType: getApp().globalData.userConfig.examType
    }).then((res) => {
      wx.hideLoading()
      if (res.data.code !== 200) {
        showNetWorkToast(res.data.msg)
        return
      }
      const resData = res.data.data || []
      let obj = {
        myWrongUserSubject: resData.find(p => p.type == 'wrong') || {},
      };

      that.setData({
        userSubject: obj
      })
    })
    poolList({
      step: that.data.step,
      examType: getApp().globalData.userConfig.examType
    }).then((res) => {
      wx.hideLoading()
      if (res.data.code !== 200) {
        showNetWorkToast(res.data.msg)
        return
      }
      const resData = res.data.data.reduce((total, item) => ({
        ...total,
        [item.type]: item
      }), {})
      that.setData({
        poolDataObj: resData
      })
      that.getProgress()
      getApp().globalData.poolDataObj = resData

    })
  },

  /**
   * 获取做题状态信息-百分比
   * @param poolId
   */
  getProgress() {
    let target = this.data.poolDataObj['chosen'];
    if (!target) return 0
    userSubjectGet({
      poolId: target._id,
    }).then(res => {
      wx.hideLoading()
      if (res.data.code !== 200) {
        showNetWorkToast(res.data.msg)
        return
      }
      const resData = res.data.data;
      let currentIndex = resData.currentIndex || 0;
      let rate = currentIndex / target.subjectCount * 100
      rate = Number.parseInt(rate) || 0;
      this.setData({
        percentage: rate || 0
      })
    })
  },

  swiperChange(e) {
    const item = e.detail.current
    const step = item == 0 ? 1 : 4
    this.setData({
      step
    })
    this.chosenAndWrong()
    wx.setStorageSync('step', step)
  },
  // 事件处理函数
  onStepChange(e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      step: item
    })
    this.chosenAndWrong()
    wx.setStorageSync('step', e.currentTarget.dataset.item)
  },

  gotoSubject(e) {
    if (!getApp().globalData.hasLogin) {
      this.selectComponent("#LoginModal").showModal()
      return
    }
    const item = e.currentTarget.dataset.item
    gotoSubject({
      from: getApp().globalData.from,
      step: this.data.step,
      poolType: item,
      poolId: item === 'wrong' ? this.data.userSubject.myWrongUserSubject._id : undefined,
    })
  },
  gotoPage() {
    if (!getApp().globalData.hasLogin) {
      this.selectComponent("#LoginModal").showModal()
      return
    }
    wx.navigateTo({
      url: `/pages/SubjectIncPage/index?step=${this.data.step}`,
    })
  },

  // 用户配置更新
  onUserConfigUpdate() {
    let that = this
    that.setData({
      userConfig: getApp().globalData.userConfig,
      enumeMap: getApp().globalData.enumeMap,
    })
  },


  setBodyHeight() {
    const that = this
    const query = wx.createSelectorQuery()
    query.select('#mainContent').boundingClientRect()
    query.exec(function (res) {
      console.log('res[0].height', res[0].height);
      that.setData({
        mainHeight: res[0].height
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
   
  }

})