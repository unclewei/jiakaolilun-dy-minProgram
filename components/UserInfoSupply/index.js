import {
  showToast,
  showNetWorkToast
} from "../../utils/util"

import {
  coachPhoneNum,
} from '../../utils/api'

import {
  autoLogin
} from "../../plugins/wxapi";


Component({

  /**
   * 组件的属性列表
   */
  properties: {

    disabled: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    name: undefined,
    phoneNum: undefined
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
    },

    onInputChange(e) {
      const item = e.currentTarget.dataset.item
      this.setData({
        [item]: e.detail.value
      })
    },

    onConfirm() {
      let that = this
      const {
        name,
        phoneNum
      } = that.data
      if (!name || !phoneNum) {
        showToast(`请填写姓名及手机号码`)
        return
      }
      if (phoneNum.length !== 11) {
        showToast(`手机号码填写错误`)
        return
      }
      tt.showLoading()
      coachPhoneNum({
        name,
        phoneNum
      }).then((res) => {

        tt.hideLoading()
        if (res.data.code !== 200) {
          showNetWorkToast(res.data.msg)
          return
        }
        showToast(`用户基本信息完善成功`)
        autoLogin(()=>{
          that.triggerEvent('Update')
          that.hideModal()
        })

      });
    },

  }
})