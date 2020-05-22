<template>
	<view class="container">
		<view class="chat">
			<!-- 背景蒙版（点击隐藏表情） -->
			<view class="cf-bg" catchtap="cemojiCfBg" :style="{display: cfBg ? 'block' : 'none'}"></view>

			<scroll-view class="aa" scroll-y :scroll-top="scrollTop" @scrolltoupper="getMore" upper-threshold="50rpx"
			 :scroll-into-view="toView">
				<view id="j_page">
					<view class="msg-more">暂无更多消息</view>

					<block v-if="list.length>0">
						<block v-for="(item,index) in list" :key="index">
							<view class="chat-item my" v-if="item.id == uid" :id="'A'+index">
								<view class="item-msg">
									<view class="item-info">
										<text class="item-time">{{item.timestamp}}</text>
										<text>{{item.username}}</text>
									</view>
									<!-- 文字或文字表情 -->
									<view class="item-msg-con" v-if="(item.pro_type==''&&item.msgType==0)||(item.pro_type==''&&item.msgType==1)">
										<rich-text :nodes="item.content"></rich-text>
									</view>
									<!-- 图片 -->
									<view class="item-msg-con" v-if="item.pro_type==''&&item.msgType==2">
										<view class="msg-con-img">
											<image @tap="previewImage" :data-src="item.content" :src="item.content" mode="widthFix"></image>
										</view>
									</view>
									<!-- 录音 -->
									<view class="item-msg-con" v-if="item.pro_type==''&&item.msgType==3">
										<view class="msg-con-play" :data-url="item.content" @tap="play">
											<text>语音</text>
											<image src="/static/members/imgs/play2.png" mode="widthFix"></image>
										</view>
									</view>
									<!-- 任务 -->
									<view class="item-msg-con" v-if="item.pro_type=='task'" @tap="getDetail" :data-id="item.pro_id">
										<view class="task-chat">
											<view class="task-img">
												<image :src="item.pro_image"></image>
											</view>
											<view class="task-con">
												<view class="task-title">{{item.pro_name}}</view>
												<view class="task-price">￥{{item.pro_money}}/{{item.pro_unit}}</view>
											</view>
										</view>
									</view>
								</view>
								<view class="item-img">
									<image :src="item.avatar"></image>
								</view>
							</view>
							<view class="chat-item other" v-else  :id="'A'+index">
								<view class="item-img">
									<image :src="item.avatar"></image>
								</view>
								<view class="item-msg">
									<view class="item-info">
										<text>{{item.username}}</text>
										<text class="item-time">{{item.timestamp}}</text>
									</view>
									<!-- 文字或文字表情 -->
									<view class="item-msg-con" v-if="(item.pro_type==''&&item.msgType==0)||(item.pro_type==''&&item.msgType==1)">
										<rich-text :nodes="item.content"></rich-text>
									</view>
									<!-- 图片 -->
									<view class="item-msg-con" v-if="item.pro_type==''&&item.msgType==2">
										<view class="msg-con-img">
											<image @tap="previewImage" :data-src="item.content" :src="item.content" mode="widthFix"></image>
										</view>
									</view>
									<!-- 录音 -->
									<view class="item-msg-con" v-if="item.pro_type==''&&item.msgType==3">
										<view class="msg-con-play" :data-url="item.content" @tap="play">
											<text>语音</text>
											<image src="/static/members/imgs/play1.png" mode="widthFix"></image>
										</view>
									</view>
									<!-- 任务 -->
									<view class="item-msg-con" v-if="item.pro_type=='task'">
										<view class="task-chat">
											<view class="task-img">
												<image :src="item.pro_image"></image>
											</view>
											<view class="task-con">
												<view class="task-title">{{item.pro_name}}</view>
												<view class="task-price">￥{{item.pro_money}}/{{item.pro_unit}}</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</block>
					</block>
				</view>
				<!-- 已连接 -->
				<!-- <view class="disconnect-pro" v-if="connection"><text>成功连接</text></view> -->
				<!-- 连接断开 -->
				<view class="disconnect-pro" v-if="disconnect"><text>连接已断开</text></view>

			</scroll-view>
		</view>
		<!-- 是否从任务详情进入 -->
		<view class="task" v-if="isTask">
			<view class="task-img">
				<image :src="proDetail.image"></image>
			</view>
			<view class="task-con">
				<image class="task-close" @tap="closrTask" src="/static/members/imgs/del1.png"></image>
				<view class="task-title">{{proDetail.task_name}}</view>
				<view class="task-price">￥{{proDetail.money}}/{{proDetail.unit}}</view>
				<view class="task-send" @tap="sendTask">发给客服</view>
			</view>
		</view>
		<!-- 发送框 -->
		<view class="inpBox" :class="[{ 'emoji-move-out': isShow }, {'emoji-move-in': !isShow}, {'no-emoji-move': isLoad}]">
			<!-- 输入框 -->
			<view class="chat-inp">
				<view class="inp-voice" @tap="switchBtn" v-if="switchShow">
					<image src="/static/members/imgs/chat01.png"></image>
				</view>
				<view class="inp-voice" @tap="switchBtn" v-else>
					<image src="/static/members/imgs/chat11.png"></image>
				</view>
				<view class="inp" v-if="switchShow">
					<input type="text" :value='content' @input='content' confirm-type="send" @confirm="send" confirm-hold="true"
					 adjust-position="false"></input>
				</view>
				<view class="inp" catch:longpress="handleRecordStart" catch:touchmove="handleTouchMove" catch:touchend="handleRecordStop"
				 catch:touchcancel="handleTouchMove" v-else>
					<text>{{recordText}}</text>
				</view>
				<view class="btn">
					<view class="inp-face" catchtap="emojiShowHide">
						<image src="/static/members/imgs/chat02.png"></image>
					</view>
					<view class="inp-face pd" v-if="!content" catchtap="chooseImg">
						<image src="/static/members/imgs/chat03.png"></image>
					</view>
					<view class="send" @tap="send" v-if="content">发送</view>
				</view>
			</view>

			<!--emoji表情盒子-->
			<view class="emoji-box">
				<scroll-view scroll-y="true" @scroll="emojiScroll" style="height:200px">
					<block v-for="(item,index) in emoji" :key="index">
						<view class="emoji-cell">
							<image class="touch-active" catchtap="emojiChoose" :src="'https://job.touchpoint.cn/cloudim/public/static/layui/images/face/'+index+'.gif'"
							 :data-emoji="item"></image>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>
	</view>

	<!-- 录音播放 -->
	<!-- <audio hidden src="{{src}}" id="myAudio" ></audio> -->
</template>

<script>
	let util = require("@/utils/util.js");
	let websocket = require("@/utils/websocket.js");
	const recorderManager = wx.getRecorderManager(); //语音功能定义
	const audioContext = wx.createInnerAudioContext(); //语音播放
	export default {
		data() {
			return {
				page: 1, //页码
				num: 20, //条数
				list: [],
				recordText: '按住 说话', //录音按钮文字
				is_clock: false, //是否发送录音控制
				switchShow: true, //语音、输入框切换
				isShow: true,
				connection: false,
				pageShow: true,
				content: '', //输入框内容
				flag: true, //判断是否可以再次发送数据
				isTask: false, //控制任务显示或隐藏
				emoji: ["[微笑]", "[嘻嘻]", "[哈哈]", "[可爱]", "[可怜]", "[挖鼻]", "[吃惊]", "[害羞]", "[挤眼]", "[闭嘴]", "[鄙视]", "[爱你]", "[泪]",
					"[偷笑]", "[亲亲]", "[生病]", "[太开心]", "[白眼]", "[右哼哼]", "[左哼哼]", "[嘘]", "[衰]", "[委屈]", "[吐]", "[哈欠]", "[抱抱]", "[怒]",
					"[疑问]", "[馋嘴]", "[拜拜]", "[思考]", "[汗]", "[困]", "[睡]", "[钱]", "[失望]", "[酷]", "[色]", "[哼]", "[鼓掌]", "[晕]", "[悲伤]",
					"[抓狂]", "[黑线]", "[阴险]", "[怒骂]", "[互粉]", "[心]", "[伤心]", "[猪头]", "[熊猫]", "[兔子]", "[ok]", "[耶]", "[good]", "[NO]",
					"[赞]", "[来]", "[弱]", "[草泥马]", "[神马]", "[囧]", "[浮云]", "[给力]", "[围观]", "[威武]", "[奥特曼]", "[礼物]", "[钟]", "[话筒]",
					"[蜡烛]", "[蛋糕]"
				], //表情
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	page {
		background-color: #e5e5e5;
		height: 100%;
	}

	.container {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}

	.chat {
		position: relative;
		flex: 1;
		/* padding-bottom: 120rpx; */
		overflow: hidden;
	}

	.chat scroll-view {
		height: 100%;
		overflow: hidden;
	}

	.msg-more {
		padding: 20rpx;
		text-align: center;
		font-size: 24rpx;
		color: #888;
	}

	.chat-item {
		padding: 20rpx;
		display: flex;
		flex-direction: row;
	}

	.my {
		justify-content: end;
	}

	.item-img image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.item-msg {
		margin-top: 6rpx;
		flex: 1;
		display: flex;
		flex-direction: column;
		padding-left: 20rpx;
	}

	.item-info {
		display: flex;
		flex-direction: row;
		align-items: center;
		line-height: 45rpx;
		font-size: 24rpx;
		color: #999;
	}

	.item-time {
		margin-left: 30rpx;
	}

	.item-msg-con {
		max-width: 70%;
		display: flex;
		flex-direction: row;
		align-items: center;
		word-break: break-word;
	}

	.item-msg-con rich-text {
		color: #333;
		background-color: #fff;
		font-size: 28rpx;
		line-height: 45rpx;
		border-radius: 10rpx;
		padding: 6rpx 15rpx;
	}

	/* 图片 */
	.msg-con-img,
	.msg-con-play {
		padding: 15rpx;
		border-radius: 10rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.msg-con-img image {
		width: 200rpx;
	}

	/* 录音 */
	.msg-con-play {
		font-size: 20rpx;
	}

	.msg-con-play image {
		margin-left: 10rpx;
		width: 34rpx;
		height: 34rpx;
	}

	.my .msg-con-img,
	.my .msg-con-play {
		background-color: #f06c7a;
		color: #fff;
	}

	.other .msg-con-img,
	.other .msg-con-play {
		background-color: #fff;
		color: #333;
	}

	.my .item-msg {
		padding-left: 0;
		padding-right: 20rpx;
		justify-content: flex-end;
	}

	.my .item-msg .item-info {
		justify-content: flex-end;
	}

	.my .item-time {
		margin-left: 0;
		margin-right: 30rpx;
	}

	.my .item-msg-con {
		justify-content: flex-end;
		margin-left: 30%;
	}

	.my .item-msg-con rich-text {
		background-color: #f06c7a;
		color: #fff;
	}


	.inpBox {
		/* z-index: 101; */
		/* position: fixed; */
		/* bottom: 0; */
		/* right: 0; */
		/* left: 0; */
		height: 510rpx;
		width: 100%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		margin-bottom: -420rpx;
		/* padding: 20rpx 0; */
		background-color: #f2f2f2;
	}

	.chat-inp {
		display: flex;
		flex-direction: row;
		align-items: center;
		/* height: 100rpx; */
	}

	.inp-voice {
		display: flex;
		padding: 20rpx;
	}

	.inp-voice image {
		width: 40rpx;
		height: 40rpx;
	}

	.inp {
		flex: 1;
		padding: 20rpx 0;
		display: flex;
		flex-direction: column;
	}

	.inp input {
		width: 100%;
		/* min-height: 60rpx; */
		padding: 0 20rpx;
		border-radius: 10rpx;
		box-sizing: border-box;
		background-color: #fff;
		font-size: 28rpx;
		color: #333;
		height: 70rpx;
		line-height: 70rpx;
	}

	.inp text {
		width: 100%;
		padding: 0 20rpx;
		height: 70rpx;
		line-height: 70rpx;
		box-sizing: border-box;
		background-color: #fff;
		text-align: center;
		font-size: 28rpx;
		color: #333;
	}

	.btn {
		display: flex;
		flex-direction: row;
		align-items: center;
		/* padding: 0 20rpx; */
	}

	.inp-face {
		display: flex;
		padding: 20rpx 15rpx 20rpx 30rpx;
	}

	.pd {
		padding: 20rpx 30rpx 20rpx 15rpx;
	}

	.inp-face image {
		width: 40rpx;
		height: 40rpx;
	}

	.send {
		margin: 0 20rpx;
		line-height: 60rpx;
		padding: 0 20rpx;
		border-radius: 10rpx;
		background-color: #d6343f;
		color: #fff;
		font-size: 28rpx;
	}

	.task {
		position: fixed;
		bottom: 120rpx;
		right: 20rpx;
		left: 20rpx;
		display: flex;
		flex-direction: row;
		/* width: 100%; */
		background-color: #fff;
		border-radius: 16rpx;
		padding: 20rpx;
	}

	.task-chat {
		display: flex;
		flex-direction: row;
		padding: 20rpx;
	}

	.my .task-chat {
		background-color: #f06c7a;
		color: #fff;
		border-radius: 16rpx;
	}

	.my .task-title {
		color: #fff;
		margin-bottom: 10rpx;
		font-size: 24rpx;
		text-overflow: ellipsis;
		white-space: normal;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.my .task-price {
		color: #fff;
		font-size: 28rpx;
	}

	.other .task-chat {
		background-color: #fff;
		border-radius: 16rpx;
	}

	.task-img {
		display: flex;
	}

	.task-img image {
		width: 140rpx;
		height: 140rpx;
		border-radius: 6rpx;
	}

	.task-con {
		flex: 1;
		padding-left: 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-size: 28rpx;
	}

	.task-title {
		color: #666;
		margin-bottom: 30rpx;
	}

	.task-price {
		color: #d6343f;
		font-size: 32rpx;
	}

	.task-send {
		position: absolute;
		right: 20rpx;
		bottom: 20rpx;
		background-color: #d6343f;
		color: #fff;
		font-size: 24rpx;
		padding: 8rpx 20rpx;
		border-radius: 40rpx;
	}

	.task-close {
		position: absolute;
		top: -20rpx;
		right: -20rpx;
		width: 30rpx;
		height: 30rpx;
		padding: 10rpx;
	}

	.task-img {
		display: flex;
	}

	.task-chat .task-img image {
		width: 100rpx;
		height: 100rpx;
	}

	.disconnect-pro {
		padding-bottom: 40rpx;
		text-align: center;
	}

	.disconnect-pro text {
		padding: 5rpx 20rpx;
		background-color: #ccc;
		color: #fff;
		font-size: 24rpx;
		border-radius: 6rpx;
	}



	/* 表情包 */

	.cf-bg {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: transparent;
		z-index: 99;
	}

	.cf-box {
		padding: 8px 5px;
		display: flex;
		justify-content: center;
	}

	.emoji {
		background-color: #fff;
		width: 30px;
		height: 30px;
		text-align: center;
		padding-top: 2px;
		box-sizing: border-box;
		font-size: 20px;
	}

	.emoji-box {
		position: relative;
		height: 420rpx;
		padding: 10rpx 0;
		box-sizing: border-box;
		background-color: #fff;
	}

	.emoji-cell {
		width: 9.09%;
		height: 33px;
		display: inline-block;
	}

	.emoji-cell image {
		width: 23px;
		height: 23px;
		padding: 5px;
		border-radius: 3px;
	}

	.emoji-move-in {
		-webkit-animation: emoji-move-in 0.3s forwards;
		animation: emoji-move-in 0.3s forwards;
	}

	.emoji-move-out {
		-webkit-animation: emoji-move-out 0.01s forwards;
		animation: emoji-move-out 0.01s forwards;
	}

	.no-emoji-move {
		-webkit-animation: none;
		animation: none;
	}

	@-webkit-keyframes emoji-move-in {
		0% {
			margin-bottom: -420rpx;
		}

		100% {
			margin-bottom: 0;
		}
	}

	@keyframes emoji-move-in {
		0% {
			margin-bottom: -420rpx;
		}

		100% {
			margin-bottom: 0;
		}
	}

	@-webkit-keyframes emoji-move-out {
		0% {
			margin-bottom: 0;
		}

		100% {
			margin-bottom: -420rpx;
		}
	}

	@keyframes emoji-move-out {
		0% {
			margin-bottom: 0;
		}

		100% {
			margin-bottom: -420rpx;
		}
	}

	@-webkit-keyframes pd-left-move {
		0% {
			padding-left: 5px;
		}

		100% {
			padding-left: 15px;
		}
	}

	@keyframes pd-left-move {
		0% {
			padding-left: 5px;
		}

		100% {
			padding-left: 15px;
		}
	}
</style>
