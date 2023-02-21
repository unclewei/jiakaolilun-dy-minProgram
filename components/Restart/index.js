import {
  showToast,
  showNetWorkToast
} from '../../utils/util'


import {
  userSubjectRemove,
} from '../../utils/api'


Component({

  /**
   * 组件的属性列表
   */
  properties: {

    poolId: {
      type: String,
      value: ''
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

    onOpen() {
      const that = this
      if (!that.data.poolId) {
        showToast('数据错误，请重试')
        return
      }
      wx.showModal({
        title: '确定要重考吗？',
        content: '重考将重置你本次考试的所有记录',
        cancelText: '取消',
        confirmText: '确定重考',
        success: (modalRes) => {
          if (modalRes.confirm) {
            wx.showLoading()
            userSubjectRemove({
              poolId: that.data.poolId
            }).then(res => {
              wx.hideLoading()

              if (res.data.code !== 200) {
                showNetWorkToast(res.data.msg)
                return
              }
              wx.removeStorageSync(`localPoolStatus_${that.data.poolId}`)
              wx.showToast({
                title: '已重置！',
              })
              setTimeout(() => {
                that.triggerEvent('ReSet')
              }, 1000);
            })
          }
        }
      })
    }

  }
})