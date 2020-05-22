<template>
	<view class="">
		<!--pages/members/task-car/task-car.wxml-->
		<view class="container" :style="{'padding-top': navHeight + 'px'}">
			<navbar ref="navbar" class="navbar" page-name="任务车"></navbar>
			<image class="train-bg" src="/static/members/imgs/top_BG@2x.png"></image>
			<view class="main">
				<!-- 广告 -->
				<view class="task-ad">
					<image src="/static/members/imgs/notice.png" v-if="noticeList.length>0"></image>
					<swiper vertical autoplay circular>
						<swiper-item v-for="(item, index) in noticeList" :key="(index)">
							<navigator :url="'/pages/members/message/notice-detail/notice-detail?id='+item.id" hover-class="none">{{item.title}}</navigator>
						</swiper-item>
					</swiper>
				</view>
				<!-- 我的点赞列表 -->
				<view class="label-list">
					<navigator class="label-item" url="/pages/members/personal/collection/collection?flag=1" hover-class="none">
						<image class="label-img" src="/static/members/imgs/car1.png"></image>
						<text>我的点赞</text>
					</navigator>
					<navigator class="label-item" url="/pages/members/personal/collection/collection?flag=2" hover-class="none">
						<image class="label-img" src="/static/members/imgs/car2.png"></image>
						<text>我的收藏</text>
					</navigator>
					<navigator class="label-item" url="/pages/members/personal/collection/collection?flag=4" hover-class="none">
						<image class="label-img" src="/static/members/imgs/car3.png"></image>
						<text>我的分享</text>
					</navigator>
					<navigator class="label-item" url="/pages/members/personal/collection/my-evaluate/my-evaluate" hover-class="none">
						<image class="label-img" src="/static/members/imgs/car4.png"></image>
						<text>我的评论</text>
					</navigator>
				</view>
				<!-- 任务列表 -->
				<view class="task">
					<!-- 任务列表导航条 -->
					<view class="task-navbar" :class="{'home-top-fixed': navTop}" :style="{top: navTop==true?navHeight:'0' + 'px'}">
						<view v-for="(item, index) in navbar" :key="index" :data-idx="index" class="item" @tap="navbarTap">
							<text :class="{active: currentTab==index}">{{item}}</text>
						</view>
					</view>
					<!-- 列表 -->
					<view class="task-list" v-if="myList.length>0">
						<view class="task-item">
							<!-- <view class="task-item-time">2020-04-18</view> -->
							<view class="task-item-child">
								<view class="task-child" v-for="(item, index) in myList" :key="index">
									<!-- <image v-if="{{item.status == 0}}" class="item-del" src="/static/members/imgs/del.png" @tap="delItem" data-index="{{index}}" data-mtid="{{item.mtid}}"></image> -->
									<view class="task-child-item" @touchstart="touchS" @touchmove="touchM" @touchend="touchE" :data-index="index"
									 :data-indexBox="indexBox" :style="{'margin-left': item.txtStyle + 'px'}">
										<view class="task-child-item-img" @tap="getDetail" :data-mtid="item.task_id">
											<image :src="item.image"></image>
											<text class="bgFF515C" v-if="item.status == 0">已接收</text>
											<text class="bg0C8E1B" v-if="item.status == 1">已提交</text>
											<text class="bgFF8B0F" v-if="item.status == 2">已通过</text>
											<text class="bg909090" v-if="item.status == 3">未通过</text>
										</view>
										<view class="task-child-item-con" @tap="getDetail" :data-mtid="item.task_id">
											<view class="task-child-item-title">{{item.task_name}}</view>
											<view class="task-child-item-num">已接 {{item.received_people_count}} {{item.unit}}/ <text>剩余
													{{item.surplus_count}} {{item.unit}}</text></view>
											<view class="task-child-item-price">￥{{item.money}}/{{item.unit}}</view>
											<view class="task-child-item-receive">{{item.ctime}}</view>
										</view>
										<button class="task-btn disabledBtn" v-if="item.status == 0 || item.status == 3" @tap="submitTask" :data-mtid="item.mtid">提交任务</button>
										<button class="task-btn disabledBtn" v-if="item.status == 2 && item.is_comm == 0" @tap="evaluateTask"
										 :data-mtid="item.mtid">评价任务</button>
										<button class="commented" v-if="item.status == 2 && item.is_comm == 1">已评价</button>
									</view>
									<view :data-index="index" :data-mtid="item.mtid" :data-indexBox="indexBox" @tap="delItem" class="inner del">
										<text>删除</text>
									</view>
								</view>
							</view>
						</view>
						<!-- 共几条 -->
						<view class="task-total" v-if="showFlag">共有{{myList.length}}条任务</view>
					</view>
					<!-- 暂无更多 -->
					<view class="pro" v-else>
						<image :src="myTask.image" mode="widthFix"></image>
						<view class="pro-text">{{myTask.content}}</view>
					</view>
				</view>
				<!-- 为你优选 -->
				<view class="task-list" v-if="optimizationList.length>0">
					<view class="task-item">
						<view class="task-item-time optimization">
							<view class="optimization-title">为你推荐</view>
							<navigator url="/pages/members/home/label_list/label_list?name=为你推荐&&flag=4" hover-class="none" class="optimization-title-more">
								<text>查看更多</text>
								<image src="/static/members/imgs/home-right.png"></image>
							</navigator>
						</view>
						<view class="task-item-child">
							<view class="task-child-item" v-for="(item, index) in optimizationList" :key="index">
								<view class="task-child-item-img">
									<image :src="item.image"></image>
								</view>
								<navigator class="task-child-item-con" :url="'/pages/members/taks-detail/taks-detail?id='+item.task_id"
								 hover-class="none">
									<view class="task-child-item-title">{{item.task_name}}</view>
									<view class="task-child-item-receive">
										<text>已接收 {{item.received_people_count}} {{item.unit}}</text>/<text class="task-surplus">剩余{{item.surplus_count}}{{item.unit}}</text>
										<!-- <view class="score-con">
		                  <template-stars id="dialog" stars="{{item.label_sort}}" width="{{width}}"></template-stars>
		                </view> -->
									</view>
									<view class="task-child-item-price optimization">
										<text>￥{{item.money}}/{{item.unit}}</text>
									</view>
								</navigator>
								<view class="optimization-receive-btn" :data-id="item.task_id" @tap="receiveTask">立即接收</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 底部logo -->
				<view class="logo-bottom" v-if="showFlag">
					<image src="/static/members/logo-bottom.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<view class="back-top" v-if="topShow" @tap="goTop">
			<image src="/static/members/imgs/back-top.png"></image>
		</view>
		<!-- 联系客服 -->
		<view class="service-icon" @tap="getChat">
			<image src="/static/members/imgs/chat2.png"></image>
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
		computed: mapState(['userInfo', 'userConfig', 'navHeight', 'taskFlag']),
		components: {
			navbar
		},
		data() {
			return {
				navbar: ['全部', '已接收', '已提交', '已通过', '未通过'],
				currentTab: 0,
				navTop: false,
				width: 25,
				score: 4,
				page: 1,
				pageShow: true,
				myList: [],
				//自定义参数
				noticeList: [], //公告列表
				myTask: '', //用户配置缓存数据
				optimizationList: [] //为你推荐列表
			}
		},
		onLoad() {
			var that = this;
			that.getList(1);
			that.myTask = that.userConfig.myTask
			var query = wx.createSelectorQuery();
			//选择id
			query.select('.task-navbar').boundingClientRect(function(rect) {
				// console.log(rect)
				that.top = rect.top - rect.height
			}).exec();
		},
		onShow() {
			var that = this;
			that.page = 1,
			that.currentTab = that.taskFlag
			var status;
			if (that.currentTab == 0) {
				//0全部
				status = 100;
			} else if (that.currentTab == 1) {
				//已接收
				status = 0;
			} else if (that.currentTab == 2) {
				//已提交
				status = 1;
			} else if (that.currentTab == 3) {
				//已通过
				status = 2;
			} else if (that.currentTab == 4) {
				//未通过
				status = 3;
			}
			var page = that.page;
			that.getMyTaskList(0, 1, status, page);
		},
		onReachBottom() {
			var that = this;
			var status;
			if (that.currentTab == 0) {
				//0全部
				status = 100;
			} else if (that.currentTab == 1) {
				//已接收
				status = 0;
			} else if (that.currentTab == 2) {
				//已提交
				status = 1;
			} else if (that.currentTab == 3) {
				//已通过
				status = 2;
			} else if (that.currentTab == 4) {
				//未通过
				status = 3;
			}
			if (that.pageShow) {
				that.page = that.page + 1
				var page = that.page;
				that.getMyTaskList(0, 0, status, page);
			}
		},
		onPageScroll(e) {
			var scrollTop = e.scrollTop
			this.$refs.navbar.setOpacity(scrollTop, 100);
			if (scrollTop > 700) {
				if (!this.topShow) {
					this.topShow = true
				}
			} else {
				if (this.topShow) {
					this.topShow = false
				}
			}
			if (scrollTop >= this.top) {
				if (!this.navTop) {
					this.navTop2(scrollTop, this.top);
				}
			} else {
				if (this.navTop) {
					this.navTop = false
				}
			}
		},
		onHide() {
			this.$store.commit('setTaskFlag', this.currentTab)
		},
		methods: {
			//获取公告列表
			getList(page) {
				var that = this;
				var data = {
					uid: that.userInfo.userid,
					page: page
				}
				util.request('noticeList', 'member', data, function(res) {
					// console.log(res)
					if (res.code == '000') {
						that.noticeList = res.data
					} else {
						wx.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						})
					}
				})
			},

			//撤销任务
			delItem(e) {
				var that = this;
				var myList = that.myList;
				var index = e.currentTarget.dataset.index;
				var mtid = e.currentTarget.dataset.mtid;
				var data = {
					uid: that.userInfo.userid,
					mtid: mtid
				}
				wx.showModal({
					title: '提示',
					content: '是否删除该任务？',
					success(res) {
						if (res.confirm) {
							util.request('delTask', 'taskcenter', data, function(res) {
								if (res.code == '000') {
									myList.splice(index, 1);
									that.myList = myList
									wx.showToast({
										title: '删除成功',
										icon: 'success',
										duration: 2000
									})
								} else {
									wx.showToast({
										title: res.msg,
										icon: 'none',
										duration: 2000
									})
								}
							})
						} else if (res.cancel) {
							return false;
						}
					}
				})
			},
			//为你优选任务列表
			getTaskList(page, limit, type, showstate) {
				var that = this;
				var data = {
					type: type, //首页获取全部0
					page: page,
					limit: limit,
					uid: that.userInfo.userid,
					showstate: showstate
				}
				util.request('getTaskList', 'taskcenter', data, function(res) {
					// console.log(res)
					if (res.code == '000') {
						that.optimizationList = res.data
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

			//接受任务
			receiveTask(e) {
				var that = this;
				var data = {
					uid: that.userInfo.userid,
					taskid: e.currentTarget.dataset.id,
				}
				wx.showModal({
					title: '提示',
					content: '是否接收该任务？',
					success(res) {
						if (res.confirm) {
							util.request('receiveTask', 'taskcenter', data, function(res) {
								// console.log(res)
								if (res.code == '000') {
									wx.showToast({
										title: "接收成功",
										mask: true,
										icon: 'success',
										duration: 2000
									})
									wx.navigateTo({
										url: '/pages/members/personal/task/task?flag=1'
									})
								} else if (res.code == '313') {
									wx.showModal({
										title: '提示',
										content: res.msg,
										success(res) {
											if (res.confirm) {
												wx.navigateTo({
													url: '/pages/base/bind-info/bind-info'
												})
											} else if (res.cancel) {
												console.log('用户点击取消')
											}
										}
									})
								} else {
									wx.showToast({
										title: res.msg,
										icon: 'none',
										mask: true,
										duration: 2000
									})
								}
							})
						} else if (res.cancel) {}
					}
				})
			},


			//切换tab
			navbarTap(e) {
				var that = this;
				that.currentTab = e.currentTarget.dataset.idx,
				that.page = 1,
				that.pageShow = true
				var status;
				if (that.currentTab == 0) {
					//0全部
					status = 100;
				} else if (that.currentTab == 1) {
					//已接收
					status = 0;
				} else if (that.currentTab == 2) {
					//已提交
					status = 1;
				} else if (that.currentTab == 3) {
					//已通过
					status = 2;
				} else if (that.currentTab == 4) {
					//未通过
					status = 3;
				}
				var page = that.page;
				that.getMyTaskList(0, 1, status, page);
			},

			//获取列表
			getMyTaskList(type, flag, status, page) {
				var that = this;
				var data = {
					type: type,
					uid: that.userInfo.userid,
					status: status,
					page: page,
				}
				util.request('getMyTaskList', 'taskcenter', data, function(res) {
					// console.log(res)
					if (res.code == '000') {
						if (type == 0) {
							if (res.data.length > 0) {
								var myList;
								if (flag == 1) {
									myList = [];
								} else {
									myList = that.myList;
								}
								myList.push.apply(myList, res.data);
								that.myList = myList,
								that.pageShow = true
								// if (page == 1) {
								var query = wx.createSelectorQuery();
								//选择id
								if (res.data.length > 0) {
									query.select('.del').boundingClientRect(function(rect) {
										that.delBtnWidth = rect.width - 10
									}).exec();
								}
								// }
							} else {
								that.myList = []
							}
							if (res.data.length < 21) {
								that.showFlag = true,
								that.pageShow = false
								// 获取为你优选
								if (!that.optimizationList || that.optimizationList.length == 0) {
									that.getTaskList(null, 3, 4, 0);
								}
							} else {
								that.showFlag = false
							}
						} else {
							that.audittask = res.data
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

			//跳转详情
			getDetail(e) {
				wx.navigateTo({
					url: '/pages/members/taks-detail/taks-detail?id=' + e.currentTarget.dataset.mtid
				})
			},
			// 提交任务
			submitTask(e) {
				wx.navigateTo({
					url: '/pages/members/task-car/task-detail/task-detail?mtid=' + e.currentTarget.dataset.mtid
				})
			},
			// 评价任务
			evaluateTask(e) {
				wx.navigateTo({
					url: '/pages/members/task-car/task-evaluate/task-evaluate?mtid=' + e.currentTarget.dataset.mtid
				})
			},
			navTop2(scrollTop, maxTop) {
				this.navTop = true
			},

			//返回顶部
			goTop(e) { // 一键回到顶部
				if (wx.pageScrollTo) {
					wx.pageScrollTo({
						scrollTop: 0
					})
				} else {
					wx.showModal({
						title: '提示',
						content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
					})
				}
			},

			//联系客服
			getChat() {
				//添加会话
				this.addChat();
			},

			//添加会话
			addChat() {
				var that = this;
				var data = {
					uid: that.userInfo.userid,
					task_id: 0
				}
				util.requestChat('add_chat', data, function(res) {
					if (res.code == '000') {
						//that.taskFlag = that.currentTab;
						that.$store.commit('setTaskFlag', that.currentTab)
						wx.navigateTo({
							url: '/pages/members/message/chat/chat?sid=' + res.data.sid + '&&to_id=' + res.data.to_id + '&&name=' + res
								.data.name
						})
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
			//暂未开放
			  prompt () {
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
	page {
		background-color: #EEEEEE;
	}

	.container {
		position: relative;
	}

	.navbar {
		z-index: -1;
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 1001;
	}

	.main {
		position: relative;
		z-index: 101;
		display: flex;
		flex-direction: column;
	}

	.train-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 300rpx;
		border-radius: 0 0 40rpx 40rpx;
	}

	.task-ad {
		z-index: 1;
		position: relative;
		display: flex;
		flex-direction: row;
		height: 80rpx;
		box-sizing: border-box;
		align-items: center;
		padding: 15rpx 30rpx;
	}

	.task-ad image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 15rpx;
	}

	.task-ad swiper {
		flex: 1;
		height: 50rpx;
	}

	.task-ad swiper-item {
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.task-ad navigator {
		flex: 1;
		width: 100%;
		font-size: 24rpx;
		line-height: 50rpx;
		color: #fff;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* 导航列表 */
	.label-list {
		margin: 0 20rpx;
		background-color: #fff;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 30rpx;
		border-radius: 20rpx;
		box-shadow: 2rpx 2rpx 12rpx 0 rgba(43, 86, 112, .1);
	}

	.label-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color: #8D8D96;
	}

	.label-img {
		width: 70rpx;
		height: 70rpx;
		margin-bottom: 10rpx;
	}

	/* 列表 */
	/* 导航条 */
	.task {
		position: relative;
		padding-top: 80rpx;
	}

	.task-navbar {
		width: 100%;
		position: absolute;
		top: 0;
		z-index: 11;
		background-color: #EEEEEE;
		height: 80rpx;
		display: flex;
		-ms-flex-pack: distribute;
		justify-content: space-around;
		font-size: 28rpx;
		color: #444;
		overflow: hidden;
	}

	.task-navbar .item {
		width: 20%;
		line-height: 80rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		text-align: center;
	}

	.task-navbar .item text {
		padding: 0 10rpx;
		line-height: 76rpx;
		border-bottom: 4rpx solid transparent;
	}

	.task-navbar .item text.active {
		border-color: #d6343f;
		color: #d6343f;
	}

	.task-surplus {
		color: #d6343f;
	}

	.home-top-fixed {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		box-sizing: border-box;
		background-color: #EEEEEE;
	}

	/* 任务具体列表 */
	.task-list {
		display: flex;
		flex-direction: column;
		padding: 0 20rpx;
	}

	.task-item {
		display: flex;
		flex-direction: column;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 0 20rpx;
		margin-bottom: 30rpx;
		box-shadow: 2rpx 2rpx 12rpx 0 rgba(43, 86, 112, .2);
	}

	.task-item-time {
		/* line-height: 80rpx; */
		padding: 20rpx 0 20rpx 10rpx;
		color: #8D8D96;
		font-size: 28rpx;
		border-bottom: 1rpx solid #EAECF0;
	}

	.task-item-child {
		display: flex;
		flex-direction: column;
		/* padding: 20rpx 0; */
	}

	.task-child {
		position: relative;
	}

	.task-child-item {
		/* position: relative;
	  display: flex;
	  flex-direction: row;
	  padding: 20rpx 0;
	  border-bottom: 1rpx solid #EAECF0; */
		position: relative;
		width: 100%;
		box-sizing: border-box;
		z-index: 5;
		display: flex;
		flex-direction: row;
		padding: 20rpx 0;
		background-color: #fff;
		transition: margin-left 0.2s ease-in-out;
	}

	.item-del {
		position: absolute;
		top: 10rpx;
		right: 0;
		width: 40rpx;
		height: 40rpx;
		padding: 10rpx;
	}

	.task-child-item:last-child {
		border-bottom: 1rpx solid transparent;
	}

	.task-child-item-img {
		display: flex;
		position: relative;
		overflow: hidden;
	}

	.task-child-item-img text {
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

	.task-child-item-img image {
		width: 170rpx;
		height: 170rpx;
		border-radius: 10rpx;
		border: 1rpx solid #FF414D;
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

	/* 暂无更多 */
	.pro {
		position: relative;
		background-color: #fff;
		padding: 40rpx 0;
		margin: 0 30rpx 30rpx;
		border-radius: 20rpx;
		box-shadow: 2rpx 2rpx 12rpx 0 rgba(43, 86, 112, .1);
	}

	/* 为你优选 */
	.optimization {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.optimization-title {
		flex: 1;
		font-size: 32rpx;
		color: #313138;
		font-weight: 600;
	}

	.optimization-title-more {
		font-size: 28rpx;
		color: #BEBECA;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.optimization-title-more image {
		width: 35rpx;
		height: 35rpx;
		margin-left: 5rpx;
	}

	.optimization-receive-btn {
		position: absolute;
		bottom: 20rpx;
		right: 0;
		font-size: 24rpx;
		padding: 8rpx 20rpx;
		background-color: #FF414D;
		font-weight: normal;
		color: #fff;
		border-radius: 30rpx;
	}

	.task-btn {
		position: absolute;
		bottom: 20rpx;
		right: 20rpx;
		font-size: 24rpx;
		padding: 8rpx 20rpx;
		background-color: #FF414D;
		font-weight: normal;
		color: #fff;
		border-radius: 30rpx;
	}

	/* 删除 */
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

	.disabledBtn {
		padding: 0 20rpx;
		height: 48rpx;
		line-height: 48rpx;
	}

	.commented {
		position: absolute;
		bottom: 20rpx;
		right: 20rpx;
		font-size: 24rpx;
		background-color: #8D8D96;
		font-weight: normal;
		color: #fff;
		border-radius: 30rpx;
		padding: 0 20rpx;
		height: 48rpx;
		line-height: 48rpx;
	}
</style>
