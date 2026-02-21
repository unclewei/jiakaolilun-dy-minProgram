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
    poolData: {}, // 题库数据
    subjectData: {}, // 题目数据
    currentIndex: 0, // 当前做到第几题
    isNowWrong: false, //当前题目做错（做错时不会自动进入下一题）
    loading: false,
    optionIndex: [], //选择的选项
    isSelected: false, //答题确定选择
    isWrongDelete: true, // 错题集的情况下，做对是否移除错题。
    userSubjectData: userSubjectJson, // 做题状态
    isCoach: getApp().globalData.userInfo && getApp().globalData.userInfo.userType == 2, // 是否教练
    rightHistory: false, // 正确历史;
    wrongHistory: {}, // 错误历史
    isShowFailTips: false, // 是否提示过不及格
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.clean()
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
      fontSize: tt.getStorageSync('fontSize'),
      poolType,
      step,
      poolId,
      from,
      urlPrefix: getApp().globalData.enumeMap?.configMap?.urlPrefix,
      userSubjectData: userSubjectJson, // 做题状态
      requestPoolObj: { // 请求的数据池子对象
        poolId: poolId,
        userPoolId: undefined
      }
    })
    autoLogin((res) => {
      if (res == 'fail') {
        this.selectComponent("#LoginModal").showModal()
        return
      }
      // 请求成功，提示信息
      this.setData({
        userInfo: getApp().globalData.userInfo
      })
      console.log('登录了两次？');
      //按顺序请求题库数据-个人做题状态-题库内题目数据
      this.getPoolData();
    })
  },

  onShow() {
    this.getUrlPrefix()
  },

  getUrlPrefix() {
    const that = this
    if (!getApp().globalData.enumeMap?.configMap?.urlPrefix) {
      setTimeout(() => {
        that.getUrlPrefix()
      }, 1000);
      return
    }
    this.setData({
      urlPrefix: getApp().globalData.enumeMap?.configMap?.urlPrefix,
    })
  },
  /**  登录成功*/
  onLoginSuccess() {
    this.setData({
      userInfo: getApp().globalData.userInfo
    })
    //按顺序请求题库数据-个人做题状态-题库内题目数据
    this.getPoolData();
  },

  /**
   * 获取题库数据
   * */
  getPoolData() {
    const that = this
    // 请求错题数据
    // tt.showLoading()
    // 获取问题数据
    poolData({
      poolType: that.data.poolType,
      poolId: that.data.poolId,
      step: that.data.step,
      isDetail: true
    }).then(res => {
      tt.hideLoading()
      if (res.data.code !== 200) {
        showNetWorkToast(res.data.msg)
        return
      }
      const resData = res.data.data;
      that.setData({
        poolData: resData,
        poolType: resData.type,
        poolId: resData._id,
        step: resData.step,
      })
      // 因为是模拟考试，不用获取历史数据，清除一下本地缓存
      let key = resData._id || `${resData.step}_${resData.type}`;
      let keyName = `localPoolStatus_${key}`;
      tt.removeStorageSync(keyName)

      // 验证用户是购买 或者数据是否免费
      isItemValid({
        step: resData.step
      }).then(validRes => {
        if (validRes.data.code !== 200) {
          showNetWorkToast(validRes.data.msg)
          return
        }
        if (validRes.data.data || resData.isForFree) {

          that.getSubjectData({
            currentIndex: 0,
            poolId: resData._id,
            poolType: resData.type,
            limit: 100,
            skip: 0,
            loading: true,
            step: resData.step,
          });
       
           //获取用户做题状态
        that.userSubjectDataGet({
          isSyncSubject: false
        });

          return
        }
        tt.redirectTo({
          url: `/pages/SubjectIncPage/index?step=${that.data.step}`,
        })
      })
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
      tt.setStorageSync(keyName, fullUserSubjectConfig)
      this.setData({
        userSubjectData: fullUserSubjectConfig
      })
      return;
    }

    let userSubjectConfig = tt.getStorageSync(keyName) || {};
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

    tt.setStorageSync(keyName, userSubjectConfig)
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
      let resData = res.data.data
      resData = resData.filter((_p, index) => index < 50)
      if (step == 1 && currentIndex != 0) {
        resData = that.data.subjectData.concat(resData)
      }
      that.setData({
        subjectData: resData,
      })
      if (step == 1 && currentIndex == 0) {
        that.getSubjectData({
          limit,
          skip: 50,
          step,
          poolId,
          poolType,
          currentIndex: 50
        })
      }
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
    // tt.showLoading()
    userSubjectGet({
      type: poolType,
      ...that.data.requestPoolObj,
      step
    }).then(res => {
      tt.hideLoading()
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
      type: "wrong",
      step: this.data.step ? this.data.step : undefined,
      examType: this.data.poolData.examType,
    })
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
      isNowWrong: false,
      isShowFailTips: false
    })
  },

  onCurrentSelect(e) {
    const index = e.currentTarget.dataset.index
    this.clean();
    this.localUserSubjectStatusGet({
      type: 'set',
      propName: 'currentIndex',
      value: index
    });
    this.setData({
      currentIndex: index,
    })
    this.useToDoWrong(this.data.subjectData[index])
    this.useToDoRight(this.data.subjectData[index])

  },

  //下一题
  next() {
    if (this.data.currentIndex >= this.data.subjectData.length - 1) {
      return;
    }
    this.checkFailSocre()
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
    this.useToDoWrong(this.data.subjectData[currentIndex + 1])
    this.useToDoRight(this.data.subjectData[currentIndex + 1])

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
    this.useToDoWrong(this.data.subjectData[currentIndex - 1])
    this.useToDoRight(this.data.subjectData[currentIndex - 1])
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
    let json = that.localUserSubjectStatusGet({
      type: 'get'
    });
    //做对了，就要把对的题塞进去，如果错题里有，就要拿出来
    let {
      wrongSubjectItems,
      rightSubjectIds
    } = json;
    if (rightSubjectIds.includes(subjectId)) {
      return;

    }
    rightSubjectIds.push(subjectId);
    wrongSubjectItems.filter(p => p.subjectId !== subjectId)
    for (let i of wrongSubjectItems) {
      if (i.subjectId == subjectId) {
        wrongSubjectItems = deleteArrObjMember('subjectId', subjectId, wrongSubjectItems);
      }
    }
    this.clean();
    that.localUserSubjectStatusGet({
      type: 'set',
      propName: 'rightSubjectIds',
      value: rightSubjectIds,
      stopSetData: true
    });
    that.localUserSubjectStatusGet({
      type: 'set',
      propName: 'wrongSubjectItems',
      value: wrongSubjectItems,
      stopSetData: true
    });
    that.next();
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
    let json = this.localUserSubjectStatusGet({
      type: 'get'
    });
    //放入错题，取出对题
    let {
      wrongSubjectItems,
      rightSubjectIds
    } = json;
    for (let i of wrongSubjectItems) {
      if (i.subjectId == subjectId) {
        this.clean();
        return
      }
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
    this.clean();
    this.localUserSubjectStatusGet({
      type: 'set',
      propName: 'rightSubjectIds',
      value: rightSubjectIds,
      stopSetData: true
    });
    this.localUserSubjectStatusGet({
      type: 'set',
      propName: 'wrongSubjectItems',
      value: wrongSubjectItems,
      stopSetData: true
    });
    this.syncSubject({
      subjectId,
    });
    this.next();
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
    return this.isDone(item) || this.data.isSelected
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
    let subjectId = item._id;
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
    let subjectId = item._id;
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
      poolData: {}, // 题库数据
      subjectData: {}, // 题目数据
      currentIndex: 0, // 当前做到第几题
      loading: false,
      optionIndex: [], //选择的选项
      isSelected: false, //答题确定选择
      isNowWrong: false, //当前题目做错
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
    console.log('回答了了',e);
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
    const subject = e.currentTarget.dataset.item
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


  // 获取正确的分数
  getScore() {
    const {
      userSubjectData,
      poolData
    } = this.data
      return userSubjectData.rightSubjectIds?.length * poolData.eachScore|| 0;
  },

  // 获取错误的扣分
  getWrongScore() {
    const {
      step,
      userSubjectData
    } = this.data
    if (step == 1) {
      return userSubjectData.wrongSubjectItems?.length || 0;
    }
    return (userSubjectData.wrongSubjectItems?.length || 0) * 2 || 0;
  },

  // 时间到，提交考试
  onTimeOut() {
    tt.showModal({
      title: '考试时间到',
      content: '考试结束',
      showCancel: false,
      confirmText: '提交考卷',
      success: (res) => {
        if (res.confirm) {
          this.onSubmit()
        }
      }
    })
  },

  // 测试是否不及格，不及格的话，直接提示不要做了
  checkFailSocre() {
    const wrongScore = this.getWrongScore()
    if (wrongScore > 10 && !this.data.isShowFailTips) {
      tt.showModal({
        title: '考试提示',
        content: '您已考试不及格！',
        cancelText: '继续做题',
        confirmText: '重新考试',
        success: (res) => {
          if (res.cancel) {
            this.setData({
              isShowFailTips: true,
            })
          }
          if (res.confirm) {
            // 重新给一个题目
          }
        }
      })
    }
  },


  /**
   * 交卷
   * @param score 分数
   */
  onSubmit() {
    tt.showModal({
      title: '考试提示',
      content: '你将要提交考试',
      success: (res) => {
        if (res.confirm) {
          const score = this.getScore()
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
            subjectId: this.data.subjectData._id,
          });
          if (score >= 90) {
            tt.showModal({
              title: '考试结果',
              content: '考试通过！',
              showCancel: false,
              confirmText: '返回首页',
              success: (res) => {
                if (res.confirm) {
                  tt.redirectTo({
                    url: `/pages/SubjectMoniPage/index?step=${this.data.step}&poolId=${this.data.poolId}`,
                  })
                }
              }
            })
            return
          }
          tt.showModal({
            title: '考试结果',
            content: '考试不通过！',
            cancelText: '返回首页',
            confirmText: '重新考试',
            success: (res) => {
              if (res.cancel) {
                tt.switchTab({
                  url: '/pages/index/index',
                })
              }
              if (res.confirm) {
                // 重新给一个题目
                tt.redirectTo({
                  url: `/pages/SubjectMoniPage/index?step=${this.data.step}&poolId=${this.data.poolId}`,
                })
              }
            }
          })

        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})