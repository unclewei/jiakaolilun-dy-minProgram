import {
  ruleIconList
} from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlPrefix: '',
    ruleIconList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('options',options);
    this.setData({
      ruleIconTypeId: options.ruleIconTypeId
    })
    wx.setNavigationBarTitle({
      title:options.ruleIconTypeName||'图形速记'
    })
    this.getUrlPrefix()
    this.ruleIconList()
  },

  ruleIconList() {
    wx.showLoading()
    ruleIconList({
      ruleIconTypeId: this.data.ruleIconTypeId,
      limit: 100,
      isShowSomeIcon: true
    }).then(res => {
      wx.hideLoading()
      const resData = res.data.data || []
      this.setData({
        ruleIconList: resData.map(p => ({
          ...p,
          src: `${this.data.urlPrefix}${p.imgPath}`
        }))
      })
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
    const item = e.currentTarget.dataset.item
    wx.previewImage({
      urls: this.data.ruleIconList?.map(p => p.src),
      current: item
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})