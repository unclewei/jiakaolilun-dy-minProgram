import xapi from "./xapi";
// const baseApi = 'https://biguo.fanstag.com/api'
// 测试服务器
const baseApi = 'http://test.fanstag.com/api'
// 正式服务器
// const baseApi = 'https://fanstag.com/api'
// const baseApi = 'http://127.0.0.1:3008/api'

export const login = (data) => {
  return xapi.request({
    url: `${baseApi}/user/loginNew`,
    method: 'post',
    data,
  })
}

//获取用户信息
export const getUserInfo = () => {
  return xapi.requestWithJwt({
    url: `${baseApi}/user/userInfo`
  })
}

// 更新用户信息
export const updateUserInfo = (userInfo) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/user/updateUserInfo`,
    method: 'post',
    data: userInfo
  })
}

// 获取基本信息
export const getBaseConfig = (data) => {
  return xapi.request({
    url: `${baseApi}/enume/baseConfig`,
    data
  })
}
/**
 * 获取枚举
 */
export const getEnumeMap = () => {
  return xapi.request({
    url: `${baseApi}/enume/enumeMap`,
  })
}
/**
 * 当前做题数据状态
 */
export const userSubjectGet = (data) => {
  return xapi.requestWithJwtNoToast({
    url: `${baseApi}/subject/userSubjectGet`,
    method: 'post',
    data
  })
}