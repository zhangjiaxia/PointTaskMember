<template>
	<view class="">
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle" @getHeight="setTop"></navigationBar>
		</view>
		<scroll-view class="container" scroll-y scroll-with-animation='true' :scroll-into-view="toView" @scroll="bindscroll">
			<!-- 任务列表导航条 -->
			<view class="task-navbar" :class="{'home-top-fixed':navTop}" :style="{top: scrollTop}">
				<view v-for="(item, index) in navbar" :key="index" :data-idx="index" class="item" @tap="navbarTap">
					<text :class="{active: currentTab==index}" @tap="jumpTo" :data-opt="item.flag">{{item.name}}</text>
				</view>
			</view>
			<view class="box">
				<!-- 我的评价 -->
				<view class="evaluation" id="A1">
					<view class="evaluation-title">
						<text class="evaluation-title-left">我的评价</text>
						<view class="evaluation-score">
							<template-stars id="dialog" :stars="evalGrade.avgeval" :width="width" :avtive="avtive" :grey="grey"></template-stars>
						</view>
						<text class="evaluation-title-right">{{evalGrade.ratings}}</text>
					</view>
					<!-- <view class="evaluation-item">
		        <view class="evaluation-item-title">准时提交</view>
		        <view class="evaluation-item-con">
		          <view class="evaluation-item-con-l">不准时</view>
		          <view class="evaluation-item-con-score">
		            <template-stars id="dialog" stars="{{evalGrade.submitted_time}}" width="{{width}}" avtive="{{avtive}}" grey="{{grey}}"></template-stars>
		          </view>
		          <view class="evaluation-item-con-r">准时</view>
		        </view>
		      </view> -->
					<view class="evaluation-item">
						<view class="evaluation-item-title">通过率</view>
						<view class="evaluation-item-con">
							<view class="evaluation-item-con-l">0%</view>
							<view class="evaluation-item-con-score">
								<template-stars id="dialog" :stars="evalGrade.pass_rate" :width="width" :avtive="avtive" grey="grey"></template-stars>
							</view>
							<view class="evaluation-item-con-r">100%</view>
						</view>
					</view>
					<view class="evaluation-item">
						<view class="evaluation-item-title">任务质量</view>
						<view class="evaluation-item-con">
							<view class="evaluation-item-con-l">低</view>
							<view class="evaluation-item-con-score">
								<template-stars id="dialog" :stars="evalGrade.quality" :width="width" :avtive="avtive" :grey="grey"></template-stars>
							</view>
							<view class="evaluation-item-con-r">高</view>
						</view>
					</view>
					<view class="evaluation-item">
						<view class="evaluation-item-title">性价比</view>
						<view class="evaluation-item-con">
							<view class="evaluation-item-con-l">低</view>
							<view class="evaluation-item-con-score">
								<template-stars id="dialog" :stars="evalGrade.cost" :width="width" :avtive="avtive" :grey="grey"></template-stars>
							</view>
							<view class="evaluation-item-con-r">高</view>
						</view>
					</view>
					<view class="evaluation-item">
						<view class="evaluation-item-title">沟通服务</view>
						<view class="evaluation-item-con">
							<view class="evaluation-item-con-l">差</view>
							<view class="evaluation-item-con-score">
								<template-stars id="dialog" :stars="evalGrade.communiction" :width="width" :avtive="avtive" :grey="grey"></template-stars>
							</view>
							<view class="evaluation-item-con-r">好</view>
						</view>
					</view>
					<view class="evaluation-item">
						<view class="evaluation-item-title">放弃率</view>
						<view class="evaluation-item-con">
							<view class="evaluation-item-con-l">放弃</view>
							<view class="evaluation-item-con-score">
								<template-stars id="dialog" :stars="evalGrade.giveup_rate" :width="width" :avtive="avtive" :grey="grey"></template-stars>
							</view>
							<view class="evaluation-item-con-r">没放弃</view>
						</view>
					</view>
				</view>
				<!-- 对我评论 -->
				<view class="comments" id="A2">
					<view class="comments-top">
						<view class="comments-top-title">
							<view class="comments-top-title-text">对我评论</view>
							<view class="comments-top-title-number">{{comments.count}}条</view>
							<view class="comments-top-title-right">

								<text :class="{'comments-top-title-sort': type==1}" @tap="navSort" data-type="1">默认排序</text> |
								<text :class="{'comments-top-title-sort': type==2}" @tap="navSort" data-type="2">按时间排序</text>
							</view>
						</view>
						<!-- label -->
						<view class="comments-label" v-if="commentsList.length>0">
							<view class="comments-label-item">好评量 {{comments.goodcount}} 条</view>
							<view class="comments-label-item">好评率 {{comments.goodrate}}%</view>
						</view>
					</view>
					<!-- 列表 -->
					<view class="comments-list" v-if="commentsList.length>0">
						<view class="comments-item" v-for="(item, index) in commentsList" :key="index">
							<view class="comments-item-top">
								<view class="comments-item-top-info">
									<image class="comments-item-top-info-img" :src="item.shop_img"></image>
									<view class="comments-item-top-info-con">
										<view class="comments-item-top-info-con-top">
											<text>{{item.shop_name}}</text>
											<view class="comments-item-top-info-con-score">
												<template-stars id="dialog" :stars="item.avgeval" :width="width" :avtive="avtive" :grey="grey"></template-stars>
											</view>
										</view>
										<view class="comments-item-top-info-con-titme">{{item.shop_ctime}}</view>
									</view>
								</view>
								<view class="comments-item-top-text">{{item.shop_content}}</view>
								<view class="comments-item-top-pro">
									<text class="comments-item-top-pro-l">对我评价</text>
									<text class="comments-item-top-pro-con">{{item.avgeval}}星</text>
									<view class="comments-item-top-pro-r">{{item.ratings}}</view>
								</view>
							</view>
							<!-- 回复 -->
							<view class="comments-item-reply" v-if="item.reply_content">
								<view class="comments-item-reply-title">我的回复</view>
								<view class="comments-item-reply-con">{{item.reply_content}}</view>
							</view>
						</view>
						<view class="comments-list-more-box">
							<view class="comments-list-more" @tap="getMore">
								<text>查看更多</text>
								<image src="/static/members/imgs/red-right.png"></image>
							</view>
						</view>
					</view>
					<view class="comments-pro" v-else>
						暂无评论
					</view>
				</view>
				<!-- 会员等级 -->
				<view class="level" id="A3">
					<view class="level-title">
						<view class="level-title-text">会员等级</view>
						<view class="level-title-con">
							<image src="/static/members/imgs/level.png"></image>
							<text>{{userGrade.rank}}</text>
						</view>
					</view>
					<view class="level-list">
						<view class="level-item">
							<image src="/static/members/imgs/level1.png"></image>
							<view class="level-item-title">累计完成任务数</view>
							<view class="level-item-num">{{userGrade.cumul_num}}条</view>
						</view>
						<view class="level-item">
							<image src="/static/members/imgs/level2.png"></image>
							<view class="level-item-title">累计服务时长</view>
							<view class="level-item-num">{{userGrade.dvration}}小时</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="back-top" v-if="topShow" @tap="goTop">
			<image src="/static/members/imgs/back-top.png"></image>
			<!-- <image src="/static/members/top2.png"></image> -->
		</view>

		<!-- 联系客服 -->
		<view class="service-icon" @tap="getChat">
			<image src="/static/members/imgs/chat2.png"></image>
			<!-- <image src="/static/members/chat2.png"></image> -->
		</view>
	</view>
</template>

<script>
	import util from '@/utils/util.js'
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
	import templateStars from '@/components/star.vue'
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		computed: mapState(['userInfo']),
		components: {
			navigationBar,
		},
		data() {
			return {
				scrollTop: '',
				//设置导航栏样式
				navigationBarStyle: {
					iconText: '评价卡片' //导航栏文字
				},
				navbar: [{
					name: '我的评价',
					flag: 1
				}, {
					name: '对我评论',
					flag: 2
				}, {
					name: '会员等级',
					flag: 3
				}],
				currentTab: 0,
				width: 45,
				page: 1,
				type: 1,
				avtive: 'xx101',
				grey: 'xx102',
				//自定义参数
				commentsList: [], //评论列表
				comments: {}, //评论数据
				evalGrade: '', //星级
				userGrade: '', //等级
				toView: '', //锚点跳转
				//导航切换效果
				topA1: 0,
				topA2: 0,
				topA3: 0,
			}
		},
		onLoad() {
			this.userEvalCard();
			this.userTaskComment();
		},
		methods: {
			setTop(systems) {
				this.scrollTop = (systems.ktxStatusHeight + systems.navigationHeight) + 'rpx'
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
			// 锚点跳转
			jumpTo(e) {
				// 获取标签元素上自定义的 data-opt 属性的值
				let target = e.currentTarget.dataset.opt;
				this.toView = 'A' + target
			},
			//滚动监听
			bindscroll(e) {
				var scrollTop = e.detail.scrollTop;
				// console.log(scrollTop , this.topA2)
				if (scrollTop <= this.topA1) {
					this.currentTab = 0
				}
				if ((scrollTop >= this.topA2) && (scrollTop <= this.topA3)) {
					this.currentTab = 1
				}
				if (scrollTop > this.topA3) {
					this.currentTab = 2
				}
			},

			//加载更多
			getMore() {
				this.page = this.page + 1
				this.userTaskComment(this.page);
			},

			//切换排序
			navSort(e) {
				// console.log(e)
				this.type = e.currentTarget.dataset.type
				this.page = 1
				this.userTaskComment(this.page, 1);
			},

			//评论
			userTaskComment(page, flag) {
				var that = this;
				var data = {
					uid: that.userInfo.userid,
					page: page,
					rank: that.type
				}
				util.request('userTaskComment', 'member', data, function(res) {
					// console.log(res)
					if (res.code == '000') {
						if (flag) {
							that.commentsList = []
						}
						if (that.page == 1) {
							that.comments = res.data, //星级
							that.commentsList = res.data.comment
						} else {
							var commentsList = that.commentsList;
							commentsList.push.apply(commentsList, res.data.comment);
							that.commentsList = commentsList //星级
						}
						// console.log(that.comments)
						//我的评价
						wx.createSelectorQuery().select('#A1').boundingClientRect(rect => {
							that.topA1 = rect.top - 40
						}).exec()
						//对我评论
						wx.createSelectorQuery().select('#A2').boundingClientRect(rect => {
							that.topA2 = rect.top - 40
						}).exec()
						//会员等级
						wx.createSelectorQuery().select('#A3').boundingClientRect(rect => {
							that.topA3 = rect.top - 40
						}).exec()
					} else {
						wx.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						})
					}
				})
			},

			//评价与等级
			userEvalCard() {
				var that = this;
				var data = {
					uid: that.userInfo.userid,
				}
				util.request('userEvalCard', 'member', data, function(res) {
					if (res.code == '000') {
						that.evalGrade = res.data.evalGrade, //星级
						that.userGrade = res.data.userGrade //会员等级
					} else {
						wx.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						})
					}
				})
			},

			//切换tab
			navbarTap(e) {
				var that = this;
				that.currentTab = e.currentTarget.dataset.idx
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
					// console.log(res)
					if (res.code == '000') {
						wx.navigateTo({
							url: '/pages/members/message/chat?sid=' + res.data.sid + '&&to_id=' + res.data.to_id + '&&name=' + res
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
		}
	}
</script>

<style>
	page {
		height: 100%;
		background: #F6F6F9;
	}
	
	.container {
		height: 100%;
		overflow: hidden;
		position: relative;
		padding-top: 80rpx;
		box-sizing: border-box;
	}

	.task-navbar {
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 11;
		background-color: #F6F6F9;
		height: 80rpx;
		display: flex;
		-ms-flex-pack: distribute;
		justify-content: space-around;
		font-size: 28rpx;
		color: #444;
	}

	.task-navbar .item {
		flex: 1;
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
		border-color: #FF0000;
		color: #FF0000;
	}

	/* 我的评价 */
	.box {
		display: flex;
		flex-direction: column;
		padding: 30rpx 0;
	}

	.evaluation,
	.comments,
	.level {
		display: flex;
		flex-direction: column;
		padding: 0 30rpx;
		margin: 0 30rpx 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 2rpx 2rpx 12rpx 0 rgba(43, 86, 112, .2);
	}

	.evaluation-title-left {
		font-weight: 600;
	}

	.evaluation-title {
		padding: 20rpx 10rpx;
		display: flex;
		flex-direction: row;
		font-size: 32rpx;
		color: #313138;
		border-bottom: 1rpx solid #EAECF0;
	}

	.evaluation-score {
		flex: 1;
	}

	.evaluation-title-right {
		color: #FF0000;
	}

	.evaluation-item {
		display: flex;
		flex-direction: row;
		padding: 20rpx 10rpx;
	}

	.evaluation-item-title {
		width: 160rpx;
		font-size: 30rpx;
		color: #313138;
	}

	.evaluation-item-con {
		flex: 1;
		display: flex;
		flex-direction: row;
		font-size: 24rpx;
		color: #8D8D96;
		align-items: center;
		justify-content: center;
	}

	.evaluation-item-con-score {
		flex: 1;
	}

	.evaluation-item-con-l,
	.evaluation-item-con-r {
		width: 100rpx;
		text-align: center;
	}

	.comments-top {
		display: flex;
		flex-direction: column;
	}

	.comments-top-title {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 20rpx 10rpx;
	}

	.comments-top-title-text {
		font-weight: 600;
		font-size: 32rpx;
		color: #313138
	}

	.comments-top-title-number {
		margin-left: 20rpx;
		color: #FF0000;
	}

	.comments-top-title-right {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		font-size: 28rpx;
		color: #8D8D96;
	}

	.comments-top-title-right text {
		padding: 0 10rpx;
	}

	.comments-top-title-sort {
		color: #FC404C;
	}

	.comments-label {
		display: flex;
		flex-direction: row;
		margin: 0 10rpx 20rpx;
	}

	.comments-label-item {
		padding: 6rpx 15rpx;
		font-size: 24rpx;
		margin-right: 10rpx;
		border-radius: 25rpx;
		background-color: #FFD3D6;
		color: #FF0000;
	}

	/* 列表 */
	.comments-list {
		display: flex;
		flex-direction: column;
	}

	.comments-item {
		display: flex;
		flex-direction: column;
		padding: 30rpx 10rpx;
		border-bottom: 1rpx solid #EAECF0;
	}

	.comments-item-top {
		display: flex;
		flex-direction: column;
	}

	.comments-item-top-info {
		display: flex;
		flex-direction: row;
		padding-bottom: 20rpx;
	}

	.comments-item-top-info-img {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		box-shadow: 2rpx 2rpx 12rpx 0 rgba(43, 86, 112, .2);
	}

	.comments-item-top-info-con {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 30rpx;
	}

	.comments-item-top-info-con-top {
		display: flex;
		flex-direction: row;
		font-size: 32rpx;
		color: #313138;
	}

	.comments-item-top-info-con-score {
		padding-left: 20rpx;
	}

	.comments-item-top-info-con-titme {
		font-size: 24rpx;
		color: #BEBECA;
	}

	.comments-item-top-text {
		font-size: 28rpx;
		color: #313138;
		margin-bottom: 10rpx;
	}

	.comments-item-top-pro {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.comments-item-top-pro-l {
		font-size: 24rpx;
		color: #8D8D96;
	}

	.comments-item-top-pro-con {
		font-size: 28rpx;
		color: #FC404C;
		padding: 0 15rpx;
	}

	.comments-item-top-pro-r {
		font-size: 28rpx;
		color: #FC404C;
	}

	.comments-item-reply {
		margin-top: 10rpx;
		padding: 15rpx 20rpx;
		border-radius: 20rpx;
		background-color: #F1F1FD;
		font-size: 28rpx;
		color: #313138;
	}

	.comments-item-reply-title {
		margin-bottom: 6rpx;
	}

	.comments-list-more-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 20rpx 0;
	}

	.comments-list-more {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 15rpx 30rpx;
		border-radius: 35rpx;
		justify-content: center;
		background-color: #FFD3D6;
		color: #FF0000;
		font-size: 28rpx;
	}

	.comments-list-more image {
		margin-left: 8rpx;
		width: 30rpx;
		height: 30rpx;
	}

	/* 会员等级 */
	.level-title {
		padding: 20rpx 10rpx;
		display: flex;
		flex-direction: row;
		border-bottom: 1rpx solid #EAECF0;
	}

	.level-title-text {
		flex: 1;
		font-weight: 600;
		font-size: 32rpx;
		color: #313138;
	}

	.level-title-con {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #8D8D96;
	}

	.level-title-con image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 8rpx;
	}

	.level-list {
		display: flex;
		flex-direction: row;
		padding: 20rpx 0;
	}

	.level-item {
		flex: 1;
		padding: 20rpx;
		margin: 0 10rpx;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		border-radius: 20rpx;
		color: #313138;
		box-shadow: 2rpx 2rpx 12rpx 0 rgba(43, 86, 112, .2);
	}

	.level-item image {
		width: 130rpx;
		height: 130rpx;
	}

	.level-item-title {
		margin: 10rpx 0;
	}

	.comments-pro {
		color: #8D8D96;
		font-size: 28rpx;
		padding: 40rpx 0;
		text-align: center;
	}
</style>
