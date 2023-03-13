import {
  subjectItemList,
} from '../../utils/api'

import {
  gotoSubject,
  showNetWorkToast,
  showToast,
} from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemData: [], // 权益数据
    selectItem: {}, // 选择的权益数据
    User: getApp().globalData.userInfo || {},
    isUserInfoOK: false, // 是否有手机号码和姓名
    step: '1',
    insideBtnPaidDone:false,

    benifyList: [{
        text: '精选500题',
        image: '../../images/IncOne.png'
      },
      {
        text: '考前秘卷',
        image: '../../images/IncTwo.png'
      },
      {
        text: '模拟考试',
        image: '../../images/IncThree.png'
      },
      {
        text: '错题记录',
        image: '../../images/IncFour.png'
      },
      {
        text: '易错巩固',
        image: '../../images/IncFive.png'
      },
      {
        text: '专项训练',
        image: '../../images/IncSix.png'
      },
      {
        text: '预测通过率',
        image: '../../images/IncSeven.png'
      },
      {
        text: '不合格补偿',
        image: '../../images/IncEight.png',
        mustRefund: true
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      step: options.step,
      User: getApp().globalData.userInfo,
      isUserInfoOK: getApp().globalData.userInfo.name && getApp().globalData.userInfo.phoneNum
    })
    this.itemDataGet({
      step: options.step
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

  /**
   * 请求对应科目权益套餐
   */
  itemDataGet({
    step
  }) {
    let params = {
      step,
    };
    wx.showLoading()
    subjectItemList(params).then((res) => {
      wx.hideLoading()
      if (res.data.code !== 200) {
        showNetWorkToast(res.data.msg)
        return
      }
      const resData = res.data.data
      let isDefaultSelectedItem;
      let isPaidDoneItem;
      for (let i of resData) {
        if (i.isDefaultSelected) {
          isDefaultSelectedItem = i;
        }
        if (i.isPaidDone) {
          isPaidDoneItem = i
        }
      }
      this.setData({
        itemData: resData,
        selectItem: isPaidDoneItem || isDefaultSelectedItem || {}
      })
    })
  },

  onSelect(e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      selectItem: item
    })
  },

  showContactTips() {
    showToast('请先完善个人信息')
  },

  gotoSubjectPage() {
    if (this.data.selectItem.isPaidDone) {
      wx.navigateBack();
    }
  },
  updateUserInfo() {
    this.setData({
      User: getApp().globalData.userInfo,
      isUserInfoOK: getApp().globalData.userInfo.name && getApp().globalData.userInfo.phoneNum
    })
  },

  gotoShop() {
    this.selectComponent("#ShoppingDrawer").showModal()
  },

  buySuccess() {
    this.selectComponent("#ShoppingDrawer").hideModal()
    this.setData({
      insideBtnPaidDone:true,
      User: getApp().globalData.userInfo,
      isUserInfoOK: getApp().globalData.userInfo.name && getApp().globalData.userInfo.phoneNum
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})