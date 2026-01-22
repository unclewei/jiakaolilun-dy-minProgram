// common/component/modal.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {

    close: {
      type: Boolean,
      value: true
    },
    block: {
      type: Boolean,
      value: false
    },
    // 额外的弹窗body样式，注意css需要写在baseModal的wxss中
    className: {
      type: String,
      value: ''
    },
    bodyContentClassName: {
      type: String,
      value: ''
    },
    title:{
      type: String,
      value: ''
    },
    imageSrc:{
      type: String,
      value: '../../images/updateBanner.png'
    },
    showImage:{
      type: Boolean,
      value: true
    },

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
    isShowing() {
      return this.data.isShow
    },
    hideModal: function () {
      if (this.data.isShow) {
        this.setData({
          isShow: !this.data.isShow,
          hidding: false
        })
        this.triggerEvent('Hide')
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
        this.triggerEvent('Show')
      }
    },
  }
})