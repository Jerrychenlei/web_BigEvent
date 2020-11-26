$(() => {
    // 0.为layui添加校验规则
    layui.form.verify({
        // 1.1密码规则
        pwd: [/^\S{6,12}$/, '密码必须在6-12个字符之间'],
        // 1.2新旧密码必须不一样 规则
        samepwd: function (value) {
            if (value == $('[name =oldPwd]').val()) {
                return '新旧密码不能一样'
            }
        },
        // 确认必须和新密码一样规则
        confirmpwd: function (value) {
            if (value != $('[name=newPwd]').val()) {
                return '确认密码和新密码输入的不一样'
            }
        }
    })
    // 2.为表单添加提交事件
    $('.layui-form').on('submit', changePwd);
})
// 1.修改密码
function changePwd(e) {
    e.preventDefault();
    // a.提交数据到接口 完成更新密码
    $.ajax({
        url: '/my/updatepwd',
        method: 'POST',
        data: $(this).serialize(),
        success(res) {
            // 如果不成功，则退出函数
            if (res.status != 0) return layui.layer.msg(res.message);
            layui.layer.msg(res.message, { icon: 1, time: 2000 }, function () {
                // 如果成功，则清空token，并跳转到登陆页面
                localStorage.removeItem('token');
                window.top.location = '/login.html'
            })

        }
    })

}