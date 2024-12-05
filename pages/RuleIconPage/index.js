// pages/RuleIconPage/index.js
import {
  ruleIconTypeList
} from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlPrefix: '',
    ruleIconTypeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      fontSize: wx.getStorageSync('fontSize'),
    })
    this.getUrlPrefix()
    this.ruleIconTypeList()
  },

  ruleIconTypeList() {
    wx.showLoading()
    ruleIconTypeList({
      limit: 100,
      isShowSomeIcon: true
    }).then(res => {
      wx.hideLoading()
      this.setData({
        ruleIconTypeList: res.data.data || []
      })
    })
  },

  gotoPage(e) {
    const {
      _id,
      name
    } = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/RuleIconDetailPage/index?ruleIconTypeId=${_id}&ruleIconTypeName=${name}`,
    })
  },


  getUrlPrefix() {
    const that = this;
    if (!getApp().globalData.enumeMap?.configMap?.urlPrefix) {
      setTimeout(() => {
        that.getUrlPrefix();
      }, 1000);
      return;
    }
    this.setData({
      urlPrefix: getApp().globalData.enumeMap?.configMap?.urlPrefix,
    });
  },

  onShowGallery(e) {
    const imageList = e.currentTarget.dataset.images
    const item = e.currentTarget.dataset.item
    wx.previewImage({
      urls: imageList.map(p => `${this.data.urlPrefix}${p.imgPath}`),
      current: `${this.data.urlPrefix}${item.imgPath}`
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