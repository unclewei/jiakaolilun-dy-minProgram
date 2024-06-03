import {
  updateUserConfig
} from "../../plugins/wxapi";
import {
  showToast
} from "../../utils/util";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showLocationIcon: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    visible: false,
    hidding: false, // 关闭中，用于关闭动画
    recommendCityData: [],
    provinceData: [],
    cityData: []
  },

  ready: function () {
    this.init()
  },

  /**
   * 组件的方法列表
   */
  methods: {

    init() {
      const that = this;
      const userConfig = getApp().globalData.userConfig
      const locationData = getApp().globalData.locationData
      if (Object.keys(userConfig) == 0 || locationData.length === 0) {
        setTimeout(() => {
          that.init();
        }, 1000);
        return;
      }
      that.setData({
        userConfig,
        cityId: userConfig.cityId,
        myProvince: locationData.find(p => p.cityId === userConfig.cityId).provinceName,
      });
    },
    showModal() {
      if (!getApp().globalData.hasLogin) {
        this.selectComponent("#LoginModal").showModal()
        return
      }

      const userConfig = getApp().globalData.userConfig
      const locationData = getApp().globalData.locationData
      this.setData({
        visible: true,
        userConfig,
        provinceId: userConfig.provinceId,
        cityId: userConfig.cityId,
        myProvince: locationData.find(p => p.cityId === userConfig.cityId).provinceName,
        recommendCityData: locationData.filter(p => p.isRecommend),
        provinceData: locationData.filter(p => !p.cityId),
      })
      setTimeout(() => {
        this.getCityData()
      });
    },

    hideModal: function () {
      if (this.data.visible) {
        this.setData({
          hidding: true
        })
        setTimeout(() => {
          this.setData({
            visible: !this.data.visible,
            hidding: false
          })
        }, 100);
      }
    },


    getCityData() {
      if (!this.data.provinceId) {
        this.setData({
          cityData: []
        })
        return
      }
      const locationData = getApp().globalData.locationData
      this.setData({
        cityData: locationData.filter((i) => {
          return i.cityId && i.provinceId === this.data.provinceId;
        })
      })
    },

    onProvinceClick(e) {
      const item = e.currentTarget.dataset.item;
      this.setData({
        provinceId: item.provinceId,
      })
      setTimeout(() => {
        this.getCityData()
      });
    },

    onCityClick(e) {
      const item = e.currentTarget.dataset.item;
      this.setData({
        cityId: item.cityId,
      })
    },

    onConfirm() {
      const locationData = getApp().globalData.locationData
      const that = this
      wx.showLoading()
      if (that.data.provinceId && that.data.cityId) {
        updateUserConfig({
          provinceId: that.data.provinceId,
          cityId: that.data.cityId,
        }, (res) => {
          wx.hideLoading()
          if (res == 'fail') {
            showToast('网络错误，稍后再试')
            return
          }
          that.setData({
            myProvince: locationData.find(p => p.cityId === that.data.cityId).provinceName,
            userConfig: getApp().globalData.userConfig,
          })
          that.triggerEvent('UserConfigUpdate', {
            userConfig: getApp().globalData.userConfig,
            provinceId: that.data.provinceId,
            cityId: that.data.cityId,
          })
        })
      }
      that.hideModal()
    },

    /**  登录成功*/
    onLoginSuccess() {
      this.setData({
        isLogin: true,
        userInfo: getApp().globalData.userInfo,
        isCoach: getApp().globalData.userInfo.userType === 2
      })
    },
  },
});