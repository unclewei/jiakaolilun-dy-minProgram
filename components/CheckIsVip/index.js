import {
  locationSequence
} from "../../plugins/wxapi";
import {
  clearUserSubjectData
} from "../../utils/subjectUtil";

import {
  floatNumFormatted,
  autoChooseDisCount
} from '../../utils/util';

Component({
  properties: {
    step: {
      type: Number,
      value: 1,
    },
    currentIndex: {
      type: Number,
      value: 0,
    },
    poolData: {
      type: Object,
      value: {},
    },
    poolId: {
      type: String,
      value: '',
    },
    isJustClose: {
      type: Boolean,
      value: false,
    },
    isVipValid: {
      type: Boolean,
      value: true,
    },
    isForFree: {
      type: Boolean,
      value: true,
    },
  },

  observers: {
    "poolData": function (poolData) {
      this.setData({
        freeSubjectNums: poolData.freeSubjectNums || 0,
        isForFree: poolData.isForFree || false,
      });
    },
    "step": function (step) {
      this.itemDataGet({
        step
      })
    },
    "isVipValid,isForFree,currentIndex,freeSubjectNums": function (isVipValid, isForFree, currentIndex, freeSubjectNums) {
      if (isVipValid || isForFree) {
        //有效
        return;
      }
      if (!freeSubjectNums || currentIndex > freeSubjectNums) {
        this.showModal()
      }
    },
  },


  data: {
    isVipValid: true, //VIP是否有效，默认true，通过接口判断给予否定
  },

  ready() {
    this.setData({
      userConfig: getApp().globalData.userConfig,
      userInfo: getApp().globalData.userInfo,
      isCoach: getApp().globalData.userInfo.userType === 2
    })
    // this.showModal()
  },

  methods: {
    hideModal: function () {
      this.selectComponent("#baseModal").hideModal();
    },
    showModal: function () {
      this.selectComponent("#baseModal").showModal();
    },

    /**
     * 没有会员，直接清空做题记录，为了安全仅对小于30做处理。
     */
    cleanHistory() {
      if (this.data.currentIndex < 30) {
        clearUserSubjectData({
          poolId: this.data.poolId,
          isNoTips: true
        });
      }

    },

    onSelect(e) {
      const item = e.currentTarget.dataset.item
      this.setData({
        selectItem: item
      })
    },

    /**
     * 请求对应科目权益套餐
     */
    itemDataGet({
      step
    }) {
      const subjectItemList = getApp().globalData.subjectItemList
      const resData = subjectItemList.map(p => {
        const isPaidDone = !!getApp().globalData.userInfo?.paidItems?.find(payItem => payItem._id === p._id)
        let fitPrice = floatNumFormatted(p.price);
        let refund = floatNumFormatted(p.refund);
        return {
          ...p,
          isPaidDone,
          fitPrice,
          refund
        }
      })
      const itemData = resData.filter(p => p.step.includes(Number.parseInt(step)))
      const paidItem = itemData.find(p => p.isPaidDone)
      const isDefaultSelectedItem = itemData.find(p => p.isDefaultSelected)
      this.setData({
        itemData,
        selectItem: paidItem || isDefaultSelectedItem || itemData[0] || {}
      })
    },

    gotoShop() {
      this.hideModal()
      this.selectComponent("#ShoppingDrawer").showModal()
    },

    buySuccess() {
      this.selectComponent("#ShoppingDrawer").hideModal()
      this.triggerEvent("OnBuySuccess");
      this.setData({
        userInfo: getApp().globalData.userInfo,
      })
      this.hideModal()
    },

  },
});