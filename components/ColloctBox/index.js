// components/colloct/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    subjectId: {
      type: String,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    colloectList: [],
    isCollectNow: false,
  },

  ready() {

  },

  /**
   * 组件的方法列表
   */
  methods: {

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

    },
    // 取消收藏
    unColloect() {}
  }
})