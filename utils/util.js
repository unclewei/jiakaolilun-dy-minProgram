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
export const userSubjectConfigSetGet = ({ key = undefined, value = undefined, isGet }) => {
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
  const day = parseInt(restSec / (60 * 60 * 24 ));
  // 剩余小时
  const hour = parseInt((restSec / (60 * 60 )) % 24);
  // 剩余分钟
  const minu = parseInt((restSec / (60 )) % 60);
  // 剩余秒数
  const sec = parseInt((restSec ) % 60);
  return { day, hour, minu, sec };
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
  from = undefined, //从哪里来的
  isReplace = undefined
}) => {
  let params = {};
  let url = `/pages/SubjectQuestionPage/index`;
  if (poolId) {
    params = {
      poolId
    };
  } else if (step && poolType) {
    params = {
      step,
      poolType
    };
    if (from) {
      params.from = from;
    }
    switch (poolType) {
      case 'moni':
        params.step = step;
        url = '/pages/SubjectMoniPage/index';
        break;
      case 'special':
        params.step = step;
        url = '/pages/SubjectMiddlePage/index';
        break;
      default:
        params.poolType = poolType;
    }
  } else {
    return;
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