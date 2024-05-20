import {
  provinceList
} from './config';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    VipList: {
      type: Array,
      value: [],
    },
  },

  observers: {
    "VipList": function (VipList) {
      if (!VipList.length) {
        return
      }
      let vipFinNameList = VipList.map((p) => p.name)
      if (vipFinNameList?.[0]) {
        vipFinNameList = [...vipFinNameList, vipFinNameList[0]]
      }
      console.log('vipFinNameList',vipFinNameList);
      clearInterval(this.data.interval)
      this.data.interval = setInterval(() => {
        const provinceLength = provinceList.length;
        const vipLength = vipFinNameList.length;
        const provinceIndex = this.getInterger(0, provinceLength - 1);
        const VipIndex = this.getInterger(0, vipLength - 1);
        this.setData({
          danmuList: `${provinceList[provinceIndex]}`,
          vipName: vipFinNameList[VipIndex]
        })
      }, 2000);
    },
  },
  detached() {
    clearInterval(this.data.interval)

  },

  /**
   * 组件的初始数据
   */
  data: {
    interval: null,
    isLike: false,
    num: 0,
  },

  ready: function () {},

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     *
     * @param start
     * @param end
     * @description 获取某个区间整数
     */
    getInterger(start, end) {
      return Math.abs(Math.floor(Number(start) + (Number(end) - Number(start)) * Math.random()));
    },
  },
});