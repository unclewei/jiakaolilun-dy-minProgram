import {
  updateUserConfig
} from "../../plugins/wxapi"

// pages/UserConfigInit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carTypes: [{
        name: '小车',
        type: 'car',
        key: 'car',
        name2: 'C1/C2/C3',
        img: '../../images/car/car.png'
      },
      {
        name: '货车',
        type: 'car',
        key: 'goodsTrain',
        name2: 'A2/B2/C6',
        img: '../../images/car/goodsTrain.png',
        disabled: true
      },
      {
        name: '客车',
        type: 'car',
        key: 'bus',
        name2: 'A1/A2/B1',
        img: '../../images/car/bus.png',
        disabled: true
      },
      {
        name: '摩托',
        type: 'car',
        key: 'motorcycle',
        name2: 'D/E/F',
        img: '../../images/car/motorcycle.png',
        disabled: true
      },
    ],
    subjectSteps: [{
        name: '未报名',
        step: 1,
        key: 0
      },
      {
        name: '科目一',
        step: 1,
        key: 1
      },
      {
        name: '科目二',
        step: 4,
        key: 2
      },
      {
        name: '科目三',
        step: 4,
        key: 3
      },
      {
        name: '科目四',
        step: 4,
        key: 4
      },
      {
        name: '满分学习(扣满12分，再教育)',
        step: 4,
        key: 6
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userConfig: getApp().globalData.userConfig,
      step: getApp().globalData.userConfig.step || 1,
      stepItem: this.data.subjectSteps[getApp().globalData.userConfig.step || 1],
      carItem: this.data.carTypes[0]
    })
  },
  
  onStepChange(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      stepItem: item
    })
  },
  onCardTypeChange(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      carItem: item
    })
  },
  onConfirm() {
    if (!this.data.carItem || !this.data.stepItem || !this.data.carItem.type || !this.data.stepItem.step) {
      props.dispatch(
        MessageAction.setMessage({
          msg1: `请选择学车类型以及学车阶段哦`,
          msg2: '选完马上就可以做题了~',
          isShow: true,
          type: 'success',
        })
      );
      wx.showModal({
        title: '请选择学车类型以及学车阶段哦',
        content: '选完马上就可以做题了',
      })
      return;
    }
    const initData = {
      isInit: true,
      step: this.data.stepItem.step,
      carType: this.data.carItem.type,
    };
    updateUserConfig(initData, (res) => {
      if (res == 'fail') {
        return
      }
      wx.switchTab({
        url: '/pages/index/index',
      })
    })
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
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})