// pages/SubjectQuestionPage/index.js

import {
  poolData,
  isItemValid,
  userSubjectGet,
  subjectList,
  userWrongSubjectRemove,
  syncSubject,
  subjectToUserPool
} from '../../utils/api'

import {
  goBack,
  userSubjectConfigSetGet,
  timeCodeFormatted,
  showNetWorkToast,
  showToast,
  deleteArrObjMember,
  deleteArrMember
} from '../../utils/util'
import {
  autoLogin
} from "../../plugins/wxapi";


/***用户在本题库做题状态数据,用于同步到数据库***/
const userSubjectJson = {
  poolId: '',
  step: 0,
  currentIndex: 0,
  wrongSubjectItems: [],
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
    poolType: '', // 题库类型
    poolId: undefined, // 题库Id
    isItemValid: false, // 题库购买状态
    isForFree: false, // 是否免费
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
    isCoach: getApp().globalData.userInfo && getApp().globalData.userInfo.userType == 2, // 是否教练
    rightHistory: false, // 正确历史;
    wrongHistory: {}, // 错误历史
    requestPoolObj: {}, // 请求的数据池子对象


    swiperDuration: "250",
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
      swiperHeight: wx.getSystemInfoSync().windowHeight,
      userSubjectData: userSubjectJson, // 做题状态
      urlPrefix: getApp().globalData.enumeMap.configMap.urlPrefix,
      stepFolder: step == 1 ? 'subject/one/' : 'subject/four/',
      requestPoolObj: { // 请求的数据池子对象
        poolId: poolType === 'wrong' ? undefined : poolId,
        userPoolId: poolType === 'wrong' ? poolId : undefined
      }
    })
    //若当前为我的错题情况下
    if (poolType == 'wrong') {
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
        isWrongDelete: typeof isWrongDelete == 'boolean' ? isWrongDelete : true,
        isTypeWrong: true,
      })
    }

    //按顺序请求题库数据-个人做题状态-题库内题目数据
    this.getPoolData();
  },
  onShow() {
    this.setData({
      userInfo: getApp().globalData.userInfo,
      isCoach: getApp().globalData.userInfo && getApp().globalData.userInfo.userType == 2,
    })
  },
  //购买成功
  onBuySuccess() {
    wx.showLoading()
    this.getPoolData();
  },

  /**
   * 获取题库数据
   * */
  getPoolData() {
    const that = this
    // 请求错题数据
    if (that.data.isTypeWrong) {
      that.userSubjectDataGet({
        isSyncSubject: false
      })
      return
    }
    // wx.showLoading()
    // 获取问题数据
    poolData({
      poolType: that.data.poolType,
      step: that.data.step,
      isDetail: true,
      ...that.data.requestPoolObj
    }).then(res => {
      wx.hideLoading()
      if (res.data.code !== 200) {
        showNetWorkToast(res.data.msg)
        return
      }
      const resData = res.data.data;
      that.setData({
        poolData: resData,
      })
      // 验证用户是购买 或者数据是否免费
      isItemValid({
        step: resData.step,
        poolId: resData._id,
      }).then(validRes => {
        if (validRes.data.code !== 200) {
          showNetWorkToast(validRes.data.msg)
          return
        }
        this.setData({
          isItemValid: validRes.data.data,
          isForFree: resData.isForFree
        })
        if (validRes.data.data || resData.isForFree) {
          //获取用户做题状态
          that.userSubjectDataGet({
            isSyncSubject: false
          });
          return
        }
        wx.redirectTo({
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
    isSyncSubject = false
  }) {
    const that = this
    const poolType = that.data.poolType
    const poolId = that.data.poolId
    const step = that.data.step

    let json = that.localUserSubjectStatusGet({
      poolId_: poolId,
      poolType_: poolType,
      step_: step,
      type: 'get'
    });
    // wx.showLoading()
    userSubjectGet({
      type: poolType,
      ...that.data.requestPoolObj,
      step
    }).then(res => {
      wx.hideLoading()
      if (res.data.code !== 200) {
        showNetWorkToast(res.data.msg)
        return
      }
      const resData = res.data.data;
      let useJson = json;
      if (resData && resData.date >= json.date) {
        //远程的新，用远程的，同时同步至本地
        useJson = resData;
      }
      //错题集的情况下，直接使用默认值
      if (that.data.isTypeWrong) {
        useJson = json;
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
          limit: 100,
          skip: 0,

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
    if (type == 'get') {
      if (userSubjectConfig.poolId) {
        return userSubjectConfig;
      }
      return userSubjectJson;
    }
    if (!propName) return;
    //是个新的
    if (!userSubjectConfig.poolId) {
      userSubjectConfig = {
        ...userSubjectJson
      };
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
    isLoadMore = false
  }) {
    const that = this
    const params = {
      currentIndex,
      ...that.data.requestPoolObj
    };
    subjectList(params).then((res) => {
      if (res.data.code !== 200) {
        showNetWorkToast(res.data.msg)
        return
      }
      const resData = res.data.data
      const finalCurrentIndex = that.data.isTypeWroonAnswerSelectng ? 0 : currentIndex
      that.setData({
        subjectData: resData,
        currentIndex: finalCurrentIndex,
      })
      const nowItem = resData.find(p => p.currentIndex === finalCurrentIndex)
      that.useToDoWrong(nowItem)
      that.useToDoRight(nowItem)
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
      isSeeMode: item == 'true'
    })
  },

  /**
   * 同步做题状态，并返回最新做题状态
   * 如果是错题，还需要增加来源
   */
  syncSubject({
    subjectId,
    callback = () => {}
  }) {
    let json = this.localUserSubjectStatusGet({
      type: 'get'
    });
    let obj = {};
    if (subjectId) {
      obj.subjectId = subjectId
    }
    console.log('json', json);
    let params = Object.assign({}, json, {
      userSubjectId: json._id,
      subjectId,
    });
    syncSubject(params).then((res) => {
      this.userSubjectDataGet({
        isSyncSubject: true
      });
      callback()
    });
    subjectToUserPool({
      subjectId,
      type: "wrong"
    })
  },
  /**
   * 交卷
   * @param score 分数
   */
  onSubmit(e) {
    const score = e.detail.score
    this.localUserSubjectStatusGet({
      type: 'set',
      propName: 'isSubmit',
      value: true
    });
    this.localUserSubjectStatusGet({
      type: 'set',
      propName: 'score',
      value: score
    });
    this.syncSubject({
      subjectId: undefined,
      callback: () => {
        wx.redirectTo({
          url: `/pages/SubjectMoniPage/index?step=${this.data.step}&poolId=${this.data.poolId}`,
        })
      }
    });
  },
  /**
   * 错题移除
   */
  onWrongSwitchChange(e) {
    const checked = e.detail.value
    this.setData({
      isWrongDelete: checked
    })
    userSubjectConfigSetGet({
      key: 'isWrongDelete',
      value: checked,
      isGet: false
    });
  },

  //还原本题状态
  clean() {
    this.setData({
      optionIndex: [],
      isSelected: false,
      isNowWrong: false
    })
  },

  //下一题
  next() {
    if (this.isDisabledNext()) {
      return;
    }
    const {
      currentIndex
    } = this.data || {}
    this.clean();
    this.localUserSubjectStatusGet({
      type: 'set',
      propName: 'currentIndex',
      value: currentIndex + 1
    });
    this.setData({
      currentIndex: currentIndex + 1
    })
    this.loadMore({
      currentIndex: currentIndex + 1,
      isNext: true
    });
    const nowItem = this.data.subjectData.find(p => p.currentIndex === currentIndex + 1)
    this.useToDoWrong(nowItem)
    this.useToDoRight(nowItem)

  },

  //上一题
  last() {
    const {
      currentIndex
    } = this.data || {}
    if (currentIndex == 0) return;
    this.setData({
      currentIndex: currentIndex - 1
    })
    this.clean();
    this.localUserSubjectStatusGet({
      type: 'set',
      propName: 'currentIndex',
      value: currentIndex - 1
    });
    this.loadMore({
      currentIndex: currentIndex + 1,
      isNext: false
    });

    const nowItem = this.data.subjectData.find(p => p.currentIndex === currentIndex - 1)
    this.useToDoWrong(nowItem)
    this.useToDoRight(nowItem)
  },

  /**
   * 错题集的情况下，做对，移除本题
   */
  removeWrongWhileDoRight({
    subjectId,
    currentIndex
  }) {
    let newSubjectData = [];
    for (let i of this.data.subjectData) {
      let isThisSubject = i._id == subjectId;
      if (i.currentIndex >= currentIndex) i.currentIndex -= 1
      if (!isThisSubject) {
        newSubjectData.push(i);
      }
    }
    this.setData({
      subjectData: newSubjectData
    })
  },

  /**
   * 做对时的操作
   * 如果是错题集，则需要把当前的题从错题中去除，无感知。
   */
  rightSubject({
    subjectId
  }) {
    const that = this
    const {
      isTypeWrong,
      isWrongDelete,
      currentIndex,
      step
    } = this.data || {}
    if (isTypeWrong) {
      setTimeout(() => {
        that.clean();
        if (isWrongDelete) {
          that.removeWrongWhileDoRight({
            subjectId,
            currentIndex
          })
          userWrongSubjectRemove({
            subjectId,
            step
          })
          return
        }
        if (that.isDisabledNext()) {
          showToast('没有下一题咯')
          return
        }
        that.setData({
          currentIndex: currentIndex + 1
        })
        const nowItem = that.data.subjectData.find(p => p.currentIndex === currentIndex + 1)
        that.useToDoWrong(nowItem)
        that.useToDoRight(nowItem)
      }, 1000);
      return
    }
    let json = that.localUserSubjectStatusGet({
      type: 'get'
    });
    //做对了，就要把对的题塞进去，如果错题里有，就要拿出来
    let {
      wrongSubjectItems,
      rightSubjectIds
    } = json;
    if (rightSubjectIds.includes(subjectId)) return;
    rightSubjectIds.push(subjectId);
    wrongSubjectItems.filter(p => p.subjectId !== subjectId)
    for (let i of wrongSubjectItems) {
      if (i.subjectId == subjectId) {
        wrongSubjectItems = deleteArrObjMember('subjectId', subjectId, wrongSubjectItems);
      }
    }
    that.localUserSubjectStatusGet({
      type: 'set',
      propName: 'rightSubjectIds',
      value: rightSubjectIds
    });
    that.localUserSubjectStatusGet({
      type: 'set',
      propName: 'wrongSubjectItems',
      value: wrongSubjectItems
    });
    setTimeout(() => {
      that.next();
    }, 1000);
  },

  /**
   * 做错时的操作（错了）
   * */
  wrongSubject({
    subjectId,
    options
  }) {
    this.setData({
      isNowWrong: true
    })
    const {
      isTypeWrong
    } = this.data || {}
    if (isTypeWrong) {
      return
    }
    let json = this.localUserSubjectStatusGet({
      type: 'get'
    });
    //放入错题，取出对题
    let {
      wrongSubjectItems,
      rightSubjectIds
    } = json;
    for (let i of wrongSubjectItems) {
      if (i.subjectId == subjectId) return
    }
    options = options.map(i => Number(i)); //答案是+1的
    let wrongSubjectObj = {
      subjectId,
      options
    }
    wrongSubjectItems.push(wrongSubjectObj);
    if (rightSubjectIds.includes(subjectId)) {
      rightSubjectIds = deleteArrMember(rightSubjectIds, subjectId);
    }
    this.localUserSubjectStatusGet({
      type: 'set',
      propName: 'rightSubjectIds',
      value: rightSubjectIds
    });
    this.localUserSubjectStatusGet({
      type: 'set',
      propName: 'wrongSubjectItems',
      value: wrongSubjectItems
    });
    this.syncSubject({
      subjectId
    });
  },


  /**
   * 提前请求更多数据
   * */
  loadMore({
    currentIndex,
    isNext = false,
    isSelectMode = false
  }) {
    if (isSelectMode) {
      this.getSubjectData({
        currentIndex: currentIndex,
        isLoadMore: true
      });
      return;
    }
    //向后加载更多，用于下一题达到阈值时
    if (isNext && (currentIndex + 1) % 50 == 1) {
      this.getSubjectData({
        currentIndex: currentIndex,
        isLoadMore: true
      });
      return;
    }
    //向前加载更多，用于上一题达到阈值时
    if (!isNext && (currentIndex + 1) % 50 == 2) {
      this.getSubjectData({
        currentIndex: currentIndex - 2,
        isLoadMore: true
      });
      return;
    }
  },

  /**
   * 做题状态
   * @param item
   */
  subjectDoState(item) {
    let subjectId = item._id;
    if (!this.data.userSubjectData) return undefined;
    const {
      wrongSubjectItems,
      rightSubjectIds
    } = this.data.userSubjectData;
    let isInWrongSubjectIds = false;
    for (let i of wrongSubjectItems) {
      if (i.subjectId == subjectId) {
        isInWrongSubjectIds = true
        break;
      }
    }
    if (isInWrongSubjectIds) {
      return false;
    } else if (rightSubjectIds.includes(subjectId)) {
      return true;
    }
    return undefined;
  },
  /**
   * 是否已做过这题
   * @param item
   */
  isDone(item) {
    const state = this.subjectDoState(item);
    return state == true || state == false
  },
  /**
   * 不允许选答案
   */
  isDisabledSelect(item) {
    return this.isDone(item) || this.data.isSelected || this.data.isSeeMode
  },

  /**
   * 不允许下一题
   */
  isDisabledNext() {
    const {
      subjectData,
      poolData,
      currentIndex,
      loading
    } = this.data || {}
    if (subjectData.length == 0) return true;
    if ((poolData && poolData.subjectCount == currentIndex + 1) || loading) return true
    if (!poolData && subjectData.length == currentIndex + 1) return true; //错题情况
    return false
  },
  /**
   * 单选做对
   * */
  isRight(answer, opIndex) {
    answer = answer.toString();
    opIndex = (opIndex).toString();
    return answer.includes(opIndex);
  },

  /**
   * 多选全对
   * */
  isAllRight(subject) {
    let {
      answer
    } = subject;
    answer = answer.toString();
    if (answer.length !== this.data.optionIndex.length) return false;
    const optionIndex_ = this.data.optionIndex.map((i) => Number(i));
    let isAllRight = false;
    for (let i of answer) {
      i = Number(i);
      isAllRight = optionIndex_.includes(i);
    }
    return isAllRight;
  },


  /* 这条题的历史记录
   * @param item
   */
  useToDoWrong(item) {
    let subjectId = item?._id;
    if (!this.data.userSubjectData) return false;
    const {
      wrongSubjectItems
    } = this.data.userSubjectData;
    let finalWrongHistory = {}; //记录当时做错
    for (let i of wrongSubjectItems) {
      if (i.subjectId == subjectId) {
        finalWrongHistory = i
        break
      }
    }
    this.setData({
      wrongHistory: finalWrongHistory
    })
  },
  /**
   * 这条题的历史记录
   * @param item
   */
  useToDoRight(item) {
    let subjectId = item?._id;
    if (!this.data.userSubjectData) return false;
    const {
      rightSubjectIds
    } = this.data.userSubjectData;
    this.setData({
      rightHistory: rightSubjectIds.includes(subjectId)
    })
  },

  /**
   * 重置题库
   */
  onReSet() {
    // 重新获取列表
    this.setData({
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
      isCoach: getApp().globalData.userInfo && getApp().globalData.userInfo.userType == 2, // 是否教练
      rightHistory: false, // 正确历史;
      wrongHistory: {}, // 错误历史
    })
    this.onLoad({
      poolType: this.data.poolType,
      step: this.data.step,
      poolId: this.data.poolId,
      from: this.data.from
    })
  },

  // 选择问题答案
  onAnswerSelect(e) {
    const {
      subjectItem,
      answerNum
    } = e.detail || {};
    if (this.isDisabledSelect(subjectItem)) {
      return
    };
    if (subjectItem.type == 3) {
      //多选逻辑
      if (this.data.optionIndex.includes(answerNum)) {
        //这里拿出原来的
        const newOptionIndex = [...this.data.optionIndex || []]
        newOptionIndex.splice(answerNum, 1)
        this.setData({
          optionIndex: newOptionIndex
        })
        return;
      }
      this.setData({
        optionIndex: [...this.data.optionIndex, answerNum]
      })
      return;
    }
    this.setData({
      optionIndex: [answerNum],
      isSelected: true
    })

    //单选逻辑
    if (this.isRight(subjectItem.answer, answerNum)) {
      // 正确
      this.rightSubject({
        subjectId: subjectItem._id
      });
    } else {
      //记录错题
      this.wrongSubject({
        subjectId: subjectItem._id,
        options: [answerNum]
      });
    }
  },


  // 多选选择问题 确定
  onAnswerConfirm(e) {
    const subject = e.detail
    if (this.isDone(subject)) {
      showToast('此题已做，请做下一题')
      return
    }
    if (this.data.optionIndex.length < 2) {
      showToast('多选题，至少两个答案')
      return
    }
    this.setData({
      isSelected: true
    })
    if (this.isAllRight(subject)) {
      //全对逻辑
      this.rightSubject({
        subjectId: subject._id
      });
      return;
    }
    //做错后，记录错题
    this.wrongSubject({
      subjectId: subject._id,
      options: this.data.optionIndex
    });
  },

  CurrentChange(e) {
    this.loadMore({
      currentIndex: e.detail.currentIndex,
      isSelectMode: true
    });
  },


  // 考试提交
  setLocal(e) {
    const value = e.detail
    this.localUserSubjectStatusGet({
      type: 'set',
      propName: 'limitTime',
      value: value
    });

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})