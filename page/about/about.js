Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrls: [{
            src: '/asset/image/tongyong.jpg',
            name: '通用'
        }, {
            src: '/asset/image/qing.jpg',
            name: '晴'
        }, {
            src: '/asset/image/feng.jpg',
            name: '风'
        }, {
            src: '/asset/image/yu.jpg',
            name: '雨'
        }, {
            src: '/asset/image/xue.jpg',
            name: '雪'
        }, {
            src: '/asset/image/mai.jpg',
            name: '霾'
        }],
        indicatorDots: true,
        autoplay: true,
        interval: 2000,
        duration: 500,
        developerInfo: [{
                type: 'developer',
                img: '/asset/image/user.svg',
                info: 'qin-ziqi'
            },
            {
                type: 'github',
                img: '/asset/image/github.svg',
                info: 'https://github.com/qin-ziqi'
            },
            {
                type: 'qq',
                img: '/asset/image/QQ.svg',
                info: '348633040'
            },
            {
                type: 'email',
                img: '/asset/image/email.svg',
                info: '348633040@qq.com'
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    }
})