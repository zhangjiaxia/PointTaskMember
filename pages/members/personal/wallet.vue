<template>
	<view class="">
		<!-- <import src="../../../wxParse/wxParse.wxml"/> -->
		<view class="container">
			<navbar ref="navbar" class="navbar" page-name="我的钱包" :back="back"></navbar>
			<image class="train-bg" src="/static/members/imgs/top_BG@2x.png"></image>
			<view class="main" :style="{'padding-top': navHeight + 'px'}">
				<!-- 钱包 -->
				<view class="balance-box">
					<view class="balance-top">
						<view class="balance-title">{{userInit_MoneyUse.withdrawal_money}}</view>
						<view class="balance-pro">余额（元）</view>
					</view>
					<view class="balance-bottom">
						<view class="balance-item border-right">
							<view class="balance-title">{{userInit_MoneyCash.cash}}</view>
							<view class="balance-pro">已提现（元）</view>
						</view>
						<view class="balance-item">
							<view class="balance-title">{{userInit_MoneyAll.accumulation_money}}</view>
							<view class="balance-pro">总收益（元）</view>
						</view>
					</view>
				</view>
				<!-- 列表 -->
				<view class="list">
					<navigator class="list-item" url="/pages/members/personal/withdrawal-record/withdrawal-record" hover-class="none">
						<image class="list-img-l" src="/static/members/imgs/balance1.png"></image>
						<text>收支流水</text>
						<image class="list-img-r" src="/static/members/imgs/home-right.png"></image>
					</navigator>
					<view class="list-item" bindtap="prompt">
						<image class="list-img-l" src="/static/members/imgs/balance2.png"></image>
						<text>卡包管理</text>
						<image class="list-img-r" src="/static/members/imgs/home-right.png"></image>
					</view>
					<view class="list-item" bindtap="prompt">
						<image class="list-img-l" src="/static/members/imgs/balance3.png"></image>
						<text>个税明细</text>
						<image class="list-img-r" src="/static/members/imgs/home-right.png"></image>
					</view>
				</view>
				<!-- 提现按钮 -->
				<navigator class="withdrawal-btn" url="/pages/members/personal/withdrawal/withdrawal" hover-class="none">提现</navigator>
			</view>
		</view>
		<!-- 提现需知 -->
		<view class="doubt-box" v-if="isDoubt">
			<view class="doubt-model" catchtap="hideDoubt"></view>
			<view class="doubt">
				<view class="doubt-title">{{doubt.title}}</view>
				<scroll-view class="doubt-con" scroll-y>
					<!-- <view class=""><template is="wxParse" data="{{wxParseData:doubtContent.nodes}}"/></view> -->
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/utils/util.js'
	import navbar from '@/components/navbar.vue' //引入授权窗体
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		computed: mapState(['navHeight', 'userConfig', 'userInfo', 'taskClass', 'banner', 'userInit_MoneyAll',
			'userInit_MoneyUse', 'userInit_MoneyCash'
		]),
		components: {
			navbar
		},
		data() {
			return {
				back: true
			}
		},
		onLoad() {
			this.getDoubt();
		},
		onShow() {
			var that = this;
			//获取初始化接口
			util.initializeLogin(that.userInfo, that.userConfig, that.banner, that.taskClass,
				function(res) {
					// that.setData({
					// 	userInit_MoneyAll: that.userInit_MoneyAll,
					// 	userInit_MoneyCash: that.userInit_MoneyCash,
					// 	userInit_MoneyUse: that.userInit_MoneyUse,
					// })
				});
		},
		methods: {
			//获取提现须知
			getDoubt() {
				var that = this;
				var data = {
					type: 1,
					changeType: 5
				}
				util.request('getInfoConfig', 'member', data, function(res) {
					// console.log(res)
					if (res.code == '000') {
						// WxParse.wxParse('doubtContent', 'html', res.data.content, that, 5);
						that.doubt = res.data
					} else {
						wx.showToast({
							title: res.msg,
							mask: true,
							icon: 'none',
							duration: 2000
						})
					}
				})
			},

			//提现须知显示
			showDoubt() {
				this.isDoubt = true
			},

			// 提现须知隐藏
			hideDoubt() {
				this.isDoubt = false
			},

			//暂未开放
			prompt() {
				wx.showToast({
					title: '功能正在维护，敬请期待',
					icon: 'none',
					duration: 2000
				})
			},
		}
	}
</script>

<style>
	/* @import "/pages/wxParse/wxParse.wxss"; */
	.navbar {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 1001;
	}

	.train-bg {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 250rpx;
		border-radius: 0 0 80rpx 80rpx;
	}

	.main {
		position: relative;
		z-index: 1;
		margin: 50rpx 0 0;
	}

	.balance-box {
		display: flex;
		flex-direction: column;
		padding: 30rpx;
		margin: 0 30rpx 50rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 2rpx 2rpx 12rpx 0 rgba(43, 86, 112, .2);
	}

	.balance-top {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 20rpx 0;
	}

	.balance-title {
		font-size: 46rpx;
		font-weight: 600;
		color: #313138;
	}

	.balance-pro {
		padding: 10rpx 0;
		color: #8D8D96;
		font-size: 28rpx;
	}

	.balance-bottom {
		display: flex;
		flex-direction: row;
	}

	.balance-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.border-right {
		border-right: 1rpx solid #EAECF0;
	}

	/* 列表 */
	.list {
		display: flex;
		flex-direction: column;
		background-color: #fff;
		border-radius: 20rpx;
		margin: 0 30rpx 50rpx;
		padding: 0 20rpx;
		box-shadow: 2rpx 2rpx 12rpx 0 rgba(43, 86, 112, .2);
	}

	.list-item {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #EAECF0;
	}

	.list-item:last-child {
		border-bottom: none;
	}

	.list-item text {
		flex: 1;
		font-size: 30rpx;
		color: #8D8D96;
		padding: 0 15rpx;
	}

	.list-img-l {
		width: 60rpx;
		height: 60rpx;
	}

	.list-img-r {
		width: 40rpx;
		height: 40rpx;
	}

	.withdrawal-btn {
		margin: 150rpx 150rpx 0;
		background-color: #FF414D;
		color: #fff;
		padding: 20rpx;
		text-align: center;
		font-size: 32rpx;
		letter-spacing: 4rpx;
		border-radius: 40rpx;
	}

	/* 提现须知 */
	.doubt-box {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, .3);
	}

	.doubt {
		position: relative;
		z-index: 101;
		width: 600rpx;
		height: 800rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 10rpx;
		/* padding: 20rpx; */
		display: flex;
		flex-direction: column;
	}

	.doubt-title {
		font-size: 32rpx;
		color: #d6343f;
		padding: 15rpx 0;
		text-align: center;
	}

	.doubt-con {
		box-sizing: border-box;
		overflow: hidden;
		flex: 1;
		padding-bottom: 20rpx;
		font-size: 28rpx;
		color: #333;
	}

	.doubt-con view {
		padding: 0 20rpx;
	}

	.doubt-model {
		z-index: 1;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
</style>
