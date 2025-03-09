import {
  payForTicket,
  autoLogin
} from "../../plugins/wxapi";
import {
  postUserPhoneNum,
  getUserCouponList
} from "../../utils/api";
import {
  showToast,
  autoChooseDisCount
} from "../../utils/util";

Component({
  properties: {
    selectItem: {
      type: Object,
      value: {},
    },
  },

  data: {
    userInfo: getApp().globalData.userInfo,
  },

  methods: {
    showModal: function () {
      this.selectComponent("#baseDrawer").showModal();
      this.getUserCouponList(); // 获取优惠券
    },
    hideModal: function () {
      this.selectComponent("#baseDrawer").hideModal();
    },


    /**
     * 明信片购买
     */
    onBuy(e) {
      var that = this;
      const fromWho = wx.getStorageSync('fromWho')
      payForTicket({
          paidId: that.data.selectItem._id,
          paidType: 'item',
          paidEntry: getApp().globalData.paidEntry,
          orderPaySource: "wx",
          fromWho,
          userCouponId: that.data.disCountItem ?
            that.data.disCountItem._id : undefined,
        },
        (res) => {
          if (res === "success") {
            wx.showToast({
              duration: 3000,
              title: "购买成功!",
              icon: "success",
            });
            that.triggerEvent("OnSuccess");
          }
        }
      );
    },

    // 获取优惠券
    getUserCouponList() {
      getUserCouponList().then((res) => {
        if (res.data.code !== 200) {
          return;
        }
        const resData = res.data.data || [];
        // 没有优惠券
        if (!resData.length) {
          this.setData({
            discountList: [],
            disCountItem: null
          });
          return;
        }
        this.setData({
          discountList: resData,
          disCountItem: resData?.[0]
        });
      });
    },

  },
});