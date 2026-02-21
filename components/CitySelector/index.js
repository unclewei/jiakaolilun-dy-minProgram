import {
  updateUserConfig
} from "../../plugins/wxapi";
import {
  showToast,
  debounce
} from "../../utils/util";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showLocationIcon: {
      type: Boolean,
      value: false,
    },
    isShowPoolInfo: {
      type: Boolean,
      value: true,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isSearch: false, // 是否搜索模式
    searchCityList: [], // 城市列表（搜索使用）
    searchText: null,
    searchCityOriginList: [], // 城市列表（搜索使用）
    visible: false,
    hidding: false, // 关闭中，用于关闭动画
    recommendCityData: [],
    provinceData: [],
    cityData: [],
    subjectLocationTick: 0,
  },

  ready: function () {
    this.init();
  },
  pageLifetimes: {
    show() {
      this.init();
    },
    hide() {
      console.log('组件所在的页面隐藏了');
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    getOutsideName(cityId) {
      const locationData = getApp().globalData.locationData;
      const cityItem = locationData.find(
        (p) => p.cityId === cityId
      )
      if (cityItem.cityName === '市辖区') {
        return cityItem.provinceName
      }
      // if (cityItem.cityName.length + cityItem.provinceName.length > 7) {
      //   return cityItem.cityName
      // }
      return `${cityItem.cityName}`
    },
    init() {
      const that = this;
      const userConfig = getApp().globalData.userConfig;
      const locationData = getApp().globalData.locationData;
      const searchCityList = locationData?.filter(p => p.cityId)?.map(p => p.cityName === '市辖区' ? ({
        ...p,
        cityName: p.provinceName
      }) : p)

      if (Object.keys(userConfig) == 0 || locationData.length === 0) {
        setTimeout(() => {
          that.init();
        }, 1000);
        return;
      }
      that.setData({
        userConfig,
        cityId: userConfig.cityId,
        locationData,
        searchCityList,
        searchCityOriginList: searchCityList,
        myProvince: that.getOutsideName(userConfig.cityId)
      });
    },
    showModal() {
      if (!getApp().globalData.hasLogin) {
        this.selectComponent("#LoginModal").showModal();
        return;
      }

      const userConfig = getApp().globalData.userConfig;
      const locationData = getApp().globalData.locationData;
      this.setData({
        visible: true,
        userConfig,
        provinceId: userConfig.provinceId,
        cityId: userConfig.cityId,
        locationData,
        myProvince: this.getOutsideName(userConfig.cityId),
        recommendCityData: locationData.filter((p) => p.isRecommend),
        provinceData: locationData.filter((p) => !p.cityId),
      });
      if (!userConfig.cityId) {
        this.setDataByIp()
      }
      setTimeout(() => {
        this.getCityData();
      });
    },



    hideModal: function () {
      if (this.data.visible) {
        this.setData({
          hidding: true,
        });
        setTimeout(() => {
          this.setData({
            visible: !this.data.visible,
            hidding: false,
            isSearch: false, // 是否搜索模式
            searchCityList: this.data.searchCityOriginList, // 城市列表（搜索使用）
            searchText: null,
          });
        }, 100);
      }
    },

    /** 对外暴露的自动设置地区 */
    autoSetCityByIp() {
      const userConfig = getApp().globalData.userConfig;
      if (userConfig.provinceId || userConfig.cityId) {
        return
      }
      const locationData = getApp().globalData.locationData;
      this.setData({
        userConfig,
        provinceId: userConfig.provinceId,
        cityId: userConfig.cityId,
        locationData,
        myProvince: this.getOutsideName(userConfig.cityId),
        recommendCityData: locationData.filter((p) => p.isRecommend),
        provinceData: locationData.filter((p) => !p.cityId),
      });


      const {
        cityId,
        provinceId
      } = this.setDataByIp()
      if (cityId) {
        this.setData({
          myProvince: this.getOutsideName(cityId),
          userConfig: {
            ...this.data.userConfig || {},
            cityId,
            provinceId,
          }
        })
        return {
          cityId,
          provinceId
        }
      }
    },

    // 通过ip的信息自动设置城市
    setDataByIp() {
      const ipLocationDataStr = tt.getStorageSync('ipLocationData')
      const locationData = getApp().globalData.locationData;
      try {
        const ipLocationData = JSON.parse(ipLocationDataStr)
        if (!ipLocationData || !ipLocationData?.cityName) {
          return {}
        }
        const {
          cityName
        } = ipLocationData
        let matchItem;
        for (let i of locationData) {
          let mapCityName = i.cityName;
          if (i.cityName === '市辖区') {
            mapCityName = i.provinceName;
          }
          if (mapCityName === cityName) {
            matchItem = i;
            break;
          }
        }
        if (matchItem) {
          this.setData({
            provinceId: matchItem.provinceId,
            cityId: matchItem.cityId,

          })
          tt.showToast({
            title: '已自动定位地区',
            icon: 'none',
            duration: 1000 * 2
          })
          return {
            provinceId: matchItem.provinceId,
            cityId: matchItem.cityId,
          }
        }
      } catch (error) {
        return {}
      }
    },

    getCityData() {
      if (!this.data.provinceId) {
        this.setData({
          cityData: [],
        });
        return;
      }
      const locationData = getApp().globalData.locationData;
      this.setData({
        cityData: locationData.filter((i) => {
          return i.cityId && i.provinceId === this.data.provinceId;
        }),
      });
    },

    onProvinceClick(e) {
      const item = e.currentTarget.dataset.item;
      this.setData({
        provinceId: item.provinceId,
      });
      setTimeout(() => {
        this.getCityData();
      });
    },

    onCityClick(e) {
      const item = e.currentTarget.dataset.item;
      this.setData({
        cityId: item.cityId,
      });
    },

    onConfirm() {
      const that = this;
      tt.showLoading();
      if (that.data.provinceId && that.data.cityId) {
        updateUserConfig({
            provinceId: that.data.provinceId,
            cityId: that.data.cityId,
          },
          (res) => {
            tt.hideLoading();
            if (res == "fail") {
              showToast("网络错误，稍后再试");
              return;
            }
            that.setData({
              myProvince: that.getOutsideName(that.data.cityId),
              userConfig: getApp().globalData.userConfig,
            });
            if (this.data.isShowPoolInfo) {
              this.setData({
                subjectLocationTick: this.data.subjectLocationTick + 1,
              });
              this.selectComponent("#SubjectLocationInfo").showModal();
            }
            that.triggerEvent("UserConfigUpdate", {
              userConfig: getApp().globalData.userConfig,
              provinceId: that.data.provinceId,
              cityId: that.data.cityId,
            });
          }
        );
      }
      that.hideModal();
    },

    /**  登录成功*/
    onLoginSuccess() { 
      this.setData({
        isLogin: true,
        userInfo: getApp().globalData.userInfo,
        isCoach: getApp().globalData.userInfo.userType === 2,
      });
    },
    // 开启搜索
    starSearch() {
      if (this.data.isSearch) {
        return
      }
      this.setData({
        isSearch: true
      })
    },
    // 关闭搜索
    endSearch() {
      if (!this.data.isSearch) {
        return
      }
      this.setData({
        isSearch: false
      })
    },
    onSearchInput(e) {
      const word = e.detail.value
      let that = this
      const {
        searchCityOriginList
      } = that.data
      this.setData({
        searchText: word,
        searchCityList: searchCityOriginList?.filter(p => p?.cityName?.includes(word)),
      })
    },
    cleanSearchText() {
      this.setData({
        searchText: null,
        searchCityList: this.data.searchCityOriginList
      })
    },
    onCityExactClick(e) {
      const item = e.currentTarget.dataset.item;
      const {
        provinceId,
        cityId
      } = item
      if (!provinceId || !cityId) {
        showToast("城市信息错误，稍后再试");
        return
      }
      const locationData = getApp().globalData.locationData;
      const that = this;
      tt.showLoading();
      updateUserConfig({
          provinceId,
          cityId,
        },
        (res) => {
          tt.hideLoading();
          if (res == "fail") {
            showToast("网络错误，稍后再试");
            return;
          }
          that.setData({
            myProvince: that.getOutsideName(cityId),
            userConfig: getApp().globalData.userConfig,
          });
          if (this.data.isShowPoolInfo) {
            this.setData({
              subjectLocationTick: this.data.subjectLocationTick + 1,
            });
            this.selectComponent("#SubjectLocationInfo").showModal();
          }
          that.triggerEvent("UserConfigUpdate", {
            userConfig: getApp().globalData.userConfig,
            provinceId: provinceId,
            cityId: cityId,
          });
        }
      );
      that.hideModal();
    }
  },
});