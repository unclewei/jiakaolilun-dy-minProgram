import {
  poolList,
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
    step: '1',
    poolType: undefined,
    poolData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: `科目${options.step == 1 ? '一' : '四'}专项训练`,
    })
    this.setData({
      step: options.step,
      poolType: options.poolType,
    })
    this.poolDataGet({
      step: options.step,
      poolType: options.poolType,
    })
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

  },

  poolDataGet({
    step,
    poolType
  }) {
    step = Number.parseInt(step);
    const params = {
      step,
      type: poolType //模拟题为6
    };
    wx.showLoading()
    poolList(params).then((res) => {
      wx.hideLoading()
      if (res.data.code !== 200) {
        showNetWorkToast(res.data.msg)
        return
      }
      const resData = res.data.data;
      this.setData({
        poolData: resData
      })
    })
  },


  gotoSubject(e) {
    const id = e.currentTarget.dataset.id
    gotoSubject({
      from: getApp().globalData.from,
      step: this.data.step,
      poolType: undefined,
      poolId: id,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})