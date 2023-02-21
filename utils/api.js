import xapi from "./xapi";
// const baseApi = 'https://biguo.fanstag.com/api'
// 测试服务器
// const baseApi = 'http://test.fanstag.com/api'
// 正式服务器
// const baseApi = 'https://fanstag.com/api'
const baseApi = 'http://127.0.0.1:3008/api'

export const login = (data) => {
  return xapi.request({
    url: `${baseApi}/user/loginSubjectExam`,
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
 * 题目列表
 */
export const theoryVipPriceInfo = () => {
  return xapi.requestWithJwt({
    url: `${baseApi}/subject/theoryVipPriceInfo`,
  })
}

/**
 * 题目列表
 */
export const subjectList = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/subject`,
    data,
  })
}

/**
 * 题库数据
 */
export const poolList = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/subject/poolList`,
    data,
  })
}
/**
 * 获取题库详情数据
 */
export const poolData = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/subject/poolDetail`,
    data,
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

/**
 * 同步做题状态
 */
export const syncSubject = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/subject/syncSubject`,
    method: 'post',
    data
  })
}

/**
 * 移除用户错题
 */
export const userWrongSubjectRemove = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/subject/userWrongSubjectRemove`,
    method: 'post',
    data
  })
}
/**
 * 用户模拟题库信息
 */
export const getUserMoniPool = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/subject/getUserMoniPool`,
    method: 'post',
    data
  })
}

/**
 * 移除用户某题库做题状态
 */
export const userSubjectRemove = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/subject/userSubjectRemove`,
    method: 'post',
    data
  })
}