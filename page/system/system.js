Page({

    /**
     * 页面的初始数据
     */
    data: {
        systemInfo: null,
        systemInfoKey: [{
                key: 'brand',
                desc: '手机品牌'
            },
            {
                key: 'model',
                desc: '手机型号'
            },
            {
                key: 'pixelRatio',
                desc: '设备像素比'
            },
            {
                key: 'screenWidth',
                desc: '屏幕宽度'
            },
            {
                key: 'screenHeight',
                desc: '屏幕高度'
            },
            {
                key: 'windowWidth',
                desc: '可使用窗口宽度'
            },
            {
                key: 'windowHeight',
                desc: '可使用窗口高度'
            },
            {
                key: 'statusBarHeight',
                desc: '状态栏的高度'
            },
            {
                key: 'language',
                desc: '微信设置的语言'
            },
            {
                key: 'version',
                desc: '微信版本号'
            },
            {
                key: 'system',
                desc: '操作系统版本'
            },
            {
                key: 'platform',
                desc: '客户端平台'
            },
            {
                key: 'fontSizeSetting',
                desc: '用户字体大小设置'
            },
            {
                key: 'SDKVersion',
                desc: '客户端基础库版本'
            },
            {
                key: 'benchmarkLevel',
                desc: '性能等级'
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            systemInfo: getApp().globalData.systemInfo
        })
    }
})