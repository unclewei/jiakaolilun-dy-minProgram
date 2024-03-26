import MpProgress from "./progress.min.js";

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    config: {
      type: Object,
      value: {}
    },
    percentage: {
      type: Number,
      value: 0
    }
  },
  data: {
    customOptions: {
      canvasSize: {
        width: 750 / wx.getSystemInfoSync().windowWidth *140,
        height: 750 / wx.getSystemInfoSync().windowWidth * 140
      },
      percent: 100,
      barStyle: [{
        width: 10,
        fillStyle: '#f0f0f0'
      }, {
        width: 10,
        animate: true,
        fillStyle: [{
          position: 0,
          color: '#56B37F'
        }, {
          position: 1,
          color: '#c0e674'
        }]
      }],
      needDot: true,
      dotStyle: [{
        r: 10,
        fillStyle: '#ffffff',
        shadow: 'rgba(0,0,0,.15)'
      }, {
        r: 10,
        fillStyle: '#56B37F'
      }]

    },
    canvasId: `mp_progress_${new Date().getTime()}`
  },
  attached() {
    console.log('wx.getSystemInfoSync().windowWidth',wx.getSystemInfoSync().windowWidth);
    const customOptions = Object.assign({}, this.data.customOptions, this.data.config);
    this.setData({
      customOptions
    });
  },
  ready() {
    this._mpprogress = new MpProgress(Object.assign({}, this.data.customOptions, {
      canvasId: this.data.canvasId,
      target: this
    }));
    this._mpprogress.draw(this.data.percentage || 0);
  },
  observers: {
    'percentage': function (percentage) {
      if (this._mpprogress) {
        // 第一次进来的时候还没有初始化完成
        this._mpprogress.draw(percentage);
      }
    },
  }
});