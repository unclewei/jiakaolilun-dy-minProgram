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

  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowAnswer: false,
    isShowKeyWorld: false
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
          isShowKeyWorld: false
        })
      }
    },
    onAnswerConfirm(e) {
      this.triggerEvent("AnswerConfirm", e.currentTarget.dataset.item)
    },
  }
})