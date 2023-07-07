const answerNameEnum = {
  0: 'A',
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'D',
  5: 'E',
  6: 'F',
}

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
    isConfirm: {
      type: Boolean,
      value: false,
    },
    answerNum: {
      type: Number,
      value: undefined,
    },
    optionIndex: {
      type: Array,
      value: [],
    },
  },

  observers: {
    'subjectItem,isSeeMode,isNowWrong,wrongHistory,rightHistory,isConfirm,optionIndex': function (subjectItem, isSeeMode, isNowWrong, wrongHistory, rightHistory, isConfirm, answerNum, optionIndex) {
      let answer = subjectItem.answer.toString().split();
      if (wrongHistory && wrongHistory.subjectId && wrongHistory.subjectId === subjectItem._id) {
        this.setData({
          type:'wrong',
          answer:this.optionToName(answer),
          result: `回答错误：您选择的是：${this.optionToName(wrongHistory.options)}；正确答案是：${this.optionToName(answer)}`
        })
        return
      }

      this.setData({
        type:'correct',
        answer:this.optionToName(answer),
        result: `回答正确：您选择的是：${this.optionToName(answer)}`
      })

    }
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

    optionToName(option) {
      return option.map(p => answerNameEnum[p]).join(',')
    },


    onWhy(){
      this.selectComponent("#baseModal").showModal()

    }
  }
})