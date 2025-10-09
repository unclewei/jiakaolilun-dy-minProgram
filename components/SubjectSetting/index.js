import {
  userSubjectConfigSetGet,
} from '../../utils/util'

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    subjectItem: {
      type: Object,
      value: {}
    },
    subjectId: {
      type: String,
    },
    poolType: {
      type: String,
    },
    poolId: {
      type: String,
    },
    userPoolId: {
      type: String,
    },
    userSubjectStatus: {
      type: String,
    },
    userSubjectId: {
      type: String,
    },
    isReload: {
      type: Boolean,
      value: true
    },
    // 答对自动跳转下一题
    autoNextWhenRight: {
      type: Boolean,
      value: true
    },
    // 答错停留在当前题目
    stayWhenWrong: {
      type: Boolean,
      value: true
    },
    // 是否展示关键词
    isShowKeyWorld: {
      type: Boolean,
      value: false
    },
    // 错题集的情况下，做对是否移除错题。
    isWrongDelete: {
      type: Boolean,
      value: true
    },
  },


  /**
   * 组件的初始数据
   */
  data: {},


  ready() {},
  /**
   * 组件的方法列表
   */
  methods: {

    hideModal: function () {
      this.selectComponent("#baseDrawer").hideModal()
    },
    showModal: function () {
      this.setData({
        showPlay: true,
      })
      this.selectComponent("#baseDrawer").showModal()

    },

    /**
     * 答对自动跳转下一题
     */
    onAutoNextWhenRight(e) {
      const checked = e.detail.value
      this.triggerEvent('AutoNextWhenRight', {
        value: checked
      })
    },
    /**
     * 答错停留在当前题目
     */
    onStayWhenWrong(e) {
      const checked = e.detail.value
      this.triggerEvent('StayWhenWrong', {
        value: checked
      })
    },
    /**
     * 是否展示关键词
     */
    onIsShowKeyWorld(e) {
      const checked = e.detail.value
      this.triggerEvent('IsShowKeyWorld', {
        value: checked
      })
    },
    /**
     * 错题移除
     */
    onIsWrongDelete(e) {
      const checked = e.detail.value
      this.triggerEvent('IsWrongDelete', {
        value: checked
      })
    },

    answerInit(item) {
      const answer = item.answer.toString();
      const answers = [];
      for (let i of answer) {
        const a = item.options[Number(i) - 1];
        answers.push(a);
      }
      return answers;
    },

    skillVideoContent(i) {
      if (!i.skillContent) {
        return '该题无技巧';
      }
      let content = '请记住答题技巧：' + i.skillContent;
      let t = content.slice(-1);
      if (t !== '。') {
        content = content + '。';
      }
      if (content.includes('因此选')) {
        let content_ = content.split('因此选');
        content = content_[0];
        //技巧里已经有答案，不再重复说明
      }
      if (content.includes('所以选')) {
        let content_ = content.split('所以选');
        content = content_[0];
        //技巧里已经有答案，不再重复说明
      }
      let an = '所以，这道题选：';
      let answer = this.answerInit(i);
      if (i.type === 3) {
        //多选题只读字母.
        for (let i of answer) {
          let answerIndex = i.split(':');
          an += `${answerIndex[0]}、`;
        }
      } else {
        for (let i of answer) {
          an += `${i}、`;
        }
      }
      an = an.slice(0, -1);
      an = an + '。';
      return content + an;
    },

    copyId() {
      wx.setClipboardData({
        data: this.data.subjectId,
      })
    },
    copySkill() {
      wx.setClipboardData({
        data: this.skillVideoContent(this.data.subjectItem),
      })
    },

    onReSet() {
      this.triggerEvent('ReSet')
    },

  }
})