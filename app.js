App({
  onLaunch: function () {
    const self = this;
    wx.getSystemInfo({
      success: function(res) {
        self.globalData.systemInfo = res;
        console.log(res);
      },
    })
  },
  globalData: {
    systemInfo: null
  }
 
})
