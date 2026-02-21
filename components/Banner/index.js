import {
  frontResourceList,
} from '../../utils/api'

Component({
  /**
   * 组件的属性列表
   */
  properties: {},


  /**
   * 组件的初始数据
   */
  data: {
    urlPrefix: undefined,
    banners: []
  },

  ready: function () {
    this.getUrlPrefix()
    this.getFrontResourceList()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoInc() {
      if (!getApp().globalData.hasLogin) {
        this.selectComponent("#LoginModal").showModal()
        return
      }
      tt.navigateTo({
        url: `/pages/SubjectIncPage/index?step=${tt.getStorageSync('step') || '1'}`,
      })
    },
    getUrlPrefix() {
      const that = this;
      if (!getApp().globalData.enumeMap?.configMap?.urlPrefix) {
        setTimeout(() => {
          that.getUrlPrefix();
        }, 1000);
        return;
      }
      this.setData({
        urlPrefix: getApp().globalData.enumeMap?.configMap?.urlPrefix,
      });
    },
    getFrontResourceList() {
      frontResourceList().then(res => {
        if (res.data.code !== 200) {
          return
        }
        const resData = res.data.data
        getApp().globalData.ResourceList = resData
        const banners = resData?.find(p => p.type === 'ke1_topbanner')?.imageInfos?.map(p => p.path) || []
        this.setData({
          banners
        })
      })
    },
    /**  登录成功*/
    onLoginSuccess() { 
      this.setData({
        isLogin: true,
        userInfo: getApp().globalData.userInfo,
        isCoach: getApp().globalData.userInfo.userType === 2
      })
      this.poolDataGet({
        step: this.data.step
      })
    },
  },
});