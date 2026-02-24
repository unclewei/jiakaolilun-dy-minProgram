
const SHOW_AD_COUNT = 30
Component({

  properties: {
  },

  data: {
    logining: false,
  },
  ready(){
    this.ad = tt.createRewardedVideoAd({
      adUnitId: "8qg3v2m76geonqslrp",
    });
    // 监听错误
    this.ad.onError((err) => {
      tt.hideLoading();
      console.log('激励视频错误 err',err)
      switch (err.errCode) {
        case 1004:
          tt.setStorageSync('answerQuestionCount', 1);
          this.hideModal()
          // 无合适的广告
          break;
        default:
        // 更多请参考错误码文档
      }
    });
    // 监听视频播放完成
    const closeHandler = (data) => {
      console.log('激励视频完成回调 err',data)
      tt.hideLoading();
      if (data.isEnded) {
        tt.setStorageSync('answerQuestionCount', 1);
        this.hideModal()
        console.log("观看了", data.count, "个视频");
      } else {
        console.log("未观看完视频");
      }
    };
    this.ad.onClose(closeHandler);
    // do other thing
    // 卸载 close 事件监听
    // this.ad.offClose(closeHandler);
    // 预加载资源
    this.ad.load();

    this.checkAdStatus()
  },

  methods: {

    hideModal: function () {
      this.selectComponent("#baseModal").hideModal()
    },
    showModal: function () {
      this.selectComponent("#baseModal").showModal()
    },
    checkAdStatus:function(){
      const answerQuestionCount = tt.getStorageSync('answerQuestionCount');
      if(!answerQuestionCount){
        tt.setStorageSync('answerQuestionCount', 1);
        return
      }
      // 触发激励广告
      if(answerQuestionCount >= SHOW_AD_COUNT){
        this.ad.show()
        setTimeout(() => {
          this.showModal()
        }, 1000 * 2);
        return
      }
      tt.setStorageSync('answerQuestionCount', answerQuestionCount + 1);

    },

    showAd(){
      this.ad.show()
    },
     
  }
})