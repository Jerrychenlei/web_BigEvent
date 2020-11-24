$(() => {
    // 去注册按钮点击事件---------------------
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 去登录按钮点击事件---------------------
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })
    // 从layui 中获取form对象----------------
    var form = layui.form
    // 通过form.verify() 函数自定义校验规则---
    form.verify({
        // 自定义了一个叫做pwd校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        // 使用函数作为自定义规则 形参value是确认密码框中的密码
        // 如果出错 返回消息 如果正常 啥也不返回
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个提示消息即可
            let pwd = $('.reg-box [name =password]').val();
            // 比较两个密码是否相同
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })
    // 注册表单的提交事件--------------------
    $('#regForm').on('submit', submitData);
    // 注册表单的提交事件
    $('#loginForm').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault()
        // a.获取登录表单数据
        let dataStr = $(this).serialize()
        // blur.异步提交到登录接口
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: dataStr,
            success(res) {
                // 登录失败
                if (res.status !== 0) return layui.layer.msg(res.message)
                // 登录成功
                layui.layer.msg(res.message, {
                    time: 1500 //1.5秒关闭（如果不配置，默认是3秒）
                }, function () {
                    // a.保存 token值到localstorage
                    localStorage.setItem('token', res.token)
                    // b.跳转到index.html
                    location = './index.html'
                })
            }
        })
    })
})

// 1.注册函数------------
function submitData(e) {
    // 阻断表单默认提交
    e.preventDefault();
    // a.获取表单数据
    let dataStr = $(this).serialize();
    // b.发送异步请求
    $.ajax({
        url: '/api/reguser',
        method: 'POST',
        data: dataStr,
        success(res) {
            // 不论成功与否 都显示消息
            layui.layer.msg(res.message);
            //注册出错                    
            if (res.status != 0) return;
            //注册成功
            // 将用户名 密码自动填充到登陆表单中
            let uname = $('.reg-box [name =username]').val().trim();
            $('.login-box [name =username]').val(uname);
            let upwd = $('.reg-box [name =password]').val().trim();
            $('.login-box [name =password]').val(upwd);
            // 清空注册表单
            $('#regForm')[0].reset();
            // 切换到登陆div
            $('#link_login').click();
        }
    })
}
