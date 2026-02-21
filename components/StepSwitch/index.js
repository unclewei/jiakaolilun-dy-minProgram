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
      step: tt.getStorageSync("step") || "1",
    })
  },
  pageLifetimes: {
    show() {
      this.setData({
        step: tt.getStorageSync("step") || 1,
      })
    },
    hide() {
      console.log('组件所在的页面隐藏了');
    }
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
      tt.setStorageSync('step', item)
      this.triggerEvent('Update')
    },
  },
});