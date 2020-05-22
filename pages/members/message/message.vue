<template>
	<view>
		<view class="container">
			<navbar ref="navbar" class="navbar" page-name="消息"></navbar>
			<image class="train-bg" src="/static/members/imgs/top_BG@2x.png"></image>
			<!-- <image class="header-bg" src="/static/members/bg.png"></image> -->
			<!-- <view class="header-bg"></view> -->
			<view class="main" :style="{'padding-top': navHeight + 'px'}">
				<!-- 公告 -->
				<view class="task-ad">
					<image src="/static/members/imgs/notice.png" v-if="noticeList.length>0"></image>
					<swiper vertical autoplay circular>
						<swiper-item v-for="(item, index) in noticeList" :key="index">
							<navigator :url="'/pages/members/message/notice-detail/notice-detail?id='+item.id" hover-class="none">{{item.title}}</navigator>
						</swiper-item>
					</swiper>
				</view>
				<image class="train-bg" src="/static/members/imgs/top_BG@2x.png"></image>
				<view class="msg-nav">
					<view class="msg-nav-item" data-nav="1" @tap="navBtn">
						<image src="/static/members/imgs/hudong.png" mode="widthFix"></image>
						<text :class="{active: isShow}">消息互动</text>
					</view>
					<view class="msg-nav-item" @tap="navBtn" data-nav="2">
						<image src="/static/members/imgs/system.png" mode="widthFix"></image>
						<text :class="{active: isShow}">公告消息</text>
					</view>
				</view>
		
				<!-- 消息 -->
				<view v-if="isShow" class="box">
					<!-- 消息列表 -->
					<view class="list" v-if="list.length>0">
						<scroll-view scroll-y scroll-with-animation='true' @scrolltoupper="getChatMore" upper-threshold="30rpx">
							<view class="list-item" v-for="(item, index) in list" :key="index" @tap="jumpChat" :data-name="item.info.name" 
							:data-sid="item.id" :data-toid="item.to_id">
								<view class="list-item-portrait">
									<image :src="item.info.avatar" mode="widthFix"></image>
								</view>
								<view class="list-item-con">
									<view class="new-num" v-if="item.news">{{item.news}}</view>
									<view class="item-name">
										<text>{{item.info.name}}</text>
										<text class="item-time">{{item.time}}</text>
									</view>
									<view class="item-msg">{{item.lastmsg}}</view>
								</view>
							</view>
						</scroll-view>
					</view>
					<!-- 暂无消息 -->
					<view class="pro" v-else>
						<image :src="msgList.image" mode="widthFix"></image>
						<view class="pro-text">{{msgList.content}}</view>
					</view>
				</view>
				<!-- 公告 -->
				<view v-else class="box">
					<view class="noticeList" v-if="noticeList.length>0">
						<scroll-view scroll-y scroll-with-animation='true' @scrolltoupper="getNoticeMore" upper-threshold="30rpx">
							<navigator v-for="(item, index) in noticeList" :key="index" :url="'/pages/members/message/notice-detail/notice-detail?id='+item.id"
							 hover-class="none" class="item">
								<!-- <view class="item-img">
									<image src="/static/1/1.png" mode="widthFix"></image>
								</view> -->
								<view class="item-con">
									<view class="item-title">标题：{{item.title}}</view>
									<view class="item-username">内容：{{item.content}}</view>
									<view class="item-time">创建时间：{{item.ctime}}</view>
								</view>
							</navigator>
						</scroll-view>
					</view>
					<!-- 暂无消息 -->
					<view class="pro" v-else>
						<image :src="noticeMsg.image" mode="widthFix"></image>
						<view class="pro-text">{{noticeMsg.content}}</view>
					</view>
				</view>
			</view>
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
		computed: mapState(['navHeight', 'userConfig', 'userInfo']),
		components: {
			navbar
		},
		data() {
			return {
				isShow: true,
				page: 1, //页码
				pageShow: true,
				list: [],
				noticeList: [],
				num: 20
			}
		},
		onLoad() {
			this.getList(1);
		},
		onShow() {
			var that = this;
			if (that.isShow) {
				that.page = 1,
				that.pageShow = true,
				that.msgList = that.userConfig.msgList,
				that.noticeMsg = that.userConfig.noticeMsg
				var page = that.page;
				that.chatList(page, that.num);
			}
		},
		onPageScroll(e) {
			var scrollTop = e.scrollTop
			this.$refs.navbar.setOpacity(scrollTop, 200);
		},
		onHide() {
			clearInterval(this.indexInterval);
		},
		methods: {
			//联系客服（默认客服）
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
					// console.log(res)
					if (res.code == '000') {
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

			//跳转聊天（指定某个人）
			jumpChat(e) {
				const sid = e.currentTarget.dataset.sid,
					to_id = e.currentTarget.dataset.toid,
					name = e.currentTarget.dataset.name;
				wx.navigateTo({
					url: '/pages/members/message/chat?sid=' + sid + '&&to_id=' + to_id + '&&name=' + name
				})
			},

			//跳转公告
			getNotice() {
				wx.navigateTo({
					url: '/pages/members/message/notice/notice'
				})
			},

			//切换消息
			navBtn(e) {
				var that = this;
				if (e.currentTarget.dataset.nav == 1) {
					//消息互动
					that.page = 1,
					that.isShow = true,
					that.pageShow = true
					var page = that.page;
					that.chatList(page, that.num);
				} else {
					that.page = 1,
					that.isShow = true,
					that.pageShow = false
					var page = that.page;
					that.getList(page);
				}
			},

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
						if (res.data.length > 0) {
							var noticeList;
							if (page > 1) {
								noticeList = that.noticeList;
							} else {
								noticeList = [];
							}
							noticeList.push.apply(noticeList, res.data);
							that.noticeList = noticeList
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
			//获取回话列表
			chatList(page, num) {
				var that = this;
				var data = {
					uid: that.userInfo.userid,
					page: page,
					num: num
				}
				util.requestChat('list_chat', data, function(res) {
					// console.log(res)
					if (res.code == '000') {
						if (res.data.data.length > 0) {
							var list;
							if (page > 1) {
								list = that.list;
							} else {
								list = [];
							}
							list.push.apply(list, res.data.data);
							that.list = list
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

			//互动更多
			getChatMore() {
				var that = this;
				if (that.pageShow) {
					that.page = that.page + 1
					var page = that.page;
					that.chatList(page, that.num);
				}
			},

			//公告更多
			getNoticeMore() {
				var that = this;
				if (that.pageShow) {
					that.page = that.page + 1
					var page = that.page;
					that.getList(page);
				}
			},
		}
	}
</script>

<style>
	.navbar {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 1001;
	}

	page {
		height: 100%;
		background-color: #fff;
		/* overflow: hidden; */
	}

	.container {
		height: 100%;
	}

	/* 主体 */
	.main {
		position: relative;
		z-index: 101;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.train-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 300rpx;
		border-radius: 0 0 80rpx 80rpx;
	}

	.msg-nav {
		z-index: 101;
		display: flex;
		flex-direction: row;
		box-shadow: 0 0 60rpx 0 rgba(43, 86, 112, .1);
		margin: 0 16rpx 12rpx 16rpx;
		padding: 8rpx;
		background-color: #fff;
		border-radius: 16rpx;
	}

	.msg-nav-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		text-align: center;
		padding: 12rpx 6rpx;
		font-size: 24rpx;
		color: #666;
		align-items: center;
	}

	.msg-nav-item image {
		width: 90rpx;
		height: 90rpx;

		margin-bottom: 10rpx;
	}

	.box {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
	}

	/* 消息列表 */
	.list {
		flex-grow: 1;
		overflow-y: auto;
	}

	.list scroll-view {
		height: 100%;
		overflow: hidden;
	}

	.list-item {
		padding: 24rpx 32rpx;
		border-bottom: 1rpx solid #ededed;
		overflow: hidden;
		display: flex;
		flex-direction: row;
		background-color: #fff;
	}

	.list-item-portrait {
		margin-right: 36rpx;
		display: flex;
	}

	.list-item-portrait image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}

	.list-item-con {
		flex-grow: 1;
		padding: 15rpx 8rpx;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
	}

	.new-num {
		position: absolute;
		right: 20rpx;
		bottom: 10rpx;
		padding: 5rpx 10rpx;
		text-align: center;
		font-size: 24rpx;
		background-color: #d6343f;
		color: #fff;
		border-radius: 10rpx;
	}

	.item-name {
		font-size: 30rpx;
		color: 444;
		padding-bottom: 10rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.item-name .item-time {
		font-size: 24rpx;
		color: #666;
	}

	.item-msg {
		max-width: 450rpx;
		font-size: 24rpx;
		color: #888;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	/* 暂无更多 */
	.pro {
		z-index: -10;
		position: absolute;
	}

	.noticeList {
		flex-grow: 1;
		overflow-y: auto;
	}

	.noticeList scroll-view {
		height: 100%;
		overflow: hidden;
	}

	.item {
		margin: 0 20rpx 18rpx;
		display: flex;
		flex-direction: row;
		padding: 18rpx;
		border-radius: 12rpx;
		background-color: #fff;
		box-shadow: 2rpx 2rpx 12rpx 0 rgba(43, 86, 112, .1);
	}

	.item-con {
		padding-left: 18rpx;
		flex: 1;
		overflow: hidden;
	}

	.item-title {
		font-size: 32rpx;
		color: #333;
		white-space: nowrap;
		word-break: keep-all;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.item-username {
		font-size: 28rpx;
		color: #666;
		margin-top: 6rpx;
		white-space: nowrap;
		word-break: keep-all;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.item-time {
		font-size: 24rpx;
		color: #999;
		margin-top: 6rpx;
		white-space: nowrap;
		word-break: keep-all;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.active {
		color: #d6343f;
	}

	/* 联系客服 */
	.service-icon {
		z-index: 1001;
		position: fixed;
		right: 20rpx;
		bottom: 50rpx;
		/* padding: 15rpx; */
		display: flex;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0rpx 0rpx 10rpx 0 rgba(141, 141, 150, .5);
	}

	.service-icon image {
		width: 70rpx;
		height: 70rpx;
	}

	/* 公告 */
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
</style>
