import {
  userSubjectConfigSetGet,
  getRandom
} from '../../utils/util'

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
  data: {
    month: 0,
    num: 27,
  },


  ready: function () {


    let month = new Date().getMonth() + 1;
    let userSubjectConfig = userSubjectConfigSetGet({
      key: 'month',
      isGet: true
    });
    this.setData({
      month,
      num: getRandom(10, 50)
    })
    if (userSubjectConfig && userSubjectConfig.month === month) return;
    this.showModal()
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

    gotoPage() {
      wx.navigateTo({
        url: `/pages/SubjectIncPage/index?step=${this.data.step}`,
      })
    },

    onConfirm() {
      const that = this
      wx.showLoading({
        title: '更新中',
      })
      setTimeout(() => {
        wx.showToast({
          title: '已更新最新题库！',
          duration: 2000,
        });
        userSubjectConfigSetGet({
          key: 'month',
          value: that.data.month,
          isGet: false
        });
        that.hideModal()
      }, 2000);
    },
  }
})