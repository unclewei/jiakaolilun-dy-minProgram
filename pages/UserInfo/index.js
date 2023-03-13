// index.js
import {
  autoLogin
} from "../../plugins/wxapi";

Page({
  data: {
    isLogin: false,
    step: wx.getStorageSync('step') || '1',
    userSubject: {}, // 用户科目数据
  },
  onLoad() {
    autoLogin((res) => {
      if (res === 'fail') {
        return
      }
      // 请求成功，提示信息
      this.setData({
        isLogin: true,
        userInfo: getApp().globalData.userInfo
      })
    })
  },

  /**  登录成功*/
  onLoginSuccess() {
    this.setData({
      isLogin: true,
      userInfo: getApp().globalData.userInfo
    })
  },

  copyId() {
    wx.setClipboardData({
      data: getApp().globalData.userInfo.openId,
    })
  },


  gotoOrderList(e) {
    if (!getApp().globalData.hasLogin) {
      this.selectComponent("#LoginModal").showModal()
      return
    }
    wx.navigateTo({
      url: `/pages/orderList/index`,
    })
  },

  showRQCode() {
    this.selectComponent("#QRModal").showModal({
      src: '../../images/gzhqrcode.jpg',
      desc: '长按识别图中二维码关注公众号',
      descTwo: '追踪科一科四情况'
    })
  },
})