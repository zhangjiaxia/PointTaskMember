<script>
	export default {
		onLaunch: function(options) {
			let that = this;
			that.$store.commit('setScene', options.scene)
			that.$store.commit('setType', options.query.type)
			that.$store.commit('setId', options.query.id)
			if (options.query.scene) {
			  //推荐人标识
			  const scene = decodeURIComponent(options.query.scene);
			  that.$store.commit('setWxacode', scene)
			}
			//加载小程序配置
			var userConfig = wx.getStorageSync('userConfig');//配置信息
			var userInfo = wx.getStorageSync('userInfo');//用户信息
			var userInit_MoneyAll = wx.getStorageSync('userInit_MoneyAll');//用户数据1
			var userInit_MoneyUse = wx.getStorageSync('userInit_MoneyUse');//用户数据2
			var userInit_MoneyCash = wx.getStorageSync('userInit_MoneyCash');//用户数据3
			var userInit_DataGet = wx.getStorageSync('userInit_DataGet');//用户数据4
			var userInit_DataMake = wx.getStorageSync('userInit_DataMake');//用户数据5
			var userInit_DataPass = wx.getStorageSync('userInit_DataPass');//用户数据6
			var banner = wx.getStorageSync('banner');//轮播图
			var taskClass = wx.getStorageSync('taskClass');//分类
			that.$store.commit('setUserConfig', userConfig);
			that.$store.commit('setUserInfo', userInfo);
			that.$store.commit('setUserInitMoneyAll', userInit_MoneyAll);
			that.$store.commit('setUserInitMoneyUse', userInit_MoneyUse);
			that.$store.commit('setUserInitMoneyCash', userInit_MoneyCash);
			that.$store.commit('setUserInitDataGet', userInit_DataGet);
			that.$store.commit('setUserInitDataMake', userInit_DataMake);
			that.$store.commit('setUserInitDataPass', userInit_DataPass);
			that.$store.commit('setBanner', banner);
			that.$store.commit('setTaskClass', taskClass);
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
			//获取设备顶部窗口高度
			this.getHeight();
			const updateManager = wx.getUpdateManager()
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				// console.log('1.2.0')
			})

			updateManager.onUpdateReady(function() {
				wx.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success: function(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate()
						}
					}
				})
			})

			updateManager.onUpdateFailed(function() {
				// 新版本下载失败
			})
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			getHeight() {
				var that = this;
				let menuButtonObject = wx.getMenuButtonBoundingClientRect();
				wx.getSystemInfo({
					success: res => {
						let statusBarHeight = res.statusBarHeight,
							navTop = menuButtonObject.top, //胶囊按钮与顶部的距离
							navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
						that.$store.commit('setNavHeight', navHeight)
						that.$store.commit('setNavTop', navTop)
						that.$store.commit('setWindowHeight', res.windowHeight)
						// that.globalData.navHeight = navHeight;
						// that.globalData.navTop = navTop;
						// that.globalData.windowHeight = res.windowHeight;
						// console.log(navHeight, navTop)
					},
					fail(err) {
						that.getHeight();
					}
				})
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "./common/uni.css";
	@import "./common/custom.css";
	/*导航栏吸顶效果*/
	.bar-sticky {
		position: sticky;
		position: -webkit-sticky;
		top: 0;
		z-index: 101;
	}
	page{
	  background-color: #F6F6F9;
	}
	.container {
	  display: flex;
	  flex-direction: column;
	}
	.search{
	  z-index: 1001;
	  position: fixed;
	  top: 0;
	  width: 100%;
	  height: 72rpx;
	  background-color: #ff3f4c;
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  justify-content: space-between;
	}
	.search-city{
	  padding: 0 30rpx;
	  font-size: 28rpx;
	  line-height: 72rpx;
	  color: #fff;
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  justify-content: space-between;
	}
	.search-city image{
	  margin-left: 4rpx;
	  width: 36rpx;
	  height: 36rpx;
	}
	.search-input{
	  flex: 1;
	  flex-grow: 1;
	  height: 48rpx;
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  font-size: 24rpx;
	  color: #999;
	  background-color: #fff;
	  border-radius:24rpx;
	  line-height: 48rpx;
	}
	.search-input image{
	  padding: 0 16rpx;
	  width: 36rpx;
	  height: 36rpx;
	}
	.search-code{
	  padding: 0 30rpx;
	  height: 72rpx;
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  justify-content: space-between;
	}
	.search-code image{
	  width: 36rpx;
	  height: 36rpx;
	}
	
	/* 共用顶部背景颜色 */
	.header-bg{
	  position: fixed;
	  left: -10%;
	  top: 0;
	  width: 120%;
	  height: 200rpx;
	  background-color: #ff3f4c;
	  border-radius: 0 0 50% 50%;
	  /* background: #d6343f; */
	  z-index: 1;
	}
	/* .header-bg::after{
	  content: "";
	  position: absolute;
	  left: -20%;
	  top: 0;
	  width: 140%;
	  height: 180rpx;
	  border-radius: 0 0 50% 50%;
	  background: #d6343f;
	  z-index: 1;
	} */
	
	/* 暂无更多 */
	.no{
	  padding: 20rpx;
	  font-size: 24rpx;
	  color: #999;
	  text-align: center;
	}
	
	/* 没有 */
	.pro{
	  position: absolute;
	  top: 0;
	  left: 0;
	  right: 0;
	  bottom: 0;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	}
	.pro image{
	  width: 360rpx;
	  height: 360rpx;
	}
	.pro-text{
	  color: #666;
	  font-size: 24rpx;
	  /* margin: 30rpx 0; */
	}
	.pro-btn{
	  font-size: 28rpx;
	  color: #d6343f;
	  text-decoration:underline;
	}
	
	/* 公用返回顶部 */
	.back-top{
	  z-index: 1001;
	  position: fixed;
	  bottom: 50rpx;
	  right: 20rpx;
	  display: flex;
	  /* padding: 15rpx; */
	  border-radius: 50%;
	  background: #fff;
	  box-shadow: 0rpx 0rpx 10rpx 0 rgba(141, 141, 150, .5);
	}
	.back-top image{
	  width: 70rpx;
	  height: 70rpx;
	}
	/* 联系客服 */
	.service-icon{
	  z-index: 1001;
	  position: fixed;
	  right: 20rpx;
	  bottom: 140rpx;
	  /* padding: 15rpx; */
	  display: flex;
	  border-radius: 50%;
	  background: #fff;
	  /* box-shadow: 0rpx 0rpx 10rpx 0 rgba(141, 141, 150, .5); */
	}
	.service-icon image{
	  width: 70rpx;
	  height: 70rpx;
	}
	/* 底部logo */
	.logo-bottom{
	  display: flex;
	  width: 50%;
	  margin: 20rpx auto;
	}
	.logo-bottom image{
	  width: 100%;
	}
</style>
