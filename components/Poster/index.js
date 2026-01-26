// components/Poster/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mainSrc: {
      type: String,
      value: '',
      observer: 'onPropsChange'
    },
    subSrc: {
      type: String,
      value: '',
      observer: 'onPropsChange'
    },
    width: {
      type: Number,
      value: 750
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    urlPrefix: '',
    canvasWidth: 0,
    canvasHeight: 0,
    posterUrl: '',
    userInfo: {
      name: '',
      phone: '',
      avatar: ''
    },
    isLoading: false
  },

  /**
   * 组件生命周期
   */
  ready() {
    this.setData({
      urlPrefix: getApp().globalData.enumeMap?.configMap?.urlPrefix,
    })
    this.loadUserInfo()
    this.drawPoster()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPropsChange() {
      if (this.data.mainSrc && this.data.subSrc) {
        this.drawPoster()
      }
    },

    loadUserInfo() {
      const userInfo = getApp().globalData.userInfo || {}
      this.setData({
        'userInfo.name': userInfo.nickName || userInfo.name || '',
        'userInfo.phone': userInfo.phone || '',
        'userInfo.avatar': userInfo.avatarUrl || ''
      })
    },

    async drawPoster() {
      if (!this.data.mainSrc) {
        console.error('Main image src is required')
        return
      }

      console.log('开始绘制海报，mainSrc:', this.data.mainSrc)
      console.log('开始绘制海报，subSrc:', this.data.subSrc)
      console.log('urlPrefix:', this.data.urlPrefix)

      this.setData({
        isLoading: true
      })

      try {
        // 1. Get main image info to calculate dimensions
        const mainImgInfo = await this.getImageInfo(this.data.mainSrc)
        console.log('获取主图信息成功:', mainImgInfo)

        // Convert rpx to px (assuming 750rpx = 375px screen width)
        const systemInfo = wx.getSystemInfoSync()
        const pixelRatio = systemInfo.pixelRatio || 2
        const canvasWidth = this.data.width / 2 // Convert rpx to px
        const canvasHeight = (canvasWidth / mainImgInfo.width) * mainImgInfo.height
        console.log('画宽',canvasWidth)
        console.log('画高',canvasHeight)

        this.setData({
          canvasWidth,
          canvasHeight
        })

        // 2. Initialize canvas
        const ctx = wx.createCanvasContext('posterCanvas', this)

        // 3. Draw main image (background)
        await this.drawImageToCanvas(ctx, this.data.mainSrc, 0, 0, canvasWidth, canvasHeight)
        console.log('主图绘制完成')

        // 4. Draw QR code (与头像对称，在右边)
        if (this.data.subSrc) {
          const qrSize = canvasWidth * 0.25 // 放大二维码
          const qrX = canvasWidth - qrSize - 5 // 向左移动5px
          const qrY = canvasHeight - qrSize - 25 // 再向下移动20px
          await this.drawImageToCanvas(ctx, this.data.subSrc, qrX, qrY, qrSize, qrSize)
          console.log('次图（二维码）绘制完成')
        }

        // 6. Draw user info (bottom-left)
        if (this.data.userInfo.avatar || this.data.userInfo.name) {
          await this.drawUserInfo(ctx, canvasWidth, canvasHeight)
        }

        // 7. Draw to canvas（所有内容绘制完成后，统一绘制到 Canvas）
        console.log('准备调用 ctx.draw()')
        ctx.draw(false, () => {
          console.log('ctx.draw() 回调执行')
          this.canvasToImage(canvasWidth, canvasHeight)
        })

      } catch (error) {
        console.error('Poster generation failed:', error)
        this.setData({
          isLoading: false
        })
      }
    },

    async drawUserInfo(ctx, canvasWidth, canvasHeight) {
      const avatarSize = canvasWidth * 0.12 + 10 // 放大10px
      const avatarX = 5 // 向右移动5px
      const avatarY = canvasHeight - avatarSize - 45 // 再向下移动10px

      // Draw circular avatar
      if (this.data.userInfo.avatar) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, 2 * Math.PI)
        ctx.clip()

        try {
          // 下载头像到本地
          const avatarLocalPath = await this.downloadImage(this.data.userInfo.avatar)
          console.log('头像已下载:', avatarLocalPath)

          // Draw avatar image
          await new Promise((resolve) => {
            ctx.drawImage(
              avatarLocalPath,
              avatarX,
              avatarY,
              avatarSize,
              avatarSize
            )
            setTimeout(() => resolve(), 100)
          })
        } catch (error) {
          console.error('Failed to draw avatar:', error)
        }

        ctx.restore()
      }

      // Draw user name and phone
      const nameFontSize = canvasWidth * 0.04
      const phoneFontSize = canvasWidth * 0.035
      const inviteFontSize = canvasWidth * 0.035

      const textX = avatarX + avatarSize + 15
      const nameY = avatarY + avatarSize / 2 - 5 // 向上移动10px
      const inviteY = nameY + nameFontSize + 10

      // Draw name
      ctx.setFontSize(nameFontSize)
      ctx.setFillStyle('#000000')
      ctx.setTextAlign('left')
      ctx.setTextBaseline('bottom')
      ctx.fillText(this.data.userInfo.name || '', textX, nameY)

      // Draw invite text (橙色，在名字下方)
      ctx.setFontSize(inviteFontSize)
      ctx.setFillStyle('#FF6B00') // 橙色
      ctx.fillText('邀请您学习科一科四,不过包退款', textX, inviteY)
    },

    async drawImageToCanvas(ctx, src, x, y, width, height) {
      const fullSrc = `${this.data.urlPrefix}${src}`
      console.log('准备绘制图片:', fullSrc)

      try {
        // 先下载图片到本地
        const localPath = await this.downloadImage(fullSrc)
        console.log('图片已下载到本地，准备绘制到 Canvas:', localPath)
        console.log('绘制参数:', { x, y, width, height })

        // 绘制本地图片到 Canvas（不调用 draw，等所有内容绘制完再统一绘制）
        return new Promise((resolve) => {
          ctx.drawImage(localPath, x, y, width, height)
          console.log('drawImage 调用完成')
          setTimeout(() => {
            console.log('图片绘制等待完成')
            resolve()
          }, 200)
        })
      } catch (error) {
        console.error('绘制图片失败:', error)
        throw error
      }
    },

    downloadImage(url) {
      return new Promise((resolve, reject) => {
        wx.downloadFile({
          url: url,
          success: (res) => {
            if (res.statusCode === 200) {
              console.log('图片下载成功:', res.tempFilePath)
              resolve(res.tempFilePath)
            } else {
              console.error('图片下载失败, statusCode:', res.statusCode)
              reject(new Error(`下载失败: ${res.statusCode}`))
            }
          },
          fail: (err) => {
            console.error('图片下载失败:', err)
            reject(err)
          }
        })
      })
    },

    getImageInfo(src) {
      const fullSrc = `${this.data.urlPrefix}${src}`
      console.log('getImageInfo 完整路径:', fullSrc)
      return new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: fullSrc,
          success: (res) => {
            console.log('getImageInfo 成功:', res)
            resolve(res)
          },
          fail: (err) => {
            console.error('getImageInfo 失败:', err)
            console.error('失败的路径:', fullSrc)
            reject(err)
          }
        })
      })
    },

    canvasToImage(canvasWidth, canvasHeight) {
      wx.canvasToTempFilePath({
        canvasId: 'posterCanvas',
        x: 0,
        y: 0,
        width: canvasWidth,
        height: canvasHeight,
        destWidth: canvasWidth * 2,
        destHeight: canvasHeight * 2,
        fileType: 'png',
        quality: 1,
        success: (res) => {
          this.setData({
            posterUrl: res.tempFilePath,
            isLoading: false
          })
        },
        fail: (error) => {
          console.error('Canvas to image failed:', error)
          this.setData({
            isLoading: false
          })
        }
      }, this)
    },

    // Expose method to get poster URL
    getPosterUrl() {
      return this.data.posterUrl
    }
  }
})