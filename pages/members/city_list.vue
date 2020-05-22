<template>
	<view class="container">
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<!-- 顶部显示 -->
		<!-- <view class="current-anchor">{{current}}</view> -->
		<!-- 城市列表 -->
		<view class="city">
			<scroll-view scroll-y scroll-with-animation='true' :scroll-into-view="toView" @scroll="bindscroll">
				<view>
					<!-- 当前城市 -->
					<view class="current-city">
						<view class="city-sot" id="A1">当前</view>
						<view class="city-name">
							<text>{{currentCity}}</text>
						</view>
					</view>
					<!-- 所有城市列表 -->
					<view class="city-all">
						<view class="city-letter" v-for="(item, index) in cityList" :key="index">
							<view class="letter-name" :id="item.name">{{item.name}}</view>
							<view class="city-list">
								<text v-for="(itemCity, index) in item.city" :key="i" :data-name="itemCity.region_name" @tap="getChoose">{{itemCity.region_name}}</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 锚点导航 -->
		<view class="city-anchor">
			<text @tap="jumpTo" data-opt="A1">顶</text>
			<text @tap="jumpTo" v-for="(item, index) in letter" :key="index" :data-opt="item">{{item}}</text>
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
		computed: mapState(['userInfo']),
		components: {
			navigationBar
		},
		data() {
			return {
				//设置导航栏样式
				navigationBarStyle: {
					iconText: '城市选择' //导航栏文字
				},
				current: '当前', //顶部定位显示
				toitem: '', //锚点跳转目标
				letter: null, //锚点集合
				cityList: [], //城市集合
				currentCity: '', //当前城市
				toView: 'A1'
			}
		},
		onLoad(options) {
			this.currentCity = options.currentCity
			this.getCityList();
		},
		methods: {
			//获取城市列表
			getCityList() {
				var that = this;
				var data = {
					uid: that.userInfo.userid
				}
				util.request('region', 'member', data, function(res) {
					// console.log(res)
					if (res.code == '000') {
						var cityList = that.tidyCity(res);
						that.cityList = cityList
						that.letter = res.letter
					} else {
						wx.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			//处理城市
			tidyCity(data) {
				var arr = [];
				var cityList = data.data;
				var letter = data.letter;
				for (var i = 0; i < letter.length; i++) {
					var text = {
						name: letter[i],
						city: []
					}
					for (var j = 0; j < cityList.length; j++) {
						if (letter[i] == cityList[j].initial) {
							text.city.push(cityList[j])
						}
					}
					arr.push(text)
				}
				return arr;
			},
			//获取城市
			getChoose(e) {
				const name = e.currentTarget.dataset.name;
				//将选择的城市存入缓存
				wx.setStorage({
					key: "city",
					data: name + '市'
				})
				wx.navigateBack({
					delta: 1
				})
			},
			// 锚点跳转
			jumpTo(e) {
				console.log(e)
				// 获取标签元素上自定义的 data-opt 属性的值
				let target = e.currentTarget.dataset.opt;
				this.toView = target
			},
			//滚动跳转
			bindscroll(e) {
				// console.log(e.detail.scrollTop)
			},
		}
	}
</script>

<style>
	page {
		height: 100%;
		background-color: #fff;
	}

	.container {
		height: 100%;
	}

	.current-anchor {
		z-index: 1001;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		font-size: 24rpx;
		color: #333;
		height: 60rpx;
		background: #f4fcff;
		padding-left: 30rpx;
	}

	/* 城市列表 */
	.city {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.city scroll-view {
		height: 100%;
	}

	.city-sot {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		font-size: 24rpx;
		color: #333;
		height: 60rpx;
		background: #f4fcff;
		padding-left: 30rpx;
	}

	.city-name {
		padding: 0 30rpx;
	}

	.city-name text {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 200rpx;
		height: 25px;
		font-size: 28rpx;
		border-radius: 20rpx;
		margin: 20rpx 0;
		color: #fff;
		background-color: #d6343f;
	}

	/* 所有城市列表 */
	.letter-name {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		font-size: 24rpx;
		color: #333;
		height: 60rpx;
		background: #f4fcff;
		padding-left: 30rpx;
	}

	.city-list {
		display: flex;
		flex-direction: column;
	}

	.city-list text {
		margin: 0 30rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
		color: #333;
	}

	/* 锚点 */
	.city-anchor {
		position: fixed;
		top: 56%; /*50%*/
		transform: translateY(-50%);
		right: 10rpx;
		display: flex;
		flex-direction: column;
		text-align: center;
		z-index: 99999;
		/* background-color: #f4fcff; */
		padding: 0px 0px;
		border-radius: 100rpx;
	}

	.city-anchor text {
		font-size: 24rpx;
		color: #333;
		padding: 6rpx 6rpx;
	}

	.city-anchor text.active {
		color: #d6343f;
	}
</style>
