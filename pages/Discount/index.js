import { getUserCouponList } from "../../utils/api";

import { showNetWorkToast, showToast, dedupliById } from "../../utils/util";

Page({
  data: {
    skip: 0, // 跳过多少条
    discountList: [],
    loading: false,
    isEmpty: false,
    isEnd: false,
  },

  onLoad() {
    this.setData({
      userInfo: getApp().globalData.userInfo,
    });
    this.onRefresh();
  },

  onRefresh() {
    this.setData({
      loading: false,
      isEnd: false,
      isEmpty: false,
      skip: 0,
    });
    this.getDiscountList();
  },
  getDiscountList() {
    var that = this;
    that.setData({
      loading: true,
    });
    getUserCouponList().then((res) => {
      that.setData({
        loading: false,
      });
      if (res.data.code !== 200) {
        showNetWorkToast();
        return;
      }
      const resData = res.data.data;
      if (!that.data.discountList.length && !resData.length) {
        that.setData({
          discountList: [],
          isEmpty: true,
          isEnd: true,
        });
        return;
      }
      const discountList = dedupliById(that.data.discountList.concat(resData));
      that.setData({
        isEnd: true, // 默认请求20条
        isEmpty: false,
        discountList: discountList,
      });
    });
  },
});
