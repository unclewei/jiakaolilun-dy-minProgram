import {
  login,
  createOrder,
  afterPay,
  userInfo,
  userConfigGet,
  syncUserConfig
} from "../utils/api";
import {
  showToast,
  showNetWorkToast
} from '../utils/util.js'

const reTryCount = 5 // 支付重试

/**
 * 微信统一接口类
 */
export const autoLogin = (callBack) => {
  doLogin((res) => {
    callBack(res)
  }, undefined, true)
}

/**微信登录方法 */
export const doLogin = (callback, userInfo, isInit, isUpdate = false) => {
  tt.showLoading()
  tt.login({
    success: function (res) {
      // success
      console.log("userInfo ", userInfo);
      console.log("login_res: = ", res);
      console.log("wxapi tt.login code = ", res.code);
      const fromWho = tt.getStorageSync('fromWho') || undefined
      const fromUnionId = tt.getStorageSync('fromUnionId') || undefined
      const scenceCode = tt.getStorageSync('scenceCode') || undefined
      const source = tt.getStorageSync('source') || undefined
      let loginData = {
        code: res.code,
        userInfo,
        isUpdate,
      }
      if (fromWho && fromWho !== 'undefined') {
        loginData.fromWho = fromWho
      }
      if (fromUnionId) {
        loginData.fromUnionId = fromUnionId
      }
      if (scenceCode) {
        loginData.scenceCode = scenceCode
      }
      if (source) {
        loginData.source = source
      }
      login(loginData).then(function (res) {
        console.log("come in");
        if (res.data.code != 200) {
          loginFailOption(callback, res, isInit)
          return
        }
        tt.hideLoading()
        let resData = res.data.data
        getApp().globalData.cookies = res.data.token
        getApp().globalData.userInfo = resData
        getApp().globalData.hasLogin = true
        getUserConfig(callback)
      }).catch((e) => {
        console.log('e', e);
        loginFailOption(callback, null, isInit)
      })
    },
    fail: () => {
      loginFailOption(callback, null, isInit)
    }
  })
}

/**登录失败重新登录操作 */
export const loginFailOption = (callback, res, isInit) => {
  callback('fail')
  if (isInit) {
    tt.hideLoading()
    return
  }
  if (res && res.daata && res.data.code == 503 && res.data.msg == '用户身份验证失败') {
    callback('noAuth')
    return
  }
  tt.showToast({
    title: '网络错误，请稍后重试',
    icon: 'none'
  })
}

// 获取用户配置
export const getUserConfig = (callBack) => {
  userConfigGet().then(res => {
    tt.hideLoading()
    if (res.data.code !== 200) {
      callback('fail')
      return;
    }
    let resData = res.data.data
    getApp().globalData.userConfig = resData
    callBack('success')
  })
}
// 更新用户配置
export const updateUserConfig = (data, callBack) => {
  tt.showLoading()
  syncUserConfig(data).then(res => {
    if (res.data.code !== 200) {
      callback('fail')
      return;
    }
    getUserConfig(callBack)
  })
}

/**买票 */
export const payForTicket = (data, callback) => {
  tt.showLoading({
    title: '',
    mask: true
  })
  createOrder(data).then(res => {
    tt.hideLoading()
    if (res.data.code !== 200) {
      showNetWorkToast(res.data.msg)
      callback('fail')
      return;
    }
    showMeTheMoney(res.data.data, callback)
  })
}
export const showMeTheMoney = (data, callback) => {
  // debugger
  // reTryCount = 5 执行到这报错

  tt.requestPayment({
    timeStamp: data.timeStamp,
    nonceStr: data.nonceStr,
    package: data.package,
    signType: data.signType,
    paySign: data.paySign,
    success(res) {
      console.log('付款成功')
      // 成功后修改订单状态
      tt.showLoading({
        title: '更新中，请稍等...',
      })
      afterPayFunc(data.orderId, callback)
    },
    fail(res) {
      console.log(res)
      tt.showToast({
        duration: 3000,
        title: '支付失败',
        icon: 'error'
      })
      callback('fail')
    }
  })
}

export const afterPayFunc = (orderId, callback) => {
  // 更新后台信息 
  afterPay({
    orderId
  }).then(payRes => {
    if (payRes.data.code !== 200 && reTryCount > 0) {
      reTryCount++;
      afterPayFunc(orderId, callback)
      return
    }
    if (payRes.data.code !== 200 && reTryCount <= 0) {
      tt.hideLoading()
      tt.showModal({
        title: '网络错误',
        content: '请稍后尝试，可以去个人中心联系客服处理',
        showCancel: false
      })
      callback('fail')
      return
    }
    // 更新用户信息 
    autoLogin(() => {
      callback('success')
    })
  })
}