// component/nav-component.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        isShow: false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 显示导航菜单
         */
		showNaver() {
            this.setData({
                isShow: true
            })
        },

		/**
		 * 跳转首页
		 */
		toIndex() {
			wx.navigateTo({
				url: '/page/index/index',
			})
		},
		
        /**
         * 跳转城市选择页
         */
        toCitychoose() {
            wx.navigateTo({
                url: '/page/city/city',
            })
        },

        /**
         * 跳转系统页
         */
        toSystem() {
            wx.navigateTo({
                url: '/page/system/system',
            })
        },

        /**
         * 跳转关于页
         */
        toAbout() {
            wx.navigateTo({
                url: '/page/about/about',
            })
        }
    }
})