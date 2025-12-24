import xapi from "./xapi";
// const baseApi = 'https://biguo.fanstag.com/api'
// 测试服务器
// const baseApi = 'https://test.fanstag.com/api'
// 正式服务器
export const baseApi = 'https://ydt.biguojk.com/api'

export const login = (data) => {
  return xapi.request({
    url: `${baseApi}/user/miniProgramLogin`,
    // url: `${baseApi}/user/loginSubjectExam`, // old
    method: 'post',
    data,
  })
}
// 获取版本信息
export const getVersion = (data) => {
  return xapi.request({
    method: 'post',
    url: `${baseApi}/version/compareVersion`,
    data
  })
}

// 更新用户信息
export const updateUserInfo = (userInfo) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/user/userInfoEdit`,
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
    url: `${baseApi}/user/userInfoEdit`,
    data
  });
}
// 查询优惠券列表
export const getUserCouponList = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/userCoupon/userCouponList`,
    method: 'post',
    data,
  })
}

// 获取基本信息
export const getBaseConfig = (data) => {
  return xapi.request({
    url: `${baseApi}/enume/baseConfig`,
    data
  })
}
// 获取全部地域数据
export const getLocationData = () => {
  return xapi.request({
    url: `${baseApi}/enume/locationDataGet`,
    method: 'post',
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
    url: `${baseApi}/userSubject/theoryVipPriceInfo`,
  })
}
/**
 * 题目列表
 */
export const getUserSubjects = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/userSubject/getUserSubjects`,
    method: 'post',
    data
  })
}

/**
 * 题目列表
 */
export const subjectList = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/subject/subjectList`,
    method: 'post',
    data,
  })
}


/**
 * 获取题库详情数据
 */
export const poolData = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/pool/poolDetail`,
    method: 'post',
    data,
  })
}

/**
 * 当前做题数据状态
 */
export const userSubjectGet = (data) => {
  return xapi.requestWithJwtNoToast({
    url: `${baseApi}/userSubject/userSubjectGet`,
    method: 'post',
    data
  })
}

/**
 * 同步做题状态
 */
export const syncSubject = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/userSubject/syncSubject`,
    method: 'post',
    data
  })
}
/**
 * 同步做题状态到个人信息里
 */
export const subjectToUserPool = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/userPool/subjectToUserPool`,
    method: 'post',
    data
  })
}
/**
 * 同步做题状态到个人信息里
 */
export const userPoolShow = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/userPool/userPoolShow`,
    method: 'post',
    data
  })
}

/**
 * 移除用户错题
 */
export const userWrongSubjectRemove = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/userSubject/userWrongSubjectRemove`,
    method: 'post',
    data
  })
}
/**
 * 用户模拟题库信息
 */
export const getUserMoniPool = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/userSubject/getUserMoniPool`,
    method: 'post',
    data
  })
}

/**
 * 移除用户某题库做题状态
 */
export const userSubjectRemove = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/userSubject/userSubjectRemove`,
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
  return xapi.request({
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


/**
 * 用户做题配置
 */
export const userConfigGet = (data) => {
  return xapi.requestWithJwtNoToast({
    url: `${baseApi}/userConfig/userConfigGet`,
    method: 'post',
    data
  })
}
/**
 * 同步用户设置
 */
export const syncUserConfig = (data) => {
  return xapi.requestWithJwtNoToast({
    url: `${baseApi}/userConfig/syncUserConfig`,
    method: 'post',
    data
  })
}
/**
 * 用户做题状态
 */
export const userPoolList = (data) => {
  return xapi.requestWithJwtNoToast({
    url: `${baseApi}/userPool/userPoolList`,
    method: 'post',
    data
  })
}

/**
 * 题库数据
 */
export const poolList = (data) => {
  return xapi.requestWithJwtNoToast({
    url: `${baseApi}/pool/poolList`,
    method: 'post',
    data,
  })
}
/**
 * 评论
 */
export const commentList = (data) => {
  return xapi.requestWithJwtNoToast({
    url: `${baseApi}/comment/commentList`,
    method: 'get',
    data,
  })
}

/**
 * 评论
 */
export const likeSet = (data) => {
  return xapi.requestWithJwtNoToast({
    url: `${baseApi}/like/likeSet`,
    method: 'post',
    data,
  })
}
/**
 * 资源list
 */
export const frontResourceList = (data) => {
  return xapi.request({
    url: `${baseApi}/frontResource/frontResourceList`,
    method: 'post',
    data,
  })
}

/**
 * 科目评论获取
 * @param params
 * @returns {*}
 */
export const subjectCommentList = (data) => {
  return xapi.requestWithJwtNoToast({
    url: `${baseApi}/subjectComment/subjectCommentList`,
    method: 'post',
    data,
  })
}

/**
 * 地域下的顺序题
 * @param params
 * @returns {*}
 */
export const locationSequence = (data) => {
  return xapi.requestWithJwtNoToast({
    url: `${baseApi}/pool/locationSequence`,
    method: 'post',
    data,
  })
}

/**
 * 交通图标类型列表
 * @param params
 * @returns {*}
 */
export const ruleIconTypeList = (data) => {
  return xapi.requestWithJwtNoToast({
    url: `${baseApi}/ruleIconType/ruleIconTypeList`,
    method: 'post',
    data,
  })
}
/**
 * 交通图标类型列表
 * @param params
 * @returns {*}
 */
export const ruleIconList = (data) => {
  return xapi.requestWithJwtNoToast({
    url: `${baseApi}/ruleIcon/ruleIconList`,
    method: 'post',
    data,
  })
}
/**
 * 激活码激活
 * @param params
 * @returns {*}
 */
export const userAcCodeActive = (data) => {
  return xapi.requestWithJwtNoToast({
    url: `${baseApi}/userAcCode/userAcCodeActive`,
    method: 'post',
    data,
  })
}

/**
 * 通过ip自动获取地址
 * @param params
 * @returns {*}
 */
export const autoLocation = () => {
  return xapi.requestWithJwtNoToast({
    url: `${baseApi}/userConfig/autoLocation`,
    method: 'post',
  })
}

/**
 * 用户佣金
 * @param params
 * @returns {*}
 */
export const userAmountGet = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/userAmount/userAmountGet`,
    method: 'post',
    data
  })
}
/**
 * 提现记录查询
 * @param params
 * @returns {*}
 */
export const payOrderList = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/payOrder/payOrderList`,
    method: 'post',
    data
  })
}
/**
 * 用户发起提现
 * @param params
 * @returns {*}
 */
export const payOrderBegin = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/payOrder/payOrderBegin`,
    method: 'post',
    data
  })
}
/**
 * 返回教练推广成功的订单
 * @param params
 * @returns {*}
 */
export const promoteOrderList = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/order/promoteOrderList`,
    method: 'post',
    data
  })
}
/**
 * 用户关系人员返回
 * @param params
 * @returns {*}
 */
export const myPromoteList = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/user/myPromoteList`,
    method: 'post',
    data
  })
}