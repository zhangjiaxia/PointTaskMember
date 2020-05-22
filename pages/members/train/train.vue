<template>
	<view class="container">
		<navbar ref="navbar" class="navbar" page-name="指引" :back="back"></navbar>
		<view class="train-swiper" :style="{'padding-top': navHeight + 'px'}">
			<image class="train-bg" src="/static/members/imgs/top_BG@2x.png"></image>
			<view class="swiper-title">
				<view class="swiper-title-con">
					<text class="swiper-title-con-text">最新指引</text>
					<view class="swiper-title-con-num"><text>{{current}}</text>/{{bannerArr.length}}</view>
				</view>
				<navigator url="/pages/members/train/train-more/train-more" class="swiper-title-pro" hover-class="none">
					<text>查看更多</text>
					<image src="/static/members/imgs/right-e5e5e5.png"></image>
				</navigator>
			</view>
			<!-- 轮播图 -->
			<swiper class="swiper" autoplay indicator-active-color="#ffffff" previous-margin="30rpx" next-margin="30rpx"
			 circular="true" @change="bindchangeCurrent">
				<swiper-item v-for="(item,index) in bannerArr" :key="index">
					<navigator :url="'/pages/members/train-detail/train-detail?id='+item.id" hover-class="none">
						<image class="swiper-img" :src="item.image"></image>
						<view class="swiper-item-bg">
							<!-- <image src="/static/members/imgs/play-icon.png"></image> -->
							<text class="swiper-item-title">{{item.name}}</text>
						</view>
					</navigator>
				</swiper-item>
			</swiper>
		</view>
		<!-- 列表 -->
		<view class="train">
			<view class="train-nav">
				<view v-for="(item, index) in trainClass" :key="index" class="train-nav-item" :class="{active: item.active}" @tap="switchNav"
				 :data-index="index">
					{{item.name}}
					<text></text>
				</view>
			</view>
			<view class="train-list">
				<navigator class="train-item" v-for="(item, index) in list" :key="index" :url="'/pages/members/train-detail/train-detail?id='+item.id"
				 hover-class="none">
					<view class="train-item-left">
						<view class="train-item-con">
							<text class="train-item-label">{{item.qcName}}</text>
							{{item.name}}
						</view>
						<view class="train-item-pro">
							<view class="train-item-paly">
								<image src="/static/members/imgs/play-num.png"></image>
								<text>{{item.people}}播放量</text>
							</view> |
							<view class="train-item-score">
								<view class="train-item-score-num">{{item.sorce}}分</view>
								<view class="train-item-score-xx">
									<template-stars id="dialog" :stars="item.sorce" :width="width"></template-stars>
								</view>
							</view>
						</view>
					</view>
					<view class="train-item-right">
						<image class="train-item-img" :src="item.image"></image>
						<view class="train-item-right-bg">
							<!-- <image src="/static/members/imgs/play-icon.png"></image> -->
						</view>
					</view>
				</navigator>
			</view>
		</view>
		<view class="panel-no" v-if="isPro">-- 我是有底线的 --</view>
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
		computed: mapState(['navHeight', 'userConfig', 'userInfo']),
		components: {
			navbar
		},
		data() {
			return {
				current: 1, //当前轮播到第几张
				width: 30,
				page: 1,
				back: true,
				//自定义参数
				bannerArr: [],
				list: [],
				trainClass: []
			}
		},
		onLoad() {
			var that = this;
			// that.setData({
			//   navHeight: app.globalData.navHeight,
			//   loading: app.globalData.userConfig.loading
			// })
			//获取最新指引
			that.getTrainingList(that.page, 4);
			that.getTrainingClass();
		},
		onPageScroll(e) {
			var scrollTop = e.scrollTop
			this.$refs.navbar.setOpacity(scrollTop, 200);
		},
		methods: {
			//获取当前轮播数值
			bindchangeCurrent(e) {
				this.current = e.detail.current + 1
			},

			//获取培训分类
			getTrainingClass() {
				// console.log(app.globalData.userInfo)
				var that = this;
				var data = {
					uid: that.userInfo.userid,
					type: 1
				}
				util.request('getTrainingClass', 'guide', data, function(res) {
					// console.log(res)
					if (res.code == '000') {
						res.data[0].active = true;
						that.trainClass = res.data
						that.getTrainingList(that.page, 1, res.data[0].class_id);
					}
				})
			},

			//获取最新指引
			getTrainingList(page, type, id) {
				var that = this;
				var data = {
					uid: that.userInfo.userid,
					type: type,
					page: page,
					class_id: id
				}
				util.request('getTrainingList', 'guide', data, function(res) {
					// console.log(res)
					if (res.code == '000') {
						if (type == 4) {
							//最新指引
							that.bannerArr = res.data
						} else if (type == 1) {
							that.list = res.data
						}
					}
				})
			},

			//切换类型
			switchNav(e) {
				// console.log(e)
				var trainClass = this.trainClass;
				var index = e.currentTarget.dataset.index;
				for (var i = 0; i < trainClass.length; i++) {
					trainClass[i].active = false;
				}
				trainClass[index].active = true;
				this.trainClass = trainClass
				this.getTrainingList(this.page, 1, trainClass[index].class_id);
			},
			//培训详情
			jumpDetail(e) {
				wx.navigateTo({
					url: '/pages/members/train-detail/train-detail?id=' + e.currentTarget.dataset.id
				})
			},
			//跳转更多
			jumpMore(e) {
				wx.navigateTo({
					url: '/pages/members/train/train-more/train-more?pid=' + e.currentTarget.dataset.pid
				})
			},
		}
	}
</script>

<style>
	page {
		background-color: #fff;
	}

	.navbar {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 1001;
	}

	.train-swiper {
		position: relative;
	}

	.train-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		/* margin-left: -5%; */
		height: 95%;
		border-radius: 0 0 80rpx 80rpx;
	}

	.swiper-title {
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 40rpx 30rpx;
	}

	.swiper-title-con {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
	}

	.swiper-title-con-text {
		font-size: 34rpx;
		color: #fff;
		font-weight: 600;
		letter-spacing: 4rpx;
	}

	.swiper-title-con-num {
		margin-left: 10rpx;
		font-size: 28rpx;
		color: rgba(255, 255, 255, .54);
	}

	.swiper-title-con-num text {
		color: #fff;
	}

	.swiper-title-pro image {
		margin-left: 10rpx;
		width: 30rpx;
		height: 30rpx;
	}

	.swiper-title-pro {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 28rpx;
		color: #e5e5e5;
	}

	.swiper {
		height: 380rpx;
		background-color: transparent;
		display: flex;
		flex-direction: row;
	}

	.swiper swiper-item {
		box-sizing: border-box;
		/* margin: 0 50rpx; */
		background-color: transparent;
		display: flex;
		flex-direction: column;
	}

	.swiper navigator {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.swiper image.swiper-img {
		margin: 0 auto;
		width: 96%;
		height: 100%;
		border-radius: 20rpx;
	}

	.swiper-item-bg {
		position: absolute;
		top: 0;
		left: 2%;
		right: 2%;
		bottom: 0;
		background: rgba(0, 0, 0, .1);
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.swiper-item-bg image {
		width: 70rpx;
		height: 70rpx;
	}

	.swiper-item-title {
		position: absolute;
		bottom: 20rpx;
		left: 20rpx;
		color: #fff;
	}

	/* 分类 */
	.train {
		display: flex;
		flex-direction: column;
		padding: 30rpx;
		background-color: #fff;
	}

	.train-nav {
		display: flex;
		flex-direction: row;
	}

	.train-nav-item {
		position: relative;
		padding: 20rpx 15rpx;
		font-size: 32rpx;
		font-weight: 600;
		color: #888;
	}

	.active {
		color: #FC404C;
	}

	.active text {
		position: absolute;
		bottom: 0;
		left: 50%;
		margin-left: -30rpx;
		width: 60rpx;
		height: 6rpx;
		background-color: #FC404C;
		border-radius: 0 0 6rpx 6rpx;
	}

	/* 列表 */
	.train-list {
		display: flex;
		flex-direction: column;
	}

	.train-item {
		display: flex;
		flex-direction: row;
		margin-top: 40rpx;
	}

	.train-item-left {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		overflow: hidden;
		padding-right: 30rpx;
	}

	.train-item-con {
		color: #333;
		font-weight: 700;
		font-size: 28rpx;
		line-height: 50rpx;
		height: 100rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.train-item-label {
		font-weight: normal;
		font-size: 24rpx;
		padding: 5rpx 10rpx;
		background: rgba(49, 49, 56, .8);
		color: #fff;
		border-radius: 6rpx;
	}

	.train-item-pro {
		display: flex;
		flex-direction: row;
		color: #BFBEC5;
		font-size: 24rpx;
	}

	.train-item-paly {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #BFBEC5;
		margin-right: 15rpx;
	}

	.train-item-paly image {
		width: 30rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}

	.train-item-score {
		margin-left: 15rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.train-item-score-xx {
		margin-left: 10rpx;
	}

	.train-item-right {
		display: flex;
		border-radius: 20rpx;
		overflow: hidden;
		position: relative;
	}

	.train-item-right image.train-item-img {
		width: 240rpx;
		height: 160rpx;
	}

	.train-item-right-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .1);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.train-item-right-bg image {
		width: 50rpx;
		height: 50rpx;
	}

	.panel-no {
		padding: 20rpx;
		font-size: 20rpx;
		color: #777;
		text-align: center;
		/* background-color: #f1f1f1; */
	}
</style>
