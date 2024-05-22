import {
  getUserSubjects,
  userSubjectGet,
  poolList
} from "../../utils/api";
import { gotoSubject } from "../../utils/util";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    step: {
      type: String,
      value: "",
    },
    examType: {
      type: String,
      value: '',
    },

  },
  observers: {
    "step,examType": function (step, examType) {
      if (!step || !getApp().globalData.hasLogin) {
        return
      }
      console.log('进来答题了');
      // 获取答题进度
      this.getSubjectCurrentIndex(step)
      getUserSubjects({
        step,
        examType
      }).then(res => {
        if (res.data.code !== 200) {
          return
        }
        const resData = res.data.data
        this.setData({
          userSubjectData: resData
        })
        // 获取平均分
        const avgScore = this.getAvgScore(resData)
        // 获取通过率
        this.getForesee(resData, avgScore)
      })
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    avgScore: 0,
    chosenIndex: 0,
    sequenceIndex: 0,
    foresee: {},
  },

  ready: function () {
    this.setData({
      poolDataObj: getApp().globalData.poolDataObj,
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取平均成绩
    getAvgScore(data) {
      if (data.length === 0) {
        this.setData({
          avgScore: 0
        })
        return 0
      }
      let score = 0;
      for (let i of data) {
        score += i.score;
      }
      const avgScore = Number.parseInt(String(score / data.length))
      this.setData({
        avgScore
      })
      return avgScore
    },
    // 获取通过率
    getForesee(data, avgScore) {
      let obj = {
        rate: 30,
        text: '低'
      };
      let times = data.length;
      if (times === 0) {
        obj.rate = 0;
        obj.text = '极低';
      }
      if (times < 2) {
        obj.rate = 18;
        obj.text = '低';
      }
      let avg = avgScore;
      if (avg > 94) {
        if (times < 2) {
          obj.rate = 95;
          obj.text = '高';
        } else {
          obj.rate = 97;
          obj.text = '很高';
        }
      }
      if (avg > 89 && avg < 95) {
        obj.rate = 85;
        obj.text = '中等';
      }
      if (avg > 85 && avg < 90) {
        obj.rate = 70;
        obj.text = '中等偏下';
      }
      if (avg > 80 && avg < 85) {
        obj.rate = 60;
        obj.text = '中等偏下';
      }
      this.setData({
        foresee: obj
      })
    },

    // 获取做题状态
    getUserSubjectGet(poolId, keyName) {
      userSubjectGet({
        poolId
      }).then(res => {
        if (res.data.code !== 200) {
          return
        }
        this.setData({
          [keyName]: res.data.data.currentIndex
        })
      })
    },

    getSubjectCurrentIndex(step) {
      if (!getApp().globalData.hasLogin) {
        return
      }
      poolList({
        step
      }).then((res) => {
        wx.hideLoading()
        if (res.data.code !== 200) {
          showNetWorkToast(res.data.msg)
          return
        }
        const resData = res.data.data.reduce((total, item) => ({
          ...total,
          [item.type]: item
        }), {})
        this.setData({
          poolDataObj: resData
        })
        this.getUserSubjectGet(resData?.chosen?._id, 'chosenIndex')
        this.getUserSubjectGet(resData?.sequence?._id, 'sequenceIndex')
      })
    },


  gotoPage(e) {
    const poolType = e.currentTarget.dataset.pooltype;
    const {
      step,
      poolDataObj
    } = this.data;

    gotoSubject({
      step: step,
      poolType: poolType,
      poolId: poolType === 'sequence' ? poolDataObj.sequence?._id : undefined,
    })
  },

  },
});