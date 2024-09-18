Component({

  /**
   * 组件的属性列表
   */
  properties: {

    step: {
      type: String,
      value: '1'
    },
    poolData: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    examTypeName: null
  },


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
      if (!this.data.poolData || !this.data.poolData.examType) return null;
      const EnumeExamType = getApp().globalData.enumeMap?.examType;
      let examType = this.data.poolData.examType;
      this.setData({
        examTypeName: `${EnumeExamType?.[examType]?.label}-${EnumeExamType?.[examType]?.name}`
      })
    },

  }
})