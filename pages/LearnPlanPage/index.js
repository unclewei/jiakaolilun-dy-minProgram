import {
  userPoolList,
  getUserMoniPool,
  poolList,
  userSubjectGet
} from '../../utils/api'
import {
  gotoSubject,
  showNetWorkToast
} from '../../utils/util'



Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPoolList: [],
    userMoniSubject: [],
    myWrongUserSubject: {},
    step: 1,
    chosenDoneSubjectNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      step: options.step
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.userPoolsGet()
    this.poolDataGet()
    this.getSubjectCurrentIndex()

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
   * 获取用户个人题库（错题情况）
   */
  userPoolsGet() {
    userPoolList({
      step: this.data.step
    }).then(res => {
      if (res.data.code !== 200) {
        return
      }
      const resData = res.data.data
      this.setData({
        userPoolList: resData,
        myWrongUserSubject: resData?.find(p => p.type == 'wrong')
      })
    })
  },
  /**
   * 模拟题情况
   */
  poolDataGet() {
    getUserMoniPool({
      step: this.data.step
    }).then(res => {
      if (res.data.code !== 200) {
        return
      }
      let isOkUserMoniSubject = res?.data?.data?.userMoniSubject?.filter((i) => i.score >= 95) || [];
      this.setData({
        userMoniSubject: isOkUserMoniSubject
      })
    })
  },


  getSubjectCurrentIndex() {
    if (!getApp().globalData.hasLogin) {
      return
    }
    poolList({
      step: this.data.step
    }).then((res) => {
      wx.hideLoading()
      if (res.data.code !== 200) {
        showNetWorkToast(res.data.msg)
        return
      }
      const resData = res.data.data.reduce((total, item) => ({
        ...total,
        [item.type]: item
      }), {})
      this.setData({
        poolDataObj: resData
      })
      this.getUserSubjectGet(resData?.chosen?._id)
    })

  },

  // 获取做题状态
  getUserSubjectGet(poolId, keyName) {
    userSubjectGet({
      poolId
    }).then(res => {
      if (res.data.code !== 200) {
        return
      }
      const resData = res.data.data
      let wrongNums = resData.wrongSubjectItems ?
        resData.wrongSubjectItems.length :
        0;
      let rightNums = resData.rightSubjectIds ?
        resData.rightSubjectIds.length :
        0;
      this.setData({
        chosenDoneSubjectNum: wrongNums + rightNums
      })
    })
  },

  gotoPage(e) {
    const pooltype = e.currentTarget.dataset.pooltype
    const routetype = e.currentTarget.dataset.routetype

    gotoSubject({
      step: this.data.step,
      poolType: pooltype,
      poolId: routetype === 'wrong' ? this.data.myWrongUserSubject._id : undefined,
    })
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