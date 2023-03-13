Component({
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    src: '',
    desc: ''

  },
  methods: {
    hideModal: function () {
      this.selectComponent("#baseModal").hideModal()
    },

    touchModal() {
      this.hideModal()
    },

    showModal: function (e) {
      this.setData({
        src: e.src,
        desc: e.desc,
        descTwo:e.descTwo
      })
      setTimeout(() => {
        this.selectComponent("#baseModal").showModal()
      });
    },
  }
})