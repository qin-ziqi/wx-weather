// page/about/about.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrls: [{
                src: '/asset/image/swiper-1.jpg',
                name: '风景'
            },
            {
                src: '/asset/image/swiper-2.jpg',
                name: '宠物'
            },
            {
                src: '/asset/image/swiper-3.jpg',
                name: '人物'
            }
        ],
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