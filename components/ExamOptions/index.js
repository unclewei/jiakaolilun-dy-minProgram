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
    optionContent: {
      type: String,
      value: '',
    },
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
    'optionContent,subjectItem,isSeeMode,isNowWrong,wrongHistory,rightHistory,isConfirm,answerNum,optionIndex': function (optionContent, subjectItem, isSeeMode, isNowWrong, wrongHistory, rightHistory, isConfirm, answerNum, optionIndex) {
      let answer = subjectItem?.answer?.toString() || '';
      answer = [...answer]
      answer = answer.map(i => Number(i));
      let isRightAnswer = answer.includes(answerNum); //这个选项是对的
      let isMutType = subjectItem.type === 3; //是否为多选题
      const isOptionSelected = optionIndex.includes(answerNum); //是否选中
      //渲染做错过的题的选项
      if (wrongHistory && wrongHistory.subjectId) {
        let isUseAnswerIncludes = wrongHistory.options.includes(answerNum); //当时选择的答案是否包含这个选项
        //此题做错过，需要回显错误答案
        if (isRightAnswer) {
          if (isUseAnswerIncludes) {
            //既包含，又是对的答案
            return this.opStyleInit({
              type: 'right'
            })
          }
          if (!isUseAnswerIncludes) {
            //    对的答案，却没选，如果是单选，则渲染对，否则渲染漏选
            if (isMutType) {
              //漏选
              return this.opStyleInit({
                type: 'louXuan'
              })
            } else {
              return this.opStyleInit({
                type: 'right'
              })
            }
          }
        } else if (isUseAnswerIncludes) {
          //是错的答案又选了,直接渲染错误
          return this.opStyleInit({
            type: 'wrong'
          })
        }
      }
      //以上的判断，是基于错题历史数据用于回显。
      if (isRightAnswer) {
        // debugger
        if (rightHistory || isSeeMode) {
          //历史做对、背题模式都显示正确的答案
          return this.opStyleInit({
            type: 'right'
          })
        }
        if (isNowWrong) {
          //正确答案，却做错本题
          if (isMutType) {
            //多选情况1:选了对的答案：
            if (isOptionSelected) {
              return this.opStyleInit({
                type: 'right'
              })
            }
            //多选情况2:漏选了对的答案：
            return this.opStyleInit({
              type: 'louXuan'
            })
          }
        }
      }
      if (!isConfirm) {
        //没确定的选项
        if (isMutType && isOptionSelected) {
          console.log('地方对了');
          return this.opStyleInit({
            type: 'isMutSelect'
          })
        }
        return this.opStyleInit({
          type: 'default'
        })
      }
      //对的，又选了，显示对
      if (isRightAnswer && isOptionSelected) {
        return this.opStyleInit({
          type: 'right'
        })
      }
      //错了，却又选了，显示错
      if (isOptionSelected) {
        return this.opStyleInit({
          type: 'wrong'
        })
      }
      //其余情况默认状态
      return this.opStyleInit({
        type: 'default'
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

    onClick() {
      this.triggerEvent('OptionSelect', {
        subjectItem: this.data.subjectItem,
        answerNum: this.data.answerNum
      })

    },
    /**
     * 选项样式渲染
     * @param type
     */
    opStyleInit({
      type = ''
    }) {
      let textStyles, optionSuffix, styles;
      let A = this.data.optionContent.split(':');
      let optionText = A[1];
      optionSuffix = A[0];
      switch (type) {
        case 'right':
          styles = 'optionRight';
          textStyles = 'optionTextRight';
          break;
        case 'wrong':
          styles = 'optionWrong';
          textStyles = 'optionTextWrong'
          break;
        case 'louXuan': //漏选
          styles = 'optionTextRightButNotChoice';
          textStyles = 'optionTextRight'
          break;
        case 'isMutSelect': //做题时多选选中
          styles = 'isMutSelect';
          textStyles = 'isMutSelect'
          break;
        default:
          styles = 'optionNormal';
          textStyles = 'optionTextNormal';
      }
      this.setData({
        optionSuffix,
        styles,
        textStyles,
        optionText,
      })

    }

  }
})