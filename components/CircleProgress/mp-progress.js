import MpProgress from "./progress.js";

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    config: {
      type: Object,
      value: {}
    },
    percentage: {
      type: Number,
      value: 0
    }
  },
  data: {
    oldpercentage: null,
    customOptions: {
      canvasSize: {
        width: 750 / wx.getSystemInfoSync().windowWidth * 144,
        height: 750 / wx.getSystemInfoSync().windowWidth * 144
      },
      percent: 100,
      barStyle: [{
        width: 10,
        fillStyle: '#f0f0f050'
      }, {
        width: 10,
        animate: false,
        fillStyle: [{
          position: 0,
          color: '#5a99f4'
        }, {
          position: 1,
          color: '#fff'
        }]
      }],
      needDot: true,
      dotStyle: [{
        r: 4,
        fillStyle: '#5a99f4',
        shadow: 'rgba(0,0,0,.15)'
      }, {
        r: 2,
        fillStyle: '#5a99f4'
      }]

    },
    canvasId: `mp_progress_${new Date().getTime()}`
  },
  attached() {
    const customOptions = Object.assign({}, this.data.customOptions, this.data.config);
    this.setData({
      customOptions
    });
  },
  ready() {
    this._mpprogress = new MpProgress(Object.assign({}, this.data.customOptions, {
      canvasId: this.data.canvasId,
      target: this
    }));
    this.clockDrawer()
    this._mpprogress.draw(this.data.percentage || 0);
  },
  observers: {
    'percentage': function (percentage) {
      if (this.data.oldpercentage === percentage) {
        return
      }
      if (this._mpprogress) {
        // 第一次进来的时候还没有初始化完成
        this._mpprogress.draw(percentage);
        this.data.oldpercentage = percentage
      }
    },
  },
  methods: {
    clockDrawer() {
      const query = wx.createSelectorQuery().in(this);
      query
        .select('#clock')
        .fields({
          node: true,
          size: true
        }) // 拿到 node 和 尺寸
        .exec((res) => {
          const canvas = res[0].node; // 拿到 canvas 节点
          const ctx = canvas.getContext('2d');
          const dpr = wx.getSystemInfoSync().pixelRatio; // 设备像素比

          // 设置真实像素大小，避免模糊
          canvas.width = res[0].width * dpr;
          canvas.height = res[0].height * dpr;
          ctx.scale(dpr, dpr);

          this.drawClockTicks(ctx, 134);
        })

    },
    drawClockTicks(ctx, size) {
      const centerNub = (16 - size) / 2
      const cx = size + centerNub;
      const cy = size + centerNub;
      const radius = Math.floor(size / 2);

      // 参数可调整
      const minorLen = 4; // 小刻度长度
      const minorWidth = 1; // 小刻度线宽（逻辑像素）
      const tickColor = '#97bff870'; // 刻度颜色（透明度可调）
      const backgroundColor = '#e8f9fe' // 背景色
      const count = 40; // 刻度数量
      // 清空（不填充背景，保持透明） 

      ctx.save(); // 保存初始状态
       // ===== 外圈圆线 =====
       ctx.beginPath();
       ctx.arc(cx, cy, radius, 0, Math.PI * 2);
       ctx.lineWidth = 6;
       ctx.strokeStyle = backgroundColor;
       ctx.stroke();
       
      // 我们先 translate 到中心，后面使用 rotate 绘制
      ctx.translate(cx, cy);

      // 先画 60 个小刻度（包含大刻度的位置）
      for (let i = 0; i < count; i++) {
        ctx.beginPath();
        ctx.moveTo(0, -radius); // 从外圆边缘开始
        ctx.lineTo(0, -radius + minorLen); // 向内画到 (len) 的位置
        ctx.lineCap = 'round'; // 线帽
        ctx.lineWidth = minorWidth; // 线宽
        ctx.strokeStyle = tickColor; // 颜色
        ctx.stroke();
        ctx.rotate((Math.PI * 2) / count); // 旋转 1/60 圈
      }

      // 恢复坐标系（将 translate 复位）
      ctx.translate(-cx, -cy);
      ctx.restore(); // 恢复坐标系，避免影响后续绘制

     

    }
  }
});