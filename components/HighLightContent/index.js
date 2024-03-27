Component({

  /**
   * 组件的属性列表
   */
  properties: {

    content: {
      type: String,
      value: '',
    },
    keys: {
      type: String,
      value: '',
    },
  },

  observers: {
    'content,keys': function (content, keys) {
      let highLightKeys = keys ? keys.split('/') : [];
      for (let i of highLightKeys) {
        content = content.replace(i, `[[${i}]]`);
      }
      const reg = new RegExp(/\[\[(.*?)\]\]/);
     const skillList =   content.split(reg).reduce((prev, current, i) => {
        if (!i) return [{
          text: current
        }]
        return [...prev, {
          text: current,
          class: highLightKeys.includes(current) ? "isHighLight" : ''
        }]
      }, [])
      console.log('skillList',skillList);
      this.setData({
        skillList
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    skillList: [],
  },


  ready: function () {

  },

  /**
   * 组件的方法列表
   */
  methods: {


  }
})