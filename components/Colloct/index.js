// components/colloct/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showColloct: false,
  },

  ready() {
    setTimeout(() => {
      this.checkColloct()
    }, 1000 * 60 * 1);

    setTimeout(() => {
      // 1分钟后自动关闭
      this.onColloct()
    }, 1000 * 60 * 2);
    // 1分钟后，出现
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onColloct() {
      wx.setStorageSync('colloct_tag', true)
      this.setData({
        showColloct: false
      })
    },
    checkColloct() {
      const isCheck = wx.getStorageSync('colloct_tag')
      if (!isCheck) {
        this.setData({
          showColloct: true
        })
      }
    }
  }
})