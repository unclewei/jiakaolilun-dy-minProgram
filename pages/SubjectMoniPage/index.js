import {
  getUserMoniPool,
} from '../../utils/api'

import {
  gotoSubject,
  showNetWorkToast,
} from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    thisMoniPool: undefined,
    unDoMoniPool: undefined,
    isKeepGoing: false,
    allDoneSubject: [],
    isDoneMoniPool: [],

    step: '1',
    poolId: undefined,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: `科目${options.step == 1 ? '一' : '四'}模拟考试`,
    })
    this.setData({
      step: options.step,
      poolId: options.poolId,
      userInfo:getApp().globalData.userInfo,
      examType:getApp().globalData.userConfig.examType
    })
    this.poolDataGet({
      step: options.step
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  poolDataGet({
    step
  }) {
    let that = this
    wx.showLoading()
    getUserMoniPool({
      step
    }).then((res) => {
      wx.hideLoading()
      if (res.data.code !== 200) {
        showNetWorkToast(res.data.msg)
        return
      }
      const resData = res.data.data;
      let {
        nextMoniPool,
        isDoneMoniPool,
        userMoniSubject
      } = resData;
      if (nextMoniPool && nextMoniPool._id) {
        that.isKeepgoing({
          poolId: nextMoniPool._id
        });
      }
      if (that.data.poolId && userMoniSubject.length > 0) {
        for (let i of userMoniSubject) {
          if (i.poolId === that.data.poolId) {
            that.setData({
              thisMoniPool: i
            })
            break;
          }
        }
      }
      for (let i = 0; i < userMoniSubject.length; i++) {
        let item = userMoniSubject[i];
        for (let j of isDoneMoniPool) {
          if (item.poolId === j._id) {
            item.name = j.name;
          }
        }
      }
      that.setData({
        allDoneSubject: userMoniSubject,
        lastDoneSubject:userMoniSubject.length > 0 ? userMoniSubject[0]:undefined,
        unDoMoniPool: nextMoniPool,
        isDoneMoniPool: isDoneMoniPool
      })
    });
  },

  /**
   * 继续做题
   */
  isKeepgoing({
    poolId
  }) {
    let keyName = `localPoolStatus_${poolId}`;
    let userSubjectConfig = wx.getStorageSync(keyName) || '{}';
    if (userSubjectConfig.currentIndex > 0) {
      this.setData({
        isKeepGoing: true
      })
    }
  },

  gotoMoniTi() {
    const {
      unDoMoniPool,
      step,
    } = this.data
    if (!unDoMoniPool || !unDoMoniPool._id) {
      wx.showModal({
        title: '提示',
        content: '没有更多的模拟题了，建议重做之前不及格的模拟题',
        showCancel: false,
        confirmText: '知道了'
      })
      return;
    }
    gotoSubject({
      step,
      poolId: unDoMoniPool._id,
      poolType: undefined,
      from: getApp().globalData.from,
    });
  },

  gotoSubject(e) {
    const item = e.currentTarget.dataset.item
    gotoSubject({
      from: getApp().globalData.from,
      step: this.data.step,
      poolType: item,
      poolId: undefined,
    })
  },

  onReSet(){
    this.onLoad({
      poolType: this.data.poolType,
      step: this.data.step,
      poolId: this.data.poolId,
      from: this.data.from
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})