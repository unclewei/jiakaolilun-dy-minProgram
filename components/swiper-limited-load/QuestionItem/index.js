// pages/SubjectQuestionPage/QuestionItem/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    },
    swiperHeight: {
      type: Number,
      value: 0
    },
    urlPrefix: {
      type: String,
      value: ''
    },
    optionIndex: {
      type: Array,
      value: []
    },
    isSelected: {
      type: Boolean,
      value: false
    },
    isNowWrong: {
      type: Boolean,
      value: false
    },
    isSeeMode: {
      type: Boolean,
      value: false
    },
    wrongHistory: {
      type: Object,
      value: {}
    },
    rightHistory: {
      type: Boolean,
      value: false,
    },
    isShowNow: {
      type: Boolean,
      value: false,
    },
    isSwipering: {
      type: Boolean,
      value: false,
    },
    isShowKeyWorld: {
      type: Boolean,
      value: false,
    },

  },

  observers: {

    'isNowWrong,isSeeMode,wrongHistory,rightHistory,isConfirm,isShowNow,isSwipering': function (isNowWrong, isSeeMode, wrongHistory, rightHistory, isConfirm, isShowNow, isSwipering) {
      if (isSeeMode) { // 背题模式，最高优先级
        this.setData({
          isShowAnswer: true
        })
        return
      }
      if (!isShowNow || isSwipering) { // 不是本题的数据，或者滑动中，先不展示
        this.setData({
          isShowAnswer: false
        })
        return
      }
      // 其他情况
      if (isNowWrong || wrongHistory?.subjectId || rightHistory || isConfirm) {
        this.setData({
          isShowAnswer: true
        })
        return
      }
      this.setData({
        isShowAnswer: false
      })
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowAnswer: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {

    onOptionSelect(e) {
      this.triggerEvent("OptionSelect", e.detail)
    },
    onButtonClick(e) {
      const item = e.currentTarget.dataset.item
      if (item === 'keyWorld') {
        this.setData({
          isShowAnswer: false,
          isShowKeyWorld: !this.data.isShowKeyWorld,
        })
      }
      if (item === 'answer') {
        this.setData({
          isShowAnswer: !this.data.isShowAnswer,
        })
      }
    },
    onAnswerConfirm(e) {
      this.triggerEvent("AnswerConfirm", e.currentTarget.dataset.item)
    },
  }
})