// index.js
import {
  autoLogin,
  getUserConfig
} from "../../plugins/wxapi";
import {
  userPoolList,
  poolList,
} from "../../utils/api";
import {
  gotoSubject
} from "../../utils/util";

Page({
  data: {
    isLogin: false,
    step: tt.getStorageSync("step") || "1",
    userSubject: {}, // 用户科目数据
    isPaidDone: false,
    shareType: 'default', // 'default' or 'inviteCoach'
    benefitItemData: [{
        name: "不过补偿",
        icon: "../../images/vipIcon/money.png",
        poolType: "incPage",
      },
      {
        name: "七天速成",
        icon: "../../images/vipIcon/speed.png",
        poolType: "learnPlanPage",
      },
      {
        name: `精选${
          getApp().globalData.userConfig.examType === "moto" ? "100" : "500"
        }题`,
        icon: "../../images/vipIcon/vip.png",
        poolType: "chosen",
      },
      {
        name: "模拟考试",
        icon: "../../images/vipIcon/right.png",
        poolType: "moni",
      },
      {
        name: "考前秘卷",
        icon: "../../images/vipIcon/lock.png",
        poolType: "secret",
      },
      {
        name: "我的错题",
        icon: "../../images/vipIcon/order.png",
        poolType: "WCPage",
      },
    ],
  },
  onLoad() {
    autoLogin((res) => {
      if (res === "fail") {
        return;
      }
      this.onLoginSuccess();
    });
  },
  onShow() {
    const stepStorage = tt.getStorageSync('step')
    tt.setNavigationBarColor({
      backgroundColor: stepStorage == 1 ? "#46b978" : "#2196f3",
      frontColor: "#ffffff",
    });
    this.setData({
      fontSize: tt.getStorageSync('fontSize'),
      userConfig: getApp().globalData.userConfig,
      enumeMap: getApp().globalData.enumeMap,
      step: stepStorage || 1,
    });
    this.checkPaidDone(this.data.step)
    tt.setTabBarStyle({
      backgroundColor: "#fff",
    });
    this.getBenefitItemData()
  },

  // 检测这个科目是否已经购买
  checkPaidDone(step) {
    const subjectItemList = getApp().globalData.subjectItemList
    const resData = subjectItemList.map(p => {
      const isPaidDone = this.data.userInfo && this.data.userInfo.paidItems.find(payItem => payItem._id === p._id)
      return {
        ...p,
        isPaidDone,
      }
    })
    const isPaidDone = !!resData.filter(p => p.step.includes(Number.parseInt(step))).find(p => p.isPaidDone)
    this.setData({
      isPaidDone
    })

  },
  getBenefitItemData() {
    const index = this.data.benefitItemData.findIndex(p => p.poolType === 'chosen')
    let newList = [...this.data.benefitItemData];
    newList[index].name = `精选${
      getApp().globalData.userConfig.examType === "moto" ? "100" : "500"
    }题`
    this.setData({
      benefitItemData: newList
    })
  },
  onStepUpdate() {

    const newStep = tt.getStorageSync("step") || "1";
    const that = this
    that.selectComponent("#SwitchSubjectBox").switchStep(newStep)
    setTimeout(() => {
      that.setData({
        step: newStep,
      });
    }, 500);

    this.checkPaidDone(newStep)
    tt.setNavigationBarColor({
      backgroundColor: newStep == 1 ? "#46b978" : "#2196f3",
      frontColor: "#ffffff",
    });
    this.userPoolsGet(newStep);
  },
  /**
   * 获取用户个人题库
   */
  userPoolsGet(step) {
    if (!step) return;
    userPoolList({
      step,
    }).then((res) => {
      if (res.data.data) {
        this.setData({
          userPoolList: res.data.data,
        });
      }
    });
    poolList({
      step,
      examType: tt.getStorageSync('examType') || getApp().globalData.userConfig.examType
    }).then((res) => {
      if (res.data.code !== 200) {
        return;
      }
      const resData = res.data.data.reduce(
        (total, item) => ({
          ...total,
          [item.type]: item,
        }), {}
      );
      this.setData({
        poolListMap: resData,
      });
    });
  },

  /**  登录成功*/
  onLoginSuccess() {
    const userInfo = getApp().globalData.userInfo;

    // 关键：全局刷新 tabBar
    getApp().refreshTabBar();
    // 请求成功，提示信息
    this.setData({
      isLogin: true,
      userInfo,
      userConfig: getApp().globalData.userConfig,
      enumeMap: getApp().globalData.enumeMap,
    });
    this.checkPaidDone(this.data.step)
    this.getBenefitItemData()
    this.userPoolsGet(this.data.step);
  },

  // 用户配置更新
  onUserConfigUpdate() {
    let that = this;
    that.setData({
      userConfig: getApp().globalData.userConfig,
      enumeMap: getApp().globalData.enumeMap,
    });
    this.getBenefitItemData()
  },

  copyId() {
    tt.setClipboardData({
      data: getApp().globalData.userInfo._id,
    });
  },
  gotoNP(e) {
    const item = e.currentTarget.dataset.item;
    tt.navigateToMiniProgram({
      appId: item,
    });
  },

  showRQCode() {
    this.selectComponent("#QRModal").showModal({
      src: "../../images/gzhqrcode.jpg",
      desc: "长按识别图中二维码进入公众号",
      descTwo: "科二科三实地视频为你驾考保驾护航",
    });
  },

  gotoMiniPro() {},

  gotoPage(e) {
    const poolType = e.currentTarget.dataset.pooltype;
    const {
      step,
      poolListMap
    } = this.data;

    gotoSubject({
      step: step,
      poolType: poolType,
      poolId: poolType === "chosen" ? poolListMap?.[poolType]?._id : undefined,
    });
  },

  onCheckLogin() {
    if (!getApp().globalData.hasLogin) {
      this.selectComponent("#LoginModal").showModal();
      return;
    }
  },
  gotoOrderList(e) {
    if (!getApp().globalData.hasLogin) {
      this.selectComponent("#LoginModal").showModal();
      return;
    }
    tt.navigateTo({
      url: `/pages/orderList/index`,
    });
  },

  gotoSetting() {
    tt.navigateTo({
      url: '/pages/Setting/index',
    })
  },
  gotoDiscount() {
    tt.navigateTo({
      url: '/pages/Discount/index',
    })
  },
  cleanAccount() {
    tt.clearStorageSync()
    getApp().globalData.cookies = null
    getApp().globalData.userInfo = {}
    this.setData({
      isLogin: false
    })
    tt.reLaunch({
      url: '/pages/index/index',
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {},

  /**
   * 去教练邀请页
   */
  gotoCoachInvite() {
    tt.navigateTo({
      url: '/pages/CoachInvatePoster/index',
    })
  }
});