// components/RecommendPeople/index.js
Component({
  data: {
    items: [
      {
        key: 'time',
        icon: '../../../images/car/car.png',
        text: '时间忙',
        dotColor: '#ffc08e',
        subItems: ['工作忙碌', '学习时间不足', '没有学习氛围', '容易半途而废'],
      },
      {
        key: 'effect',
        icon: '../../../images/car/motorcycle.png',
        text: '效率低',
        dotColor: '#96d7ff',
        subItems: ['自律性差', '容易分心', '学习常遇瓶颈', '依赖死记硬背'],
      },
      {
        key: 'memory',
        icon: '../../../images/car/bus.png',
        text: '记性差',
        dotColor: '#54e5bf',
        subItems: ['年纪较大', '文化基础薄弱', '看题头疼', '识字量有限'],
      },
      {
        key: 'plan',
        icon: '../../../images/car/goodsTrain.png',
        text: '无规划',
        dotColor: '#ff91e2',
        subItems: ['学习效率低下', '没有时间管理', '缺乏考试计划', '学习进度跟不上'],
      },
    ],
    steps: [
      { text: '分享课程给学员', icon: '../../../images/share.png' },
      { text: '学员购买课程', icon: '../../../images/vip2.png' },
      { text: '系统自动提现到账', icon: '../../../images/icon/money.png' },
    ]
  }
});