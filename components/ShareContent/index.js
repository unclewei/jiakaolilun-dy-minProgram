// components/ShareContent/index.js
import {
  subjectItemList,
} from '../../utils/api'
import {
  floatNumFormatted,
  autoChooseDisCount
} from '../../utils/util';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    step: {
      type: String,
      value: 1
    }
  },

  observers: {
    'step': function (step) {
      const itemData = this?.data?.totalItem?.filter(p => !p.isCoachHide && p.step.includes(Number.parseInt(step))) || []
      this.setData({
        itemData,
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  ready() {
    this.getUrlPrefix()
    this.itemDataGet()
  },

  /**
   * 组件的方法列表
   */
  methods: {

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

    /**
     * 请求对应科目权益套餐
     */
    itemDataGet() {
      const subjectItemList = getApp().globalData.subjectItemList
      const resData = subjectItemList.map(p => {
        let fitCoupon =
          autoChooseDisCount({
            discountList: [],
            totalAmount: p.price,
            payItem: p
          });
        let fitPrice = floatNumFormatted(fitCoupon ? p.price - fitCoupon.discountAmount : p.price);
        let refund = floatNumFormatted(fitCoupon ? p.price - fitCoupon.discountAmount : p.refund);
        return {
          ...p,
          fitPrice,
          refund
        }
      })
      const itemData = resData.filter(p => !p.isCoachHide && p.step.includes(Number.parseInt(this.data.step)))
      this.setData({
        totalItem: resData,
        itemData,
      })
    },

    showQRCode() {
      this.selectComponent("#QRModal").showModal({
        src: "../../images/wmQRCode.jpg",
        desc: "长按二维码识别",
        descTwo: "关注公众号",
      });
    },

    /**
     * 跳转到分享海报页面
     */
    gotoSharePoster() {
      wx.navigateTo({
        url: '/pages/SharePoster/index'
      });
    },
    /**
     * 去教练邀请页
     */
    gotoCoachInvite() {
      wx.navigateTo({
        url: '/pages/CoachInvatePoster/index',
      })
    }

  }
})