// pages/Banding/index.js

import {
  autoLogin,
  doLogin
} from "../../plugins/wxapi";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logining: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
 if (options?.fromWho) {
      wx.setStorageSync('fromWho', options?.fromWho)
      wx.removeStorageSync('fromUnionId')
    }
    if (options?.fromUnionId) {
      wx.setStorageSync('fromUnionId', options?.fromUnionId)
      wx.removeStorageSync('fromWho')
    }
    if (options?.source) {
      wx.setStorageSync('source', options?.source)
    }
    if (options?.scenceCode) {
      wx.setStorageSync('scenceCode', options?.scenceCode)
    }

    // 二维码进来，需要解析参数
    if (options.scene) {
      try {
        const sceneStr = decodeURIComponent(options.scene);
        const params = this.parseQuery(sceneStr)
        console.log('params', params);
         if (params?.fromWho) {
          wx.setStorageSync('fromWho', params?.fromWho)
          wx.removeStorageSync('fromUnionId')
        }
        if (params?.fromUnionId) {
          wx.setStorageSync('fromUnionId', params?.fromUnionId)
          wx.removeStorageSync('fromWho')
        }
        if (params?.source) {
          wx.setStorageSync('source', params?.source)
        }
        if (params?.scenceCode) {
          wx.setStorageSync('scenceCode', params?.scenceCode)
        }
      } catch (error) {

      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    autoLogin((res) => {
      if (res == 'fail') {
        this.setData({
          logining: false
        })
        return
      }
      // 请求成功，提示信息
      this.onLoginSuccess()
    })
  },

  parseQuery(str) {
    return str.split('&').reduce((obj, item) => {
      const [key, value] = item.split('=');
      obj[key] = decodeURIComponent(value || '');
      return obj;
    }, {});
  },
  /**
   * 处理绑定按钮点击
   */
  handleBindClick() {
    if (this.data.logining) {
      wx.showToast({
        title: '已绑定，请返回App页面',
        icon: 'success',
        duration: 2000
      })
    } else {
      this.login()
    }
  },


  login: function () {
    // 没有用户权限，申请
    var that = this
    that.setData({
      logining: true
    })
    that.loginByNetWork({
      nickName: 'app用户',
      avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132", // 默认头像
    })
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
      that.onLoginSuccess()
    }, userInfo, false)
  },


  /**  登录成功*/
  onLoginSuccess() {
    // 全局刷新 tabBar
    getApp().refreshTabBar();
    this.setData({
      isLogin: true,
      userInfo: getApp().globalData.userInfo,
      userConfig: getApp().globalData.userConfig,
      enumeMap: getApp().globalData.enumeMap,
      isCoach: getApp().globalData.userInfo.userType === 2,
      examType: getApp().globalData.userConfig.examType
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})