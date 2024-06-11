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
    isSeeMode: {
      type: Boolean,
      value: false,
    },
    isNowWrong: {
      type: Boolean,
      value: false,
    },
    wrongHistory: {
      type: Object,
      value: {},
    },
    rightHistory: {
      type: Boolean,
      value: false,
    },
    isShowNow: {
      type: Boolean,
      value: false,
    },
    isConfirm: {
      type: Boolean,
      value: false,
    },
    isSwipering:{
      type:Boolean,
      value:false,
    },
  },

  observers: {
    'subjectItem': function (subjectItem) {
      let answerNum = subjectItem?.answer?.toString() || '';
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


  }
})