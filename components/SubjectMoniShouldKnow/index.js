Component({

  /**
   * 组件的属性列表
   */
  properties: {

    step: {
      type: String,
      value: '1'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},


  ready: function () {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    hideModal: function () {
      this.selectComponent("#ConfirmModal").hideModal()
    },
    showModal: function () {
      this.selectComponent("#ConfirmModal").showModal()
    },

  }
})