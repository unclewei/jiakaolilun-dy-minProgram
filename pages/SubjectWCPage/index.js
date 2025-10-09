import {
  gotoSubject,
  showNetWorkToast
} from "../../utils/util"
import {
  subjectList,
  userPoolShow
} from "../../utils/api"
import {
  updateUserConfig
} from "../../plugins/wxapi"

// pages/SubjectWCPage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjectList: [],
    userPoolType: 'wrong',
    userPoolDetail: {},
    userPoolTypeArr: [{
        type: 'wrong',
        name: '我的错题'
      },
      {
        type: 'collect',
        name: '我的收藏'
      },
    ],
    typeText: '错题',
    step: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      fontSize: wx.getStorageSync('fontSize'),
      step: options.step,
      poolId: options.poolId,
      isWrongDelete: getApp().globalData.userConfig.isWrongDelete
    })
  },

  onShow() {
    this.getUserPoolShow({
      step: this.data.step,
      userPoolType: this.data.userPoolType
    })
  },


  getUserPoolShow({
    step,
    userPoolType
  }) {
    wx.showLoading()
    userPoolShow({
      step,
      type: userPoolType,
      isShowToday: true,
      examType: getApp().globalData.userConfig.examType
    }).then(res => {
      wx.hideLoading()
      if (res.data.code !== 200) {
        showNetWorkToast(res.data.msg)
        return
      }
      const resData = res.data.data
      this.setData({
        userPoolDetail: resData
      })
      if (!resData?._id) {
        return
      }
      this.getPoolData({
        userPoolId: resData._id
      })
    })
  },

  getPoolData({
    userPoolId
  }) {
    wx.showLoading()
    subjectList({
      userPoolId
    }).then(res => {
      wx.hideLoading()
      if (res.data.code !== 200) {
        showNetWorkToast(res.data.msg)
        return
      }
      this.setData({
        subjectList: res.data.data
      })
    })
  },
  onMenuPress(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      userPoolType: item.type
    })
    this.getUserPoolShow({
      step: this.data.step,
      userPoolType: item.type
    })
  },

  onSwitchChange() {
    const that = this
    updateUserConfig({
      isWrongDelete: !that.data.isWrongDelete
    }, (res) => {
      if (res == 'fail') {
        return
      }
      that.setData({
        isWrongDelete: !that.data.isWrongDelete
      })
    })
  },

  gotoSubject() {
    gotoSubject({
      step: this.data.step,
      poolType: this.data.userPoolType,
      poolId: this.data.userPoolDetail._id
    })
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