<template>
	<view>
		<view class="navbar-bg" :style="{height: navHeight + 'px',opacity: opacity}"></view>
		<view class="navbar custom-class" :style="{height: navHeight + 'px'}">
			<view class="navbar-action-wrap navbar-action-group row item-center" :style="{top: navTop + 'px'}" @tap="getCityList">
				<text>{{pageCity}}</text>
				<image v-if="imgShow" class="navbar-img" src="/static/members/imgs/home-bottom.png"></image>
			</view>
			<view class='navbar-title' :style="{top: navTop + 'px'}">
				<view class="navbar-return" v-if="back" @tap="navBack">
					<image src="/static/members/imgs/back.png"></image>
				</view>
				{{pageName}}
			</view>
		</view>
	</view>
</template>

<script>
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		computed: mapState(['navHeight', 'navTop']),
		// options: {
		//     addGlobalClass: true,
		// },
		/**
		 * 组件的属性列表
		 */
		props: {
			pageName: {
				type: String,
				default: ''
			},
			pageCity: {
				type: String,
				default: ''
			},
			imgShow: {
				type: Boolean,
				default: false
			},
			back: {
				type: Boolean,
				default: false
			},
			showNav: {
				type: Boolean,
				default: false
			},
			showHome: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				opacity: 0 //设置透明度
			};
		},
		mounted() {

		},
		methods: {
			//回退
			navBack() {
				wx.navigateBack({
					delta: 1
				})
			},
			//回主页
			toIndex() {
				wx.navigateTo({
					url: '/pages/admin/home/index/index'
				})
			},
			setOpacity(scrollTop, maxTop) {
				var opacity = 0
				if (scrollTop <= maxTop) {
					opacity = scrollTop / maxTop
				} else {
					opacity = 1
				}
				this.opacity = opacity
			},
			getCityList() {
				wx.navigateTo({
					url: '/pages/members/city_list?currentCity=' + this.pageCity
				})
			}
		}
	}
</script>

<style>
	.navbar {
		width: 100%;
		overflow: hidden;
		position: relative;
		top: 0;
		left: 0;
		z-index: 10;
		flex-shrink: 0;
	}

	.navbar-img {
		margin-left: 8rpx;
		width: 30rpx;
		height: 30rpx;
	}

	.navbar-title {
		width: 100%;
		box-sizing: border-box;
		padding-left: 115px;
		padding-right: 115px;
		height: 32px;
		line-height: 32px;
		text-align: center;
		position: absolute;
		left: 0;
		z-index: 10;
		color: #fff;
		font-size: 28rpx;
		/* font-weight: bold; */
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.navbar-return {
		position: absolute;
		top: 0;
		left: 0;
		padding: 12rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.navbar-return image {
		width: 40rpx;
		height: 40rpx;
	}

	.navbar-bg {
		position: fixed;
		top: 0;
		width: 100%;
		background: #fc404c;
	}

	.navbar-action-wrap {
		display: -webkit-flex;
		display: flex;
		flex-direction: row;
		-webkit-box-align: center;
		-ms-flex-align: center;
		-webkit-align-items: center;
		align-items: center;
		justify-content: center;
		position: absolute;
		left: 20px;
		z-index: 11;
	}

	.navbar-action-group {
		/* border: 1px solid #f0f0f0; */
		/* border-radius: 20px; */
		overflow: hidden;
		color: #fff;
		font-size: 28rpx;
		height: 32px;
		line-height: 32px;
	}

	.navbar-action_item {
		padding: 3px 0;
		color: #333;
	}

	.navbar-action-group .navbar-action_item {
		border-right: 1px solid #f0f0f0;
		padding: 3px 14px;
	}

	.navbar-action-group .last {
		border-right: none;
	}
</style>
