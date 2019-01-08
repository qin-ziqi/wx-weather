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
        updateTime: '00:00',
        weather: null,
        weatherDetail: null,
        hourlyWeather: null,
        dailyWeather: null,
        animationFlag: true,
        weatherDesc: {
            tmp: '温度(℃)',
            fl: '体感温度(℃)',
            cond_txt: '实况天气',
            wind_deg: '风向角度(deg)',
            wind_dir: '风向',
            wind_sc: '风力(级)',
            wind_spd: '风速(km/h)',
            hum: '相对湿度(%)',
            pcpn: '降水量(mm)',
            pres: '大气压强(mPa)',
            vis: '能见度(km)',
            cloud: '云量'
        },
        hourlyDesc: {
            tmp: '温度(℃)',
            cond_txt: '实况天气',
            wind_deg: '风向角度(deg)',
            wind_dir: '风向',
            wind_sc: '风力(级)',
            wind_spd: '风速(km/h)',
            hum: '相对湿度(%)',
            pres: '大气压强(mPa)',
            pop: '降水概率(%)',
            dew: '露点温度',
            cloud: '云量(%)'
        }
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
        /**
         * 当前的天气
         */
        this.getWeather(city).then(success => {
            this.clearInput();
            const now = new Date();
            const time = Utils.formatDate(now, 'hh:mm');
            this.getWeatherDesc(success.now, 1).then(suc => {
                this.setData({
                    city,
                    weather: success,
                    updateTime: time,
                    weatherDetail: suc
                });
            });
        }).catch(error => {
            Utils.errorHandler(error);
        });

        /**
         * 24小时天气信息
         */
        this.getHourly(city).then(success => {
            const hourlyList = [];
            success.hourly.forEach((item, i) => {
                this.getWeatherDesc(item, 2).then(suc => {
                    const o = {
                        time: item.time,
                        details: suc
                    }
                    hourlyList.push(o);
                    if (i === success.hourly.length - 1) {
                        this.setData({
                            hourlyWeather: hourlyList
                        });
                    }
                })
            })
        }).catch(error => {
            console.log(error);
        });

        /**
         * 七天天气信息
         */
        this.getDaily(city).then(success => {
            this.setData({
                dailyWeather: success.daily_forecast
            });
        }).catch(error => {
            console.log(error);
        });

        wx.stopPullDownRefresh();

        callback && callback()
    },

    /**
     * 获取地理位置信息
     */
    getLocation() {
        const that = this;
        wx.getStorage({
            key: 'location',
            success: res => {
                GlobalData.location = res.data;
                that.init(res.data);
            },
            fail: msg => {
                Utils.errorHandler('获取缓存失败');
                wx.getLocation({
                    success: res => {
                        that.getGlobalCity(`${res.longitude},${res.latitude}`).then(success => {
                            const city = success.data.regeocode.addressComponent.district;
                            GlobalData.location = city;
                            that.init(city);
                        })
                    }
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
                url: GlobalData.gaodeApi.location,
                data: {
                    location,
                    key: GlobalData.gaodeKey,
                },
                success(res) {
                    resolve(res);
                }
            })
        });
    },

    /**
     * 获取当前天气数据
     */
    getWeather(location) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: GlobalData.hefengApi.weather,
                data: {
                    location,
                    key: GlobalData.hefengKey,
                },
                success: res => {
                    if (res.statusCode === 200) {
                        let data = res.data.HeWeather6[0]
                        if (data.status === 'ok') {
                            resolve(data);
                        } else {
                            Utils.errorHandler('获取天气信息失败');
                        }
                    }
                },
                fail: msg => {
                    reject(msg);
                }
            })
        });
    },

    /**
     * 获取24小时天气信息
     */
    getHourly(location) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: GlobalData.hefengApi.hourly,
                data: {
                    location,
                    key: GlobalData.hefengKey,
                },
                success: res => {
                    if (res.statusCode === 200) {
                        let data = res.data.HeWeather6[0]
                        if (data.status === 'ok') {
                            resolve(data);
                        } else {
                            Utils.errorHandler('获取天气信息失败');
                        }
                    }
                },
                fail: msg => {
                    reject(msg);
                }
            })
        });
    },

    /**
     * 获取七天的天气信息
     */
    getDaily(location) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: GlobalData.hefengApi.daily,
                data: {
                    location,
                    key: GlobalData.hefengKey,
                },
                success: res => {
                    if (res.statusCode === 200) {
                        let data = res.data.HeWeather6[0]
                        if (data.status === 'ok') {
                            resolve(data);
                        } else {
                            Utils.errorHandler('获取天气信息失败');
                        }
                    }
                },
                fail: msg => {
                    reject(msg);
                }
            })
        });
    },

    /**
     * 获取天气描述信息
     */
    getWeatherDesc(wetaher, flag) {
        return new Promise(resolve => {
            const desc = [];
            const obj = flag === 1 ? this.data.weatherDesc : this.data.hourlyDesc;
            for (let i in obj) {
                const o = {
                    value: wetaher[i],
                    name: obj[i]
                };
                desc.push(o);
            }
            resolve(desc);
        });
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
        this.getLocation();
        this.setNavigationBarColor();
    },

    /**
     * 分享
     */
    goShare() {
        wx.showShareMenu({
            withShareTicket: true
        })
    },

    /**
     * 跳转城市
     */
    goCity() {
        this.menuChange();
        wx.navigateTo({
            url: '/page/city/city',
        });
    },

    /**
     * 跳转关于
     */
    goAbout() {
        this.menuChange();
        wx.navigateTo({
            url: '/page/about/about',
        });
    },

    /**
     * 跳转系统信息
     */
    goSystem() {
        this.menuChange();
        wx.navigateTo({
            url: '/page/system/system',
        });
    },

    /**
     * 主菜单点击
     */
    menuChange() {
        if (this.data.animationFlag) {
            this.animationRun();
            this.setData({
                animationFlag: false
            })
        } else {
            this.animationBack();
            this.setData({
                animationFlag: true
            })
        }
    },

    /**
     * 动画启动
     */
    animationRun() {
        const animationZero = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        });
        const animationOne = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        });
        const animationTwo = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        });
        const animationThree = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        });
        const animationFour = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        });
        animationZero.rotateZ(180).step();
        animationOne.translate(0, -50).rotateZ(360).opacity(1).step();
        animationTwo.translate(-Math.sqrt(2500 - 625), -25).rotateZ(360).opacity(1).step();
        animationThree.translate(-Math.sqrt(2500 - 625), 25).rotateZ(360).opacity(1).step();
        animationFour.translate(0, 50).rotateZ(360).opacity(1).step();
        this.setData({
            animationZero: animationZero.export(),
            animationOne: animationOne.export(),
            animationTwo: animationTwo.export(),
            animationThree: animationThree.export(),
            animationFour: animationFour.export()
        })
    },

    /**
     * 动画恢复
     */
    animationBack() {
        const animationZero = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-in'
        });
        const animationOne = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-in'
        });
        const animationTwo = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-in'
        });
        const animationThree = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-in'
        });
        const animationFour = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-in'
        });
        animationZero.rotateZ(0).step();
        animationOne.translate(0, 0).rotateZ(0).opacity(0).step();
        animationTwo.translate(0, 0).rotateZ(0).opacity(0).step();
        animationThree.translate(0, 0).rotateZ(0).opacity(0).step();
        animationFour.translate(0, 0).rotateZ(0).opacity(0).step();
        this.setData({
            animationZero: animationZero.export(),
            animationOne: animationOne.export(),
            animationTwo: animationTwo.export(),
            animationThree: animationThree.export(),
            animationFour: animationFour.export()
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

		wx.setStorage({
			key: 'location',
			data: this.data.city
		});
    },
})