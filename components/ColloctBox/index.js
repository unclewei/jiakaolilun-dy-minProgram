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
    step: {
      type: String,
    },
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

  observers: {
    'subjectId,colloectIdList': function (subjectId, colloectIdList) {
      if (subjectId) {
        this.setData({
          isCollectNow: colloectIdList?.includes(subjectId)
        })
      }
    }
  },

  ready() {
    this.getUserPoolShow()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUserPoolShow() {
      tt.showLoading({ title: "" })
      userPoolShow({
        step: this.data.step,
        type: 'collect',
        examType: tt.getStorageSync('examType') || getApp().globalData.userConfig.examType
      }).then(res => {
        tt.hideLoading()
        if (res.data.code !== 200) {
          // showNetWorkToast(res.data.msg)
          return
        }
        const resData = res.data.data
        this.setData({
          colloectIdList: resData.subjectIds,
        })
      })
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
      const colloectBoxFirst = tt.getStorageSync('colloectBoxFirst')
      if (!colloectBoxFirst) {
        // 弹窗提示收藏按钮
        this.selectComponent("#ColloectTipsModal").showModal()
        tt.setStorageSync('colloectBoxFirst', true)
      }
      subjectToUserPool({
        ...this.data.poolData,
        type: 'collect',
        subjectId: this.data.subjectId,
        step: this.data.step,
        isRemove: false,
      }).then(() => {
        this.setData({
          colloectIdList: [...this.data.colloectIdList || [], this.data.subjectId],
          isCollectNow: true
        })
      })

    },
    // 取消收藏
    unColloect() {
      subjectToUserPool({
        ...this.data.poolData,
        type: 'collect',
        subjectId: this.data.subjectId,
        step: this.data.step,
        isRemove: true,
      }).then(() => {
        this.setData({
          colloectIdList: this.data.colloectIdList.filter(p => p !== this.data.subjectId),
          isCollectNow: false
        })
      })
    }
  }
})