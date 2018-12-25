// page/city/city.js
const staticData = require('../../asset/data/cityData.js')

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
  onLoad: function (options) {
    this.setHotCity();
    this.formatCity();
    this.getLocation();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 定位当前城市
   */
  getLocation(){
    const that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        wx.request({
          url: `https://restapi.amap.com/v3/geocode/regeo?location=121.52609,31.25956&key=0a6f7e4adc55c410a9591b79d8b4fdb2`, // 仅为示例，并非真实的接口地址
          success(res) {
            const info = res.data.regeocode.addressComponent;
            that.setData({
              location: info.district
            });
            console.log(res.data)
          }
        })
      }
    })
  },

  /**
   * 获取热门城市
   */
  setHotCity(){
    this.setData({
      hotCities: [
        { name: '北京' },
        { name: '上海' },
        { name: '杭州' },
        { name: '南京' },
        { name: '成都' }
      ]
    })
  },

  /**
   * 整理城市信息
   */
  formatCity(){
    const cities= {};
    const letterArr = staticData.cities.sort((a, b) => {
      if(a.letter > b.letter){
        return 1;
      }
      if (a.letter < b.letter) {
        return -1;
      }
      return 0;
    });
    letterArr.forEach(item => {
      if (!cities[item.letter]){
        cities[item.letter] = [];
      }
      cities[item.letter].push(item);
    });
    this.setData({
      cities,
      // filterCity: cities
    })
  },

  /**
   * 清空输入数据
   */
  clear(){
    this.setData({
      searchText: null,
      filterCity: null
    })
  }, 

  /**
   * 城市数据过滤
   */
  cityFilter(e){
    const value = e.detail.value;
    const cityInfo = staticData.cities;
    if (!value) {
      this.setData({
        filterCity: null
      })
      return;
    }
   
    const startArray = cityInfo.filter(item => {
      if (item.name.startsWith(value)){
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
  chooseCity(e){
    const value = e.target.dataset.name;
    const page = getCurrentPages();
    console.log(page);
    wx.showModal({
      title: '提示',
      content: value,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 跳转系统页
   */
  toSystem() {
    wx.navigateTo({
      url: '/page/system/system',
    })
  }
})