import {
  showToast,
  showNetWorkToast,
  countTime
} from '../../utils/util'


import {
  userSubjectRemove,
} from '../../utils/api'


let timeVal = null
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    class: {
      type: String,
      value: "",
    },
    mss: {
      type: Number,
      value: 0,
    },
  },

  observers: {},

  /**
   * 组件的初始数据
   */
  data: {
    answer: '',
    countCount: 0,
  },




  ready: function () {
    let that = this
    timeVal = setInterval(() => {
      const newCount = that.data.countCount + 1
      const time = that.data.mss - newCount
      const {
        minu,
        sec
      } = countTime(time)
      that.setData({
        minu,
        sec,
        countCount: newCount,
      })
      let record = [15, 30, 45]
      if (record.includes(sec) || time === 0) {
        this.triggerEvent('SetLocal', time)
        this.setData({
          countCount: 0
        })
      }
      if (time === 0) {
        clearInterval(timeVal)
      }
    }, 1000)
  },

  detached() {
    clearInterval(timeVal)
    timeVal = null
  },
  /**
   * 组件的方法列表
   */
  methods: {


  }
})