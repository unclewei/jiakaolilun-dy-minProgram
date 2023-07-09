import xapi from "./xapi";
// const baseApi = 'https://biguo.fanstag.com/api'
// 测试服务器
// const baseApi = 'https://test.fanstag.com/api'
// 正式服务器
// const baseApi = 'https://fanstag.com/api'
const baseApi = 'http://127.0.0.1:3008/api'

export const login = (data) => {
  return xapi.request({
    url: `${baseApi}/user/miniProgramLogin`,
    // url: `${baseApi}/user/loginSubjectExam`, // old
    method: 'post',
    data,
  })
}

//获取用户信息
export const userInfo = () => {
  return xapi.requestWithJwt({
    url: `${baseApi}/userInfo`
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


/**
 *  更新姓名和电话号码
 * @returns {*}
 */
export const coachPhoneNum = (data) => {
  return xapi.requestWithJwt({
    method: 'post',
    url: `${baseApi}/user/coachPhoneNum`,
    data
  });
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


/** ------------------ item --------------------- */

/**
 * 科目的权益list
 * @returns {*}
 */
export const subjectItemList = (data) => {
  return xapi.requestWithJwt({
    method: 'post',
    url: `${baseApi}/item/subjectItemList`,
    data
  });
}
/**
 * 科目的权益list
 * @returns {*}
 */
export const isItemValid = (data) => {
  return xapi.requestWithJwt({
    method: 'post',
    url: `${baseApi}/item/isItemValid`,
    data
  });
}
/**
 * 用户已购买的权益
 * @returns {*}
 */
export const paidItemList = (data) => {
  return xapi.requestWithJwt({
    method: 'post',
    url: `${baseApi}/item/paidItemList`,
    data
  });
}


/** ------------------ order --------------------- */

/**
 * 创建订单
 * @returns {*}
 */
export const createOrder = (data) => {
  return xapi.requestWithJwt({
    method: 'post',
    url: `${baseApi}/order/orderCreate`,
    data
  });
}
/**
 * 成功支付后
 */

export const afterPay = (data) => {
  return xapi.requestWithJwt({
    method: 'post',
    url: `${baseApi}/order/afterPay`,
    data
  });
}