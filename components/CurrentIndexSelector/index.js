import {
  subjectList
} from '../../utils/api'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    poolId: {
      type: String,
      value: ''
    },
    userPoolId: {
      type: String,
      value: ''
    },
    userSubjectData: {
      type: Object,
      value: {},
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    visible: false,
    data: [],
    washData: [],
    currentIndex: 0,
    rightMap: {},
    wrongMap: {},
  },

  /**
   * 组件的方法列表
   */
  methods: {

    hideModal: function () {
      if (this.data.visible) {
        this.setData({
          hidding: true,
        });
        setTimeout(() => {
          this.setData({
            visible: !this.data.visible,
            hidding: false,
          });
        }, 100);
      }
    },
    subjectData(poolId, userPoolId) {
      if (!poolId && !userPoolId) return;
      if (!this.data.visible) return;
      if (this.data.data.length > 0) return;
      subjectList({
          poolId,
          userPoolId,
          limit: 3000,
          limitOnly: true,
          isOmit: true
        })
        .then((res) => {
          this.setData({
            data: res.data.data
          })

          this.washData()
        })
    },

    showSelector() {
      if (this.data.visible) {
        this.setData({
          visible: false
        })
        return
      }
      this.setData({
        visible: true
      })
      this.subjectData(this.data.poolId, this.data.userPoolId)
      this.userSubjectDataMap(this.data.userSubjectData)

    },
    userSubjectDataMap(userSubjectData) {
      console.log('userSubjectData', userSubjectData);
      if (Object.keys(userSubjectData).length === 0) {
        return
      }
      let rightMap = {},
        wrongMap = {};
      if (userSubjectData) {
        for (let i of userSubjectData.wrongSubjectItems || []) {
          wrongMap[i.subjectId] = true;
        }
        for (let i of userSubjectData.rightSubjectIds || []) {
          rightMap[i] = true;
        }
      }
      this.setData({
        rightMap,
        wrongMap,
        currentIndex: userSubjectData.currentIndex || 0
      })
      this.washData()
    },
    washData() {
      const {
        data,
        rightMap,
        wrongMap
      } = this.data
      if (!data.length || !rightMap || !wrongMap) {
        return
      }
      const washData = data.map(p => ({
        ...p,
        rightItem: rightMap[p._id],
        wrongItem: wrongMap[p._id],
      }))
      this.setData({
        washData
      })

    },
    onCurrentIndexClick(e) {
      const index = e.currentTarget.dataset.index
      this.setData({
        currentIndex: index
      })

    },
    onConfirm() {
      this.triggerEvent("CurrentChange", {
        currentIndex: this.data.currentIndex,
      });
      this.hideModal()
    }
  }
})