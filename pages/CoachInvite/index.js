// pages/CoachInvite/index.js
import {
  baseApi,
  applyToCoach,
  updateUserInfo
} from "../../utils/api";
import {
  autoLogin,
  updateUserConfig
} from "../../plugins/wxapi";

import {
  showNetWorkToast,
  showToast
} from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromWho: '', // 邀请人ID
    hasLogin: false, // 是否已登录
    userInfo: {
      nickName: '',
      avatarUrl: '',
      phoneNum: ''
    },
    isRegistering: false // 是否正在注册
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('CoachInvite onLoad', options);

    // 保存邀请人ID到本地
    if (options.fromWho) {
      tt.setStorageSync('coachInviteFromWho', options.fromWho);
      this.setData({
        fromWho: options.fromWho
      });
    }
    autoLogin((res) => {
      if (res == 'fail') {
        this.selectComponent("#LoginModal").showModal()
        return
      }
      // 请求成功，提示信息
      this.onLoginSuccess()
    })
  },

  /**
   * 登录成功回调
   */
  onLoginSuccess() {
    const userInfo = getApp().globalData.userInfo;
    console.log('Login success', userInfo);

    this.setData({
      hasLogin: true,
      userInfo: getApp().globalData.userInfo
    });
  },

  /**
   * 选择头像
   */
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail;
    tt.uploadFile({
      url: `${baseApi}/userResource/userResourceSave`, // TODO: 这个地址是错误的 这里换成你们后端的上传接口即可
      method: 'POST',
      header: {
        entry: 'entry',
        Authorization: `Bearer ${getApp().globalData.cookies || ""}`
      },
      filePath: avatarUrl,
      name: 'file',
      formData: {
        type: 'avatar' // 这里放你们接口所需要的参数
      },
      // 成功回调
      success: (res) => {
        console.log('头像返回的数据结构', res);
        tt.hideLoading()
        let result = JSON.parse(res.data); // JSON.parse()方法是将JSON格式字符串转换为JSON对象
        console.log('头像返回的数据结构解析后的值', result);
        let newAvatarUrl = result.data.path; // 返回的图片url
        console.log('newAvatarUrl', newAvatarUrl);
        // 将返回的url替换调默认的url，渲染在页面上
        this.setData({
          isEdit: true,
          userInfo: {
            ...this.data.userInfo,
            avatarUrl: newAvatarUrl
          }
        })
      },
      fail: (res) => {
        tt.hideLoading()
        showToast('上传失败，请检查网络')
      }
    });
    tt.showToast({
      title: '头像选择成功',
      icon: 'success'
    });
  },

  /**
   * 输入昵称
   */
  onNicknameInput(e) {
    this.setData({
      userInfo: {
        ...that.data.userInfo || {},
        nickName
      }
    })
  },

  /**
   * 获取用户手机号
   */
  getPhoneNumber(e) {
    const that = this;

    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      tt.showToast({
        title: '获取手机号失败',
        icon: 'none'
      });
      return;
    }

    console.log('getPhoneNumber success', e.detail);

    // 保存加密的手机号数据
    that.setData({
      userInfo: {
        ...that.data.userInfo || {},
        phoneNum: e.detail.code
      }
    });

    tt.showToast({
      title: '获取成功',
      icon: 'success'
    });
  },

  updateUserInfo(userInfo) {
    const that = this;
    if (!that.data.hasLogin) {
      this.selectComponent("#LoginModal").showModal()
      return
    }
    // 验证信息
    if (!this.data.userInfo.nickName) {
      tt.showToast({
        title: '请先获取用户昵称',
        icon: 'none'
      });
      return;
    }

    if (!this.data.userInfo.avatarUrl) {
      tt.showToast({
        title: '请先获取用户头像',
        icon: 'none'
      });
      return;
    }

    if (!this.data.userInfo.phoneNum) {
      tt.showToast({
        title: '请先获取手机号',
        icon: 'none'
      });
      return;
    }
    tt.showLoading();
    updateUserInfo(userInfo).then(res => {
      tt.hideLoading()
      if (res.data.code != 200) {
        showNetWorkToast(res.data.msg)
        return
      }
      showToast('已更新')
      if (!that.data.isRoom) {
        const resData = res.data.data;
        getApp().globalData.userInfo = resData
      } else {
        getApp().globalData.userInfo.nickName = userInfo.nickName
        getApp().globalData.userInfo.avatarUrl = userInfo.avatarUrl
      }

      tt.showModal({
        title: '注册成功',
        content: '后台验证通过后，您将成为认证教练！',
        showCancel: false,
        success: () => {
          // 注册成功后刷新用户信息并跳转 
          tt.switchTab({
            url: '/pages/index/index'
          });
        }
      });
    })
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