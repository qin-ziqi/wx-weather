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
        updateTime: '00:00',
        hourlyWeather: null,
        dailyWeather: null,
        nowDesc: {
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
            dew:'露点温度',
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
        this.setData({
            city
        });

        /**
         * 当前的天气
         */
        this.getWeather(city).then(success => {
            this.clearInput();
            const now = new Date();
            const time = Utils.formatDate(now, 'hh:mm');
            this.getWeatherDesc(success.now, 1).then(suc => {
                this.setData({
                    info: success,
                    updateTime: time,
                    nowInfo: suc
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

        callback && callback()
    },

    /**
     * 获取地理位置信息
     */
    getLocation() {
        wx.getLocation({
            success: res => {
                this.getGlobalCity(`${res.longitude},${res.latitude}`).then(success => {
                    const city = success.data.regeocode.addressComponent.district;
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
			const obj = flag === 1 ? this.data.nowDesc : this.data.hourlyDesc;
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
    }

})