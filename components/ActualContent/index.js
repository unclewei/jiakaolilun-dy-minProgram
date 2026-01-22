import {
  isItemValid,
  getUserMoniPool,
} from '../../utils/api'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    class: {
      type: String,
        value: ''
    },
    step: {
      type: String,
      value: '1'
    },
    poolId: {
      type: String,
      value: undefined
    },
    isLogin: {
      type: Boolean,
      value: false
    }

  },

  /**
   * 组件的初始数据
   */
  data: {},

  observers: {
    'step,isLogin': function (step, isLogin) {
      if (!isLogin) {
        return
      }
      this.poolDataGet({
        step
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getRandomNumberFromList(list) {
      if (list.length === 0) {
        return null; // 返回 null 或者其他默认值，表示列表为空
      }
      const randomIndex = Math.floor(Math.random() * list.length);
      return list[randomIndex];
    },

    /**
     * 请求做题的状态，以及下一个模拟题库
     */
    poolDataGet({
      step
    }) {
      const that = this
      if (!that.data.isLogin) {
        return
      }
      getUserMoniPool({
        step,
        examType: getApp().globalData.userConfig.examType,
      }).then((res) => {
        let {
          nextMoniPool,
          userMoniSubject
        } = res.data.data;
        const ueserPoolIds = userMoniSubject.map((p) => p._id);
        const validPoolId = nextMoniPool && nextMoniPool._id ? nextMoniPool._id : getRandomNumberFromList(ueserPoolIds)
        that.isItemValid({
          validPoolId
        });
      });
    },

    /**
     * 判断是否已购买此项
     * @param poolId
     */
    isItemValid({
      validPoolId
    }) {
      const that = this
      if (!validPoolId) {
        return;
      }
      isItemValid({
        poolId: validPoolId
      }).then((res) => {
        //已购买或者免费题库，则开始答题
        if (res.data.data) {
          // 不做任何处理
          that.setData({
            poolId: validPoolId
          })
          return;
        }
      });
    },

    onclick() {
      if (!getApp().globalData.hasLogin) {
        this.selectComponent("#LoginModal").showModal()
        return
      }
      if (!this.data.poolId) {
        wx.showModal({
          title: '模拟卷已做完',
          content: '请到模拟考试，下面点击【重做】',
          complete: (res) => {
            if (res.confirm) {
              wx.navigateTo({
                url: `/pages/SubjectMoniPage/index`,
              })
            }
          }
        })
        return
      }
      wx.navigateTo({
        url: `/pages/Exam/index?step=${this.data.step}&poolId=${this.data.poolId}`,
      })
    },
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

})