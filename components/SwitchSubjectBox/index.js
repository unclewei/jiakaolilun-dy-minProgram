Component({
  properties: {
    step: {
      type: Number,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 旧的步骤
    oldStep: undefined,
    show: false,
  },
  observers: {
    "step": function (step) {
      const that = this
      if(that.data.oldStep == step){
        return
      }
      if (!that.data.oldStep) {
        that.setData({
          oldStep: step
        })
        return
      }
      that.setData({
        oldStep: step,
        show: true,
      });
      setTimeout(() => {
        that.setData({
          show: false
        })
      }, 1000 * 3);
    },
  }
})