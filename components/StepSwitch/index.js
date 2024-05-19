Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    isLike: false,
    num: 0,
  },

  ready: function () {
    this.setData({
      step: wx.getStorageSync("step") || "1",
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onStepChange(e) {
      const item = e.currentTarget.dataset.item;
      this.setData({
        step: item
      })
      wx.setStorageSync('step', item)
      this.triggerEvent('Update')
    },
  },
});