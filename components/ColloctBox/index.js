import {
  subjectToUserPool,
  userPoolShow
} from "../../utils/api";
import {
  showNetWorkToast
} from "../../utils/util";

// components/colloct/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    subjectId: {
      type: String,
    },
    poolData: {
      type: Object,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    colloectIdList: [],
    isCollectNow: false,
  },

  ready() {
    this.getUserPoolShow()
  },

  /**
   * 组件的方法列表
   */
  methods: {


    getUserPoolShow() {
      wx.showLoading()
      userPoolShow({
        step: this.data.poolData.step,
        type: 'collect',
        isShowToday: true,
        examType: getApp().globalData.userConfig.examType
      }).then(res => {
        wx.hideLoading()
        if (res.data.code !== 200) {
          showNetWorkToast(res.data.msg)
          return
        }
        const resData = res.data.data
        this.setData({
          colloectIdList: resData.subjectIds
        })
      })
    },


    // 获取收藏列表
    getCollectList() {

    },

    onColloct() {
      if (this.data.isCollectNow) {
        this.unColloect();
        return
      }
      this.colloect()
    },
    // 收藏
    colloect() {
      const colloectBoxFirst = wx.getStorageSync('colloectBoxFirst')
      if (!colloectBoxFirst) {
        // 弹窗提示收藏按钮
        this.selectComponent("#ColloectTipsModal").showModal()
        wx.setStorageSync('colloectBoxFirst', true)
      }
      subjectToUserPool({
        ...this.data.poolData,
        subjectId: this.data.subjectId,
        isRemove: false,
      }).then(() => {
        this.setData({
          colloectIdList: [...this.data.colloectIdList, this.data.poolData._id]
        })
      })

    },
    // 取消收藏
    unColloect() {
      subjectToUserPool({
        ...this.data.poolData,
        subjectId: this.data.subjectId,
        isRemove: true,
      }).then(() => {
        this.setData({
          colloectIdList: this.data.colloectIdList.filter(p => p !== this.data.poolData._id)
        })
      })
    }
  }
})