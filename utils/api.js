import xapi from "./xapi";
// const baseApi = 'https://biguo.fanstag.com/api'
// 测试服务器
// const baseApi = 'https://test.qianyimowan.com/api'
// 正式服务器
const baseApi = 'https://mowan.qianyimowan.com/api'
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
    data:userInfo
  })
}

// 获取基本信息
export const getBaseConfig = (data) => {
  return xapi.request({
    url: `${baseApi}/enume/baseConfig`,
    data
  })
}

// 获取用户等级userLevel
export const getUserLevel = () => {
  return xapi.requestWithJwt({
    url: `${baseApi}/user/userLevel`
  })
}
// 获取用户月度领取规则
export const getMonthRebateRule = () => {
  return xapi.requestWithJwt({
    url: `${baseApi}/enume/monthRebateRule`
  })
}
// 更新用户手机号
export const postUserPhoneNum = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/user/phoneVerify`,
    method: 'post',
    data
  })
}

// 用户升级
export const postUserLevelUp = () => {
  return xapi.requestWithJwt({
    url: `${baseApi}/user/userLevelUp`,
    method: 'post'
  })
}

// 用户签署协议
export const postUserSign = () => {
  return xapi.requestWithJwt({
    url: `${baseApi}/user/userSign`,
    method: 'post'
  })
}

//获取枚举
export const getEnumeMap = () => {
  return xapi.request({
    url: `${baseApi}/enume/enumeMap`
  })
}
//获取集市枚举
export const marketDefaultContentList = () => {
  return xapi.request({
    url: `${baseApi}/enume/marketDefaultContentList`
  })
}
//获取 VIP购买 枚举
export const getVIPEnumeMap = () => {
  return xapi.request({
    url: `${baseApi}/enume/vipTypeList`
  })
}
// 获取广告图列表
export const getBanner = () => {
  return xapi.request({
    url: `${baseApi}/resource/bannerGet`,
    method: 'post'
  })
}
//获取用户 票据
export const getUserTicketsReqs = () => {
  return xapi.requestWithJwt({
    url: `${baseApi}/userTicket/list`,
    method: 'post'
  })
}

// 超神值兑换超神明信片
export const exchangeGodlikeTicket = ({
  times = 1,
  ticketId,
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/userTicket/exchangeGodlikeTicket`,
    method: 'post',
    data: {
      times,
      ticketId,
    },
  })
}

//获取用户 个人积分情况
export const getUserScoreReqs = () => {
  return xapi.requestWithJwt({
    url: `${baseApi}/score/uerScore`,
    method: 'post'
  })
}

// 领取每日积分
export const getScoreDayDrop = () => {
  return xapi.requestWithJwt({
    url: `${baseApi}/score/scoreDayDrop`,
    method: 'post'
  })
}

// 领取上个月积分 : 每月消费返积分
export const scoreMonthDrop = () => {
  return xapi.requestWithJwt({
    url: `${baseApi}/score/scoreMonthDrop`,
    method: 'post'
  })
}


// 背包分解
export const scoreCreate = ({
  packIds,
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/score/scoreCreate`,
    method: 'post',
    data: {
      packIds,
    },
  })
}
//获取用户 个人积分情况
export const userMonthScoreRebateCount = () => {
  return xapi.requestWithJwt({
    url: `${baseApi}/score/userMonthScoreRebateCount`,
    method: 'post'
  })
}

//获取版本信息，（审核）
export const getVersion = () => {
  return xapi.request({
    url: `${baseApi}/version`
  })
}

// 获取我的订单历史
export const getMyOrder = (skip) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/order/getMyOrderList`,
    method: 'post',
    data: {
      state:'success',
      limit: 20, // 多少条
      skip // 跳过多少条
    },
  })
}

// 付款准备
export const prePay = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/order/orderCreate`,
    method: 'post',
    data
  })
}
// 付款成功后回调
export const afterPay = (orderId) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/order/afterPay`,
    method: 'post',
    data: {
      orderId
    }
  })
}


// 盒子列表
export const getBoxList = (data) => {
  return xapi.request({
    url: `${baseApi}/box/list`,
    method: 'POST',
    data: {
      state: 'online',
      ...data
    }
  })
}

//盒子详情
export const getBoxDetail = (data) => {
  return xapi.request({
    url: `${baseApi}/box/boxShow`,
    method: 'post',
    data,
  })
}

//盒子卡池
export const getCardsInBoxList = (data) => {
  return xapi.request({
    url: `${baseApi}/box/cardsInBoxList`,
    method: 'post',
    data,
  })
}



// 票据枚举
export const getTicketList = () => {
  return xapi.request({
    url: `${baseApi}/ticket/list`,
    method: 'post',
  })
}

// 获取标签 枚举列表
export const getTagList = () => {
  return xapi.request({
    url: `${baseApi}/tag/list`,
    method: 'post'
  })
}

// 抽赏
export const pickUpTimesReq = ({
  boxId,
  pickUpMethod, // 抽赏方式
  times // 连抽几次
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/box/pickUpTimes`,
    method: 'post',
    data: {
      boxId,
      pickUpMethod,
      times
    },
  })
}
// 我的抽赏-历史记录
export const myPickUpHistoryList = ({
  skip // 跳过多少条
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/shot/list`,
    method: 'post',
    data: {
      limit: 20, // 多少条
      skip // 跳过多少条
    },
  })
}

//盒子抽赏记录
export const getBoxRecordList = ({
  boxId,
  skip,
  limit = 20,
  isRare = false
}) => {
  return xapi.request({
    url: `${baseApi}/shot/boxList`,
    method: 'post',
    data: {
      boxId,
      isRare, // 是否稀有
      limit, // 多少条
      skip // 跳过多少条
    },
  })
}

//超神值兑换
export const cardExchange = ({
  boxSupplyId,
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/box/cardExchange`,
    method: 'post',
    data: {
      boxSupplyId,
    },
  })
}

//查询个人抽次最佳三条
export const getTopRecord = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/shot/getTopRecord`,
    method: 'post',
    data
  })
}

//盒子抽赏极值
export const getBoxRecordTop = ({
  boxId,
  skip,
  limit = 20,
  isRare
}) => {
  return xapi.request({
    url: `${baseApi}/shot/luckShotList`,
    method: 'post',
    data: {
      skip,
      boxId,
      isRare,
      limit, // 多少条
      days: 1
    },
  })
}

// 我的背包
export const myPackageList = ({
  skip,
  state,
  sortKey
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/pack/list`,
    method: 'post',
    data: {
      sortKey,
      skip,
      limit: 20, // 多少条
      state
    },
  })
}
// 锁定赏品
export const lockPackItem = ({
  packIds,
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/pack/packLocked`,
    method: 'post',
    data: {
      packIds,
      isLock: true
    },
  })
}
// 解锁赏品
export const unLockPackItem = ({
  packIds,
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/pack/packLocked`,
    method: 'post',
    data: {
      packIds,
      isLock: false
    },
  })
}

// -----------------------------------集市

// 获取集市列表
export const getMarketList = ({
  skip,
  state
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/market/list`,
    method: 'post',
    data: {
      state: state,
      skip: skip,
      limit: 20, // 多少条
    },
  })
}

// 获取集市详情
export const getMarketDetail = ({
  marketId
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/market/marketShow`,
    method: 'post',
    data: {
      marketId
    },
  })
}

// 某条集市下的所有offer详情
export const getMarketOfferList = ({
  marketId
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/market/marketOfferList`,
    method: 'post',
    data: {
      marketId
    },
  })
}


// 用户发布的集市列表
export const getUserPublicMarketList = ({
  skip,
  isJoined
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/market/userMarketList`,
    method: 'post',
    data: {
      isJoined,
      state: 'online',
      skip: skip,
      limit: 20, // 多少条
    },
  })
}

// 发布 集市
export const marketCreate = ({
  content, // 内容
  supplyArray // 发布物品
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/market/marketCreate`,
    method: 'post',
    data: {
      content,
      supplyArray
    },
  })
}

// 撤销发布
export const marketCancel = ({
  marketId
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/market/marketCancel`,
    method: 'post',
    data: {
      marketId
    },
  })
}

// 出价
export const marketOffer = ({
  marketId,
  offerContent,
  offerSupplyArray,
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/market/marketOffer`,
    method: 'post',
    data: {
      marketId,
      offerSupplyArray,
    },
  })
}


// 撤销 出价
export const marketOfferCancel = ({
  marketId
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/market/marketOfferCancel`,
    method: 'post',
    data: {
      marketId
    },
  })
}

// 成交
export const marketDue = ({
  marketId,
  offerUserId
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/market/marketDue`,
    method: 'post',
    data: {
      marketId,
      offerUserId
    },
  })
}

// 下单发货
export const logisticsCreate = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/pack/packSend`,
    method: 'post',
    data: {
      packIds: data.packIds,
      addressId: data.addressId,
      isCancel: false,
    },
  })
}

// 撤回发货
export const logisticsReset = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/pack/packSend`,
    method: 'post',
    data: {
      packIds: data.packIds,
      addressId: data.addressId,
      isCancel: true,
    },
  })
}

// 用户查询物流信息
export const getLogisticsList = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/logistics/list`,
    method: 'post',
    data: {
      packId: data.packId,
      state: data.state,
      skip: data.skip,
      limit: 20, // 多少条
    },
  })
}

// 微信物流轨迹
export const getWxLogisticsGetPath = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/logistics/wxLogisticsGetPath`,
    method: 'post',
    data: {
      logisticsId: data.logisticsId,
    },
  })
}
// 确认收货
export const logisticsSign = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/logistics/logisticsSign`,
    method: 'post',
    data: {
      logisticsId: data.logisticsId,
    },
  })
}



// 查询地址信息列表
export const getAddressList = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/address/list`,
    method: 'post',
    data,
  })
}

// 创建地址
export const createAdress = ({
  addressId,
  provinceName,
  cityName,
  countyName,
  detailInfo,
  phoneNum,
  name,
  postalCode,
  isDefault
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/address/create`,
    method: 'post',
    data: {
      addressId,
      provinceName,
      cityName,
      countyName,
      detailInfo,
      phoneNum,
      name,
      postalCode,
      isDefault
    },
  })
}

// 设为默认地址
export const setDefaultAdress = ({
  addressId,
  isDefault
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/address/defaultAddress`,
    method: 'post',
    data: {
      addressId,
      isDefault
    },
  })
}

// 获取通知
export const getInformList = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/inform/insideInformList`,
    method: 'post',
    data,
  })
}

// 已读通知
export const informRead = ({
  insideInformId
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/inform/insideInformRead`,
    method: 'post',
    data: {
      insideInformId
    },
  })
}

// 创建留言
export const commentCreate = ({
  linkId,
  content,
  linkAddress,
  type,
}) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/comment/commentCreate`,
    method: 'post',
    data: {
      linkId,
      content,
      linkAddress,
      type,
    },
  })
}

// 查询并且获取优惠券列表
export const offerCouponForUser = () => {
  return xapi.requestWithJwtNoToast({
    url: `${baseApi}/userCoupon/offerCouponForUser`,
    method: 'post',
  })
}

// 查询优惠券列表
export const getUserCouponList = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/userCoupon/userCouponList`,
    method: 'post',
    data,
  })
}

// 新春活动-用户个人进度查询
export const getUserProgressList = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/userProgress/userProgressList`,
    method: 'post',
    data,
  })
}

// 新春活动-消费满额换超神抽次
export const costExchangeGodlikeTicket = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/userProgress/costExchangeGodlikeTicket`,
    method: 'post',
    data,
  })
}

// 新春活动-保底次数兑换超神抽次
export const progressExchangeGodlikeTicket = (data) => {
  return xapi.requestWithJwt({
    url: `${baseApi}/userProgress/progressExchangeGodlikeTicket`,
    method: 'post',
    data,
  })
}

