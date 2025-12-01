Component({
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    // 旧的步骤
    oldStep: undefined,
    show: false,
  },

  methods: {
    switchStep(step) {
      console.log('step', step)
      if (!step) {
        return
      }
      const that = this
      if (that.data.oldStep == step) {
        return
      }
      that.setData({
        oldStep: step,
        step,
        show: true,
      });
      setTimeout(() => {
        that.setData({
          show: false
        })
      }, 1000 * 3);
    }
  }
})