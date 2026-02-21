// pages/money/money.js
import {
  baseApi,
  payOrderBegin,
  userAmountGet
} from "../../utils/api";

Page({
  data: {
    hasLogin: false,
    userAmount: {
      todayValue: 0,
      canTakeValue: 0,
      tokenValue: 0,
      takingValue: 0,
      onTheWayValue: 0,
      allValue: 0,
    },
    isShowPayOrderRecord: false,
    batchLoading: false,
  },

  onLoad() {
    // 页面首次加载时不立即渲染，等 tab 切换到这里再渲染（同原逻辑）
    if (!getApp().globalData.hasLogin) {
      this.selectComponent("#LoginModal").showModal();
      return;
    }
    this.setData({
      hasLogin: true
    })
  },

  onShow() {
    this.setData({
      isShowPayOrderRecord: false,
      userInfo: getApp().globalData.userInfo,
      userConfig: getApp().globalData.userConfig,
      enumeMap: getApp().globalData.enumeMap,
    });
    this.userAmountData();
  },

  // 手动刷新时调用（提现成功后等）
  refreshPage() {
    this.userAmountData();
  },

  /**  登录成功*/
  onLoginSuccess() {
    const userInfo = getApp().globalData.userInfo;

    // 请求成功，提示信息
    this.setData({
      isLogin: true,
      userInfo,
      userConfig: getApp().globalData.userConfig,
      enumeMap: getApp().globalData.enumeMap,
      hasLogin: true
    });
    this.checkPaidDone(this.data.step);
    this.getBenefitItemData();
    this.userPoolsGet(this.data.step);
  },

  /** 获取用户金额数据 */
  userAmountData() {
    userAmountGet()
      .then((res) => {
        if (res.data.code !== 200) {
          return;
        }
        const resData = res.data.data;
        this.setData({
          userAmount: resData || this.data.userAmount,
        });
      })
      .catch((err) => {
        console.error("获取金额失败", err);
      });
  },

  /** 切换查看提现记录 / 学员订单 */
  togglePayRecord() {
    this.setData({
      isShowPayOrderRecord: !this.data.isShowPayOrderRecord,
    });
  },

  /** 一键提现 */
  onBatchMoney() {
    if (!getApp().globalData.hasLogin) {
      this.selectComponent("#LoginModal").showModal();
      return;
    }
    // 只允许正式环境提现
    // if (baseApi !== "https://ydt.biguojk.com/api") {
    //   // 你原来的判断方式可自行调整
    //   tt.showToast({
    //     title: "测试模式，请勿操作",
    //     icon: "none"
    //   });
    //   return;
    // }

    const {
      userAmount,
      batchLoading
    } = this.data;

    if (batchLoading) return;
    if (!userAmount || userAmount.canTakeValue === 0) {
      tt.showModal({
        title: "提示",
        content: "可提现金额为0",
        showCancel: false,
      });
      return;
    }
    if (!getApp().globalData.userInfo.phoneNum) {
      this.selectComponent("#UserPhoneSupply").showModal();
      return
    }

    this.setData({
      batchLoading: true
    });

    tt.showLoading()
    payOrderBegin()
      .then((res) => {
        tt.hideLoading()
        this.setData({
          batchLoading: false
        });
        if (res.data.msg) {
          tt.showModal({
            title: "提示",
            content: res.data.msg,
            showCancel: false,
          });
        } else {
          tt.showModal({
            title: "成功",
            content: "提现成功！工作人员会在24小时内审核并予以放款",
            showCancel: false,
          });
        }
        this.refreshPage();
      })
      .catch((err) => {
        tt.hideLoading()
        this.setData({
          batchLoading: false
        });
        if (err && err.data.code === 503) {
          tt.showModal({
            title: "提示",
            content: err.data.msg || "提现失败",
            showCancel: false,
          });
        }
        this.refreshPage();
      })
      .finally(() => {
        this.setData({
          batchLoading: false
        });
      });
  },
  updateUserInfo() {
    this.setData({
      userInfo: getApp().globalData.userInfo,
    })
  },

  /**
   * 跳转到分享海报页面
   */
  gotoSharePoster() {
    if (!getApp().globalData.hasLogin) {
      this.selectComponent("#LoginModal").showModal();
      return;
    }
    tt.navigateTo({
      url: '/pages/SharePoster/index'
    });
  },

  // 页面隐藏时可做清理（可选）
  onHide() {
    // 如果需要，可以在这里重置某些状态
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});