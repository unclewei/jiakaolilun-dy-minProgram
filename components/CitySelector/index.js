import {
  syncUserConfig
} from "../../utils/api";

Component({
  /**
   * 组件的属性列表
   */
  properties: {},

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
      if (this.data.provinceId && this.data.cityId) {

        syncUserConfig({
          provinceId: this.data.provinceId,
          cityId: this.data.cityId,
        }).then(res => {
          this.triggerEvent('UserConfigUpdate', {
            provinceId: this.data.provinceId,
            cityId: this.data.cityId,
          })
        })
      }
      this.hideModal()
    },
  },
});