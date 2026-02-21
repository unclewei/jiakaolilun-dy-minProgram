// pages/AddToDesk/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIos: false,
    urlPrefix: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      fontSize: tt.getStorageSync('fontSize'),
      isIos: getApp().globalData.isIos
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
    this.getUrlPrefix()
  },

  getUrlPrefix() {
    const that = this
    if (!getApp().globalData.enumeMap?.configMap?.urlPrefix) {
      setTimeout(() => {
        that.getUrlPrefix()
      }, 1000);
      return
    }
    this.setData({
      urlPrefix: getApp().globalData.enumeMap?.configMap?.urlPrefix,
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