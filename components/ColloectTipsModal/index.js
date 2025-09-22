import {
  userSubjectConfigSetGet,
  getRandom
} from '../../utils/util'

Component({ 
  /**
   * 组件的属性列表
   */
  properties: {
    imageSrc: {
      type: String,
      value: '../../images/updateBanner.jpg'
    }
  },

  /**
   * 组件的初始数据
   */
  data: { 
  },


  ready: function () {},

  /**
   * 组件的方法列表
   */
  methods: {

    hideModal: function () {
      this.selectComponent("#baseModal").hideModal()

    },
    showModal: function () {
      this.selectComponent("#baseModal").showModal()
    },

    bindHide() {
      this.triggerEvent('Hide')
    },
    bindShow() {
      this.triggerEvent('Show')
    },

    onConfirm() {
      this.triggerEvent('Confirm')
    },
    onCancel() {
      this.triggerEvent('Cancel')
    },
  }
})