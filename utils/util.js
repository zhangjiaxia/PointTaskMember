import store from '@/store' //引入全局变量的token

let hex_md5 = require("./MD5.js");
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//年月日
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

/**
 * POST请求，
 * URL：接口
 * postData：参数，json类型
 * doSuccess：成功的回调函数
 * doFail：失败的回调函数
 */
function request(action, cmd, postData, doSuccess, doFail) {
  var time = Date.parse(new Date());
  wx.request({
    //项目的真正接口，通过字符串拼接方式实现 域名：http://attn.touch-tech.com.cn:81/attn/
    url: "https://job.touchpoint.cn/apis/channel/index?v=2.0.2",
    // url: "https://job.touchpoint.cn/apis/channel/index",
    header: {
      'content-type': 'application/json' // 默认值
    },
    data: {
      cmd: cmd,
      action: action,
      ver: '',//线上数据库需要传版本号，屏蔽不传或传空值是测试数据库
      data: postData
    },
    method: "POST",
    success: function (res) {
      //参数值为res.data,直接将返回的数据传入
      doSuccess(res.data);
    }, fail: function (fail) {
      // console.log(fail)
      if (doFail){
        doFail(fail)
      }
    }, complete: function(){
    }
  })
}

/**
 * 活动抽奖
 */
function requestActivity(cmds, action, postData, doSuccess, doFail) {
  wx.request({
    url: "https://job.touchpoint.cn/apis/market/index",
    header: {
      'content-type': 'application/json' // 默认值
    },
    data: {
      cmds: cmds,
      action: action,
      data: postData
    },
    method: "POST",
    success: function (res) {
      //参数值为res.data,直接将返回的数据传入
      doSuccess(res.data);
    }, fail: function (fail) {
      // console.log(fail)
      if (doFail) {
        doFail(fail)
      }
    }
  })
}

/**
 * 会话接口
 */
function requestChat(action, postData, doSuccess) {
  wx.request({
    url: "https://job.touchpoint.cn/cloudim/index/api/index",
    header: {
      'content-type': 'application/json' // 默认值
    },
    data: {
      action: action,
      data: postData
    },
    method: "POST",
    success: function (res) {
      //参数值为res.data,直接将返回的数据传入
      doSuccess(res.data);
    }
  })
}

/**
 * 文件上传
 */
function uploadFile(uid, postData, type, mtid, doSuccess) {
  // console.log(uid, postData, type, mtid)
  wx.uploadFile({
    url: 'https://job.touchpoint.cn/apis/channel/file?v=2.0.2', //仅为示例，非真实的接口地址
    // url: 'https://job.touchpoint.cn/apis/channel/file', //仅为示例，非真实的接口地址
    filePath: postData,
    formData: {
      changeType: 'user',
      uid: uid,
      type: type,
      ver: '',
      mtid: mtid
    },
    name: 'm_file',
    success(res) {
      res.data = JSON.parse(res.data);
      if (res.data.code === '000') {
        doSuccess(res.data);
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }, complete(res){
    }
  })
}

/**
 * 聊天文件上传
 */
function uploadFileChat(url, postData, doSuccess) {
  var time = formatDate(new Date());
  wx.uploadFile({
    url: 'https://job.touchpoint.cn/cloudim/index/upload/' + url, //仅为示例，非真实的接口地址
    filePath: postData,
    name: 'file',
    success(res) {
      res.data = JSON.parse(res.data);
      if (res.data.code == '000') {
        doSuccess(res.data);
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }
  })
}

function initializeLogin(userInfo, userConfig, banner, taskClass, doSuccess, doFail) {
	var that = this;
	var data = {
	  uid: userInfo ? userInfo.userid : null,//用户id
	  ctime: userConfig ? userConfig.ctime : null,//配置信息时间戳
	  banner_ctime: banner ? banner.ctime : null,//轮播图信息时间戳
	  taskClass_ctime: taskClass ? taskClass.ctime : null,//分类信息时间戳
	}
	request('userInitialization', 'member', data, function (res) {
	  wx.hideLoading();
	  if (res.code == '000') {
		//有配置信息更新
		if (res.data.isUserConfig){
		  //that.globalData.userConfig = res.data.isUserConfig;
		  store.commit('setUserConfig', res.data.isUserConfig)
		  wx.setStorage({
			key: "userConfig",
			data: res.data.isUserConfig
		  })
		}
		//用户信息
		if (res.data.userInfo) {
		  //that.globalData.userInfo = res.data.userInfo;
		  store.commit('setUserInfo', res.data.userInfo)
		  wx.setStorage({
			key: "userInfo",
			data: res.data.userInfo
		  })
		}

		//会员数据1
		if (res.data.userInit_MoneyAll) {
		  //that.globalData.userInit_MoneyAll = res.data.userInit_MoneyAll;
		  store.commit('setUserInitMoneyAll', res.data.userInit_MoneyAll)
		  wx.setStorage({
			key: "userInit_MoneyAll",
			data: res.data.userInit_MoneyAll
		  })
		}
		//会员数据2
		if (res.data.userInit_MoneyUse) {
		  //that.globalData.userInit_MoneyUse = res.data.userInit_MoneyUse;
		  store.commit('setUserInitMoneyUse', res.data.userInit_MoneyUse)
		  wx.setStorage({
			key: "userInit_MoneyUse",
			data: res.data.userInit_MoneyUse
		  })
		}
		//会员数据3
		if (res.data.userInit_MoneyCash) {
		  //that.globalData.userInit_MoneyCash = res.data.userInit_MoneyCash;
		  store.commit('setUserInitMoneyCash', res.data.userInit_MoneyCash)
		  wx.setStorage({
			key: "userInit_MoneyCash",
			data: res.data.userInit_MoneyCash
		  })
		}
		//会员数据4
		if (res.data.userInit_DataGet) {
		  //that.globalData.userInit_DataGet = res.data.userInit_DataGet;
		  store.commit('setUserInitDataGet', res.data.userInit_DataGet)
		  wx.setStorage({
			key: "userInit_DataGet",
			data: res.data.userInit_DataGet
		  })
		}
		//会员数据5
		if (res.data.userInit_DataMake) {
		  //that.globalData.userInit_DataMake = res.data.userInit_DataMake;
		  store.commit('setUserInitDataMake', res.data.userInit_DataMake)
		  wx.setStorage({
			key: "userInit_DataMake",
			data: res.data.userInit_DataMake
		  })
		}
		//会员数据6
		if (res.data.userInit_DataPass) {
		  //that.globalData.userInit_DataPass = res.data.userInit_DataPass;
		  store.commit('setUserInitDataPass', res.data.userInit_DataPass)
		  wx.setStorage({
			key: "userInit_DataPass",
			data: res.data.userInit_DataPass
		  })
		}

		//轮播图
		if (res.data.isBanner) {
		  //that.globalData.banner = res.data.isBanner;
		  store.commit('setBanner', res.data.isBanner)
		  wx.setStorage({
			key: "banner",
			data: res.data.isBanner
		  })
		}
		//任务分类
		if (res.data.isTaskClass) {
		  //that.globalData.taskClass = res.data.isTaskClass;
		  store.commit('setTaskClass', res.data.isTaskClass)
		  wx.setStorage({
			key: "taskClass",
			data: res.data.isTaskClass
		  })
		}
		doSuccess();
	  } else {
		wx.showModal({
		  title: '提示',
		  content: res.msg,
		  success(res) {
			if (res.confirm) {
			  console.log('用户点击确定')
			} else if (res.cancel) {
			  console.log('用户点击取消')
			}
		  }
		})
	  }
	}, function (fail) {
	  doFail();
	})
}

module.exports = {
  formatTime: formatTime,
  request: request,
  requestChat: requestChat,
  uploadFile: uploadFile,
  uploadFileChat: uploadFileChat,
  requestActivity: requestActivity,
  initializeLogin: initializeLogin
}
