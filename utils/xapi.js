import {
  Promise
} from "../plugins/es6-promise";
import {
  deleteEmptyObj
} from './util'
const xapi = {
  Promise
}
const apinames = ['checkSession', 'request'];

apinames.forEach(fnname => {
  xapi[fnname] = (obj = {}) => {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }
      obj.fail = function (err) {
        reject(err)
      }

      if (!obj.header) {
        obj.header = {}
      }
      obj.header['entry'] = `jkjx_xcx`
      wx[fnname](obj)
    })
  }
})
// 带sid的请求方法
xapi['requestWithJwt'] = (obj = {}) => {
  return new Promise((resolve, reject) => {
    reqFunc(obj, resolve, reject);
  })
}

// 带sid的请求方法
xapi['requestWithJwtNoToast'] = (obj = {}) => {
  const cookies = getApp().globalData.cookies;
  if (!cookies) {
    return new Promise((resolve) => resolve())
  }
  return new Promise((resolve, reject) => {
    reqFunc(obj, resolve, reject);
  })
}

function reqFunc(obj, resolve, reject) {
  const cookies = getApp().globalData.cookies;
  if (!cookies) {
    wx.showToast({
      duration: 3000,
      title: '请先登录',
      icon: 'fail'
    })
    return
  }
  if (!obj.header) {
    obj.header = {}
  }
  // 清除请求中的undefined
  obj.data = deleteEmptyObj(obj.data || {})
  obj.header['Authorization'] = `Bearer ${cookies || ""}`
  obj.header['entry'] = `jkjx_xcx`
  obj.success = function (res) {
    resolve(res)
  }
  obj.fail = function (err) {
    //登录过期处理
    reject(err)
  }
  wx['request'](obj)
}



export default xapi;