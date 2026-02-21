Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userConfig: {
      type: Object,
      value: {},
    },
    enumeMap: {
      type: Object,
      value: {},
    },
  },

  observers: {
    "enumeMap,userConfig": function (enumeMap,userConfig) {
      if (!userConfig?.examType || !enumeMap?.examType) {
        return;
      }
      if (enumeMap?.examType && enumeMap?.examType?.[userConfig?.examType]) {
        this.setData({
          name: enumeMap?.examType?.[userConfig?.examType]?.label,
        });
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    name: "",
  },

  ready: function () {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoConfigPage() {
      tt.navigateTo({
        url: "/pages/UserConfigInit/index",
      });
    },
  },
});