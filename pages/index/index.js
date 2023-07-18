// index.js
import {
  userPoolList,
  poolList
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
      if (res == 'fail') {
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
    wx.showLoading()
    userPoolList({
      step: that.data.step
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
      step: that.data.step
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
      getApp().globalData.poolDataObj = resData

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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})