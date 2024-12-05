Page({
  /**
   * 页面的初始数据
   */
  data: {
    step: '1',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('stepStorage', stepStorage);
    this.setData({
      fontSize: wx.getStorageSync('fontSize'),
      step: options.step || stepStorage || 1,
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
    wx.setTabBarStyle({
      backgroundColor: '#171619',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})