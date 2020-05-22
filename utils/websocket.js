var url = 'wss://job.touchpoint.cn:2231';//服务器地址
//连接
function connect(func) {
  wx.connectSocket({
    url: url,
    header: { 'content-type': 'application/json' },
    success: function () {
      // console.log('websocket连接成功~')
      func();
    },
    fail: function () {
      wx.showToast({
        title: '连接客服失败，请退出重新连接',
        icon: "none",
        duration: 2000
      })
    }
  })

  wx.onSocketError(function (res) {
    wx.showToast({
      title: '连接客服失败，请退出重新连接',
      icon: "none",
      duration: 2000
    })
  })
}

//监听打开
function open(doSuccess) {
  wx.onSocketOpen(function () {
    //回调
    // console.log("监听打开")
    doSuccess();
  });
}

//监听获取消息
function message(doSuccess) {
  wx.onSocketMessage(function (res) {
    //接受服务器消息
    // console.log("监听获取消息"+res)
    doSuccess(res);
  });
}

//关闭
function close() {
  wx.closeSocket()
}

//监听断开
function socketClose(doSuccess){
  wx.onSocketClose(function (res) {
    //接受服务器消息
    // console.log("监听断开消息" + res)
    doSuccess(res);
  });
}

//发送消息
function send(msg) {
  // console.log("发送消息");
  console.log("发送消息" + msg)
  wx.sendSocketMessage({
    data: msg
  });
}

module.exports = {
  connect: connect,
  open: open,
  message: message,
  send: send,
  socketClose: socketClose,
  close: close
}