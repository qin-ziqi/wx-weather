const StaticData = require('../../asset/data/cityData.js')
const GlobalData = getApp().globalData;
const Utils = require('../../utils/utils');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        searchText: null,
        cities: null,
        filterCity: null,
        hotCities: [],
        location: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getHotCity();
        this.formatCity();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.setData({
            location: GlobalData.location
        })
    },

    /**
     * 获取热门城市
     */
    getHotCity() {
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
                        this.setData({
                            hotCities: data.basic
                        })
                    } else {
                        Utils.errorHandler('获取热门城市失败');
                    }
                }
            },
            fail: info => {
                Utils.errorHandler('获取热门城市失败');
            }
        });
    },

    /**
     * 整理城市信息
     */
    formatCity() {
        const cities = {};
        const letterArr = StaticData.cities.sort((a, b) => {
            if (a.letter > b.letter) {
                return 1;
            }
            if (a.letter < b.letter) {
                return -1;
            }
            return 0;
        });
        letterArr.forEach(item => {
            if (!cities[item.letter]) {
                cities[item.letter] = [];
            }
            cities[item.letter].push(item);
        });
        this.setData({
            cities
        })
    },

    /**
     * 清空输入数据
     */
    clear() {
        this.setData({
            searchText: null,
            filterCity: null
        })
    },

    /**
     * 城市数据过滤
     */
    cityFilter(e) {
        const value = e.detail.value;
        const cityInfo = StaticData.cities;
        if (!value) {
            this.setData({
                filterCity: null
            })
            return;
        }

        const startArray = cityInfo.filter(item => {
            if (item.name.startsWith(value)) {
                return item;
            }
        })

        const includesArray = cityInfo.filter(item => {
            if (item.name.includes(value) && !startArray.includes(item)) {
                return item;
            }
        })

        const filterArray = [...startArray, ...includesArray];
        this.setData({
            filterCity: filterArray
        })
    },

    /**
     * 城市选择
     */
    chooseCity(e) {
        const name = e.target.dataset.name;
        const page = getCurrentPages();
        const indexPage = page[0];
        indexPage.init(name, () => {
            wx.navigateBack({})
        });
    }
})