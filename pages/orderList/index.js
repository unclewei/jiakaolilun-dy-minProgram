import {
  subjectItemList
} from '../../utils/api'

import {
  autoChooseDisCount,
  floatNumFormatted,
} from '../../utils/util'
import {
  autoLogin
} from "../../plugins/wxapi";


Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false, // 加载中
    paidItems:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fontSize: wx.getStorageSync('fontSize'),
    })
    autoLogin((res) => {
      if (res === 'fail') {
        return
      }
      // 请求成功，提示信息
      this.setData({
        userInfo: getApp().globalData.userInfo
      })
      this.onRefresh()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  /**  登录成功*/
  onLoginSuccess() {
    this.setData({
      userInfo: getApp().globalData.userInfo
    })
    this.onRefresh()
  },

  onLogin() {
    this.selectComponent("#LoginModal").showModal()
  },

  onRefresh() {
    this.getDataList()
  },

  getDataList() {
    subjectItemList().then(res => {
      if (res.data.code !== 200) {
        return
      }
      const resData = res.data.data
      getApp().globalData.subjectItemList = resData
    })
    this.itemDataGet()
  },
  /**
   * 请求对应科目权益套餐
   */
  itemDataGet() {
    const subjectItemList = getApp().globalData.subjectItemList
    const resData = subjectItemList.map(p => {
      const isPaidDone = !!getApp().globalData.userInfo.paidItems.find(payItem => payItem._id === p._id)
      let fitCoupon = isPaidDone ?
        undefined :
        autoChooseDisCount({
          discountList: [],
          totalAmount: p.price,
          payItem: p
        });
      let fitPrice = floatNumFormatted(fitCoupon ? p.price - fitCoupon.discountAmount : p.price);
      let refund = floatNumFormatted(fitCoupon ? p.price - fitCoupon.discountAmount : p.refund);
      return {
        ...p,
        isPaidDone,
        fitPrice,
        refund
      }
    })
    const paidItems = resData.filter(p => p.isPaidDone)
    this.setData({
      paidItems,
      isEmpty:paidItems.length === 0
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})