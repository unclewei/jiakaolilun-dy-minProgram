import {
  userSubjectConfigSetGet,
  getRandom
} from '../../utils/util'

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    cancelText:{
      type: String,
      value: '取消'
    },
    okText:{
      type: String,
      value: '确定'
    },
    title:{
      type: String,
      value: ''
    },
    imageSrc:{
      type: String,
      value: '../../images/updateBanner.png'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    month: 0,
    num: 27,
  },


  ready: function () {
  },

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

    onConfirm() {
      this.triggerEvent('Confirm')
    },
    onCancel() {
      this.triggerEvent('Cancel')
    },
  }
})