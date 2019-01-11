const GlobalData = getApp().globalData;
const Utils = require('../../utils/utils');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        searchText: null,
        allCities: null,
        filterCities: null,
        hotCities: null,
        isSearch: false,
        location: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		this.getHotCityStorage();
		this.getAllCityStorage();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        const promise = new Promise(resolve => {
            wx.getStorage({
                key: 'location',
                success: function(res) {
                    resolve(res.data);
                }
            });
        });
        promise.then(success => {
            this.setData({
                location: success
            })
        });
    },

    /**
     * 获取热门城市缓存
     */
    getHotCityStorage() {
        wx.getStorage({
            key: 'hotCities',
            success: res => {
                this.setData({
					hotCities: res.data
                });
            },
            fail: () => {
                this.getHotCity();
            }
        });
    },

    /**
     * 获取热门城市
     */
    getHotCity() {
        const promise = new Promise(resolve => {
            wx.request({
                url: GlobalData.hefengApi.hotCity,
                data: {
                    group: 'cn',
                    key: GlobalData.hefengKey
                },
                success: res => {
                    if (res.statusCode === 200) {
                        const data = res.data.HeWeather6[0];
                        if (data.status === 'ok') {
                            resolve(data.basic);
                        } else {
                            Utils.errorHandler('获取热门城市失败');
                        }
                    }
                }
            });
        });

        promise.then(success => {
            this.setData({
                hotCities: success
            });
            wx.setStorage({
				key: 'hotCities',
                data: success
            });
        })
    },

	/**
	 * 获取所有的城市信息缓存
	 */
	getAllCityStorage() {
		wx.getStorage({
			key: 'allCities',
			success: res => {
				this.setData({
					allCities: res.data
				});
			},
			fail: () => {
				this.getAllCity();
			}
		});
	},
    /**
     * 获取所有的城市信息
     */
    getAllCity() {
        const promise = new Promise(resolve => {
            wx.request({
                url: GlobalData.gaodeApi.district,
                data: {
                    keywords: '中国',
                    subdistrict: 2,
                    key: GlobalData.gaodeKey
                },
                success: res => {
                    if (res.statusCode === 200) {
                        if (res.data.status === '1') {
                            resolve(res.data.districts);
                        }
                    }
                }
            })
        });

        promise.then(success => {
            this.formatCity(success);
        });
    },

    /**
     * 整理城市信息
     */
    formatCity(data) {
        const allCities = {};
        const sortCities = this.sort(data[0].districts);
        sortCities.forEach(item => {
            const sortDistricts = this.sort(item.districts);
			if (typeof item.citycode === "string"){ // 直辖市
				allCities[item.name] = [
					{name: item.name}					
				];
			}else{
				allCities[item.name] = sortDistricts;
			}
        });

        this.setData({
            allCities
        });
		wx.setStorage({
			key: 'allCities',
			data: allCities
		})

    },

    /**
     * 根据code排序
     */
    sort(items) {
        const result = items.sort((a, b) => {
            if (a.adcode > b.adcode) {
                return 1;
            } else {
                return -1;
            }
        });
        return result;
    },

    /**
     * 清空输入数据
     */
    clear() {
        this.setData({
            searchText: null,
            filterCity: null,
            isSearch: false
        })
    },

    /**
     * 城市数据过滤
     */
    cityFilter(e) {
        const value = e.detail.value;
		if (!value){
			this.clear();
			return;
		}
		this.setData({
			isSearch: true
		});
        const promise = new Promise(resolve => {
            wx.request({
                url: GlobalData.hefengApi.findCity,
                data: {
                    location: value,
                    key: GlobalData.hefengKey
                },
                success: res => {
                    if (res.statusCode === 200) {
                        const data = res.data.HeWeather6[0];
                        if (data.status === 'ok') {
                            resolve(data.basic);
                        } else {
                            Utils.errorHandler('未查到相关城市');
                        }
                    }
                }
            });
        });

        promise.then(success => {
			const filterCities = success.map(item => {
				return {
					name: item.location,
					desc: item.parent_city
				}
			});
			this.setData({
				filterCities
			})
        })
    },

    /**
     * 城市选择
     */
    chooseCity(e) {
        this.setData({
            isSearch: false
        });
        const name = e.target.dataset.name;
        const page = getCurrentPages();
        const indexPage = page[0];
        indexPage.init(name, () => {
            wx.navigateBack({})
        });
    }
})