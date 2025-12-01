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
    step: wx.getStorageSync('step') || 1,
    userSubject: {}, // 用户科目数据
    mainHeight: 400,
    windowHeight: 671,
    percentage: 0,
    chosenIndex: 0,
    cricleConfig: {},
    isCoach: false,
    pullTriggered: false, // 下拉刷新loading
    isinitProgrss: false, // 页面是否初始化成功，初始化成功后，再渲染做题进度条
  },

  onLoad(options) {
    console.log('options', options);
    if (options?.fromWho) {
      wx.setStorageSync('fromWho', options?.fromWho)
    }
    if (options?.source) {
      wx.setStorageSync('source', options?.source)
    }
    // 二维码进来，需要解析参数
    if (options.scene) {
      try {
        const sceneStr = decodeURIComponent(options.scene);
        const params = this.parseQuery(sceneStr)
        console.log('params', params);
        if (params?.fromWho) {
          wx.setStorageSync('fromWho', params?.fromWho)
        }
        if (params?.source) {
          wx.setStorageSync('source', params?.source)
        }
      } catch (error) {

      }
    }
    // 就当他2s后渲染成功吧
    setTimeout(() => {
      this.setData({
        isinitProgrss: true
      })
    }, 1000 * 2);
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
    const fontSize = this.getDefaultFonSize()
    this.setData({
      fontSize: fontSize || wx.getStorageSync('fontSize'),
      isLogin: !!getApp().globalData.userInfo._id,
      userInfo: getApp().globalData.userInfo,
      userConfig: getApp().globalData.userConfig,
      enumeMap: getApp().globalData.enumeMap,
      isCoach: getApp().globalData.userInfo.userType === 2,
      examType: getApp().globalData.userConfig.examType,
      step: wx.getStorageSync('step') || this.data.step || 1,

    })
    this.chosenAndWrong()
  },
  parseQuery(str) {
    return str.split('&').reduce((obj, item) => {
      const [key, value] = item.split('=');
      obj[key] = decodeURIComponent(value || '');
      return obj;
    }, {});
  },

  getDefaultFonSize() {
    try {
      const appBaseInfo = wx.getAppBaseInfo()
      console.log('appBaseInfo.fontSizeScaleFactor', appBaseInfo.fontSizeScaleFactor);
      if (appBaseInfo.fontSizeScaleFactor && !wx.getStorageSync('fontSize')) {
        if (appBaseInfo.fontSizeScaleFactor <= 1) {
          wx.setStorageSync('fontSize', 16)
          return 16
        }
        if (appBaseInfo.fontSizeScaleFactor <= 1.14) {
          wx.setStorageSync('fontSize', 18)
          return 18
        }
        if (appBaseInfo.fontSizeScaleFactor <= 1.20) {
          wx.setStorageSync('fontSize', 20)
          return 20
        }
        if (appBaseInfo.fontSizeScaleFactor > 1.20) {
          wx.setStorageSync('fontSize', 22)
          return 22
        }
        return 16
      }
    } catch (error) {
      return 16
    }
  },

  /**  登录成功*/
  onLoginSuccess() {
    this.chosenAndWrong()
    this.setData({
      isLogin: true,
      userInfo: getApp().globalData.userInfo,
      userConfig: getApp().globalData.userConfig,
      enumeMap: getApp().globalData.enumeMap,
      isCoach: getApp().globalData.userInfo.userType === 2,
      examType: getApp().globalData.userConfig.examType
    })
    if (getApp().globalData.userInfo.userType === 1 && !getApp().globalData.userConfig.isInit) {
      wx.navigateTo({
        url: '/pages/UserConfigInit/index',
      })
      return
    }
    // 购买了，没有手机号，需要补充
    if (!getApp().globalData.userInfo.phoneNum && !getApp().globalData.userInfo.isPaid) {
      this.selectComponent("#UserInfoSupply").showModal()
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

      let userSubjectConfig = wx.getStorageSync(`localPoolStatus_${target._id}`) || {};
      const resData = res.data.data;
      let currentIndex = userSubjectConfig.currentIndex || resData.currentIndex || 0;
      let rate = currentIndex / target.subjectCount * 100
      rate = Number.parseInt(rate) || 0;
      this.setData({
        percentage: rate || 0,
        chosenIndex: currentIndex
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
    const systemInfo = wx.getSystemInfoSync();
    // 屏幕高度（整个屏幕）
    const screenHeight = systemInfo.screenHeight;
    // 可使用的窗口高度（不包括顶部状态栏和底部 tabBar）
    const windowHeight = systemInfo.windowHeight;
    // 状态栏高度
    const statusBarHeight = systemInfo.statusBarHeight;

    // 自定义标题栏高度（小程序自己算的）
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    const navHeight = (menuButtonInfo.top - statusBarHeight) * 2 + menuButtonInfo.height + statusBarHeight;
    that.setData({
      windowHeight
    })

    const query = wx.createSelectorQuery()
    query.select('#mainContent').boundingClientRect()
    query.exec(function (res) {
      console.log('res[0].height', res[0].height);
      that.setData({
        mainHeight: res[0].height
      })
    })
  },
  onRefresh() {
    this.setData({
      pullTriggered: true
    }); // 开始刷新
    // 模拟接口请求，3 秒后恢复
    setTimeout(() => {
      this.setData({
        pullTriggered: false
      }); // 停止刷新
    }, 1000 * 2);
  },

  // 添加到桌面 提示
  addToDesk() {
    wx.navigateTo({
      url: '/pages/AddToDesk/index',
    })
  },

  gotoLearnPage() {
    wx.navigateTo({
      url: '/pages/LearnPlanPage/index',
    })
  },
  gotoReviewLicense() {
    wx.navigateTo({
      url: '/pages/ReviewLicense/index',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})