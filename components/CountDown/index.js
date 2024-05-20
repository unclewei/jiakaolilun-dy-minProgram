Component({
  /**
   * 组件的属性列表
   */
  properties: {
    discountPrice: {
      type: String,
      value: '',
    },
  },


  attached() {
    const that = this
    clearInterval(this.data.interval)
    this.data.interval = setInterval(() => {
      const times = that.countdownToMidnight()
      that.setData({
        ...times
      })
    }, 1000);
  },


  detached() {
    clearInterval(this.data.interval)
  },

  /**
   * 组件的初始数据
   */
  data: {
    interval: null,
    hours: '24',
    minutes: '00',
    seconds: '00'
  },

  ready: function () {},

  /**
   * 组件的方法列表
   */
  methods: {
    timeFormat(num) {
      return num < 10 ? '0' + num : num;
    },
    countdownToMidnight() {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const difference = tomorrow - now; // 差值是毫秒数
      // 将差值转换为时分秒
      const hours = Math.floor(difference / 3600000);
      const minutes = Math.floor((difference % 3600000) / 60000);
      const seconds = Math.floor((difference % 60000) / 1000);
      return {
        hours: this.timeFormat(hours),
        minutes: this.timeFormat(minutes),
        seconds: this.timeFormat(seconds)
      };
    }
  },
});