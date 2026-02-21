Component({
  data: {
    selected: 'home',
    color: "#aaaaaa",
    selectedColor: "#54b63e",
    allList: [ // 所有可能的 tab 配置（固定在这里）
      {
        pagePath: "/pages/index/index",
        text: "考试",
        iconPath: "../images/exam.png",
        selectedIconPath: "../images/exam.png", // 推荐准备选中图标
        key: "home" // 给需要动态控制的 tab 加个标识 key
      },
      {
        pagePath: "/pages/SubjectIncTab/index",
        text: "VIP",
        iconPath: "../images/vip2.png",
        selectedIconPath: "../images/vip2.png",
        key: "vip" // 给需要动态控制的 tab 加个标识 key
      },
      {
        pagePath: "/pages/MoneyPage/index",
        text: "赚钱",
        iconPath: "../images/icon/money.png",
        selectedIconPath: "../images/icon/money.png",
        key: "money" // 给需要动态控制的 tab 加个标识 key
      },
      {
        pagePath: "/pages/UserInfo/index",
        text: "我的",
        iconPath: "../images/user.png",
        selectedIconPath: "../images/user.png",
        key: "mine" // 给需要动态控制的 tab 加个标识 key
      }
    ],
    displayList: [] // 实际渲染的列表
  },

  lifetimes: {
    attached() {
      tt.nextTick(() => {
        this.refreshList();
      })
    }
  },

  methods: {
    // 刷新显示列表的公共方法（页面会调用）
    refreshList() {
      // 过滤出需要显示的列表
      let displayList = this.data.allList.filter(item => {
        if (item.key === "money") {
          return getApp().globalData.userInfo.userType === 2; // 可选：未确定时默认显示或隐藏
        }
        return true;
      });

      // 获取当前页面路径，加入空数组保护
      let selected = 'home'; // 默认选中第一个
      const pages = getCurrentPages();
      console.log('pages', pages)
      if (pages && pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        const currentPath = '/' + currentPage.route;

        const tabItem = displayList.find(item => item.pagePath === currentPath)
        if (tabItem) {
          selected = tabItem.key
        }
        if (!selected) selected = 'home';
      }
      this.setData({
        displayList,
        selected
      });
    },

    switchTab(e) {
      const index = e.currentTarget.dataset.index;
      const url = this.data.displayList[index].pagePath;
      tt.switchTab({
        url
      });
      // switchTab 是异步的，切换后会在新页面的 onShow 中再刷新选中
    }
  }
})