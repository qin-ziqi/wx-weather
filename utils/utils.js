module.exports = {
    /**
     * 错误信息显示
     */
    errorHandler: info => {
        wx.showToast({
            title: info,
            icon: 'none',
            duration: 1000
        })
    },

    /**
     * 判断对象是否为空
     */
    isEmptyObject: obj => {
        for (let i in obj) {
            return false
        }
        return true
    },

    /**
     * 格式化日期数据
     */
    formatDate(date, type) {
		if (isNaN(date.getTime())) {
            return '--';
        }

        const o = {
			'y+': date.getFullYear(),
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
			'h+': date.getHours(),
			'm+': date.getMinutes(),
			's+': date.getSeconds(),
			// 季度
			'q+': Math.floor((date.getMonth() + 3) / 3),
			// 毫秒
			'S+': date.getMilliseconds()
        }

		for(let k in o) {
			if(new RegExp(`(${k})`).test(type)) {
				type = type.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
			}
		}
		return type;
    }
}