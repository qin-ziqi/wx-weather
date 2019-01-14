const GlobalData = getApp().globalData;
const Utils = require('../../utils/utils');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        weatherIconUrl: GlobalData.weatherIconUrl,
        bcg: {
			src: '/asset/image/qing.jpg',
			color: '#358DBB',
			name: '晴',
			value: '1'
		},
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
        },
        bcgList: [{
            src: '/asset/image/tongyong.jpg',
            color: '#5A9146',
            name: '通用',
            value: 'default'
        }, {
            src: '/asset/image/qing.jpg',
            color: '#358DBB',
            name: '晴',
            value: '1'
        }, {
            src: '/asset/image/feng.jpg',
            color: '#496781',
            name: '风',
            value: '2'
        }, {
            src: '/asset/image/yu.jpg',
            color: '#5E6F9C',
            name: '雨',
            value: '3'
        }, {
            src: '/asset/image/xue.jpg',
            color: '#9CB8DB',
            name: '雪',
            value: '4'
        }, {
            src: '/asset/image/mai.jpg',
            color: '#A3BDF0',
            name: '霾',
            value: '5'
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.checkUpdate();
        this.reloadPage();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        wx.showLoading();
        setTimeout(() => {
            wx.hideLoading();
        }, 500);
    },

    /**
     * 页面初始化
     */
    init(city, callback) {
        this.getWeather(city);
        this.getHourly(city);
        this.getDaily(city);

        wx.stopPullDownRefresh();

        callback && callback()
    },

    /**
     * 获取地理位置信息
     */
    getLocation() {
        const promise = new Promise((resolve, reject) => {
            wx.getStorage({
                key: 'city',
                success: res => {
                    resolve(res.data);
                },
                fail: () => {
                    reject();
                }
            });
        });

        promise.then(success => {
            this.init(success);
        }).catch(() => {
            wx.getLocation({
                success: res => {
                    this.getCityDetail(`${res.longitude},${res.latitude}`);
                },
                fail: () => {
					this.init('北京');
                }
            })
        });
    },

    /**
     * 获取城市信息
     */
	getCityDetail(location) {
        const promise = new Promise(resolve => {
            wx.request({
                url: GlobalData.gaodeApi.location,
                data: {
                    location,
                    key: GlobalData.gaodeKey,
                },
                success(res) {
                    if (res.statusCode === 200) {
                        if (res.data.status === '1') {
                            resolve(res.data.regeocode.addressComponent.district);
                        }
                    }
                }
            })
        });

        promise.then(success => {
            this.init(success);
        })
    },

    /**
     * 获取当前天气数据
     */
    getWeather(location) {
        const promise = new Promise(resolve => {
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
                }
            })
        });

        promise.then(success => {
            this.clearInput();
            this.selectBcg(success.now);

            const now = new Date();
            const time = Utils.formatDate(now, 'hh:mm');
            this.getWeatherDesc(success.now, 1).then(suc => {
                wx.setStorage({
                    key: 'city',
                    data: location
                });
                this.setData({
                    city: location,
                    weather: success,
                    updateTime: time,
                    weatherDetail: suc
                });
            });
        });
    },

    /**
     * 获取24小时天气信息
     */
    getHourly(location) {
        const promise = new Promise(resolve => {
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
                        }
                    }
                }
            })
        });

        promise.then(success => {
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
        });
    },

    /**
     * 获取七天的天气信息
     */
    getDaily(location) {
        const promise = new Promise(resolve => {
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
                        }
                    }
                }
            })
        });

        promise.then(success => {
            const dailyWeather = success.daily_forecast.map((item, i) => {
                if (i === 0) {
                    item.date = '今天';
                }
                if (i === 1) {
                    item.date = '明天';
                }
                if (i === 2) {
                    item.date = '后天';
                }
                return item;
            });
            this.setData({
                dailyWeather: dailyWeather
            });
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
        const bcgColor = this.data.bcg.color;
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: bcgColor
        })
    },

    /**
     * 根据天气概况选择背景图
     */
    selectBcg(data) {
        const val = data.cond_code.substring(0, 1);
        let obj = this.data.bcgList.find(item => String(val) === String(item.value));
        if (!obj) {
            obj = this.data.bcgList[0];
        }
        this.setData({
            bcg: obj
        });
        this.setNavigationBarColor();
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
    },

    /**
     * 检测是否有版本更新
     */
    checkUpdate() {
        const updateManager = wx.getUpdateManager()

        updateManager.onUpdateReady(function() {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success(res) {
                    if (res.confirm) {
                        updateManager.applyUpdate();
                    }
                }
            })
        })
    },

    /**
     * 设置分享
     */
    onShareAppMessage: function() {
        return {
            title: '出行早知道',
            path: '/page/index/index',
            imageUrl: '/asset/image/share_info.jpg'
        }
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
            url: '/page/setting/setting',
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

    },
})