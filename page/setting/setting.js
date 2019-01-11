const Utils = require('../../utils/utils');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        screenBrightLevel: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const self = this;
        wx.getScreenBrightness({
            success(res) {
				const value = Math.floor(res.value * 100);
                self.setData({
                    screenBrightLevel: value
                });
            }
        })
    },

    /**
     * 跳转系统信息
     */
    goSystem() {
        wx.navigateTo({
            url: '/page/system/system',
        });
    },

    /**
     * 弹出对话框
     */
    showToastModal(msg) {
        wx.hideLoading();
        wx.showModal({
            title: '检测结果',
            content: msg,
            showCancel: false,
            confirmText: '朕知道了'
        })
    },

    /**
     * 使手机震动
     */
    checkShock() {
        wx.vibrateLong();
    },

    /**
     * 检测NFC
     */
    checkNfcSupport() {
        const self = this;
        wx.showLoading({
            title: '检测中...',
        });
        wx.getHCEState({
            success() {
                self.showToastModal('该设备支持NFC功能');
            },
            fail() {
                self.showToastModal('该设备不支持NFC功能');
            }
        })
    },

    /**
     * 检测网络类型
     */
    checkNetworkType() {
        const self = this;
        wx.getNetworkType({
            success(res) {
                const networkType = res.networkType;
                if (networkType !== 'none') {
                    self.showToastModal(`${networkType} 网络`);
                } else {
                    self.showToastModal('无网络');
                }
            }
        })
    },

    /**
     * 检查手机电量
     */
    checkPowerLevel() {
        const self = this;
        wx.getBatteryInfo({
            success(res) {
                self.showToastModal(`剩余电量 ${res.level}`);
            }
        })
    },

    /**
     * 扫码功能
     */
    checkScanQrcode() {
        const promise = new Promise(resolve => {
            wx.scanCode({
                success(res) {
                    wx.showModal({
                        title: '检测结果',
                        content: `扫码结果：${res.result}`,
                        cancelText: '取消',
                        confirmText: '复制',
                        success: msg => {
                            if (msg.confirm) {
                                resolve(res.result);
                            }
                        }
                    })
                }
            })
        });

        promise.then(result => {
            wx.setClipboardData({
                data: result,
                success() {
                    Utils.errorHandler('已复制到剪贴板');
                }
            })
        });
    },

    /**
     * 保持屏幕常亮变化
     */
    switchChange(e) {
        const flag = e.detail.value;
        wx.setKeepScreenOn({
            keepScreenOn: flag
        })
    },

    /**
     * 屏幕亮度调整
     */
    sliderchange(e) {
        const value = e.detail.value;
        this.setData({
            screenBrightLevel: value
        });
		wx.setScreenBrightness({
			value: value / 100
		});
    },

    /**
     * 清除缓存
     */
    clearAllStorage() {
        wx.clearStorage({
            success() {
                wx.showToast({
                    title: '清除成功',
                    icon: 'success'
                })
            }
        })
    }

})