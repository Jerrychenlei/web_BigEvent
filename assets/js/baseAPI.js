

// 1.为页面上所有基于JQ的ajax请求发送之前，对参数对象做处理
$.ajaxPrefilter(function (ajaxOpt) {
  // 在发起真正的ajax请求之前，统一拼接请求的根路径
  ajaxOpt.url = 'http://ajax.frontend.itheima.net' + ajaxOpt.url;
  // 统一为有权限的接口 设置header 请求头
  if (ajaxOpt.url.indexOf('/my/') > -1) {
    ajaxOpt.headers = {
      Authorization: localStorage.getItem('token')
    }
  }
  //  为所有的ajax请求统一配置complete事件函数
  ajaxOpt.complete = function (res) {
    // 1.判断返回的数据是否在告诉我们 没有登录
    if (res.responseJSON == 1 && res.responseJSON.message == '身份认证失败') {
      // 2.没有登录，则
      // 2.1显示 需要重新登录的消息 显示结束后 再执行清空token和跳转操作
      layui.layer.msg(res.responseJSON.message, {
        icon: 1,
        time: 1500
      }, function () {
        // 2.2清空token
        localStorage.removeItem('token');
        //2.3 跳转到login.html页面
        location.href = 'login.html'
      });

    }
  }
});