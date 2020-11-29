

// 【全局变量】 分页查询参数对象
let q = {
    pagenum: 1, //当前页码
    pagesize: 10,//页容量(页显示的行数)
    cate_id: '',//分类筛选id
    state: ''//发布状态
};
$(function () {

    template.defaults.imports.dataformat = function (date) {
        let dt = new Date(date)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())
        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    initArtList();
    initCate()
    // 为查询表单添加绑定事件
    $('#searchForm').on('submit', submitForm)
    //为未来的删除按钮 代理点击事件
    $('tbody').on('click', '.btn-delete', del)
})
// 1.加载文章列表
function initArtList() {
    $.ajax({
        url: '/my/article/list',
        method: 'GET',
        data: q,
        success(res) {
            // 1.遍历数组生成html字符串
            let strHtml = template('tpl-table', res.data)
            // 2.将html字符串渲染到tbody中
            $('tbody').html(strHtml)
            // 3.调用生成页码条方法
            renderPage(res.total)
        }
    })
}

// 2.加载分类下拉框
function initCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success(res) {
            // 生成下拉框html代码
            let strHtml = template('tpl-cate', res)
            // 将html代码添加到分类下拉框中
            console.log(strHtml);
            $('[name=cate_id]').html(strHtml)
            // 通知layui 重新渲染下拉框和其他表单
            layui.form.render()

        }

    })
}
// 3.查询事件处理函数
function submitForm(e) {
    // a.阻断表单提交
    e.preventDefault()
    // b.逐一获取查询表单下拉框的数据 设置给分页查询参数对象
    q.cate_id = $('select[name=cate_id]').val()
    q.state = $('select[name=state]').val()
    // c.重新加载 文章列表
    initArtList();
}
// 4.生成页码条
// 注意:laypage中的jump 函数触发时机:1.laypage.render 会执行首次触发
//                                 2.点击页码时触发
//                                 3.切换页容量下拉框时触发
function renderPage(total) {
    // 调用laypage.render()方法来渲染分页的结构
    layui.laypage.render({
        elem: 'pageBox', //分页容器的id
        count: total, // 总数据条数
        limit: q.pagesize, //每页显示几条数据
        curr: q.pagenum,  //设置默认被选中的分页
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],//页码条功能
        limits: [2, 3, 5, 10], //页容量选项
        // 分页发生切换的时候，触发jump回调
        //触发jump回调的方式有两种:
        // 1.点击页码的时候，会触发jump回调
        // 2.只要调用了laypage.render()方法，就会触发jump回调
        jump(obj, first) { //点击页码的事件函数
            // 把最新的页码值 赋值到q这个查询参数对象中
            q.pagenum = obj.curr; //获取当前页码  设置给分页查询参数
            // 把最新的条目数，赋值到q这个查阅参数对象的pagesize对象中
            q.pagesize = obj.limit; //获取下拉框中 选中的页容量  设置给分页查询参数
            //    当点击页码时
            if (!first) {
                //根据最新的q获取对应的数据列表，并渲染表格
                initArtList();
            }
        }

    })
}
// 5.删除业务
function del() {
    let id = this.getAttribute('data-id');
    console.log(id);
    // 如果用户点击确认，则执行回调函数
    layui.layer.confirm('您确定要删除吗?', function (layerId) {
        // 获取页面上 剩余行数
        let rows = $('tbody tr .btn-delete').length;
        // h5中提供了获取data- 属性的快捷语法:
        // let id = this.dataset.id;
        // 发送异步请求
        $.ajax({
            url: '/my/article/delete/' + id,
            method: 'GET',
            success(res) {
                layui.layer.msg(res.message);
                if (res.status != 0) return
                // 删除成功后，需要判断是否已经没有行了，如果没有，则页码-1
                if (rows <= 1) {
                    q.pagenum--;
                }
                // 如果删除成功，则重新请求列表数据
                initArtList()
            }
        });
        // 关闭当前确认框
        layui.layer.close(layerId)
    });
}