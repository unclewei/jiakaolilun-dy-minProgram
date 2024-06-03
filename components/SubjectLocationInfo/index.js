import { locationSequence } from "../../utils/api";
import { quickSortObjDesc } from "../../utils/util";

Component({
  properties: {
    tick: {
      type: Number,
      value: 0,
    },
    locationData: {
      type: Array,
      value: [],
    },
    UserConfig: {
      type: Object,
      value: {},
    },
  },

  observers: {
    "locationData,UserConfig": function (locationData, UserConfig) {
      const cityItem = locationData.find((p) => p.cityId === UserConfig.cityId);
      this.setData({
        cityItem,
      });
    },
  },

  data: {
    data: {},
    logining: false,
  },

  methods: {
    hideModal: function () {
      this.selectComponent("#baseModal").hideModal();
    },
    showModal: function () {
      if (this.data.tick === 0 || !this.data.UserConfig.cityId) {
        return;
      }
      this.locationSequence();
      this.selectComponent("#baseModal").showModal();
    },
    locationSequence() {
      const { provinceId, cityId } = this.data.UserConfig;
      locationSequence({ provinceId, cityId, examType: "car" }).then((res) => {
        if (!res.data.data) {
          return;
        }
        const resData = res.data.data
        this.setData({
          data: resData,
          combinePoolOneText: this.combinePoolInit(resData?.ke1?.combinePool||[]),
          combinePoolFourText: this.combinePoolInit(resData?.ke4?.combinePool||[]),
        });
        this.combinePoolInit()
      });
    },
    combinePoolInit(combinePool = []) {
      combinePool = quickSortObjDesc(combinePool, "subjectCount");
      return combinePool.map((i, index) => {
        let text = "";
        if (i) {
          text += `${index === combinePool.length - 1 ? "+" : ""}${
            i.secondName || i.name
          }`;
          text += `${i.subjectCount}题`;
        }
        return text;
      });
    },
  },
});
