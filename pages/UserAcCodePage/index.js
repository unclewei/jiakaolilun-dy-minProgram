import {
  userAcCodeActive,
} from "../../utils/api"
import {
  showNetWorkToast
} from "../../utils/util"
import {
  autoLogin,
  getUserConfig
} from "../../plugins/wxapi";

// pages/UserAcCodePage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: null,
    errorMsg: null,
    loading: false,
    userAcCodeData: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({

      fontSize: tt.getStorageSync('fontSize'),
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

  onInputChange(e) {
    console.log('e', e);
    this.setData({
      content: e.detail.value
    })
  },
  onPost() {
    const {
      loading,
      userAcCodeData,
      content
    } = this.data
    if (loading || userAcCodeData) return;
    const params = {
      userAcCodeId: content.trim(),
    };
    if (!params.userAcCodeId || params.userAcCodeId.length !== 24) {
      tt.showToast({
        title: '激活码输入有误',
        icon: 'error'
      })
      return;
    }
    this.setData({
      errorMsg: null,
    })
    tt.showLoading({ title: "" })
    userAcCodeActive(params).then((res) => {
      tt.hideLoading()
      if (res.data.code !== 200) {
        this.setData({
          errorMsg: res.data.msg
        })
        return;
      }
      this.setData({
        userAcCodeData: res.data.data
      })
      // 重新登录，获取登录信息
      autoLogin()
    })
  },

  goToDetail() {
    tt.reLaunch({
      url: '/pages/index/index',
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