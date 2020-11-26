
$(() => {
    // 0.为layui添加校验规则
    layui.form.verify({
        nickname: [/^\S{6,12}$/, '昵称必须在6-12个字符之间']
    })
    // 加载用户基本信息
    initUserInfo()
    // 重置按钮事件
    $('#btnReset').on('click', function () {
        initUserInfo();
    });
    // 表单提交事件 
    $('.layui-form').on('submit', submitData);

})
// 初始化用户的基本信息----------------
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success(res) {
            // 错误判断
            if (res.status != 0) return layui.layer.msg(res.message)
            // 调用form.val() 快速给表单赋值(将数据装入同名的表单元素中)
            layui.form.val('userForm', res.data)
        }
    })
}
// 提交表单数据
function submitData(e) {
    e.preventDefault();
    $.ajax({
        url: '/my/userinfo',
        method: 'POST',
        data: $(this).serialize(),
        success(res) {
            // 不管成功与否，都显示消息
            layui.layer.msg(res.message);
            // 如果有错，停止函数执行
            if (res.status != 0) return
            // 如果没有出错，则通过window.parent或window.top来调用
            // 父页面的方法
            window.top.getUserInfo();
        }
    })
}