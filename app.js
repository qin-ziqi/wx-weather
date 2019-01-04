App({
    onLaunch: function() {
        const self = this;
        wx.getSystemInfo({
            success: function(res) {
                self.globalData.systemInfo = res;
            },
        })
    },
    globalData: {
        systemInfo: null,
        location: null,
        hefengKey: '796ec8fe17934228b7a008b85841a6d3',
		gaodeKey: 'ce57ce5cc135a591d6e6e9eb6394c93c',
        weatherIconUrl: 'https://cdn.heweather.com/cond_icon/',
        hefengApi: {
			hotCity: 'https://search.heweather.net/top',
			weather: 'https://free-api.heweather.net/s6/weather/now',
			hourly: 'https://free-api.heweather.net/s6/weather/hourly',
			daily: 'https://free-api.heweather.net/s6/weather/forecast'
        },
		gaodeApi: {
			location: 'https://restapi.amap.com/v3/geocode/regeo'
		}
    }

})