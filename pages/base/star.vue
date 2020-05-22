<template>
	<view class="uni-flex">
		<!-- <view class="header">
	    <image class="header-logo" src="/images/logo.png" mode="widthFix"></image>
	    <view class="header-title">点动助力每一个想成功的你</view>
	  </view> -->
		<!-- <view class="pro">加载中...</view> -->
		<image src="/static/members/home.png" class="home"></image>
	</view>
</template>

<script>
	import util from '@/utils/util.js'
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		computed: mapState(['userInfo', 'userConfig', 'banner', 'taskClass']),
		data() {
			return {
				
			}
		},
		onLoad() {
			
		},
		onShow() {
			var that = this;
			wx.showLoading({
				title: '数据加载中...',
			})
			if (that.userInfo) {
				util.initializeLogin(that.userInfo, that.userConfig, that.banner, that.taskClass,
					function(res) {
						// console.log(1)
						wx.hideLoading();
						setTimeout(function() {
							if (that.scene != 1007 && that.scene != 1008) {
								wx.reLaunch({
									url: '/pages/members/home/home'
								})
							}
							if (that.type == 1) {
								wx.reLaunch({
									url: '/pages/members/home/home'
								})
							}
						}, 500)
					},
					function(fail) {
						util.initializeLogin(that.userInfo, that.userConfig, that.banner, that.taskClass,
							function(res) {
								wx.hideLoading();
								setTimeout(function() {
									if (that.scene != 1007 && that.scene != 1008) {
										wx.reLaunch({
											url: '/pages/members/home/home'
										})
									}
									if (that.type == 1) {
										wx.reLaunch({
											url: '/pages/members/home/home'
										})
									}
								}, 500)
							});
					});
			} else {
				wx.login({
					success(res) {
						console.log('login',res)
						if (res.code) {
							//发起网络请求，如果没有缓存，就获取openid
							that.code = res.code
							that.getWxOpenid();
						}
					},
					
				})
			}
		},
		methods: {
			getWxOpenid() {
				var that = this;
				var data = {
					code: that.code,
				}
				util.request('getWxOpenid', 'member', data, function(res) {
					if (res.code == '000') {
						that.openid = res.openid
						that.regTourist();
					} else {
						that.getWxOpenid();
					}
				}, function(fail) {
					that.getWxOpenid();
				})
			},
			//登录与注册
			regTourist() {
				var that = this;
				var data = {
					openid: that.openid,
					scene: that.wxacode ? that.wxacode : null, //推荐人标识
				}
				util.request('regTourist', 'member', data, function(res) {
					if (res.code == '000') {
						//调取初始化接口
						var userInfo = {};
						userInfo.userid = res.uid;
						util.initializeLogin(userInfo, that.userConfig, that.banner, that.taskClass,
							function(res) {
								setTimeout(function() {
									if (that.scene != 1007 && that.scene != 1008) {
										wx.reLaunch({
											url: '/pages/members/home/home'
										})
									}
									if (that.type == 1) {
										wx.reLaunch({
											url: '/pages/members/home/home'
										})
									}
								}, 500)
							});
					} else {
						that.regTourist();
					}
				}, function(fail) {
					that.regTourist();
				})
			}
		}
	}
</script>

<style>
	.home {
		width: 100%;
		height: 100vh;
	}

	/* page {
		background-color: #fff;
		height: 100%;
	}

	page .container {
		height: 100%;
	}

	.home {
		width: 100%;
		height: 100%;
	}

	.header {
		text-align: center;
		padding-top: 42rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.header-logo {
		width: 300rpx;
	}

	.header-title {
		color: #fff;
		font-size: 32rpx;
		letter-spacing: 6rpx;
		margin-top: 20rpx;
	}

	.pro {
		margin-top: 200rpx;
		text-align: center;
		color: #f3f3f3;
		font-size: 32rpx;
	}

	.refresh {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-top: 50rpx;
		text-align: center;
		color: #fff;
		font-size: 28rpx;
	}

	.refresh text {
		text-decoration: underline;
	}

	.refresh image {
		margin-left: 15rpx;
		width: 30rpx;
		height: 30rpx;
	} */
</style>
