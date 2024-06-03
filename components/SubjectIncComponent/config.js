const doctor = '../../images/inc/doctor.png';
const score = '../../images/inc/score.png';
const packageIcon = '../../images/inc/package.png';
const broken1 = '../../images/inc/broken1.png';
const broken2 = '../../images/inc/broken2.png';
const broken3 = '../../images/inc/broken3.png';
const telcIcon = '../../images/inc/telcIcon.png';
const CheckCircleFill = '../../images/inc/check-circle-fill.png';
const ForbidFill = '../../images/inc/minus-circle-fill.png';

export const rightsList = [{
    name: '不过补偿',
    normalVipImg: ForbidFill,
    normalVipClass: 'rightItemFail',
    upVipImg: CheckCircleFill,
    upVipClass: 'rightItemSuc',
  },
  {
    name: '客服优先服务',
    normalVipImg: ForbidFill,
    normalVipClass: 'rightItemFail',
    upVipImg: CheckCircleFill,
    upVipClass: 'rightItemSuc',

  },
  {
    name: '精选500题库',
    normalVipImg: CheckCircleFill,
    normalVipClass: 'rightItemFail',
    upVipImg: CheckCircleFill,
    upVipClass: 'rightItemSuc',
  },
  {
    name: '3天速成计划',
    normalVipImg: CheckCircleFill,
    normalVipClass: 'rightItemFail',
    upVipImg: CheckCircleFill,
    upVipClass: 'rightItemSuc',
  },
  {
    name: '真实考场模拟',
    normalVipImg: CheckCircleFill,
    normalVipClass: 'rightItemFail',
    upVipImg: CheckCircleFill,
    upVipClass: 'rightItemSuc',
  },
  {
    name: '考题专业解析',
    normalVipImg: CheckCircleFill,
    normalVipClass: 'rightItemFail',
    upVipImg: CheckCircleFill,
    upVipClass: 'rightItemSuc',
  },
  {
    name: '考题盲选技巧',
    normalVipImg: CheckCircleFill,
    normalVipClass: 'rightItemFail',
    upVipImg: CheckCircleFill,
    upVipClass: 'rightItemSuc',
  },
  {
    name: '会员时效性',
    isText: true,
    normalVipText: "180天",
    upVipText: '365天',
  },
];

export const reasonList = [{
    text: '题库1700+题目\n刷题慢，时间长\n效率不高',
    icon: broken2,
    type: 'tranditional',
  },
  {
    text: '精选500题\n提炼高频考点\n拒绝盲目刷题',
    icon: score,
    type: 'al',
  },
  {
    text: '传统学习死记硬背\n记忆困难\n看完就忘',
    icon: broken1,
    type: 'tranditional',
  },
  {
    text: '答题技巧\n名师总结\n一秒选择答案',
    icon: telcIcon,
    type: 'al',
  },
  {
    text: '不了解\n真实考场规则\n现场考试慌张',
    icon: broken3,
    type: 'tranditional',
  },
  {
    text: '提前了解\n真实模拟考试\n做到心里有底',
    icon: packageIcon,
    type: 'al',
  },

  {
    text: '智能备考，打破传统，简单上手。高效学车更从容！\n我们共同的目标：一次通过，拒绝补考！\n拒绝焦虑，给学车驾考多一分安全感。',
    icon: doctor,
    type: 'al',
    isFinal: true,
  },
];