// components/MoneyContent/index.js
import {
  promoteOrderList,
  myPromoteList,
  payOrderList
} from "../../../utils/api";
import {
  showNetWorkToast
} from "../../../utils/util";


Component({
  properties: {
    isShowPayOrderRecord: {
      type: Boolean,
      value: false
    }
  },

  data: {
    tabData: [{
        name: '学员购买订单',
        value: 'studentOrder'
      },
      {
        name: '推广教练订单',
        value: 'coachOrder'
      },
      {
        name: '我推广的人员',
        value: 'myPromote'
      },
    ],
    coachMenuData: [{
        name: '所有订单',
        value: 'undefined'
      },
      {
        name: '在途订单',
        value: 'isSalesLock'
      },
    ],
    menuData: [{
        name: '我的学员',
        value: 1
      },
      {
        name: '我推广的教练',
        value: 2
      },
    ],

    tabValue: 'studentOrder',
    memberType: 1,
    coachOrderType: 'undefined',
    payOrderData: [],
    orderData: [],
    memberData: [],
    contentList: [], // 统一用于渲染的数据（orderData 或 memberData） 

    showAll: false,
    needShowAllBtn: false,
    maxDataTips: '',
  },

  lifetimes: {
    ready() {
      // 组件加载完成时初始请求
      this.updateContentList();
      this.loadData();
      this.setData({
        userInfo: getApp().globalData.userInfo,
        userConfig: getApp().globalData.userConfig,
        enumeMap: getApp().globalData.enumeMap,
      })

    }
  },

  observers: {
    'isShowPayOrderRecord': function (val) {
      if (val) {
        this.loadPayOrderRecord();
      }
    },
    'tabValue, coachOrderType': function () {
      this.loadData();
    },
    'tabValue, memberType': function () {
      if (this.data.tabValue === 'myPromote') {
        this.loadData();
      }
    },
    'orderData, memberData,  tabValue': function () {
      this.updateContentList();
      this.updateMaxTips();
      this.measureContentHeight();
    }
  },

  methods: {
    // 切换主 tab
    onTabChange(e) {
      const value = e.currentTarget.dataset.value;
      if(value === this.data.tabValue){
        return
      }
      this.setData({
        tabValue: value
      });
    },

    // 切换人员类型
    onMemberTypeChange(e) {
      const value = e.currentTarget.dataset.value;
      if(value === this.data.memberType){
        return
      }
      this.setData({
        memberType: value
      });
    },

    // 切换教练订单类型
    onCoachOrderTypeChange(e) {
      const value = e.currentTarget.dataset.value;
      if(value === this.data.coachOrderType){
        return
      }
      this.setData({
        coachOrderType: value
      });
    },

    // 复制手机号（联系教练）
    onCopyPhone(e) {
      const phone = e.currentTarget.dataset.phone;
      tt.setClipboardData({
        data: phone,
        success: () => {
          tt.showToast({
            title: '复制手机成功',
            icon: 'success'
          });
        }
      });
    },

    // 加载对应数据
    loadData() {
      const {
        tabValue,
        coachOrderType,
        memberType
      } = this.data;

      if (tabValue === 'myPromote') {
        this.loadMyPromote(memberType);
        return;
      }

      let level = tabValue === 'studentOrder' ? 'first' : 'second';
      tt.showLoading({ title: "" })
      promoteOrderList({
          level,
          coachOrderType: coachOrderType === 'undefined' ? undefined : coachOrderType
        })
        .then(res => {
          if (res.data.code !== 200) {
            showNetWorkToast(res.data.msg)
            return;
          }
          const resData = res.data.data;
          tt.hideLoading()
          this.setData({
            orderData: resData || [],
            userInfo: getApp().globalData.userInfo,
            userConfig: getApp().globalData.userConfig,
            enumeMap: getApp().globalData.enumeMap,
          });

        })
        .catch(() => {
          tt.hideLoading()
        });
    },

    // 加载提现记录
    loadPayOrderRecord() {
      tt.showLoading({ title: "" })
      payOrderList()
        .then(res => {
          if (res.data.code !== 200) {
            showNetWorkToast(res.data.msg)
            return;
          }
          const resData = res.data.data;
          console.log('resData',resData)
          tt.hideLoading()
          this.setData({
            payOrderData: resData || [],
          });
        })
        .catch(() => {
          tt.hideLoading()
        });
    },

    // 加载我推广的人员
    loadMyPromote(userType) {
      tt.showLoading({ title: "" })
      myPromoteList({
          userType
        })
        .then(res => {
          if (res.data.code !== 200) {
            showNetWorkToast(res.data.msg)
            return;
          }
          const resData = res.data.data;
          tt.hideLoading()
          this.setData({
            memberData: resData || [],
          });
        })
        .catch(() => {
          tt.hideLoading()
        });
    },

    // 更新渲染列表和提示文字
    updateContentList() {
      const {
        tabValue,
        orderData,
        memberData
      } = this.data;
      const list = tabValue === 'myPromote' ? memberData : orderData;
      this.setData({
        contentList: list
      });
    },

    updateMaxTips() {
      const {
        tabValue,
        orderData,
        memberData,
        memberType
      } = this.data;
      let text = '';
      if (tabValue === 'studentOrder' && orderData.length >= 20) {
        text = '仅显示20个最新推广学员订单';
      } else if (tabValue === 'coachOrder' && orderData.length >= 20) {
        text = '仅显示20个最新推广教练订单';
      } else if (tabValue === 'myPromote' && memberData.length >= 50) {
        const name = memberType === 1 ? '学员' : '教练';
        text = `仅显示50个最新推广的${name}`;
      }
      this.setData({
        maxDataTips: text
      });
    },

    // 测量内容高度决定是否显示“显示全部”
    measureContentHeight() {
      const query = this.createSelectorQuery();
      query.select('#content').boundingClientRect(rect => {
        if (!rect) return;
        const need = rect.height > 800; // 对应原 400px ≈ 800rpx
        this.setData({
          needShowAllBtn: need,
          showAll: need ? this.data.showAll : false
        });
      }).exec();
    },

    // 切换显示全部/收起
    toggleShowAll() {
      this.setData({
        showAll: !this.data.showAll
      });
    },

  }
});