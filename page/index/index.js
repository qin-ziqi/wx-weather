const GlobalData = getApp().globalData;
const Utils = require('../../utils/utils');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        weatherIconUrl: GlobalData.weatherIconUrl,
        bcgColor: '#13223F',
        bcgUrl: '/asset/image/bcg-1.jpg',
        searchText: null,
        city: '定位中',
        info: null,
        updateTime: '00:00'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.reloadPage();
    },

	/**
 * 页面初始化
 */
	init(city, callback) {
		this.setData({
			city
		});
		this.getWeather(city);
		callback && callback()
	},

    /**
     * 获取天气信息成功后的回调
     */
	success(res) {
		wx.stopPullDownRefresh();
		const now = new Date();
		const time = Utils.formatDate(now, 'hh:mm');
		this.setData({
			info: res,
			updateTime: time
		});
	},

	/**
	 * 获取位置信息失败
	 */
	fail() {
		wx.stopPullDownRefresh();
	},

    /**
     * 获取地理位置信息
     */
    getLocationAuth() {
        wx.getStorage({
            key: 'auth',
            success: res => {
                if (res) {
                    this.getLocation();
                }
            },
            fail: () => {
                wx.showModal({
                    title: '地理位置授权',
                    content: '允许访问你当前的地理位置信息？',
                    success: msg => {
                        if (msg.confirm) {
                            this.getLocation();
                            try {
                                wx.setStorageSync('auth', true)
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        if (msg.cancel) {
							this.fail();
							Utils.errorHandler('获取位置信息失败');
                            try {
                                wx.removeStorageSync('auth')
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }
                })
            }
        });
    },

    /**
     * 获取地理位置信息
     */
    getLocation() {
        wx.getLocation({
            success: res => {
                this.getGlobalCity(`${res.longitude},${res.latitude}`).then(suc => {
                    const city = suc.data.regeocode.addressComponent.district;
                    GlobalData.location = city;
                    this.init(city);
                })
            }
        })
    },

    /**
     * 获取城市信息
     */
    getGlobalCity(location) {
        return new Promise(resolve => {
            wx.request({
                url: `https://restapi.amap.com/v3/geocode/regeo?location=${location}&key=${GlobalData.gaodeKey}`,
                success(res) {
                    resolve(res);
                }
            })
        });
    },

    /**
     * 获取天气数据
     */
    getWeather(location) {
        wx.request({
            url: `${GlobalData.requestUrl.weather}`,
            data: {
                location,
                key: GlobalData.hefengKey,
            },
            success: res => {
                console.log(res);
                if (res.statusCode === 200) {
                    let data = res.data.HeWeather6[0]
                    if (data.status === 'ok') {
                        this.clearInput();
                        this.success(data);
                    } else {
                        Utils.errorHandler('获取天气信息失败');
                    }
                }
            },
            fail: () => {
                Utils.errorHandler('获取天气信息失败');
				this.fail();
            }
        })
    },

    /**
     * 设置导航栏背景色
     */
    setNavigationBarColor() {
        const bcgColor = this.data.bcgColor;
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: bcgColor
        })
    },

    /**
     * 确认搜索内容
     */
    confirmSearch(e) {
        const city = e.detail.value;
        this.init(city);
    },

    /**
     * 清空输入框
     */
    clearInput() {
        this.setData({
            searchText: null
        })
    },

    /**
     * 去选择城市
     */
    goChooseCity() {
        wx.navigateTo({
            url: '/page/city/city',
        })
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh(res) {
        this.reloadPage()
    },

    /**
     * 重新加载
     */
    reloadPage() {
        this.getLocationAuth();
        this.setNavigationBarColor();
    }

})