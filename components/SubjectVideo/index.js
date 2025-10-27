Component({

  /**
   * 组件的属性列表
   */
  properties: {
    subjectItem: {
      type: Object,
      value: {}
    },
  },


  /**
   * 组件的初始数据
   */
  data: {
    showPlay: false,
    urlPrefix: undefined,
    palyUrl: undefined
  },


  ready() {
    this.getUrlPrefix()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getUrlPrefix() {
      const that = this;
      if (!getApp().globalData.enumeMap?.configMap?.urlPrefix) {
        setTimeout(() => {
          that.getUrlPrefix();
        }, 1000);
        return;
      }
      this.setData({
        urlPrefix: getApp().globalData.enumeMap?.configMap?.urlPrefix,
      });
    },

    hideModal: function () {
      this.setData({
        showPlay: false,
        palyUrl: undefined
      })
      this.selectComponent("#ConfirmModal").hideModal()
    },
    showModal: function () {
      const palyUrl = this.data.urlPrefix + this.data.subjectItem.skillVideoUrl
      console.log('url', palyUrl);

      this.setData({
        showPlay: true,
        palyUrl: palyUrl
      })

      // wx.previewMedia({
      //   sources: [{
      //     url: palyUrl,
      //     type: 'video'
      //   }],
      // })
      // this.selectComponent("#ConfirmModal").showModal()

    },
    close(){
      this.setData({
        showPlay: false,
      })
    },
    bindHide() {
      this.setData({
        showPlay: false,
        palyUrl: undefined
      })
    },
    onConfirm() {
      this.hideModal()
    }


  }
})