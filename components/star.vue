<template>
	<view class='stars-container'>
		<view class='stars'>
			<block v-for="(item, index) in score" :key="index">
				<image v-if="i==1" :src="'/static/members/imgs/'+avtive+'.png'" mode="widthFix" :style="{width: width + 'rpx', height: width + 'rpx'}"></image>
				<image v-else :src="'/static/members/imgs/'+grey+'.png'" mode="widthFix" :style="{width: width + 'rpx'}"></image>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		/**
		 * 组件的属性列表
		 */
		props: {
			stars: {
				type: Number,
				default: 0,
				// observer(newVal, oldVal) {
				// 	this.updateRate(newVal) //这里通过this.updateRate()方法来更新数据
				// }
			},
			avtive: {
				type: String,
				default: 'xx0'
			},
			grey: {
				type: String,
				default: 'xx1'
			},
			width: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				score: null
			};
		},
		watch: {
		    stars(oldVal, newVal) {
		        this.updateRate(newVal)
		    },
		},
		mounted() {
			var arr = [];
			for (var i = 0; i < this.properties.stars; i++) {
				arr.push(1)
			}
			for (var j = 0; j < 5 - this.properties.stars; j++) {
				arr.push(0)
			}
			this.score = arr
		},
		methods: {
			updateRate(newVal) {
				// console.log(newVal)
				var arr = [];
				for (var i = 0; i < newVal; i++) {
					arr.push(1)
				}
				for (var j = 0; j < 5 - newVal; j++) {
					arr.push(0)
				}
				this.score = arr
			},
		}
	}
</script>

<style>
	.stars-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.stars {
		display: flex;
		flex-direction: row;
	}

	.stars image {
		width: 24rpx;
		height: 24rpx;
		padding-left: 3rpx;
	}

	.star-score {
		color: #1f3463;
	}
</style>
