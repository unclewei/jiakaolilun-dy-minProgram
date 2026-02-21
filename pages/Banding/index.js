// pages/Banding/index.js

import {
  autoLogin,
  doLogin
} from "../../plugins/wxapi";
import {
  biguoLogo
} from "../../utils/resource";

const linkEnums = [{
  id: 'biguo',
  name: '必过科技 公众号',
  logo: biguoLogo
}, ]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logining: false,
    hasLogin: false,
    source: '',
    linkName: '关联程序',
    linkLogo: '/images/icon/user.png', // biguo的logo，从枚举中获取 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('options', options);
    if (options?.fromWho) {
      tt.setStorageSync('fromWho', options?.fromWho)
      tt.removeStorageSync('fromUnionId')
    }
    if (options?.fromUnionId) {
      tt.setStorageSync('fromUnionId', options?.fromUnionId)
      tt.removeStorageSync('fromWho')
    }
    if (options?.source) {
      tt.setStorageSync('source', options?.source)
    }
    if (options?.scenceCode) {
      tt.setStorageSync('scenceCode', options?.scenceCode)
    }

    // 二维码进来，需要解析参数
    if (options.scene) {
      try {
        const sceneStr = decodeURIComponent(options.scene);
        const params = this.parseQuery(sceneStr)
        console.log('params', params);
        if (params?.fromWho) {
          tt.setStorageSync('fromWho', params?.fromWho)
          tt.removeStorageSync('fromUnionId')
        }
        if (params?.fromUnionId) {
          tt.setStorageSync('fromUnionId', params?.fromUnionId)
          tt.removeStorageSync('fromWho')
        }
        if (params?.source) {
          tt.setStorageSync('source', params?.source)
        }
        if (params?.scenceCode) {
          tt.setStorageSync('scenceCode', params?.scenceCode)
        }
      } catch (error) {

      }
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
    // 获取source参数
    const source = tt.getStorageSync('source') || ''
    console.log('source', source);
    console.log('linkEnums', linkEnums);
    if (source) {
      const linkItem = linkEnums.find(p => p.id === source)
      console.log('linkItem', linkItem);

      this.setData({
        source,
        linkName: linkItem.name,
        linkLogo: linkItem.logo
      })
    }

    autoLogin((res) => {
      if (res == 'fail') {
        this.setData({
          logining: false
        })
        return
      }
      // 请求成功，提示信息
      this.onLoginSuccess()
    })
  },

  parseQuery(str) {
    return str.split('&').reduce((obj, item) => {
      const [key, value] = item.split('=');
      obj[key] = decodeURIComponent(value || '');
      return obj;
    }, {});
  },
  /**
   * 处理绑定按钮点击
   */
  handleBindClick() {
    if (this.data.logining) {
      tt.showToast({
        title: '已绑定，请返回App页面',
        icon: 'success',
        duration: 2000
      })
      return
    }
    tt.showLoading({
      title: '绑定中',
    })
    this.login()
  },


  login: function () {
    // 没有用户权限，申请
    var that = this
    that.setData({
      logining: true
    })
    that.loginByNetWork({
      nickName: 'app用户',
      avatarUrl: "https://thirdtt.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132", // 默认头像
    })
  },

  loginByNetWork(userInfo) {
    var that = this
    doLogin((res) => {
      console.log('loginRes', res)
      that.setData({
        logining: false
      })
      // 错误，提示
      if (res === 'fail') {
        return
      }
      that.onLoginSuccess()
    }, userInfo, false)
  },


  /**  登录成功*/
  onLoginSuccess() {
    // 全局刷新 tabBar
    tt.hideLoading()
    getApp().refreshTabBar();
    this.setData({
      hasLogin: true,
      userInfo: getApp().globalData.userInfo,
      userConfig: getApp().globalData.userConfig,
      enumeMap: getApp().globalData.enumeMap,
      isCoach: getApp().globalData.userInfo.userType === 2,
      examType: tt.getStorageSync('examType') || getApp().globalData.userConfig.examType
    })
  },
  closeApp(){
    tt.exitMiniProgram({
      success() {
        console.log('已退出小程序')
      },
      fail(err) {
        console.log('退出失败', err)
      }
    })
  },

  /**
   * 跳转到必过科技小程序
   */
  handleNavigateToBiguo() {

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

})