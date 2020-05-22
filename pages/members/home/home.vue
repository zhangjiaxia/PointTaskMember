<template>
	<view class="">
		<navbar ref="navbar" class="navbar" :pageCity="city" :imgShow="imgShow"></navbar>
		<!-- 轮播图 -->
		<view class="banner-swiper">
			<!-- 顶部搜索定位 -->
			<view class="home-topBox" :class="{'home-top-fixed': searchInp==true}" :style="{top: navHeightHome + 'px'}">
				<view class="home-top">
					<view class="home-position" @tap="jumpSearch">
						<image src="/static/members/imgs/icons_sousuo@2x.png"></image>
						<text>搜索任务或商家名称</text>
					</view>
					<navigator url="/pages/members/home/label_list/label_list?name=全部任务&&flag=0" hover-class="none" class="home-operation">
						<image src="/static/members/imgs/icons_list@2x.png"></image>
					</navigator>
				</view>
			</view>
			<view class="swiper-container">
				<swiper class="swiper" indicator-active-color="#ffffff" autoplay="true" circular="true" current='0' @change='swiperChange'>
					<swiper-item v-for="(item, index) in bannerArr" :key="index">
						<image v-if="item.type == 0" :src="item.image" mode="scaleToFill" :data-src="item.image" @tap="previewImg"></image>
						<navigator hover-class="none" v-if="item.type == 1" :url="'/pages/members/taks-detail/taks-detail?id=' + item.task_id">
							<image :src="item.image" mode="scaleToFill"></image>
						</navigator>
						<navigator hover-class="none" v-if="item.type == 2" url="">
							<image :src="item.image" mode="scaleToFill"></image>
						</navigator>
						<navigator hover-class="none" v-if="item.type == 3" target="miniProgram" :app-id="item.appid">
							<image :src="item.image" mode="scaleToFill"></image>
						</navigator>
						<image v-if="item.type == 4" :src="item.image" mode="scaleToFill" :data-src="item.posters" @tap="previewImg"></image>
					</swiper-item>
				</swiper>
				<!-- 自定义指示点dot -->
				<view class="dots">
					<block v-for="(item, index) in bannerArr" :key="index">
						<view class="dot" :class="{active: swiperCurrent == index}"></view>
					</block>
				</view>
			</view>
		</view>
		<!-- 分类 -->
		<view class="category-list">
			<view class="category-item" v-for="(item,index) in categoryList" :key="index" @tap="jumpList" :data-title="item.name"
			 :data-id="item.class_id" data-url="/pages/members/home/task-list/task-list">
				<image :src="item.image"></image>
				<text>{{item.name}}</text>
			</view>
			<navigator v-if="categoryList.length == 9" url="/pages/members/home/task-classification/task-classification" class="category-item"
			 hover-class="none">
				<image :src="moreIcon"></image>
				<text>更多</text>
			</navigator>
		</view>
		<!-- 最新任务 -->
		<view class="newtask" v-if="newtask.length>0">
			<view class="newtask-top">
				<view class="newtask-top-left">
					<text class="newtask-top-title">最新任务</text>
				</view>
				<navigator url="/pages/members/home/label_list/label_list?name=最新任务&&flag=0" hover-class="none" class="newtask-top-more">
					<text>查看更多</text>
					<image src="/static/members/imgs/home-right.png"></image>
				</navigator>
			</view>
			<!-- 列表 -->
			<scroll-view scroll-x>
				<view class="newtask-list">
					<view class="newtask-item" v-for="(item, index) in newtask" :key="index" @tap="jumpDetail" :data-id="item.task_id">
						<image class="newtask-item-img" :src="item.image" lazy-load></image>
						<view class="newtask-item-title">
							<text>{{item.task_name}}</text>
						</view>
						<view class="newtask-item-pro">
							<text class="newtask-item-price">￥{{item.money}}/{{item.unit}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 为你优选 -->
		<view class="recommend" v-if="rectask.length>0">
			<view class="recommend-top">
				<view class="recommend-top-left">
					<text class="recommend-top-title">为你优选</text>
				</view>
			</view>
			<!-- 自定义指示点dot -->
			<view class="dots">
				<block v-for="(item, index) in rectask" :key="index">
					<view class="dot" :class="{active: recommendCurrent == index}"></view>
				</block>
			</view>
			<!-- 为你优选列表 -->
			<swiper class="recommend-swiper" indicator-active-color="#E60114" circular="true" current='0' @change='recommendSwiperChange'>
				<swiper-item class="recommend-list" v-for="(pitem, index) in rectask" :key="index">
					<view class="recommend-item" v-for="(item, i) in rectaskItem" :key="i" @tap="jumpDetail" :data-id="item.task_id">
						<view class="recommend-item-num" v-if="item.icon">
							<image :src="item.icon"></image>
						</view>
						<view class="recommend-item-con">
							<view class="recommend-item-title">
								<text>{{item.classChildName}}</text> {{item.task_name}}</view>
							<text class="recommend-item-price">￥{{item.money}}/{{item.unit}}</text>
						</view>
						<image class="recommend-item-img" :src="item.image" lazy-load></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="recommend-more">
				<navigator url="/pages/members/home/label_list/label_list?name=为你优选&&flag=4" hover-class="none" class="newtask-top-more">
					<text>查看更多</text>
					<image src="/static/members/imgs/red-right.png"></image>
				</navigator>
			</view>
		</view>
		<!-- 返回顶部 -->
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
	var QQMapWX = require("@/utils/qqmap-wx-jssdk.min.js");
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		computed: mapState(['userInfo', 'banner', 'taskClass', 'userConfig', 'navHeight']),
		components: {
			navbar
		},
		data() {
			return {
				imgShow: true,
				pageShow: true,
				city: '城市',
				page: 1,
				swiperCurrent: 0,
				recommendCurrent: 0,
				tasklist: [],
				isLogo: true,
				//自定义参数
				bannerArr: [], //banner图片轮播
				categoryList: [], //icon分类
				newtask: [], //最新任务
				rectask: [], //为你优选
				navHeightHome: '', //搜索框距离顶部的高度
				searchInp: false, //是否浮动
				topShow: false //是否出现置顶
			}
		},
		onLoad() {
			var that = this;
			//获取最新任务
			that.getTaskList(null, 10, 0, 1);
			that.bannerArr = that.banner.homePage, //获取轮播图
				that.centerad = that.banner.homeTailPage, //获取页中广告图
				that.categoryList = that.taskClass.homeClass, //首页分类
				that.projectList = that.taskClass.tuiClass, //专题分类
				that.loading = that.userConfig.loading,
				that.moreIcon = that.userConfig.classMore.image
			var query = wx.createSelectorQuery();
			//选择id
			query.select('.home-topBox').boundingClientRect(function(rect) {
				that.maxTop = rect.top - rect.height - that.navHeight / 2
			}).exec();
			//获取位置
			that.getPosition();
		},
		onPageScroll(e) {
			var scrollTop = e.scrollTop
			this.$refs.navbar.setOpacity(scrollTop, 150);
			this.searchInp2(scrollTop, this.maxTop);
			if (scrollTop > 700) {
				if (!this.topShow) {
					this.topShow = true
				}
			} else {
				if (this.topShow) {
					this.topShow = false
				}
			}
		},
		methods: {
			searchInp2(scrollTop, maxTop) {
				//console.log(scrollTop, maxTop)
				if (scrollTop >= maxTop) {
					this.searchInp = true
					//this.navHeight = this.navHeight global
					this.navHeightHome = this.navHeight
				} else {
					this.searchInp = false
					this.navHeightHome = null
					//this.$store.commit('setNavHeight', null)
				}
			},
			/**
			 * 轮播自动滑动时，获取当前的轮播id(顶部)
			 */
			swiperChange(e) {
				const that = this;
				this.swiperCurrent = e.detail.current
			},
			//获取首页任务列表
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
						if (type == 0) {
							//最新任务
							that.newtask = res.data
							//获取为你优选
							that.getTaskList(null, 16, 3, 0);
						} else if (type == 3) {
							//为你优选
							that.rectask = res.data
							//获取热门推荐
							that.getTaskList(null, 40, 5, 0);
						} else if (type == 5) {
							//热门推荐
							if (res.data.length < 20) {
								that.pageShow = false
								that.isLogo = true
							}
							if (res.data.length > 0) {
								// var list = that.data.tasklist;
								// list.push.apply(list, res.data);
								that.tasklist = res.data
							}
						}
					}
				})
			},
			//获取位置信息
			getPosition() {
				const that = this;
				wx.getLocation({
					type: 'wgs84',
					success(res) {
						const latitude = res.latitude
						const longitude = res.longitude
						that.resolutionAddress(latitude, longitude);
					}
				})
			},
			//地址逆解析
			resolutionAddress(latitude, longitude) {
				const that = this;
				const address = new QQMapWX({
					key: 'UWCBZ-GU664-LURU4-DQRQN-VPX55-QBB6T'
				}); // 这个KEY的获取方式在上面链接 腾讯位置服务的开发文档中有详细的申请密钥步骤

				address.reverseGeocoder({ //地址解析
					location: {
						latitude: latitude,
						longitude: longitude
					},
					success(res) {
						// console.log(res);
						//获得地址
						if (res.status == 0) {
							var city = res.result.address_component.city;
							if (city != that.city) {
								that.city = city
								wx.setStorage({
									key: "city",
									data: city
								})
							}
						} else {
							wx.showModal({
								title: '提示',
								content: "获取位置失败，请重试！",
								success(res) {}
							})
						}
					}
				});
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
					// console.log(res)
					if (res.code == '000') {
						wx.navigateTo({
							url: '/pages/members/message/chat?sid=' + res.data.sid + '&&to_id=' + res.data.to_id + '&&name=' + res.data.name
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
		background-color: #fff;
	}

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.container {
		position: relative;
		/* padding-top: 92rpx; */
	}

	/* .wx-swiper-dots {
    position: relative;
    left: unset !important;
    right: 0;
}

.wx-swiper-dots.wx-swiper-dots-horizontal {
    margin-bottom: -5rpx;
} */

	.swiper-container {
		position: relative;
	}

	/* dot定位位置 */

	.swiper-container .dots {
		position: absolute;
		top: 350rpx;
		left: 30rpx;
		/* right: 0; */
		/* bottom: 20rpx; */
		display: flex;
		justify-content: center;
	}

	/* 未经过前dot */

	.swiper-container .dots .dot {
		margin: 0 8rpx;
		width: 15rpx;
		height: 10rpx;
		border-radius: 5rpx;
		/* border: 0.1rpx solid #fff; */
		background: rgba(255, 255, 255, .3);
		transition: all 0.6s ease-in-out;
	}

	/* 经过后dot */

	.swiper-container .dots .dot.active {
		width: 35rpx;
		background: #fff;
	}

	.navbar {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 1001;
		box-sizing: border-box;
		overflow: hidden;
	}

	.home-topBox {
		z-index: 101;
		position: absolute;
		top: 380rpx;
		left: 30rpx;
		right: 30rpx;
		height: 80rpx;
	}

	.home-top {
		height: 80rpx;
		display: flex;
		flex-direction: row;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.home-top-fixed {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 110rpx;
		box-sizing: border-box;
		padding: 0 30rpx 30rpx;
		background-color: #FC404C;
		border-radius: 0 0 30rpx 30rpx;
	}

	.home-position {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 20rpx;
		font-size: 32rpx;
		color: #777;
	}

	.home-position image {
		width: 50rpx;
		height: 50rpx;
		margin-right: 10rpx;
	}

	.home-operation {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0 20rpx;
	}

	.home-operation image {
		width: 50rpx;
		height: 50rpx;
	}

	/* 轮播图 */
	.banner-swiper {
		position: relative;
		width: 100%;
		/* overflow: hidden; */
		box-sizing: border-box;
		/* padding: 12rpx 28rpx; */
	}

	/* .banner-swiper-bg{
  z-index: -1;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #ff3f4c;
} */
	.banner-swiper .swiper {
		z-index: 1;
		width: 100%;
		height: 500rpx;
		/* border-radius: 12rpx; */
		overflow: hidden;
	}

	.banner-swiper .swiper image {
		width: 100%;
		height: 500rpx;
		display: block;
	}

	/* 分类列表 */
	.category-list {
		/* margin: 20rpx; */
		padding: 30rpx 0;
		text-align: center;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		background-color: #fff;
		border-radius: 12rpx;
		/* box-shadow: 2rpx 2rpx 12rpx 0 rgba(43,86,112,.1); */
	}

	.category-item {
		width: 20%;
		box-sizing: border-box;
		padding: 12rpx 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.category-item image {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 10rpx;
	}

	.category-item text {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-top: 4rpx;
		font-size: 22rpx;
		color: #333;
	}

	/* 上新任务 */
	.newtask,
	.recommend {
		margin-bottom: 50rpx;
	}

	.newtask-top,
	.recommend-top,
	.optimization-top {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.newtask-top-left,
	.recommend-top-left,
	.optimization-top-left {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 10rpx 30rpx;
	}

	.newtask-top-title,
	.recommend-top-title,
	.optimization-top-title {
		font-size: 32rpx;
		font-weight: 700;
		/* margin-bottom: 10rpx; */
	}

	.newtask-top-subtitle,
	.recommend-top-subtitle,
	.optimization-top-subtitle {
		font-size: 28rpx;
		color: #666;
	}

	.newtask-top-more,
	.recommend-top-more,
	.optimization-top-more {
		padding: 20rpx 30rpx;
		font-size: 28rpx;
		color: #BEBECA;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.newtask-top-more image,
	.recommend-top-more image,
	.optimization-top-more image {
		margin-left: 5rpx;
		width: 35rpx;
		height: 35rpx;
	}

	.newtask-list {
		width: 3200rpx;
		display: flex;
		flex-direction: row;
		padding: 20rpx;
	}

	.newtask-item {
		/* flex: 1; */
		width: 10%;
		display: flex;
		flex-direction: column;
		padding: 0 20rpx;
		overflow: hidden;
		box-sizing: border-box;
	}

	.newtask-item-img {
		width: 280rpx;
		height: 280rpx;
		border-radius: 15rpx;
		box-shadow: 0 0 16rpx 0 rgba(43, 86, 112, .1);
	}

	.newtask-item-title {
		flex: 1;
		width: 100%;
		margin: 20rpx 0;
		font-size: 28rpx;
		font-weight: 700;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.newtask-item-con {
		font-size: 28rpx;
		color: #999;
		margin-bottom: 10rpx;
	}

	.newtask-item-pro {
		display: flex;
		flex-direction: row;
	}

	.newtask-item-price {
		flex: 1;
		font-size: 28rpx;
		color: #FC404C;
	}

	.newtask-item-time {
		font-size: 28rpx;
		color: #333;
		display: flex;
		flex-direction: row;
		align-items: center;
		/* justify-content: center; */
	}

	.newtask-item-time image {
		width: 30rpx;
		height: 30rpx;
		margin-right: 8rpx;
	}

	/* 任务推荐 */
	.recommend-swiper {
		height: 880rpx;
	}

	.recommend-more {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.recommend-more navigator {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #FC404C;
		padding: 10rpx 20rpx;
		border-radius: 20rpx;
		background-color: #FFE6E7;
	}

	.recommend-more image {
		margin-left: 6rpx;
		width: 30rpx;
		height: 30rpx;
	}

	/* dot定位位置 */
	.recommend {
		position: relative;
	}

	.recommend .dots {
		position: absolute;
		top: 20rpx;
		/* left: 30rpx; */
		right: 30rpx;
		/* bottom: 20rpx; */
		display: flex;
		justify-content: center;
	}

	/* 未经过前dot */

	.recommend .dots .dot {
		margin: 0 8rpx;
		width: 15rpx;
		height: 10rpx;
		border-radius: 5rpx;
		/* border: 0.1rpx solid #fff; */
		background: rgba(190, 190, 202, .3);
		transition: all 0.6s ease-in-out;
	}

	/* 经过后dot */

	.recommend .dots .dot.active {
		width: 35rpx;
		background: #E60114;
	}

	.recommend-list {
		/* width: 280%; */
		display: flex;
		flex-direction: column;
		padding: 20rpx;
		/* flex-wrap: wrap-reverse; */
		flex-wrap: wrap;
		box-sizing: border-box;
	}

	.recommend-item {
		/* width: 25%; */
		display: flex;
		flex-direction: row;
		padding: 15rpx 20rpx;
		box-sizing: border-box;
	}

	.recommend-item-img {
		width: 180rpx;
		height: 180rpx;
		border-radius: 10rpx;
		box-shadow: 0 0 16rpx 0 rgba(43, 86, 112, .1);
	}

	.recommend-item-num {
		display: flex;
		flex-direction: column;
		padding-top: 10rpx;
	}

	.recommend-item-num image {
		width: 50rpx;
		height: 50rpx;
	}

	.recommend-item-con {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 20rpx;
		box-sizing: border-box;
		overflow: hidden;
	}

	.recommend-item-title {
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
		/* margin-bottom: 10rpx; */
	}

	.recommend-item-title text {
		font-weight: normal;
		font-size: 24rpx;
		padding: 5rpx 10rpx;
		background: rgba(49, 49, 56, .8);
		color: #fff;
		border-radius: 6rpx;
	}

	.recommend-item-price {
		color: #FC404C;
		font-size: 28rpx;
		margin-top: 20rpx;
	}

	/* 专题推荐 */
	.project {
		margin-bottom: 30rpx;
	}

	.project-top {
		display: flex;
		flex-direction: row;
		justify-content: center;
		padding: 10rpx 30rpx;
	}

	.project-top-title {
		font-weight: 700;
		flex: 1;
		font-size: 32rpx;
	}

	.project-top-more {
		font-size: 24rpx;
		color: #999;
		/* padding: 10rpx 30rpx; */
	}

	.project-list {
		display: flex;
		flex-direction: row;
		padding: 10rpx 0;
	}

	.project-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10rpx 20rpx;
		box-sizing: border-box;
		overflow: hidden;
	}

	.project-item image {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 10rpx;
	}

	.project-item-text {
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-align: center;
		color: #555;
		font-size: 28rpx;
	}

	/* 为你优选 */
	.optimization {
		margin-bottom: 30rpx;
	}

	.optimization-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;
		padding: 10rpx 20rpx 20rpx;
	}

	.optimization-item {
		width: 50%;
		display: flex;
		flex-direction: column;
		padding: 20rpx 15rpx;
		box-sizing: border-box;
		overflow: hidden;
	}

	.optimization-item-img {
		width: 100%;
		height: 320rpx;
		border-radius: 10rpx;
		box-shadow: 0 0 16rpx 0 rgba(43, 86, 112, .1);
	}

	.optimization-item-title {
		margin: 20rpx 0 15rpx;
		font-weight: 700;
		font-size: 28rpx;
		line-height: 45rpx;
		height: 90rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.optimization-item-subtitle {
		margin: 15rpx 0;
		flex: 1;
		color: #888;
		font-size: 28rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.optimization-item-pro {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.optimization-item-price {
		font-size: 28rpx;
		color: #FC404C;
	}

	.optimization-item-receipt {
		font-size: 24rpx;
		color: #999;
	}

	/* 分割图 */
	.segmentation {
		margin: 0 30rpx 30rpx;
		height: 200rpx;
		border-radius: 10rpx;
		overflow: hidden;
		display: flex;
	}

	.segmentation navigator {
		flex: 1;
		display: flex;
		width: 100%;
		height: 100%;
	}

	.segmentation-item-img {
		width: 100%;
		height: 100%;
	}

	/* 购物车 */
	.car {
		position: fixed;
		top: 35%;
		right: 10rpx;
		padding: 30rpx;
		background: rgba(0, 0, 0, .3);
		border-radius: 50%;
		display: flex;
	}

	.car image {
		width: 50rpx;
		height: 50rpx;
	}

	.car text {
		position: absolute;
		top: -5rpx;
		right: -5rpx;
		border-radius: 50%;
		padding: 8rpx;
		background-color: #FC404C;
		color: #fff;
		font-size: 20rpx;
	}


	/* 抽奖 */
	.activity-btn {
		z-index: 1001;
		position: fixed;
		top: 70%;
		right: 0;
		display: flex;
		flex-direction: column;
	}

	.activity-btn-animation {
		animation: headRotate 0.3s linear infinite;
	}

	.activity-btn image {
		width: 100rpx;
		height: 100rpx;
	}

	/* 旋转效果  */
	@keyframes headRotate {
		0% {
			transform: rotate(0deg);
		}

		50% {
			transform: rotate(10deg);
		}

		100% {
			transform: rotate(-10deg);
		}
	}

	.activity-box {
		z-index: 10001;
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: rgba(0, 0, 0, .4);
	}

	.activity-show {
		animation: emoji-move-in 1s forwards;
		-webkit-animation: emoji-move-in 1s forwards;
	}

	.activity-hide {
		animation: emoji-move-out 0.5s forwards;
		-webkit-animation: emoji-move-out 0.5s forwards;
	}

	@-webkit-keyframes emoji-move-in {
		0% {
			top: 100%;
		}

		25% {
			top: -30rpx;
		}

		50% {
			top: 30rpx;
		}

		75% {
			top: -15rpx;
		}

		100% {
			top: 0;
		}
	}

	@keyframes emoji-move-in {
		0% {
			top: 100%;
		}

		25% {
			top: -30rpx;
		}

		50% {
			top: 30rpx;
		}

		75% {
			top: -15rpx;
		}

		100% {
			top: 0;
		}
	}

	@-webkit-keyframes emoji-move-out {
		0% {
			top: 0;
		}

		100% {
			top: 100%;
		}
	}

	@keyframes emoji-move-out {
		0% {
			top: 0;
		}

		100% {
			top: 100%;
		}
	}

	.activity {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.activity-box image.activity-bg {
		width: 600rpx;
		height: 600rpx;
	}

	.activity-bg-transform3d {
		animation: transform3d 1.5s forwards;
	}

	@keyframes transform3d {
		0% {
			transform: rotateY(0deg);
		}

		25% {
			transform: rotateY(180deg);
		}

		50% {
			transform: rotateY(360deg);
		}

		75% {
			transform: rotateY(180deg);
		}

		100% {
			transform: rotateY(360deg);
		}
	}

	.activity-box image.activity-del {
		position: absolute;
		top: 80rpx;
		right: 55rpx;
		/* margin-top: 60rpx; */
		width: 65rpx;
		height: 65rpx;
		padding: 20rpx;
	}

	.activity-box image.activity-top {
		top: 60rpx;
		right: 40rpx;
	}

	.winning {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		width: 600rpx;
		height: 600rpx;
	}

	.winning text {
		padding-top: 50rpx;
		color: #fff;
		font-size: 45rpx;
		letter-spacing: 2rpx;
		font-weight: 700;
	}

	.winning .activity-bg {
		position: absolute;
		z-index: 101;
	}

	.winning .activity-zindex {
		position: absolute;
		top: 0;
		z-index: -1;
		width: 100%;
		height: 100%;
	}
</style>
