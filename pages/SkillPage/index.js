import {
  getUserSubjects,
  userSubjectGet,
  poolList
} from "../../utils/api";

import {
  gotoSubject
} from "../../utils/util";

// pages/SkillPage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    step: 1,
    examType: 'car',
    userSubjectMap: {},
    poolData: [],
    poolIds: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      fontSize: wx.getStorageSync('fontSize'),
      step: options.step || 1,
      examType: getApp().globalData.userConfig.examType
    })
    this.poolDataGet({
      step: options.step || 1,
      examType: getApp().globalData.userConfig.examType,
      poolType: 'skill'
    });
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
    this.setData({
      examType: getApp().globalData.userConfig.examType
    })
    if (this.data.poolIds?.length) {
      this.userPoolsGet({
        step: this.data.step,
        poolIds: this.data.poolIds,
      })
    }
  },



  /**
   * 获取用户个人题库（错题情况）
   */
  userPoolsGet({
    step,
    poolIds
  }) {
    if (!step) {
      return;
    }
    this.getUserSubjects({
      step,
      examType: getApp().globalData.userConfig.examType,
      poolIds
    });
  },
  /**
   * 获取用户已完成模拟题数据
   */
  getUserSubjects({
    step,
    examType,
    poolIds
  }) {
    if (!step) return;
    getUserSubjects({
      step,
      examType,
      poolIds
    }).then((res) => {
      if (res.data.code !== 200) {
        return
      }
      const resData = res.data.data
      let userSubjectMap = {};
      for (let i of resData) {
        userSubjectMap[i.poolId] = i;
      }
      this.setData({
        userSubjectMap
      })
    });
  },
  /**
   * 专项训练
   */
  poolDataGet({
    step,
    poolType,
    examType
  }) {
    wx.showLoading()
    poolList({
        step: Number.parseInt(step),
        type: poolType,
        state: 'online',
        examType,
      })
      .then((res) => {
        wx.hideLoading()
        if (res.data.code !== 200) {
          return
        }
        const poolData = res.data.data
        let poolIds = poolData.map((i) => i._id);
        this.setData({
          poolData,
          poolIds
        })
        this.userPoolsGet({
          step,
          poolIds
        });
      })
  },

  gotoPage(e) {
    const poolId = e.currentTarget.dataset.poolid;
    gotoSubject({
      userPoolId: undefined,
      step:this.data.step,
      poolId,
    });
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