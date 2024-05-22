// index.js
import {
  autoLogin,
  getUserConfig
} from "../../plugins/wxapi";
import {
  userPoolList,
  poolList,
  userSubjectGet
} from "../../utils/api";
import {
  gotoSubject
} from "../../utils/util";

Page({
  data: {
    isLogin: false,
    step: wx.getStorageSync("step") || "1",
    userSubject: {}, // 用户科目数据
    isPaidDone: false,
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
        name: "精选500题",
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
    wx.setNavigationBarColor({
      backgroundColor: this.data.step == 1 ? '#46b978' : '#2196f3',
      frontColor: '#ffffff',
    })
  },
  onStepUpdate() {
    const newStep = wx.getStorageSync("step") || "1"
    this.setData({
      step: newStep
    })
    wx.setNavigationBarColor({
      backgroundColor: newStep == 1 ? '#46b978' : '#2196f3',
      frontColor: '#ffffff',
    })
    this.userPoolsGet(newStep)
  },
  /**
   * 获取用户个人题库
   */
  userPoolsGet(step) {
    if (!step) return;
    userPoolList({
      step
    }).then((res) => {
      if (res.data.data) {
        this.setData({
          userPoolList: res.data.data,
        });
      }
    });
    poolList({
      step
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
    // 请求成功，提示信息
    this.setData({
      isLogin: true,
      userInfo,
      userConfig: getApp().globalData.userConfig,
      isPaidDone: userInfo?.itemValidMap?.[`ke${this.data.step}`],
    });
    this.userPoolsGet(this.data.step);
  },

  // 用户配置更新
  onUserConfigUpdate() {
    let that = this
    getUserConfig((res) => {
      if (res === "fail") {
        return;
      }
      that.setData({
        userConfig: getApp().globalData.userConfig
      })

    })
  },

  copyId() {
    wx.setClipboardData({
      data: getApp().globalData.userInfo.openId,
    });
  },
  gotoIncPage() {
    wx.navigateTo({
      url: `/pages/SubjectIncPage/index`,
    });
  },

  gotoMiniPro() {

  },

  gotoPage(e) {
    const poolType = e.currentTarget.dataset.pooltype;
    const {
      step,
      poolListMap
    } = this.data;

    gotoSubject({
      step: step,
      poolType: poolType,
      poolId: poolType === 'chosen' ? poolListMap?.[poolType]?._id : undefined,
    })
  },

  gotoOrderList(e) {
    if (!getApp().globalData.hasLogin) {
      this.selectComponent("#LoginModal").showModal();
      return;
    }
    wx.navigateTo({
      url: `/pages/orderList/index`,
    });
  },

  showRQCode() {
    this.selectComponent("#QRModal").showModal({
      src: "../../images/gzhqrcode.jpg",
      desc: "长按识别图中二维码关注公众号",
      descTwo: "追踪科一科四情况",
    });
  },
});