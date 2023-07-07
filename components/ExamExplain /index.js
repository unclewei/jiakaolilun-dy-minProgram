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

    subjectItem: {
      type: Object,
      value: {},
    },
  },

  observers: {
    'subjectItem': function (subjectItem) {
      let answerNum = subjectItem.answer.toString();
      let answer = '';
      if (answerNum.includes(1)) {
        answer += 'A'
      }
      if (answerNum.includes(2)) {
        answer += 'B'
      }
      if (answerNum.includes(3)) {
        answer += 'C'
      }
      if (answerNum.includes(4)) {
        answer += 'D'
      }
      this.setData({
        answer
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    answer: '',
  },


  ready: function () {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    hideModal: function () {
      this.selectComponent("#baseModal").hideModal()
    },
    showModal: function () {
      this.selectComponent("#baseModal").showModal()
    },

  }
})