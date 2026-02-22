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
    isLogin: true,
    allDoneSubject: [],
    isDoneMoniPool: [],

    step: undefined,
    poolId: undefined,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('options',options)
    let step = options.step || tt.getStorageSync('step') || '1'
    tt.setNavigationBarTitle({
      title: `科目${step == 1 ? '一' : '四'}模拟考试`,
    })
    this.setData({
      fontSize: tt.getStorageSync('fontSize'),
      step,
      poolId: options.poolId,
      userInfo: getApp().globalData.userInfo,
      examType: tt.getStorageSync('examType') ||getApp().globalData.userConfig.examType,
      isLogin: !!getApp().globalData.userInfo._id,
    })
    this.poolDataGet({
      step
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
    tt.showLoading({ title: "" })
    getUserMoniPool({
      step,
      examType: that.data.examType,
    }).then((res) => {
      tt.hideLoading()
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
        lastDoneSubject: userMoniSubject.length > 0 ? userMoniSubject[0] : undefined,
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
    let userSubjectConfig = tt.getStorageSync(keyName) || '{}';
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
      tt.showModal({
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

  onReSet() {
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