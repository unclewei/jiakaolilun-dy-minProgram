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
    isSwipering: {
      type: Boolean,
      value: false,
    },
  },

  observers: {

    'isNowWrong,isSeeMode,wrongHistory,rightHistory,isConfirm,isShowNow,isSwipering': function (isNowWrong, isSeeMode, wrongHistory, rightHistory, isConfirm, isShowNow, isSwipering) {
      if (isSeeMode) { // 背题模式，最高优先级
        this.setData({
          show: true
        })
        return
      }
      if (!isShowNow || isSwipering) { // 不是本题的数据，或者滑动中，先不展示
        this.setData({
          show: false
        })
        return
      }
      // 其他情况
      if (isNowWrong || wrongHistory?.subjectId || rightHistory || isConfirm) {
        this.setData({
          show: true
        })
      }
    },
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
    show: false,
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