export const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join("/")} ${[
    hour,
    minute,
    second,
  ]
    .map(formatNumber)
    .join(":")}`;
};

/**
 * 根据_id去重
 * @param {} list
 */
export const dedupliById = (list) => {
  if (!list || !list.length) {
    return [];
  }
  const ids = list.map((p) => p._id);
  const dedupliIds = [...new Set(ids)];
  return dedupliIds.map((id) => list.find((p) => p._id === id));
};

export const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

export const showToast = (title) => {
  wx.showToast({
    title,
    icon: "none",
    duration: 3000,
  });
};
export const goBack = (str) => {
  wx.showModal({
    title: "",
    content: str || "网络错误，请稍后再试",
    showCancel: false,
    success: (res) => {
      wx.navigateBack();
    },
  });
};

export const showNetWorkToast = (word) => {
  let str = word || "网络拥挤，请稍后重试";
  wx.showToast({
    title: str,
    icon: "none",
  });
};

/**
 * 获取随机数
 * @param {*} start 最小值
 * @param {*} end 最大值
 */
export const getRandom = (start, end) => {
  const differ = end - start;
  const random = Math.random();
  return Math.round(start + differ * random);
};

/**
 * 获取理论用户操作配置
 * @param {*} param0 
 */
export const userSubjectConfigSetGet = ({
  key = undefined,
  value = undefined,
  isGet
}) => {
  if (isGet) {
    let obj = {};
    try {
      return wx.getStorageSync('userSubjectConfig') || {};
    } catch (e) {
      return obj;
    }
  } else {
    try {
      let userSubjectConfig = wx.getStorageSync('userSubjectConfig') || {};
      let obj = {};
      obj[key] = value;
      obj = Object.assign({}, userSubjectConfig, obj);
      wx.setStorageSync('userSubjectConfig', obj)
    } catch (e) {}
  }
};

export const countTime = (mss) => {
  const restSec = mss;
  // 剩余天数
  const day = parseInt(restSec / (60 * 60 * 24));
  // 剩余小时
  const hour = parseInt((restSec / (60 * 60)) % 24);
  // 剩余分钟
  const minu = parseInt((restSec / (60)) % 60);
  // 剩余秒数
  const sec = parseInt((restSec) % 60);
  return {
    day,
    hour,
    minu,
    sec
  };
};

/*url增加参数
 * @url url
 * @value 参数以及值
 * */

export const appendUrlPara = (url, params) => {
  if (typeof params !== 'object') return url;
  for (let i in params) {
    const param = `${i}=${params[i]}`;
    url += url.indexOf('?') !== -1 ? '&' : '?';
    url += param;
  }
  return url;
};

/**
 * 跳转去哪里学习
 * @param {*} param0 
 */
export const gotoSubject = ({
  poolType = undefined,
  step = undefined,
  poolId = undefined,
  userPoolId = undefined,
  isReplace = undefined
}) => {
  const poolDataObj = getApp().globalData.poolDataObj
  let params = {
    step: step,
    poolId: poolId || poolDataObj?.[poolType]?._id,
    userPoolId,
    poolType
  };
  console.log('params', params);
  let url = `/pages/SubjectQuestionPage/index`;

  switch (poolType) {
    case 'moni':
      url = '/pages/SubjectMoniPage/index';
      break;
    case 'special':
      url = '/pages/SubjectMiddlePage/index';
      break;
    case 'WCPage':
      url = '/pages/SubjectWCPage/index';
      break;
    case 'learnPlanPage':
      url = '/pages/LearnPlanPage/index';
      break;
    case 'incPage':
      url = '/pages/SubjectIncPage/index';
      break;
  }
  url = appendUrlPara(url, params);
  if (isReplace) {
    wx.redirectTo({
      url,
    })
    return;
  }
  wx.navigateTo({
    url,
  })
};
/*
   获取10位时间戳
 */
export const timeCodeFormatted = (time = new Date().getTime()) => {
  time = time.toString().substring(0, 10);
  return Number.parseInt(time);
};

/**
 * 删除对象中的undefined
 * @param {}} time 
 */
export const deleteEmptyObj = (obj = {}) => {
  const keys = Object.keys(obj)
  keys.forEach(key => {
    if (obj[key] === undefined) {
      delete obj[key]
    }
  })
  return obj
};


/*删除数组对象符合条件的对象
 *   @key 关键字 @keyValue关键字值 @dataList 数组对象
 * */
export const deleteArrObjMember = (key, keyValue, dataList) => {
  if (typeof dataList !== 'object') return dataList;
  for (let i = 0; i < dataList.length; i++) {
    if (dataList[i][key] === keyValue) {
      dataList.splice(i, 1);
      break;
    }
  }
  return dataList;
};

/*删除数组某个元素
 * */
export const deleteArrMember = (arr, member) => {
  if (typeof arr !== 'object') return arr;
  let index;
  if (arr.includes(member)) {
    index = arr.indexOf(member);
    arr.splice(index, 1);
  }
  return arr;
};

/*格式化浮点数，保留小数并四舍五入
 * @num 浮点数
 * @digit 位数,选填,默认为2
 * 不对NAN进行处理，方便报错。
 * Usage: floatNumFormatted(1)
 * Result 1.00
 * */

export const floatNumFormatted = (num, digit = 1) => {
  if (num % 1 === 0) return num; //整数直接返回
  return Number.parseFloat(num).toFixed(digit);
};


/**
 * 自动选择最佳优惠券
 * @param discountList  优惠券列表
 * @param totalAmount   单位元
 * @param payItem       购买的项
 * @returns {null|*}
 */
export const autoChooseDisCount = ({ discountList, totalAmount, payItem }) => {
  if (!discountList || !discountList.length || !totalAmount) {
      // 没有优惠券
      return null;
  }
  // 获取在使用日期内的优惠券
  const nowDate = new Date().getTime() / 1000;
  const aliveDiscountList = discountList.filter((item) => item.startDate < nowDate && item.endDate > nowDate);
  if (!aliveDiscountList.length) {
      return null;
  }
  // 获取该消费金额下，最大的优惠
  // 符合满减的优惠券
  const amoutMatchList = aliveDiscountList.filter((item) => {
      //有linkId的为专属
      if (item.linkId) {
          return totalAmount >= item.amount && payItem && item.linkId === payItem._id;
      }
      return totalAmount >= item.amount;
  });
  if (!amoutMatchList.length) {
      return null;
  }
  // 在价格符合的优惠券里面，找到最大金额的
  return amoutMatchList.reduce((finalItem, item) => {
      if (!finalItem) {
          return item;
      }
      return item.discountAmount > finalItem.discountAmount ? item : finalItem;
  }, null);
};


/*对象属性值-快速排序-降序
 * @arr 数组对象
 * @key 属性名
 * Usage: quickSortObjDesc([{a:2},{a:1},{a:3}],'a'))
 * Result:: [{"a":3},{"a":2},{"a":1}]
 * */
export const quickSortObjDesc = (arr, key) => {
  if (!arr.length) {
      return [];
  }
  let [pivot, ...rest] = arr;
  return [
      ...quickSortObjDesc(
          rest.filter((x) => x[key] > pivot[key]),
          key
      ),
      pivot,
      ...quickSortObjDesc(
          rest.filter((x) => x[key] <= pivot[key]),
          key
      ),
  ];
};