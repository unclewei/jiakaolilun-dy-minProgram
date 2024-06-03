import {
  subjectItemList,
} from '../../utils/api'

import {
  autoChooseDisCount,
  floatNumFormatted,
  showNetWorkToast,
  showToast,
} from '../../utils/util'
import {
  rightsList,
  reasonList
} from './config'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    step: {
      type: String,
      value: 1,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

    itemData: [], // 权益数据
    selectItem: {}, // 选择的权益数据
    User: getApp().globalData.userInfo || {},
    isUserInfoOK: false, // 是否有手机号码和姓名
    step: '1',
    insideBtnPaidDone: false,

    rightsList,
    reasonList
  },

  ready() {
    const stepStorage = wx.getStorageSync('step')
    this.setData({
      User: getApp().globalData.userInfo,
      isUserInfoOK: getApp().globalData.userInfo.name && getApp().globalData.userInfo.phoneNum
    })
    this.itemDataGet({
      step: Number.parseInt(this.data.step || stepStorage),
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {


    /**
     * 请求对应科目权益套餐
     */
    itemDataGet({
      step
    }) {
      wx.showLoading()
      subjectItemList().then((res) => {
        wx.hideLoading()
        if (res.data.code !== 200) {
          showNetWorkToast(res.data.msg)
          return
        }
        const resData = res.data.data.map(p => {
          const isPaidDone = !!this.data.User.paidItems.find(payItem => payItem._id === p._id)
          let fitCoupon = isPaidDone ?
            undefined :
            autoChooseDisCount({
              discountList: [],
              totalAmount: p.price,
              payItem: p
            });
          let fitPrice = floatNumFormatted(fitCoupon ? p.price - fitCoupon.discountAmount : p.price);
          let refund = floatNumFormatted(fitCoupon ? p.price - fitCoupon.discountAmount : p.refund);
          return {
            ...p,
            isPaidDone,
            fitPrice,
            refund
          }
        })
        const itemData = resData.filter(p => p.step.includes(step))
        const paidItem = itemData.find(p => p.isPaidDone)
        const isDefaultSelectedItem = itemData.find(p => p.isDefaultSelected)
        this.setData({
          totalItem: resData,
          itemData,
          selectItem: paidItem || isDefaultSelectedItem || itemData[0] || {}
        })
      })
    },

    onStepChange() {
      if (!getApp().globalData.hasLogin) {
        this.selectComponent("#LoginModal").showModal();
        return;
      }
      const itemData = this.data.totalItem.filter(p => p.step.includes(Number.parseInt(this.data.step)))
      const paidItem = itemData.find(p => p.isPaidDone)
      const isDefaultSelectedItem = itemData.find(p => p.isDefaultSelected)
      const newStep = this.data.step == 1 ? 4 : 1
      wx.setStorageSync('step', newStep)
      this.setData({
        step: newStep,
        itemData,
        selectItem: paidItem || isDefaultSelectedItem || itemData[0] || {}
      })
    },

    onSelect(e) {
      if (!getApp().globalData.hasLogin) {
        this.selectComponent("#LoginModal").showModal();
        return;
      }
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
      if (!getApp().globalData.hasLogin) {
        this.selectComponent("#LoginModal").showModal();
        return;
      }
      this.selectComponent("#ShoppingDrawer").showModal()
    },

    buySuccess() {
      this.selectComponent("#ShoppingDrawer").hideModal()
      this.setData({
        insideBtnPaidDone: true,
        User: getApp().globalData.userInfo,
        isUserInfoOK: getApp().globalData.userInfo.name && getApp().globalData.userInfo.phoneNum
      })
    },

  }
})