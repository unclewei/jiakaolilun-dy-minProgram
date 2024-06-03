import { locationSequence } from "../../plugins/wxapi";
import { quickSortObjDesc } from "../../utils/util";

Component({
  properties: {
    step: {
      type: Number,
      value: 1,
    },
    step: {
      type: currentIndex,
      value: 0,
    },
    poolData: {
      type: Object,
      value: {},
    },
    userSubjectStatus: {
      type: Object,
      value: {},
    },
    poolId: {
      type: String,
      value: '',
    },
    isJustClose: {
      type: Boolean,
      value: false,
    },
    isNotVip: {
      type: Boolean,
      value: true,
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
      this.selectComponent("#baseModal").showModal();
    },
  },
});
