// app.js
import {
  getEnumeMap,
  getLocationData,
  subjectItemList,
  getVersion,
} from './utils/api'
App({

  onLaunch: function () {
    wx.getSystemInfo({
      success: res => {
        const patt = /ios/i
        const isIos = patt.test(res.system) //判断设备是否为苹果手机
        this.globalData.isIos = isIos
        // 得到安全区域高度res.safeArea.top
        if (res.safeArea.top > 20 && isIos) { //IPhoneX 等刘海手机底部横条高度大约为68rpx 
          this.globalData.isBangs = true
        } else {
          this.globalData.isBangs = false
        }
      }
    })
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
      const locationStorage = wx.getStorageSync('locationData')
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
        wx.setStorageSync('locationData', JSON.stringify(resData))
      })
    } catch (error) {
      console.log('get location error', error);
    }
  },

  onShareAppMessage() {
    let that = this
    wx.onAppRoute(() => {
      console.log('当前页面路由发生变化 触发该事件onShareAppMessage')
      const pages = getCurrentPages() //获取加载的页面
      const view = pages[pages.length - 1] //获取当前页面的对象
      if (!view) return false //如果不存在页面对象 则返回
      // 若想给个别页面做特殊处理 可以给特殊页面加isOverShare为true 就不会重写了
      view.onShareAppMessage = () => { //重写分享配置
        return {
          imageUrl: 'http://aliyuncdn.ydt.biguojk.com/logo/41780e9debb632d5d348001ca7d2ba3.png',
          title: `邀请你学习驾考理论知识，精选500题，不过全退`,
          path: '/pages/index/index?fromWho=' + that.globalData.userInfo._id
        }
      }
    })
  },
  // 全局刷新 tabBar 方法，可在任何页面调用
  refreshTabBar() {
    const pages = getCurrentPages();
    if (pages.length === 0) return;

    // 遍历页面栈，找到任何一个 tabBar 页面并刷新
    for (let i = pages.length - 1; i >= 0; i--) {
      const page = pages[i];
      if (typeof page.getTabBar === 'function' && page.getTabBar()) {
        page.getTabBar().refreshList();
        break; // 找到一个就够了，因为所有 tabBar 实例共享逻辑
      }
    }
  },

  globalData: {
    paidEntry: 'xcx_500',
    from: 'theory',
    version: 10.6,
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
    titleBarHeight: wx.getSystemInfoSync().statusBarHeight + 44, // 状态栏高度
    isBangs: false, // 是否刘海屏
  },



})