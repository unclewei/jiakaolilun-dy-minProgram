// components/SubjectComment/index.js
import {
  subjectCommentList
} from '../../utils/api'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    subjectId: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: ''
    },

  },
  observers: {
    "subjectId": function (subjectId) {
      this.onLoadSubjectComment(subjectId)
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    commentList: [],
    loading: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoadSubjectComment(subjectId) {
      this.setData({
        loading: true,
      })
      const params = {
        subjectId,
        type: this.data.type,
        skip: 0
      };
      subjectCommentList(params)
        .then((res) => {
          this.setData({
            loading: false,
            commentList: res?.data?.data || [],
          })
        })
        .catch(() => {
          this.setData({
            loading: false,
            commentList: [],
          })
        });
    }
  }
})