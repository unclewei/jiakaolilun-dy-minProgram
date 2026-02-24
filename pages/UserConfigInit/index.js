import {
  updateUserConfig
} from "../../plugins/wxapi"
import {
  autoLocation,
  updateUserInfo
} from "../../utils/api";
import {
  showToast,
  showNetWorkToast,
  timeCodeFormatted
} from "../../utils/util";

// pages/UserConfigInit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    examTypes: [{
        name: '小车',
        type: 'car',
        key: 'car',
        name2: 'C1/C2/C3',
        img: '../../images/car/car.png'
      },
      {
        name: '摩托',
        type: 'moto',
        key: 'moto',
        name2: 'D/E/F',
        img: '../../images/car/motorcycle.png',
        disabled: true
      },
      {
        name: '货车',
        type: 'goods',
        key: 'goodsTrain',
        name2: 'A2/B2/C6',
        img: '../../images/car/goodsTrain.png',
        disabled: true
      },
      // {
      //   name: '客车',
      //   type: 'bus',
      //   key: 'bus',
      //   name2: 'A1/A2/B1',
      //   img: '../../images/car/bus.png',
      //   disabled: true
      // },
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
    const userConfig = getApp().globalData.userConfig
    this.setData({
      fontSize: tt.getStorageSync('fontSize'),
      userConfig,
      step: tt.getStorageSync("step") || userConfig.step || 1,
      provinceId: userConfig.provinceId,
      cityId: userConfig.cityId,
      stepItem: this.data.subjectSteps[userConfig.step || 1],
      examType: tt.getStorageSync('examType') || userConfig.examType ? this.data.examTypes.find(p => p.key === userConfig.examType) : this.data.examTypes[0]
    })
    this.autoGetCity()
  },

  // 自动获取地区
  autoGetCity() {
    let now = timeCodeFormatted();
    let ipLocationData = tt.getStorageSync('ipLocationData');
    if (ipLocationData) {
      try {
        ipLocationData = JSON.parse(ipLocationData);
      } catch (e) {
        ipLocationData = {};
      }
      let cacheTime = ipLocationData?.cacheTime;
      if (cacheTime) {
        cacheTime = Number.parseInt(cacheTime);
        if (now - cacheTime < 86400) {
          console.log('命中缓存内，不重复请求ip，节省次数。')
          const data = this.selectComponent("#CitySelector").autoSetCityByIp();
          console.log('data', data)
          this.setData({
            ...data || {}
          })
          return; //命中缓存内，不重复请求ip，节省次数。
        }
      }
    }
    autoLocation().then(res => {
      try {
        let obj = {
          ...res?.data.data,
          cacheTime: now
        };
        let locationData = JSON.stringify(obj);
        tt.setStorageSync('ipLocationData', locationData)
        // 自动设置地区

        const data = this.selectComponent("#CitySelector").autoSetCityByIp();
        this.setData({
          ...data || {}
        })
      } catch (e) {}
    })
  },
  // 用户配置更新
  onUserConfigUpdate() {
    let that = this
    const userConfig = getApp().globalData.userConfig
    that.setData({
      provinceId: userConfig.provinceId,
      cityId: userConfig.cityId,
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
      examType: item
    })
  },
  onConfirm() {
    if (!this.data.examType || !this.data.stepItem || !this.data.examType.type || !this.data.stepItem.step) {
      props.dispatch(
        MessageAction.setMessage({
          msg1: `请选择学车类型以及学车阶段哦`,
          msg2: '选完马上就可以做题了~',
          isShow: true,
          type: 'success',
        })
      );
      tt.showModal({
        title: '请选择学车类型以及学车阶段哦',
        content: '选完马上就可以做题了',
      })
      return;
    }
    const initData = {
      isInit: true,
      step: this.data.stepItem.step,
      examType: this.data.examType.type,
      provinceId: this.data.provinceId,
      cityId: this.data.cityId,
    };
    tt.setStorageSync('step', this.data.stepItem.step)
    tt.setStorageSync('examType', this.data.examType.step)

    tt.getUserProfile({
      force:true,
      success: ({userInfo}) => {
        tt.showLoading({ title: "" });
        updateUserInfo(userInfo).then(res => {
          tt.hideLoading()
          if (res.data.code != 200) {
            showNetWorkToast(res.data.msg)
            return
          }
          const resData = res.data.data;
          getApp().globalData.userInfo = resData
          updateUserConfig(initData, (res) => {
            if (res == 'fail') {
              return
            }
            tt.switchTab({
              url: '/pages/index/index',
            })
          })
        })
      },
      fail: (res) => {
        console.log('获取用户信息失败',res);
        updateUserConfig(initData, (res) => {
          if (res == 'fail') {
            return
          }
          tt.switchTab({
            url: '/pages/index/index',
          })
        })
      },
    });
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