// app.js
import {
  getEnumeMap
} from './utils/api'
App({

  onLaunch: function () {
    wx.getSystemInfo({
      success: res => {
        const patt = /ios/i
        const isIos = patt.test(res.system) //判断设备是否为苹果手机
        // 得到安全区域高度res.safeArea.top
        if (res.safeArea.top > 20 && isIos) { //IPhoneX 等刘海手机底部横条高度大约为68rpx 
          this.globalData.isBangs = true
        } else {
          this.globalData.isBangs = false
        }
      }
    })
    getEnumeMap().then(res => {
      if (res.data.code !== 200) {
        return
      }
      this.globalData.enumeMap = res.data.data
    })
    this.onShareAppMessage()
  },

  onShareAppMessage() {
    let that = this
    wx.onAppRoute(() => {
      console.log('当前页面路由发生变化 触发该事件onShareAppMessage')
      const pages = getCurrentPages() //获取加载的页面
      const view = pages[pages.length - 1] //获取当前页面的对象
      if (!view) return false //如果不存在页面对象 则返回
      // 若想给个别页面做特殊处理 可以给特殊页面加isOverShare为true 就不会重写了
      const data = view.data
      if (data.isOverShare) {
        return
      }
      view.onShareAppMessage = () => { //重写分享配置
        return {
          imageUrl: 'https://aliyuncdn.mowan.qianyimowan.com/public/publicShare.jpg',
          title: '百变盲盒，千翼模玩',
          path: '/pages/home/index?fromWho='+that.globalData.userInfo._id
        }
      }
    })
  },

  globalData: {
    from:'theory',
    version: 5,
    cookies: null,
    userInfo: {},
    hasLogin: false,
    tagList: [], // 标签Tag列表
    userTickets: [], // 用户拥有的票据列表
    ticketList: [], // 票据枚举
    enumeMap: {}, // 枚举
    baseConfig:{}, // 全局配置
    marketDefaultContentList: [], // 集市可选语句

    titleBarHeight: wx.getSystemInfoSync().statusBarHeight + 44, // 状态栏高度
    isBangs: false, // 是否刘海屏
  },



})