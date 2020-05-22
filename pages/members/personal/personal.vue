<template>
	<view class="container">
		<navbar ref="navbar" class="navbar" page-name="个人中心"></navbar>
		<!-- 个人基本信息 -->
		<view class="userinfo" :style="{'padding-top': navHeight + 'px'}">
			<image class="userinfo-bg" src="/static/members/imgs/top_BG@2x.png"></image>
			<view class="userinfo-box">
				<view class="userinfo-src" @tap="jumpEditor">
					<image class="userinfo-src-portrait" :src="userInfo.avatar"></image>
				</view>
				<view class="userinfo-con">
					<view class="userinfo-nickname">
						<text class="userinfo-nickname-con">{{userInfo.nickname}}</text>
						<text class="userinfo-nickname-state" v-if="userInfo.aut == 0" @tap="bindInfo">前往认证</text>
						<text class="userinfo-nickname-state" v-if="userInfo.aut == 1">已认证</text>
						<text class="userinfo-nickname-state" v-if="userInfo.aut == 2">审核中</text>
						<text class="userinfo-nickname-state" v-if="userInfo.aut == 3" @tap="bindInfo">未通过</text>
					</view>
					<view class="userinfo-name" @tap="goToReviewCard">
						<view class="userinfo-name-label">评价等级</view>
						<view class="userinfo-score">
							<template-stars id="dialog" :stars="myGrades.avgeval" :width="width" :avtive="avtive" :grey="grey"></template-stars>
						</view>
					</view>
					<view class="userinfo-name" @tap="goToReviewCard">
						<view class="userinfo-name-label">好<text></text>评<text></text>量</view>
						<view class="userinfo-evaluation-total">{{myGrades.goodCount}}</view>
					</view>
					<view class="userinfo-name" @tap="goToReviewCard">
						<view class="userinfo-name-label">好<text></text>评<text></text>率</view>
						<view class="userinfo-evaluation-total">{{myGrades.goodrate}}%</view>
					</view>
				</view>
			</view>
			<!-- 查看详情 -->
			<navigator class="userinfo-look" hover-class="none" url="/pages/members/personal/evaluation-card">
				<text>查看详情</text>
				<!-- <image src="/static/members/imgs/red-right.png"></image> -->
			</navigator>
			<view class="userinfo-pro">
				<image src="/static/members/imgs/icons_Good@2x.png"></image>
				<view class="userinfo-pro-price">您已经在平台赚取了
					<text>{{userInit_MoneyAll.accumulation_money}}</text> 元，继续努力可以赚取更多钱哦~</view>
			</view>
		</view>
		<!-- 我的任务 -->
		<view class="task">
			<view class="base-top">
				<view class="base-title">我的任务</view>
				<view class="base-pro" @tap="goToTaskCar" data-type='0'>
					<text>接收任务</text>
					<image src="/static/members/imgs/icon-right.png"></image>
				</view>
			</view>
			<view class="task-list">
				<view class="task-item" @tap="goToTaskCar" data-type='1'>
					<image src="/static/members/imgs/icons_jieshou@2x.png"></image>
					<text class="task-item-text">已接收</text>
					<text class="task-item-num" v-if="userInit_DataGet.accept>0">{{userInit_DataGet.accept}}</text>
				</view>
				<view class="task-item" @tap="goToTaskCar" data-type='2'>
					<image src="/static/members/imgs/icons_tijiao@2x.png"></image>
					<text class="task-item-text">已提交</text>
					<text class="task-item-num" v-if="userInit_DataMake.sumbit>0">{{userInit_DataMake.sumbit}}</text>
				</view>
				<view class="task-item" @tap="goToTaskCar" data-type='3'>
					<image src="/static/members/imgs/icons_pass@2x.png"></image>
					<text class="task-item-text">已通过</text>
					<text class="task-item-num" v-if="userInit_DataPass.pass>0">{{userInit_DataPass.pass}}</text>
				</view>
				<view class="task-item" @tap="goToTaskCar" data-type='4'>
					<image src="/static/members/imgs/icons_UNpass@2x.png"></image>
					<text class="task-item-text">未通过</text>
					<text class="task-item-num" v-if="userInit_DataMake.nopass>0">{{userInit_DataMake.nopass}}</text>
				</view>
			</view>
			<view class="task-ad" v-if="audittask.length>0">
				<image src="/static/members/imgs/icons_news@2x.png"></image>
				<swiper vertical autoplay circular>
					<swiper-item v-for="(item, index) in audittask" :key="index">
						<navigator :url="'/pages/members/personal/task/task-detail/task-detail?mtid='+item.mtid" hover-class="none">{{item.task_name}}</navigator>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!-- 我的钱包与点滴 -->
		<view class="wallet">
			<navigator class="wallet-item" hover-class="none" url="/pages/members/personal/wallet">
				<view class="wallet-title">我的钱包</view>
				<view class="wallet-img">
					<image src="/static/members/imgs/wallet01.png"></image>
				</view>
				<view class="wallet-number">余额 {{userInit_MoneyUse.withdrawal_money}} 元</view>
			</navigator>
			<!-- <view class="wallet-item ml15">
		      <view class="wallet-title">我的点滴</view>
		      <view class="wallet-img">
		        <image src="/static/members/imgs/wallet02.png"></image>
		      </view>
		      <view class="wallet-number">{{myGrades.userwater}} 点滴</view>
		    </view> -->
			<navigator class="wallet-item" hover-class="none" url="/pages/members/community/paradise/paradise">
				<view class="wallet-title">点动乐园</view>
				<view class="park-img">
					<image src="/static/members/imgs/notice2.png"></image>
				</view>
				<view class="wallet-number">积累点滴</view>
			</navigator>
		</view>
		<!-- 我的服务 -->
		<view class="service">
			<view class="service-title">我的服务</view>
			<view class="service-list">
				<navigator class="service-item" url="/pages/members/personal/collection/collection?flag=1" hover-class="none">
					<image src="/static/members/imgs/icons_shoucang@2x.png"></image>
					<text>我的点赞</text>
				</navigator>
				<navigator class="service-item" url="/pages/members/personal/collection/collection?flag=2" hover-class="none">
					<image src="/static/members/imgs/collect-on.png"></image>
					<text>我的收藏</text>
				</navigator>
				<navigator class="service-item" url="/pages/members/personal/collection/collection?flag=4" hover-class="none">
					<image src="/static/members/imgs/share-on.png"></image>
					<text>我的分享</text>
				</navigator>
				<navigator class="service-item" url="/pages/members/personal/collection/my-evaluate/my-evaluate">
					<image src="/static/members/imgs/icons_peixun@2x.png"></image>
					<text>我的评论</text>
				</navigator>
				<navigator class="service-item" url="/pages/members/personal/browse" hover-class="none">
					<image src="/static/members/imgs/icons_liulan@2x.png"></image>
					<text>浏览记录</text>
				</navigator>
				<navigator class="service-item" url="/pages/members/personal/learn-list" hover-class="none">
					<image src="/static/members/imgs/icons_peixun@2x.png"></image>
					<text>学习记录</text>
				</navigator>
				<navigator class="service-item" v-if="userInfo.levelType == 1 && userInfo.aut == 1" url="/pages/members/personal/promotion-code/promotion-code"
				 hover-class="none">
					<image src="/static/members/imgs/icons_erweima@2x.png"></image>
					<text>专属二维码</text>
				</navigator>
				<!-- <view class="service-item" wx:else @tap="noPermissions">
		        <image src="/static/members/imgs/icons_erweima@2x.png"></image>
		        <text>专属二维码</text>
		      </view> -->
				<!-- <view class="service-item" @tap="prompt">
		        <image src="/static/members/imgs/icons_Fankui@2x.png"></image>
		        <text>意见反馈</text>
		      </view> -->
				<view class="service-item" @tap="prompt">
					<image src="/static/members/imgs/icons_koushui@2x.png"></image>
					<text>扣税专区</text>
				</view>
				<!-- <view class="service-item" @tap="prompt">
		        <image src="/static/members/imgs/icons_more_bottom@2x.png"></image>
		        <text>更多</text>
		      </view> -->
			</view>
		</view>
		<!-- 我的其他 -->
		<view class="other">
			<navigator class="other-item" url="/pages/members/personal/resume/resume-change/resume-change" hover-class="none">
				<view class="other-img-l">
					<image src="/static/members/imgs/my-other1.png"></image>
				</view>
				<view class="other-text-con">我的简历</view>
				<view class="other-img-r">
					<image src="/static/members/imgs/home-right.png"></image>
				</view>
			</navigator>
			<navigator class="other-item" url="/pages/members/community/community" hover-class="none">
				<view class="other-img-l">
					<image src="/static/members/imgs/my-other3.png"></image>
				</view>
				<view class="other-text-con">我的社区</view>
				<view class="other-img-r">
					<image src="/static/members/imgs/home-right.png"></image>
				</view>
			</navigator>
			<!-- <view class="other-item" @tap="goToResume">
		        <view class="other-img-l">
		          <image src="/static/members/imgs/my-other1.png"></image>
		        </view>
		        <view class="other-text-con">我的简历</view>
		        <view class="other-img-r">
		          <image src="/static/members/imgs/home-right.png"></image>
		        </view>
		      </view> -->
			<navigator class="other-item" :url="'/pages/members/personal/set/set?aut='+userInfo.aut" hover-class="none">
				<view class="other-img-l">
					<image src="/static/members/imgs/my-other2.png"></image>
				</view>
				<view class="other-text-con">用户设置</view>
				<view class="other-img-r">
					<image src="/static/members/imgs/home-right.png"></image>
				</view>
			</navigator>
			<!-- <navigator class="other-item" url="/pages/members/train/train" hover-class="none">
		        <view class="other-img-l">
		          <image src="/static/members/imgs/my-other3.png"></image>
		        </view>
		        <view class="other-text-con">点动学堂</view>
		        <view class="other-img-r">
		          <image src="/static/members/imgs/home-right.png"></image>
		        </view>
		      </navigator> -->
			<view class="other-item" @tap="getChat">
				<view class="other-img-l">
					<image src="/static/members/imgs/my-other4.png"></image>
				</view>
				<view class="other-text-con">联系客服</view>
				<view class="other-img-r">
					<image src="/static/members/imgs/home-right.png"></image>
				</view>
			</view>
			<navigator class="other-item" url="/pages/members/personal/Feedback/Feedback" hover-class="none">
				<view class="other-img-l">
					<image src="/static/members/imgs/icons_UNpass1.png"></image>
				</view>
				<view class="other-text-con">意见反馈</view>
				<view class="other-img-r">
					<image src="/static/members/imgs/home-right.png"></image>
				</view>
			</navigator>
		</view>
		<!-- 底部logo -->
		<view class="logo-bottom" v-if="showFlag">
			<image src="/static/members/logo-bottom.png" mode="widthFix"></image>
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
		computed: mapState(['navHeight', 'userConfig', 'userInfo', 'taskClass', 'banner', 'taskFlag', 'userInit_MoneyAll', 
			'userInit_MoneyUse', 'userInit_MoneyCash', 'userInit_DataGet', 'userInit_DataMake', 'userInit_DataPass']),
		components: {
			navbar
		},
		data() {
			return {
				score: 2,
				width: 40,
				avtive: 'xx001',
				grey: 'xx002',
				showFlag: true,
				//自定义参数
				myGrades: {} //个人成就
			}
		},
		onLoad() {

		},
		onShow() {
			var that = this;
			//获取初始化接口
			util.initializeLogin(that.userInfo, that.userConfig, that.banner, that.taskClass,
				function(res) {
					//audittask: []
					that.getList();
					//获取星级
					that.myGrades2();
					// console.log(that.userInfo)
				});
		},
		onPageScroll(e) {
			var scrollTop = e.scrollTop
			this.$refs.navbar.setOpacity(scrollTop, 100);
		},
		methods: {
			goToResume() {
				var data = {
					uid: that.userInfo.userid,
				}
				util.request('getUserResume', 'member', data, function(res) {
					if (res.code == '000') {
						if (res.data.length > 0) {
							wx.navigateTo({
								url: '/pages/members/personal/resume/resume',
							})
						} else {
							wx.navigateTo({
								url: '/pages/members/personal/resume/resume-edit/resume-edit',
							})
						}
					}
				})
			},
			// 任务跳转
			goToTaskCar(e) {
				that.taskFlag = e.currentTarget.dataset.type;
				wx.switchTab({
					url: '/pages/members/task-car/task-car',
				})
			},
			// 跳转评价卡片
			goToReviewCard(e) {
				wx.navigateTo({
					url: '/pages/members/personal/evaluation-card/evaluation-card',
				})
			},
			//暂未开放
			prompt() {
				wx.showToast({
					title: '功能正在维护，敬请期待',
					icon: 'none',
					duration: 2000
				})
			},

			//暂无邀请码权限
			noPermissions() {
				wx.showToast({
					title: '您暂无专属二维码权限',
					icon: 'none',
					duration: 2000
				})
			},

			//前往认证
			bindInfo() {
				var that = this;
				if (that.userInfo.aut == 3) {
					wx.showModal({
						title: '提示',
						content: that.userInfo.content,
						confirmText: '再次认证',
						cancelText: '暂不',
						success(res) {
							if (res.confirm) {
								wx.navigateTo({
									url: '/pages/base/bind-info/bind-info'
								})
							}
						}
					})
				} else {
					wx.navigateTo({
						url: '/pages/base/bind-info/bind-info'
					})
				}
			},

			//跳转设置
			jumpSet() {
				wx.navigateTo({
					url: "/pages/members/personal/set/set?aut=" + this.data.userInfo.aut + "&card_no=" + this.data.userInfo.card_no
				})
			},

			//跳转编辑
			jumpEditor() {
				if (this.data.userInfo.aut == 1) {
					wx.navigateTo({
						url: "/pages/members/personal/info-editor/info-editor"
					})
				}
			},


			//前往认证
			bindInfo() {
				var that = this;
				if (that.userInfo.aut == 3) {
					wx.showModal({
						title: '提示',
						content: that.userInfo.content,
						confirmText: '再次认证',
						cancelText: '暂不',
						success(res) {
							if (res.confirm) {
								wx.navigateTo({
									url: '/pages/base/bind-info/bind-info'
								})
							}
						}
					})
				} else {
					wx.navigateTo({
						url: '/pages/base/bind-info/bind-info'
					})
				}
			},
			//获取星级
			myGrades2() {
				var that = this;
				var data = {
					uid: that.userInfo.userid
				}
				util.request('myGrades', 'member', data, function(res) {
					// console.log(res)
					if (res.code == '000') {
						that.myGrades = res.data
					} else {
						wx.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						})
					}
				})
			},

			//获取列表
			getList() {
				var that = this;
				var data = {
					uid: that.userInfo.userid,
					type: 1
				}
				util.request('getMyTaskList', 'taskcenter', data, function(res) {
					// console.log(res)
					if (res.code == '000') {
						that.audittask = res.data
					} else {
						wx.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						})
					}
				})
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
	page {
		background: #F6F6F9;
	}
	.navbar {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 1001;
	}

	.userinfo {
		padding: 40rpx 40rpx 90rpx 40rpx;
		position: relative;
	}

	.userinfo-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		border-radius: 0 0 40rpx 40rpx;
	}

	.userinfo-box {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		z-index: 10;
	}

	.userinfo-src {
		position: relative;
		display: flex;
	}

	.userinfo-src-portrait {
		width: 180rpx;
		height: 180rpx;
		border-radius: 50%;
	}

	.userinfo-none {
		padding-left: 10rpx;
		margin-top: 10rpx;
		color: #FFCA83;
		font-size: 24rpx;
	}

	.userinfo-con {
		flex: 1;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.userinfo-nickname {
		padding: 10rpx 20rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.userinfo-nickname-con {
		font-size: 38rpx;
		color: #fff;
	}

	.userinfo-nickname-state {
		margin-left: 20rpx;
		padding: 5rpx 20rpx;
		font-size: 24rpx;
		background-color: #fff;
		color: #FF414D;
		border-radius: 20rpx;
	}

	.userinfo-name {
		display: flex;
		flex-direction: row;
		color: #fff;
		font-size: 28rpx;
		/* margin-bottom: 20rpx; */
	}

	.userinfo-name-label {
		padding: 0 30rpx 0 20rpx;
		font-size: 28rpx;
	}

	.userinfo-name-label text {
		display: inline-block;
		width: 0.5em;
	}

	.userinfo-evaluation-total {
		font-size: 28rpx;
	}

	/* 查看详情 */
	.userinfo-look {
		z-index: 10;
		position: absolute;
		right: 0;
		bottom: 95rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 15rpx 10rpx 15rpx 30rpx;
		border-radius: 30rpx 0 0 30rpx;
		font-size: 28rpx;
		color: #fff;
		margin-right: 20rpx;
		/* color: #FF414D;
	  background-color: #fff;
	  box-shadow: 2rpx 2rpx 12rpx 0 rgba(255,255,255,1); */
	}

	.userinfo-look image {
		margin-left: 6rpx;
		width: 30rpx;
		height: 30rpx;
	}

	.userinfo-pro {
		position: absolute;
		height: 120rpx;
		bottom: -60rpx;
		left: 30rpx;
		right: 30rpx;
		background-color: #48494D;
		border-radius: 20rpx;
		overflow: hidden;
		display: flex;
		flex-direction: row;
		color: #FFCA83;
		font-size: 28rpx;
		box-sizing: border-box;
		padding: 20rpx 30rpx;
	}

	.userinfo-pro image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
	}

	.userinfo-pro-price {
		flex: 1;
	}

	.userinfo-pro-price text {
		font-size: 32rpx;
	}

	/* 我的服务 */
	.service {
		margin: 0 30rpx 30rpx;
		padding: 0 20rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 2rpx 2rpx 12rpx 0 rgba(43, 86, 112, .2);
	}

	.service-title {
		padding: 20rpx 10rpx;
		font-size: 32rpx;
		font-weight: 600;
		border-bottom: 1rpx solid #EAECF0;
	}

	.service-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		/* padding: 20rpx 0; */
	}

	.service-item {
		width: 25%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 30rpx 0;
		box-sizing: border-box;
	}

	.service-item image {
		width: 70rpx;
		height: 70rpx;
		margin-bottom: 10rpx;
	}

	.service-item text {
		font-size: 28rpx;
		color: #8D8D96;
	}

	/* 钱包与点滴 */
	.wallet {
		/* margin: 90rpx 0 30rpx; */
		display: flex;
		flex-direction: row;
		margin: 0 30rpx 30rpx;
	}

	.wallet-item {
		flex: 1;
		/* margin: 0 30rpx 30rpx; */
		padding: 20rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 2rpx 2rpx 12rpx 0 rgba(43, 86, 112, .2);
	}

	.mr15 {
		margin: 0 15rpx 0 30rpx;
	}

	.ml15 {
		margin: 0 30rpx 0 15rpx;
	}

	.wallet-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #313138;
	}

	.wallet-img {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.wallet-img image {
		margin: 20rpx 0;
		width: 150rpx;
		height: 150rpx;
	}

	.wallet-number {
		font-size: 28rpx;
		font-weight: 600;
		color: #313138;
		text-align: center;
	}

	.park-img image {
		margin: 20rpx auto;
		width: 170rpx;
		height: 150rpx;
		display: block;
	}

	/* 我的其他 */
	.other {
		margin: 0 30rpx 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 0 20rpx;
		box-shadow: 2rpx 2rpx 12rpx 0 rgba(43, 86, 112, .2);
	}

	.other-item {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 20rpx 10rpx;
		border-bottom: 1rpx solid #EAECF0;
	}

	.other-item:last-child {
		border-bottom: none;
	}

	.other-img-l,
	.other-img-r {
		display: flex;
		flex-direction: column;
	}

	.other-img-l image {
		width: 50rpx;
		height: 50rpx;
	}

	.other-text-con {
		flex: 1;
		font-size: 30rpx;
		font-weight: 600;
		color: #313138;
		padding: 0 15rpx;
	}

	.other-img-r image {
		width: 40rpx;
		height: 40rpx;
	}

	/* 接收任务 */
	.task {
		margin: 90rpx 30rpx 30rpx;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 20rpx;
	}

	.base-top {
		display: flex;
		flex-direction: row;
	}

	.base-title {
		flex: 1;
		font-size: 32rpx;
		font-weight: 600;
	}

	.base-pro {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		color: #888;
	}

	.base-pro image {
		margin-left: 10rpx;
		width: 30rpx;
		height: 30rpx;
	}

	.task-list {
		display: flex;
		flex-direction: row;
		padding-top: 30rpx;
		padding-bottom: 20rpx;
	}

	.task-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	.task-item image {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 10rpx;
	}

	.task-item text.task-item-text {
		font-size: 28rpx;
		color: #555;
	}

	.task-item text.task-item-num {
		position: absolute;
		top: -5rpx;
		right: 35rpx;
		z-index: 10;
		min-width: 30rpx;
		line-height: 32rpx;
		padding: 0 2rpx;
		font-size: 22rpx;
		border-radius: 50%;
		border: 1rpx solid #d43540;
		color: #d43540;
		text-align: center;
		background: #fff;
	}

	.task-ad {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		padding: 20rpx 0 5rpx;
	}

	.task-ad image {
		width: 50rpx;
		height: 50rpx;
		margin-right: 15rpx;
	}

	.task-ad swiper {
		flex: 1;
		height: 62rpx;
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
		line-height: 62rpx;
		color: #8F8D99;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.wallet-item:first-child {
		margin-right: 30rpx;
	}
</style>
