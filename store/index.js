import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    //modules,
    //严格模式启用后，数据状态的修改就必须通过mutations的方式提交，这样也便于查看状态变更
    strict: process.env.NODE_ENV !== 'production',
    state: {
		userConfig: {}, //配置信息
		userInfo: {}, //用户信息
		userInit_MoneyAll: {}, //用户数据1
		userInit_MoneyUse: {}, //用户数据2
		userInit_MoneyCash: {}, //用户数据3
		userInit_DataGet: {}, //用户数据4
		userInit_DataMake: {}, //用户数据5
		userInit_DataPass: {}, //用户数据6
		banner: {}, //轮播图
		taskClass: {}, //分类
		scene: '', //场景值
		type: '', //跳转判断
		id: '' ,
		wxacode: '', //推荐人标识
		navHeight: '', //胶囊按钮与顶部的距离
		navTop: '', //导航高度
		windowHeight: '', //可使用窗口高度
		taskFlag: 0 //任务标记
    },
	//数据修改，非异步
    mutations: {
		setUserConfig(state, newValue) {
			state.userConfig = newValue
		},
		setUserInfo(state, newValue) {
			state.userInfo = newValue
		},
		setUserInitMoneyAll(state, newValue) {
			state.userInit_MoneyAll = newValue
		},
		setUserInitMoneyUse(state, newValue) {
			state.userInit_MoneyUse = newValue
		},
		setUserInitMoneyCash(state, newValue) {
			state.userInit_MoneyCash = newValue
		},
		setUserInitDataGet(state, newValue) {
			state.userInit_DataGet = newValue
		},
		setUserInitDataMake(state, newValue) {
			state.userInit_DataMake = newValue
		},
		setUserInitDataPass(state, newValue) {
			state.userInit_DataPass = newValue
		},
		setBanner(state, newValue) {
			state.banner = newValue
		},
		setTaskClass(state, newValue) {
			state.taskClass = newValue
		},
		setScene(state, newValue) {
			state.scene = newValue
		},
		setType(state, newValue) {
			state.type = newValue
		},
		setId(state, newValue) {
			state.id = newValue
		},
		setWxacode(state, newValue) {
			state.wxacode = newValue
		},
		setNavHeight(state, newValue) {
			state.navHeight = newValue
		},
		setNavTop(state, newValue) {
			state.navTop = newValue
		},
		setWindowHeight(state, newValue) {
			state.windowHeight = newValue
		},
		setTaskFlag(state, newValue) {
			state.taskFlag = newValue
		}
    },
	//异步方法，如果需要修改state中的数据，必须调用mutations里的方法
	actions: {
		// updateTokens(state, newValue) {
		// 	console.log('actions')
		// 	console.log(state, newValue)
		// 	//state.state.token = 'zjxs:' + newValue
		// 	state.commit('updateToken', 'zjxs:' + newValue)
		// }
	}
})