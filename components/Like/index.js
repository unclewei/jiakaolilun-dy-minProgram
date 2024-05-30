import {
  likeSet,
} from '../../utils/api'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemId: {
      type: String,
      value: "",
    },
    likeCount: {
      type: Number,
      value: 0,
    },
    type: {
      type: String,
      value: "",
    },
    defaultIsLike: {
      type: Boolean,
      value: false,
    },
  },

  observers: {
    "likeCount,defaultIsLike": function (likeCount, defaultIsLike) {
      this.setData({
        isLike: defaultIsLike,
        num: likeCount,
      });
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isLike: false,
    num: 0,
  },

  ready: function () {},

  /**
   * 组件的方法列表
   */
  methods: {
    onVote() {
      const result = this.data.isLike ? {
        isLike: false,
        num: this.data.num - 1
      } : {
        isLike: true,
        num: this.data.num + 1
      }
      this.setData({
        ...result
      });
      likeSet({
        type: this.data.type,
        itemId: this.data.itemId,
      });
    },
  },
});