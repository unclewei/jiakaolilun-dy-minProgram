// components/SubjectAudio/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    subjectItem: {
      type: Object,
      value: {}
    }
  },


  observers: {
    "subjectItem": function (subjectItem) {
      this.setData({
        stepFolder: subjectItem.step == 1 ? 'audio/TitleAndOptions/one/' : 'audio/TitleAndOptions/four/',
        isReading: false,
      });
      // 停止播放音乐
      if (getApp().globalData.innerAudioContext) {
        getApp().globalData.innerAudioContext?.stop()
        getApp().globalData.innerAudioContext = null
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    stepFolder: undefined,
    urlPrefix: undefined,
    isReading: false
  },

  ready() {
    this.getUrlPrefix()
  },
  /**
   * 组件的方法列表
   */
  methods: {
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
    onPlayMusic() {
      if (!this.data.stepFolder || !this.data.urlPrefix || !this.data.subjectItem._id) {
        return
      }

      if (getApp().globalData.innerAudioContext) {
        getApp().globalData.innerAudioContext?.stop()
        getApp().globalData.innerAudioContext = null
      }
     
      const playId = this.data.urlPrefix + this.data.stepFolder  + this.data.subjectItem._id + '.mp3'
      const innerAudioContext = getApp().globalData.innerAudioContext || wx.createInnerAudioContext({
        useWebAudioImplement: true // 默认关闭。对于短音频、播放频繁的音频建议开启此选项
      })
      innerAudioContext.onEnded(() => {
        getApp().globalData.playId = null
        getApp().globalData.innerAudioContext = null
        this.setData({
          isReading: false
        })
      })
      getApp().globalData.innerAudioContext = innerAudioContext
      if (this.data.isReading) {
        // 停止
        innerAudioContext.pause()
        getApp().globalData.playId = null
        getApp().globalData.innerAudioContext = null
        this.setData({
          isReading: false
        })
        this.triggerEvent('Stop')
        return
      }
      innerAudioContext.stop()
      innerAudioContext.src = playId
      console.log('playId', playId);
      innerAudioContext.play()
      getApp().globalData.playId = playId
      this.setData({
        isReading: true
      })
      this.triggerEvent('Play')
    },

  }
})