import {
  getMyOrder,
} from '../../utils/api'

import {
  showNetWorkToast,
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
    isEmpty: false, // 是否为空
    isEnd: false, // 是否到最后
    skip: 0, // 跳过多少条
    tagSelect: 'all', // 选择类型
    orderList: [],
    hideOrderNo: false, // 隐藏订单号
    userInfo: getApp().globalData.userInfo,
    vipType: {
      month: '千翼大会员月卡',
      season: '千翼大会员季卡',
      year: '千翼大会员年卡',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(wx.getStorageSync('hideOrderNo'));
    const hideOrderNo = wx.getStorageSync('hideOrderNo') === true
    this.setData({
      hideOrderNo,
    })
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
    this.setData({
      loading: false, // 加载中
      isEmpty: false, // 是否为空
      isEnd: false, // 是否到最后
      skip: 0, // 跳过多少条
    })
    this.getDataList()
  },

  // 获取订单列表
  getDataList() {
    var that = this
    const {
      orderList,
    } = that.data
    wx.showLoading()
    getMyOrder(that.data.skip).then(res => {
      wx.hideLoading()
      if (res.data.code !== 200) {
        showNetWorkToast(res.data.msg)
        return
      }
      const resData = res.data.data || []
      if (!orderList.length && !resData.length) {
        this.setData({
          isEnd: true,
          isEmpty: true
        })
        return
      }
      that.setData({
        isEmpty: false,
        orderList: (orderList.concat(resData)),
        isEnd: resData.length < 20 // 默认请求20条
      })
    })
  },



  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isEnd) {
      return
    }
    this.setData({
      skip: this.data.skip + 20
    })
    this.getDataList()
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})