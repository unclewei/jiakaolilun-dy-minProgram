Component({

  /**
   * 组件的属性列表
   */
  properties: {

    block: {
      type: Boolean,
      value: false
    },
    // 额外的弹窗body样式，注意css需要写在baseModal的wxss中
    className: {
      type: String,
      value: ''
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
    hidding: false, // 关闭中，用于关闭动画
  },


  ready: function () {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideModal: function () {
      if (this.data.isShow) {
        this.setData({
          hidding: true
        })
        setTimeout(() => {
          this.setData({
            isShow: !this.data.isShow,
            hidding: false
          })
        }, 100);
      }
    },

    touchModal() {
      if (this.data.block) {
        return
      }
      this.hideModal()
    },

    showModal: function () {
      if (!this.data.isShow) {
        wx.hideKeyboard();
        this.setData({
          isShow: !this.data.isShow
        })
      }
    },
  }
})