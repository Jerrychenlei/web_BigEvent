// 1.在dom树创建完后开始执行
$(() => {
    // 调用getUserInfo获取用户基本信息
    getUserInfo();
    $('#btnLogout').on('click', logout)
})


// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 渲染用户的信息头像
            renderAvatar(res.data)
        },
    })
}
// 渲染用户的头像
function renderAvatar(user) {
    // 获取用户的名称
    var userName = user.nickname || user.username;
    // 设置给welcome span 标签
    $('#welcome').html('欢迎' + userName)
    // 渲染用户的头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide();
    } else {
        // 没有图片头像，使用文本头像
        $('.layui-nav-img').hide();//隐藏图片头像
        let first = userName[0].toUpperCase()
        $('.text-avatar').html(first).show();
    }


}
// 退出按钮函数
function logout() {
    // 弹出确认框
    layui.layer.confirm('你确定要退出吗？', {
        icon: 3, title: '系统提示'
    }, function (index) {
        localStorage.removeItem('token');
        location.href = "/login.html";
        layer.close(index)
    })
}