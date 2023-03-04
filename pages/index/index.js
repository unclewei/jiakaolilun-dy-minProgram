// index.js
import {
  userSubjectGet,
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
  },
  onLoad() {
    // this.chosenAndWrong()

    autoLogin((res) => {
      this.chosenAndWrong();
      if (res === 'fail') {
        return
      }
      // 请求成功，提示信息
      this.setData({
        userInfo: getApp().globalData.userInfo
      })
    })
  },
  onShow() {
    this.chosenAndWrong()
  },

  /**  登录成功*/
  onLoginSuccess() {
    this.setData({
      userInfo: getApp().globalData.userInfo
    })
    this.chosenAndWrong()
  },

  chosenAndWrong() {
    const that = this
    let poolType = ['chosen', 'myWrong']
    wx.showLoading()
    userSubjectGet({
      type: poolType,
      step: that.data.step
    }).then((res) => {
      wx.hideLoading()
      if (res.data.code !== 200) {
        showNetWorkToast(res.data.msg)
        return
      }
      let obj = {};
      for (let i of res.data.data) {
        if (i.type === 'chosen') obj.chosenUserSubject = i;
        if (i.type === 'myWrong') obj.myWrongUserSubject = i;
      }
      that.setData({
        userSubject: obj
      })
    })
  },

  // 事件处理函数
  onStepChange(e) {
    this.setData({
      step: e.currentTarget.dataset.item
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
      poolId: undefined,
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
  }

})