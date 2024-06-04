import {userSubjectRemove} from './api'
/**
 * 清除内存/本地/云的用户做题记录
 * @param currentIndex
 */
export const clearUserSubjectData = ({
  poolId,
  userPoolId,
  isNoTips = false
}) => {
  if (!userPoolId && !poolId) return;
  let keyName = `localPoolStatus_${poolId || userPoolId}`;
  wx.removeStorageSync(keyName)
  userSubjectRemove({
    poolId,
    userPoolId
  }).then((res) => {
    if (!isNoTips) {
      wx.showModal({
        title:'已为你重置本次做题数据',
        content:'可重新做题',
      })
    }
  });
}