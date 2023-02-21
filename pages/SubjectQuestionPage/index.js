// pages/SubjectQuestionPage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poolType: '1',
    poolId: '',
    isSeeMode: false, // 答题模式 | 背题模式
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 选择模式
   */
  setIsSeeMode(e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      isSeeMode: item === 'true'
    })
  },
  /**
   * 重置题库
   */
  onReset() {
    // 重新获取列表
  },

  // 选择问题答案
  onAnswerSelect() {},


  // 多选选择问题 确定
  onAnswerConfirm() {},

  // 错题模式 切换
  onWrongSwitchChange() {},

  // 考试提交
  onSubmit() {},

  // 考试提交
  setLocal() {},


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})