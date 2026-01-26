// pages/CoachInvite/index.js
import {
  applyToCoach
} from "../../utils/api";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromWho: '',          // 邀请人ID
    hasLogin: false,      // 是否已登录
    userInfo: {
      nickName: '',
      avatarUrl: '',
      phoneNum: ''
    },
    isRegistering: false  // 是否正在注册
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('CoachInvite onLoad', options);

    // 保存邀请人ID到本地
    if (options.fromWho) {
      wx.setStorageSync('coachInviteFromWho', options.fromWho);
      this.setData({
        fromWho: options.fromWho
      });
    }
  },

  /**
   * 登录成功回调
   */
  onLoginSuccess() {
    const userInfo = getApp().globalData.userInfo;
    console.log('Login success', userInfo);

    this.setData({
      hasLogin: true,
      userInfo: {
        nickName: userInfo.nickName || '',
        avatarUrl: userInfo.avatarUrl || '',
        phoneNum: userInfo.phoneNum || ''
      }
    });
  },

  /**
   * 选择头像
   */
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    console.log('chooseAvatar success', avatarUrl);

    this.setData({
      'userInfo.avatarUrl': avatarUrl
    });

    wx.showToast({
      title: '头像选择成功',
      icon: 'success'
    });
  },

  /**
   * 输入昵称
   */
  onNicknameInput(e) {
    this.setData({
      'userInfo.nickName': e.detail.value
    });
  },

  /**
   * 获取用户手机号
   */
  getPhoneNumber(e) {
    const that = this;

    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      wx.showToast({
        title: '获取手机号失败',
        icon: 'none'
      });
      return;
    }

    console.log('getPhoneNumber success', e.detail);

    // 保存加密的手机号数据
    that.setData({
      'userInfo.phoneNum': e.detail.code
    });

    wx.showToast({
      title: '获取成功',
      icon: 'success'
    });
  },

  /**
   * 注册成为教练
   */
  async registerCoach() {
    const that = this;

    // 验证信息
    if (!this.data.userInfo.nickName) {
      wx.showToast({
        title: '请先获取用户昵称',
        icon: 'none'
      });
      return;
    }

    if (!this.data.userInfo.avatarUrl) {
      wx.showToast({
        title: '请先获取用户头像',
        icon: 'none'
      });
      return;
    }

    if (!this.data.userInfo.phoneNum) {
      wx.showToast({
        title: '请先获取手机号',
        icon: 'none'
      });
      return;
    }

    if (!this.data.fromWho) {
      wx.showToast({
        title: '邀请人信息缺失',
        icon: 'none'
      });
      return;
    }

    that.setData({
      isRegistering: true
    });

    wx.showLoading({
      title: '注册中...',
      mask: true
    });

    try {
      const res = await applyToCoach({
        nickName: this.data.userInfo.nickName,
        avatarUrl: this.data.userInfo.avatarUrl,
        phoneCode: this.data.userInfo.phoneNum, // 使用加密的手机号code
        fromWho: this.data.fromWho
      });

      wx.hideLoading();

      if (res.data.code === 200) {
        wx.showModal({
          title: '注册成功',
          content: '恭喜您成为认证教练！',
          showCancel: false,
          success: () => {
            // 注册成功后刷新用户信息并跳转
            getApp().globalData.userInfo = res.data.data.userInfo || getApp().globalData.userInfo;
            wx.switchTab({
              url: '/pages/index/index'
            });
          }
        });
      } else {
        wx.showModal({
          title: '注册失败',
          content: res.data.msg || '注册失败，请稍后重试',
          showCancel: false
        });
      }
    } catch (error) {
      wx.hideLoading();
      console.error('registerCoach error', error);
      wx.showModal({
        title: '注册失败',
        content: '网络错误，请稍后重试',
        showCancel: false
      });
    } finally {
      that.setData({
        isRegistering: false
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 检查登录状态
    if (getApp().globalData.hasLogin) {
      this.onLoginSuccess();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '邀请您成为教练，轻松教学',
      path: `/pages/CoachInvite/index?fromWho=${this.data.fromWho || ''}`,
      imageUrl: 'http://aliyuncdn.ydt.biguojk.com/logo/41780e9debb632d5d348001ca7d2ba3.png'
    };
  }
})