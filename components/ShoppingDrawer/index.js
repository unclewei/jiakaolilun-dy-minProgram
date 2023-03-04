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
      console.log(31231);
      this.selectComponent("#baseDrawer").showModal();
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
          paidType: 5,
          paidEntry: "xcx",
          orderPaySource: "wx",
          fromWho
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

  },
});