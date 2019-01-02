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
        gaodeKey: '0a6f7e4adc55c410a9591b79d8b4fdb2',
        weatherIconUrl: 'https://cdn.heweather.com/cond_icon/',
        requestUrl: {
			weather: 'https://free-api.heweather.net/s6/weather/now',
			hourly: 'https://free-api.heweather.net/s6/weather/forecast',
            hotCity: 'https://search.heweather.net/top'
        },
    }

})