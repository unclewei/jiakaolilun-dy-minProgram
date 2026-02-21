// pages/SharePoster/index.js
import {
  adResourceList,
  getShareQRCode
} from "../../utils/api";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainSrc: '', // 主图片
    subSrc: '', // 二维码图片
    posterUrl: '', // 生成的海报图片
    isLoading: true, // 加载状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadPosterData();
  },

  /**
   * 加载海报数据
   */
  loadPosterData() {
    tt.showLoading({
      title: '加载中...',
      mask: true
    });

    // 并行请求两个接口
    Promise.all([
      this.getAdResourceData(),
      this.getShareQRCodeData()
    ]).then(() => {
      tt.hideLoading();
      this.setData({
        isLoading: false
      });
    }).catch((error) => {
      console.error('Load poster data failed:', error);
      tt.hideLoading();
      tt.showToast({
        title: '加载失败',
        icon: 'none'
      });
      this.setData({
        isLoading: false
      });
    });
  },

  /**
   * 获取广告资源列表
   */
  getAdResourceData() {
    return adResourceList({
      skip: 0,
      limit: 10,
      state: "online",
      type: "poster",
    }).then((res) => {
      if (res.data.code !== 200) {
        throw new Error('adResourceList failed');
      }
      const resData = res.data.data;
      // 获取列表的第一个数据作为主图片
      if (resData && resData.length > 0) {
        const firstResource = resData[0];
        // 假设资源对象中有 imageUrl 或 path 字段
        const mainSrc = firstResource.imageInfo.path
        if (mainSrc) {
          this.setData({
            mainSrc
          });
        }
      }
    });
  },

  /**
   * 获取分享二维码
   */
  getShareQRCodeData() {
    return getShareQRCode().then((res) => {
      if (res.data.code !== 200) {
        throw new Error('getShareQRCode failed');
      }
      const resData = res.data.data;
      const firstResource = resData[0];
      console.log('firstResource', firstResource)
      this.setData({
        subSrc: firstResource.imageInfo.path
      });
      return
      // 假设返回的是二维码图片URL或包含二维码URL的对象
      let qrCodeUrl = '';
      if (typeof resData === 'string') {
        qrCodeUrl = resData;
      } else if (resData && (resData.qrCodeUrl || resData.url || resData.imageUrl)) {
        qrCodeUrl = resData.qrCodeUrl || resData.url || resData.imageUrl;
      }

      if (qrCodeUrl) {
        this.setData({
          subSrc: qrCodeUrl
        });
      }
    });
  },

  /**
   * 海报生成完成回调
   */
  onPosterReady(e) {
    console.log('Poster ready:', e.detail);
    this.setData({
      posterUrl: e.detail.posterUrl
    });
  },

  /**
   * 保存图片到相册
   */
  saveImage() {
    const posterComponent = this.selectComponent('#poster');
    if (!posterComponent) {
      tt.showToast({
        title: '海报组件未加载',
        icon: 'none'
      });
      return;
    }

    const posterUrl = posterComponent.getPosterUrl();
    if (!posterUrl) {
      tt.showToast({
        title: '海报尚未生成',
        icon: 'none'
      });
      return;
    }

    // 请求保存相册权限
    tt.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          tt.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              this.saveToPhotosAlbum(posterUrl);
            },
            fail: () => {
              tt.showModal({
                title: '提示',
                content: '需要您授权保存相册权限',
                showCancel: false,
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    tt.openSetting();
                  }
                }
              });
            }
          });
        } else {
          this.saveToPhotosAlbum(posterUrl);
        }
      }
    });
  },

  /**
   * 保存到相册
   */
  saveToPhotosAlbum(filePath) {
    tt.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        tt.showToast({
          title: '已保存到相册',
          icon: 'success'
        });
      },
      fail: (error) => {
        console.error('Save image failed:', error);
        tt.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.loadPosterData();
    tt.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    const userInfo = getApp().globalData.userInfo;
    return {
      title: '邀请你学习驾考理论知识，精选500题，不过全退',
      path: '/pages/index/index?fromWho=' + (userInfo._id || ''),
      imageUrl: this.data.posterUrl || 'http://aliyuncdn.ydt.biguojk.com/logo/41780e9debb632d5d348001ca7d2ba3.png'
    };
  }
})