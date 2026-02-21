// pages/Contract/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  /**
   * 处理联系客服点击
   */
  handleContactService() {
    tt.openCustomerServiceChat({
      extInfo: {
        url: '' // 客服链接，需要在微信公众平台配置
      },
      corpId: '', // 企业ID，需要在微信公众平台配置
      success: (res) => {
        console.log('打开客服成功', res)
      },
      fail: (err) => {
        console.error('打开客服失败', err)
        tt.showToast({
          title: '打开客服失败，请稍后重试',
          icon: 'none',
          duration: 2000
        })
      }
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