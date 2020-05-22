<template>
	<view class="">
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<view class="container" v-if="list.length>0">
			<view class="browse-del" @tap="delBrowseAll">
				<image src="/images/members/imgs/del.png"></image>
				<text>清空记录</text>
			</view>
			<block v-for="(itemBox, indexBox) in list" :key="indexBox">
				<view class="collection-list" v-if="itemBox.data.length>0">
					<!-- 头部 -->
					<view class="collection-title">{{itemBox.time}}</view>
					<view class="collection-item-box" v-for="(item, index) in itemBox.data" :key="index">
						<view class="collection-item" @touchstart="touchS" @touchmove="touchM" @touchend="touchE" :data-index="index"
						 :data-indexBox="indexBox" :style="{'margin-left': item.txtStyle + 'px'}">
							<image class="collection-item-img" :src="item.image"></image>
							<!-- <view class="collection-item-con">
		            <view class="collection-item-title">{{item.task_name}}</view>
		            <view class="collection-item-receive">已接 {{item.received_people_count}}</view>
		            <view class="collection-item-pro">
		              <view class="collection-item-price">￥{{item.money}}元/{{item.unit}}</view>
		              <navigator class="collection-item-btn" url="/pages/members/taks-detail/taks-detail?id={{item.task_id}}" hover-class="none">接收任务</navigator>
		            </view>
		          </view> -->
							<view class="task-child-item-con">
								<view class="task-child-item-title">{{item.task_name}}</view>
								<view class="task-child-item-num">已接 {{item.received_people_count}} {{item.unit}}/ <text>剩余{{item.surplus_count}} {{item.unit}}</text></view>
								<view class="task-child-item-price">￥{{item.money}}/{{item.unit}}</view>
								<view class="task-child-item-receive">{{item.ctime}}</view>
							</view>
							<navigator class="task-item-btn" :url="'/pages/members/taks-detail/taks-detail?id='+item.task_id" hover-class="none">接收任务</navigator>
						</view>
						<view :data-index="index" :data-indexBox="indexBox" @tap="delItem" class="inner del">
							<text>删除</text>
						</view>
					</view>
				</view>
			</block>
		</view>

		<!-- 暂无更多 -->
		<view class="pro" wx:else>
			<image :src="myTask.image" mode="widthFix"></image>
			<view class="pro-text">暂无浏览记录</view>
		</view>
	</view>
</template>

<script>
	import util from '@/utils/util.js'
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
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
					iconText: '浏览记录' //导航栏文字
				},
				delBtnWidth: null,
				page: 1,
				list: []
			}
		},
		onLoad() {
			// this.setData({
			// 	imgSrc: app.globalData.imgSrc,
			// })
			if (this.userConfig) {
				this.myTask = this.userConfig.myTask
			}
			this.getMyCollect(this.page);
		},
		methods: {
			//获取列表
			getMyCollect(page) {
				var that = this;
				var data = {
					uid: that.userInfo.userid,
					type: 3
				}
				util.request('getCollectList', 'member', data, function(res) {
					// console.log(res)
					if (res.code == '000') {
						if (res.data.length > 0) {
							that.list = res.data
							var query = wx.createSelectorQuery();
							//选择id
							if (res.data.length > 0) {
								query.select('.del').boundingClientRect(function(rect) {
									// console.log(rect.width)
									that.delBtnWidth = rect.width - 10
								}).exec();
							}
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
			touchS(e) {
				if (e.touches.length == 1) {
					//设置触摸起始点水平方向位置
					this.startX = e.touches[0].clientX
				}
			},
			touchM(e) {
				if (e.touches.length == 1) {
					//手指移动时水平方向位置
					var moveX = e.touches[0].clientX;
					//手指起始点位置与移动期间的差值
					var disX = this.startX - moveX;
					var delBtnWidth = this.delBtnWidth;
					var txtStyle = "";
					if (disX == 0 || disX < 0) { //如果移动距离小于等于0，说明向右滑动，文本层位置不变
						txtStyle = 0;
					} else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
						txtStyle = "-" + disX;
						if (disX >= delBtnWidth) {
							//控制手指移动距离最大值为删除按钮的宽度
							txtStyle = "-" + delBtnWidth;
						}
					}
					//获取手指触摸的是哪一项
					var indexBox = e.currentTarget.dataset.indexbox;
					var index = e.currentTarget.dataset.index;
					var list = this.list;
					for (var i = 0; i < list.length; i++) {
						for (var j = 0; j < list[i].data.length; j++) {
							list[i].data[j].txtStyle = 0;
						}
					}
					list[indexBox].data[index].txtStyle = txtStyle;
					//更新列表的状态
					this.list = list
				}
			},
			touchE(e) {
				if (e.changedTouches.length == 1) {
					//手指移动结束后水平位置
					var endX = e.changedTouches[0].clientX;
					//触摸开始与结束，手指移动的距离
					var disX = this.startX - endX;
					var delBtnWidth = this.delBtnWidth;
					//如果距离小于删除按钮的1/2，不显示删除按钮
					var txtStyle = disX > delBtnWidth / 2 ? "-" + delBtnWidth : "0";
					//获取手指触摸的是哪一项
					var indexBox = e.currentTarget.dataset.indexbox;
					var index = e.currentTarget.dataset.index;
					var list = this.list;
					list[indexBox].data[index].txtStyle = txtStyle;
					//更新列表的状态
					this.list = list
				}
			},
			//获取元素自适应后的实际宽度
			getEleWidth(w) {
				var real = 0;
				try {
					var res = wx.getSystemInfoSync().windowWidth;
					var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应
					real = Math.floor(res / scale);
					return real;
				} catch (e) {
					return false;
					// Do something when catch error
				}
			},
			initEleWidth() {
				var delBtnWidth = this.getEleWidth(this.delBtnWidth);
				this.delBtnWidth = delBtnWidth;
			},
			//点击删除按钮事件
			delItem(e) {
				var that = this;
				//获取列表中要删除项的下标
				var indexBox = e.currentTarget.dataset.indexbox;
				var index = e.currentTarget.dataset.index;
				wx.showModal({
					title: '提示',
					content: '确认清除该浏览记录吗？',
					success(res) {
						if (res.confirm) {
							that.delBrowse(indexBox, index, 1);
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},

			//清除全部
			delBrowseAll() {
				var that = this;
				wx.showModal({
					title: '提示',
					content: '确认清空浏览记录吗？',
					success(res) {
						if (res.confirm) {
							that.delBrowse();
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},

			//删除函数
			delBrowse(indexBox, index, type) {
				var that = this;
				var list = that.list;
				var data;
				if (type == 1) {
					data = {
						uid: that.userInfo.userid,
						id: list[indexBox].data[index].id,
						type: 1
					}
				} else {
					data = {
						uid: that.userInfo.userid,
						type: 0
					}
				}
				util.request('delCookies', 'member', data, function(res) {
					// console.log(res)
					if (res.code == '000') {
						wx.showToast({
							title: '清除成功',
							icon: 'success',
							duration: 2000
						})
						if (type == 1) {
							//移除列表中下标为index的项
							list[indexBox].data.splice(index, 1);
							//更新列表的状态
							that.list = list
						} else {
							that.list = []
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
	.browse-del {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #666;
	}

	.browse-del image {
		width: 35rpx;
		height: 35rpx;
		margin-right: 6rpx;
	}

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
		margin-bottom: 10rpx;
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
		display: -webkit-box;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
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
</style>
