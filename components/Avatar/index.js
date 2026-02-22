Component({

  /**
   * 组件的属性列表
   */
  properties: {

    avClassName: {
      type: String,
      value: ''
    },
    userInfo: {
      type: Object,
      value: {},
    },
  },

  observers: {
    'userInfo': function (userInfo) {
      if (userInfo?.avatarUrl) {
        this.setData({
          src: userInfo?.avatarUrl
        })
        return
      } 
      this.setData({
        src: '../../images/defaultAvatar.jpg',
      })

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    src: null,
    comAvatar: ''
  },


  ready: function () {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick() {
      this.triggerEvent('tap')
    },


  }
})