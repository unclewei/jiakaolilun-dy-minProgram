// app.js
import {
  getEnumeMap,
  getLocationData,
  subjectItemList,
  getVersion,
} from './utils/api'
App({

  onLaunch: function () {
    const systemInfo = tt.getSystemInfoSync()
    const patt = /ios/i
    const isIos = patt.test(systemInfo.system) //判断设备是否为苹果手机
    this.globalData.isIos = isIos
    // 得到安全区域高度
    if (systemInfo.safeArea.top > 20 && isIos) { //IPhoneX 等刘海手机底部横条高度大约为68rpx
      this.globalData.isBangs = true
    } else {
      this.globalData.isBangs = false
    }
    // 设置状态栏高度
    this.globalData.titleBarHeight = systemInfo.statusBarHeight + 44

    this.getVersion()
    this.getSubjectItemList()
    this.getEnumeMap()
    this.getLocationDatas()
    this.onShareAppMessage()
  },

  getVersion() {
    getVersion().then(res => {
      if (res.data.code !== 200) {
        return
      }
      this.globalData.isApproval = res.data.data < this.globalData.version
    })
  },
  getEnumeMap() {
    getEnumeMap().then(res => {
      if (res.data.code !== 200) {
        return
      }
      this.globalData.enumeMap = res.data.data
    })
  },
  getSubjectItemList() {
    subjectItemList().then(res => {
      if (res.data.code !== 200) {
        return
      }
      const resData = res.data.data
      this.globalData.subjectItemList = resData
    })
  },
  getLocationDatas() {
    try {
      const locationStorage = tt.getStorageSync('locationData')
      if (locationStorage) {
        this.globalData.locationData = JSON.parse(locationStorage)
        return
      }
      getLocationData().then(res => {
        if (res.data.code !== 200) {
          return
        }
        const resData = res.data.data
        this.globalData.locationData = resData
        tt.setStorageSync('locationData', JSON.stringify(resData))
      })
    } catch (error) {
      console.log('get location error', error);
    }
  },

  onShareAppMessage() {
    // 抖音小程序分享配置需要在各页面的 onShareAppMessage 中实现
    // 这里保留全局分享信息的配置
    this.globalData.shareInfo = {
      imageUrl: 'http://aliyuncdn.ydt.biguojk.com/logo/41780e9debb632d5d348001ca7d2ba3.png',
      title: `邀请你学习驾考理论知识，精选500题，不过全退`,
      path: '/pages/index/index'
    }
  }, 

  globalData: {
    paidEntry: 'xcx_500',
    from: 'theory',
    version: 11.0,
    cookies: null,
    isApproval: true,
    isIos: false, // 是否苹果手机
    userInfo: {},
    userConfig: {}, // 用户配置
    hasLogin: false,
    tagList: [], // 标签Tag列表
    userTickets: [], // 用户拥有的票据列表
    ticketList: [], // 票据枚举
    enumeMap: {}, // 枚举
    locationData: [], // 省份数据
    subjectItemList: [], //可购买的数据
    baseConfig: {}, // 全局配置
    innerAudioContext: undefined, // 全局播放音频上下文
    marketDefaultContentList: [], // 集市可选语句
    poolDataObj: {}, // 考题池子
    titleBarHeight: 0, // 状态栏高度,将在 onLaunch 中设置
    isBangs: false, // 是否刘海屏
  },



})