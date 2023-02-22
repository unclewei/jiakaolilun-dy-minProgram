// pages/SubjectQuestionPage/index.js

import {
  poolData,
  isItemValid,
  userSubjectGet,
  subjectList
} from '../../utils/api'

import {
  goBack,
  userSubjectConfigSetGet,
  timeCodeFormatted,
  showNetWorkToast,
  showToast
} from '../../utils/util'
import {
  autoLogin
} from "../../plugins/wxapi";


/***用户在本题库做题状态数据,用于同步到数据库***/
const userSubjectJson = {
  poolId: '',
  step: 0,
  currentIndex: 0,
  wrongSubjectIds: [],
  rightSubjectIds: [],
  type: '',
  isSubmit: false, //是否已交卷
  score: false, //分数
  date: 0,
  limitTime: 2700, //考试剩余时间,初始值45分钟，模拟题需要
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    step: '1', // 科目几
    poolType: '1', // 题库类型
    poolId: undefined, // 题库Id
    isSeeMode: false, // 答题模式 | 背题模式
    poolData: {}, // 题库数据
    subjectData: {}, // 题目数据
    currentIndex: 0, // 当前做到第几题
    loading: false,
    optionIndex: [], //选择的选项
    isSelected: false, //答题确定选择
    isNowWrong: false, //当前题目做错（做错时不会自动进入下一题）
    isTypeWrong: false, // 是否在做我的错题
    isWrongDelete: true, // 错题集的情况下，做对是否移除错题。
    userSubjectData: userSubjectJson, // 做题状态
    isCoach: getApp().globalData.userInfo && getApp().globalData.userInfo.userType === 2, // 是否教练
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('options', options);
    const {
      poolType,
      step,
      poolId,
      from
    } = options || {}
    //有poolId，或者有step及poolType即可请求题库题目数据。
    if ((!step || !poolType) && !poolId) {
      goBack()
      return
    };
    this.setData({
      poolType,
      step,
      poolId,
      from,
      userSubjectData: userSubjectJson, // 做题状态

    })
    //若当前为我的错题情况下
    if (poolType === 'myWrong') {
      wx.setNavigationBarTitle({
        title: `我的科目${step == 1 ? '一' : '四'}错题集合`,
      })
      //错题集的情况下，默认选中
      const userSubjectConfig = userSubjectConfigSetGet({
        isGet: true
      })
      const {
        isWrongDelete
      } = userSubjectConfig;
      this.setData({
        isWrongDelete: typeof isWrongDelete === 'boolean' ? isWrongDelete : true,
        isTypeWrong: true,
      })
    }

    //按顺序请求题库数据-个人做题状态-题库内题目数据
    this.getPoolData();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 获取题库数据
   * */
  getPoolData() {
    const that = this
    // 请求错题数据
    if (that.data.isTypeWrong) {
      that.userSubjectDataGet({
        poolData: {},
        poolId: undefined,
        poolType: that.data.poolType,
        step: that.data.step,
        isSyncSubject: false
      })
      return
    }
    wx.showLoading()
    // 获取问题数据
    poolData({
      poolType: that.data.poolType,
      poolId: that.data.poolId,
      step: that.data.step,
      isDetail: true
    }).then(res => {
      wx.hideLoading()
      if (res.data.code !== 200) {
        showNetWorkToast(res.data.msg)
        return
      }
      const resData = res.data.data;
      that.setData({
        poolData: resData,
        poolId: resData._id
      })
      // 验证用户是购买 或者数据是否免费
      isItemValid({
        step: resData.step
      }).then(validRes => {
        if (validRes.data.code !== 200) {
          showNetWorkToast(validRes.data.msg)
          return
        }
        if (validRes.data.data || resData.isForFree) {
          //获取用户做题状态
          that.userSubjectDataGet({
            poolData: resData,
            poolId: resData._id,
            poolType: resData.type,
            step: resData.step,
            isSyncSubject: false
          });
          return
        }
        wx.navigateTo({
          url: `/pages/SubjectIncPage/index?step=${that.data.step}`,
        })
      })
    })
  },

  /**
   * 获取用户做题状态
   * @param poolData
   * @param poolType
   * @param poolId
   * @param step
   * @param isSyncSubject 是否同步请求
   */
  userSubjectDataGet({
    poolData = {},
    poolType = undefined,
    poolId = undefined,
    step = undefined,
    isSyncSubject = false
  }) {
    const that = this
    let json = that.localUserSubjectStatusGet({
      poolId_: poolId,
      poolType_: poolType,
      step_: step,
      type: 'get'
    });
    wx.showLoading
    userSubjectGet({
      type: poolType,
      poolId,
      step
    }).then(res => {

      wx.hideLoading()
      if (res.data.code !== 200) {
        showNetWorkToast(res.data.msg)
        return
      }
      const resData = res.data.data;
      //错题集的情况下，直接使用默认值
      let useJson = json;
      if (resData && resData.date >= json.date) {
        //远程的新，用远程的，同时同步至本地
        useJson = resData;
      }
      that.localUserSubjectStatusGet({
        fullUserSubjectConfig: useJson,
        poolId_: poolId,
        poolType_: poolType,
        step_: step
      });
      if (!isSyncSubject) {
        //非同步后请求，则请求题库内的题目数据，如果是错题集，这里也拿到了错题的所有题目数据
        that.getSubjectData({
          currentIndex: useJson.currentIndex,
          poolId: poolId,
          poolType,
          limit: 100,
          skip: 0,
          loading: true,
          step
        });
      }
    })
  },

  /**
   * 获取或设置当前题库的本地信息
   * @param fullUserSubjectConfig
   * @param poolId_
   * @param poolType_
   * @param step_
   * @param propName
   * @param value
   * @param type
   */
  localUserSubjectStatusGet({
    fullUserSubjectConfig = undefined,
    poolId_ = undefined,
    poolType_ = '',
    step_ = 0,
    propName = '',
    value = 'undefined',
    type = 'get'
  }) {
    const that = this
    let _poolId = that.data.poolId || poolId_;
    let _step = that.data.step || step_;
    let _poolType = that.data.poolType || poolType_;
    let key = _poolId || `${_step}_${_poolType}`;
    let keyName = `localPoolStatus_${key}`;
    if (fullUserSubjectConfig) {
      wx.setStorageSync(keyName, fullUserSubjectConfig)
      this.setData({
        userSubjectData: fullUserSubjectConfig
      })
      return;
    }

    let userSubjectConfig = wx.getStorageSync(keyName) || {};
    //获取
    if (type === 'get') {
      if (userSubjectConfig.poolId) {
        return userSubjectConfig;
      }
      return userSubjectJson;
    }
    if (!propName) return;
    //是个新的
    if (!userSubjectConfig.poolId) {
      userSubjectConfig = userSubjectJson;
    }
    userSubjectConfig.date = timeCodeFormatted(new Date().getTime());
    userSubjectConfig.poolId = _poolId;
    userSubjectConfig[propName] = value;

    wx.setStorageSync(keyName, userSubjectConfig)
    this.setData({
      userSubjectData: userSubjectConfig
    })
  },

  /**
   * 获取题库中的题目数据
   * @param currentIndex  当前第几题,作为参数用于获取“更多”题目。因为题目不是一次性获取全部
   * @param refreshIndex  加载更多的时候
   * @param poolId    题库id
   * @param poolType  题库类型，某些题库没有id如错题集，只能通过类型+step查询
   * @param step      科目几
   * @param limit     请求多少数据
   * @param skip      跳过多少条数据
   * @param loading   是否需要显示加载中loading
   */
  getSubjectData({
    currentIndex = 0,
    poolId,
    poolType = undefined,
    step,
    limit,
    skip,
    loading = false,
    isLoadMore = false
  }) {
    const that = this
    const params = {
      limit,
      skip,
      step,
      poolId,
      poolType,
      currentIndex
    };
    subjectList(params).then((res) => {
      if (res.data.code !== 200) {
        showNetWorkToast(res.data.msg)
        return
      }
      const resData = res.data.data
      that.setData({
        subjectData: resData,
        currentIndex: that.data.isTypeWrong ? 0 : currentIndex,
      })
      if (!that.data.isTypeWrong && currentIndex !== 0 && !isLoadMore) {
        showToast(`上次做到第${currentIndex + 1}题`)
      }
    })
  },



  /**
   * 选择模式
   */
  setIsSeeMode(e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      isSeeMode: item === 'true'
    })
  },
  /**
   * 重置题库
   */
  onReset() {
    // 重新获取列表
  },

  // 选择问题答案
  onAnswerSelect() {},


  // 多选选择问题 确定
  onAnswerConfirm() {},

  // 错题模式 切换
  onWrongSwitchChange() {},

  // 考试提交
  onSubmit() {},

  // 考试提交
  setLocal() {},


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})