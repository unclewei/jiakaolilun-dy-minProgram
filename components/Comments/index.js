import { commentList } from "../../utils/api";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLogin: {
      type: Boolean,
      value: false,
    },
  },

  observers: {
    isLogin: function (isLogin) {
      if (isLogin) {
        this.getComments();
        return;
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  ready: function () {
    this.getUrlPrefix();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getComments(option) {
      commentList({
        type: "publicComment",
        limit: 20,
      }).then((res) => {
        if (res.data.data) {
          this.setData({
            commentList: res.data.data,
          });
        }
      });
    },
    getUrlPrefix() {
      const that = this;
      if (!getApp().globalData.enumeMap?.configMap?.urlPrefix) {
        setTimeout(() => {
          that.getUrlPrefix();
        }, 1000);
        return;
      }
      this.setData({
        urlPrefix: getApp().globalData.enumeMap?.configMap?.urlPrefix,
      });
    },
    showPrview(e){
      const item = e.currentTarget.dataset.item;
      const index = e.currentTarget.dataset.index;
      const urls = item.map(p => (this.data.urlPrefix + p.path))
      tt.previewImage({
        urls,
        current:urls[index]
      })
    },
  },
});
