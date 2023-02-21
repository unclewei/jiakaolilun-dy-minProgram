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
    userSubjectData: {
      type: Object,
      value: {},
    },
    poolId: {
      type: String,
      value: '',
    },
    step: {
      type: String,
      value: '1',
    },
    poolData: {
      type: Object,
      value: {},
    },
  },

  observers: {
    'step,userSubjectData,poolData': function (step,
      userSubjectData, poolData) {
      let isOk = this.isOk()
      let isNotOk = this.isNotOk()
      let unAnswerCount = this.unAnswer()
      let textInit = '还有很多题还没答哦，确定要交卷了吗？'
      let cancelText = '继续考试'
      let okText = '现在交卷'
      if (isOk) {
        textInit = '恭喜成绩合格，干的不错！'
        cancelText = '继续考试'
        okText = '现在交卷'
      }
      if (isNotOk) {
        textInit = '本次考试不及格，还需要加把劲！'
        cancelText = undefined; // 组件 变成插槽
        okText = '收下成绩'
      }
      this.setData({
        isOk,
        isNotOk,
        unAnswerCount,
        textInit,
        cancelText,
        okText
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isOk: false,
    isNotOk: false,
    unAnswerCount: 0,
    textInit: '还有很多题还没答哦，确定要交卷了吗？',
    cancelText: '继续考试',
    okText: '现在交卷'
  },


  ready: function () {
    let that = this
    timeVal = setInterval(() => {
      const {
        minu,
        sec
      } = countTime(this.data.userSubjectData.limitTime || 0)
      that.setData({
        minu,
        sec
      })
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

    hideModal: function () {
      this.selectComponent("#ConfirmModal").hideModal()
    },
    showModal: function () {
      this.selectComponent("#ConfirmModal").showModal()
    },

    scoreInit() {
      const {
        step,
        userSubjectData
      } = this.data
      if (step === 1) {
        return userSubjectData.rightSubjectIds?.length || 0;
      }
      return (userSubjectData.rightSubjectIds?.length || 0) * 2 || 0;
    },
    //做错丢失的分
    wrongScore() {
      const {
        step,
        userSubjectData
      } = this.data
      if (step === 1) {
        return userSubjectData.wrongSubjectIds?.length || 0;
      }
      return (userSubjectData.wrongSubjectIds?.length || 0) * 2 || 0;
    },
    unAnswer() {
      const {
        poolData,
        userSubjectData
      } = this.data
      let subjectCount = poolData?.subjectCount || 0;
      return subjectCount - userSubjectData.wrongSubjectIds.length - userSubjectData.rightSubjectIds.length
    },

    /**
     * 重做
     */
    onReSet() {
      this.hideModal()
      this.triggerEvent('ReSet')
    },

    /**
     * 交卷
     */
    onHandon() {
      this.hideModal()
      let score = this.scoreInit();
      this.triggerEvent('OnSubmit', {
        score
      });
    }


  }
})