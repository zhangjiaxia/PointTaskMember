<template>
	<view class="container">
		
	</view>
</template>

<script>
	import util from '@/utils/util.js'
	import navigationBar from '@/components/navigation-bar.vue' //引入授权窗体
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		computed: mapState(['userConfig', 'userInfo']),
		components: {
			navigationBar
		},
		data() {
			return {
				//设置导航栏样式
				navigationBarStyle: {
					iconText: '学习记录' //导航栏文字
				},
				page: 1,
				list: [],
				normalSrc: '/images/members/imgs/xx102.png',
				selectedSrc: '/images/members/imgs/xx101.png',
				// difficultyStars: [4, 3, 2, 1, 0],
				learnStars: [0, 1, 2, 3, 4],
				learnScore: 5,
			}
		},
		onLoad() {
			if (this.userConfig) {
				this.myTask = this.userConfig.myTask
			}
			this.getMyLearn(this.page);
		},
		onReachBottom() {
			var that = this;
			if (that.pageShow) {
				that.page = that.page + 1
				var page = that.page;
				that.getMyLearn(page);
			}
		},
		methods: {
			//获取列表
			getMyLearn(page) {
				var that = this;
				var data = {
					uid: this.userInfo.userid,
					type: 3,
					page: page
				}
				util.request('getTrainingList', 'guide', data, function(res) {
					// console.log(res)
					if (res.code == '000') {
						if (res.data.length > 0) {
							var list = that.list;
							list.push.apply(list, res.data);
							that.list = list,
								that.pageShow = true
						} else {
							that.pageShow = false
						}
					} else {
						wx.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
		}
	}
</script>

<style>
	.collection-list {
		display: flex;
		flex-direction: column;
		padding: 30rpx;
	}

	.collection-title {
		font-size: 32rpx;
		padding-bottom: 20rpx;
	}

	.collection-item-box {
		position: relative;
		overflow: hidden;
		background-color: #fff;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	}

	.inner {
		position: absolute;
		top: 0;
		width: 180rpx;
		text-align: center;
		z-index: 4;
		right: 0;
		color: #fff
	}

	.inner.del {
		font-family: Monaco;
		background-color: #FF843B;
		width: 180rpx;
		text-align: center;
		z-index: 4;
		right: 0;
		bottom: 0;
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		/* font-weight: 600; */
	}

	.collection-item {
		position: relative;
		width: 100%;
		box-sizing: border-box;
		z-index: 5;
		display: flex;
		flex-direction: row;
		padding: 20rpx;
		border-radius: 10rpx;
		background-color: #fff;
		transition: margin-left 0.2s ease-in-out;
	}

	.collection-item-img {
		width: 180rpx;
		height: 180rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
	}

	.collection-item-con {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.collection-item-title {
		font-weight: 700;
		font-size: 28rpx;
		line-height: 50rpx;
		/* height: 100rpx; */
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.collection-item-receive {
		font-size: 24rpx;
		color: #888;
		margin: 15rpx 0;
	}

	.collection-item-pro {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.collection-item-price {
		flex: 1;
		color: #FC404C;
		font-size: 28rpx;
		font-weight: 600;
	}

	.collection-item-btn {
		font-size: 26rpx;
		background-color: #FC404C;
		color: #fff;
		padding: 10rpx 20rpx;
		border-radius: 30rpx;
	}

	.collection-item-img {
		display: flex;
		position: relative;
		overflow: hidden;
	}

	.collection-item-img text {
		position: absolute;
		top: 12rpx;
		left: -30rpx;
		transform: rotate(-45deg);
		color: #fff;
		padding: 5rpx 30rpx;
		font-size: 20rpx;
	}

	.bgFF515C {
		background-color: #FF515C;
	}

	.bg0C8E1B {
		background-color: #0C8E1B;
	}

	.bgFF8B0F {
		background-color: #FF8B0F;
	}

	.bg909090 {
		background-color: #909090;
	}

	.collection-item-img image {
		width: 160rpx;
		height: 160rpx;
		border-radius: 10rpx;
	}

	.collection-item-ctime {
		font-size: 24rpx;
		color: #8D8D96;
		padding: 5rpx 0;
	}

	.task-child-item-con {
		flex: 1;
		padding: 0 50rpx 0 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		overflow: hidden;
	}

	.task-child-item-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #303138;
		line-height: 40rpx;
		/* height: 80rpx; */
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		/* display: -webkit-box;
	  word-break: break-all; */
		/* -webkit-box-orient: vertical;
	  -webkit-line-clamp: 2; */
	}

	.task-child-item-receive {
		font-size: 24rpx;
		color: #8D8D96;
		padding: 5rpx 0;
	}

	.task-child-item-price {
		font-size: 32rpx;
		color: #FF414D;
		font-weight: 600;
	}

	.task-child-item-num {
		font-size: 24rpx;
		color: #8D8D96;
		margin-left: 8rpx;
		display: flex;
		align-items: center;
	}

	.task-child-item-num text {
		color: #FF414D;
	}

	.task-total {
		font-size: 28rpx;
		color: #303138;
		text-align: center;
		margin-bottom: 30rpx;
	}

	.task-item-btn {
		position: absolute;
		bottom: 20rpx;
		right: 20rpx;
		font-size: 24rpx;
		background-color: #FF414D;
		font-weight: normal;
		color: #fff;
		border-radius: 30rpx;
		padding: 0 20rpx;
		height: 48rpx;
		line-height: 48rpx;
	}

	/* 星星 */
	.eval-con-star {
		display: flex;
		margin-left: 20rpx;
	}

	.star {
		width: 40rpx;
		height: 40rpx;
		float: left;
	}

	.score-item {
		position: relative;
		/* height: 50px; */
		margin: 0 3rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.star-image {
		position: relative;
		width: 35rpx;
		height: 35rpx;
	}

	.star-image view {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
	}

	.rules {
		display: flex;
	}

	.rules .rules-text {
		margin-top: 6rpx;
		margin-right: 8rpx;
	}

	.share-btn {
		background: transparent;
		position: relative;
		top: 13rpx;
		width: 120rpx;
	}

	.share-text {
		position: relative;
		bottom: 10rpx;
	}

	.play-img {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
	}
</style>
