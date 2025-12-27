// components/RebateIntroduce/index.js

Component({
  properties: {},

  data: {
    itemData: [],
  },

  lifetimes: {
    attached() {
      this.updateData();
    },
    ready() {
      this.updateData();
    },
  },

  methods: {
    updateData() {
      this.setData({
        itemData: getApp().globalData.subjectItemList,
      });
    },
  },
});