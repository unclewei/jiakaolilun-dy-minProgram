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
      fontSize: tt.getStorageSync('fontSize'),
      ruleIconTypeId: options.ruleIconTypeId
    })
    tt.setNavigationBarTitle({
      title:options.ruleIconTypeName||'图形速记'
    })
    this.getUrlPrefix()
    this.ruleIconList()
  },

  ruleIconList() {
    tt.showLoading({ title: "" })
    ruleIconList({
      ruleIconTypeId: this.data.ruleIconTypeId,
      limit: 100,
      isShowSomeIcon: true
    }).then(res => {
      tt.hideLoading()
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
    tt.previewImage({
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