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
      const itemData = this?.data?.totalItem?.filter(p => p.step.includes(Number.parseInt(step))) || []
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
      wx.showLoading()
      subjectItemList().then((res) => {
        wx.hideLoading()
        if (res.data.code !== 200) {
          showNetWorkToast(res.data.msg)
          return
        }
        const resData = res.data.data.map(p => {
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
        console.log('resData', resData);
        const itemData = resData.filter(p => p.step.includes(Number.parseInt(this.data.step)))
        console.log('itemData', itemData);
        this.setData({
          totalItem: resData,
          itemData,
        })
      })
    },

  }
})