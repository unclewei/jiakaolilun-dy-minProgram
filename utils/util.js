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
 * 自动选择优惠券
 * @param {*} discountList 优惠券列表
 * @param {*} totalAmount 总价格
 * @returns
 */

export const autoChooseDisCount = (discountList, totalAmount) => {
  if (!discountList || !discountList.length) {
    // 没有优惠券
    return null;
  }
  // 获取在使用日期内的优惠券
  const nowDate = new Date().getTime() / 1000;
  const aliveDiscountList = discountList.filter(
    (item) => item.startDate < nowDate && item.endDate > nowDate
  );
  if (!aliveDiscountList.length) {
    return null;
  }
  // 获取该消费金额下，最大的优惠
  // 符合满减的优惠券
  const amoutMatchList = aliveDiscountList.filter(
    (item) => totalAmount >= item.amount
  );
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
