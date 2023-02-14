// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    step: 1,
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  // 事件处理函数
  onStepChange(e) {
    this.setData({
      step: e.currentTarget.dataset.item
    })
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

})