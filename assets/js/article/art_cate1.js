

$(() => {
    initArtCateList();
    $('#btnAddCate').on('click', addCate)
    // 通过代理方式，为未来的新增表单绑定提交事件
    $('body').on('submit', '#form-add', doAdd)
    // 通过代理方式，为未来的删除按钮绑定点击事件
    $('tbody').on('click', '#btn-delete', doDelete)
    // 通过代理方式，为未来的编辑按钮绑定点击事件
    $('tbody').on('click', '#btn-add', doEdit)
})
// 1.加载文章分类列表
function initArtCateList() {
    $.ajax({
        url: '/my/article/cates',
        method: 'GET',
        success(res) {
            // 1.遍历数组生成html字符串
            let strHtml = template('tpl-table', res.data)
            // 2.将html字符串渲染到tbody中
            $('tbody').html(strHtml)
        }
    })
}
// 保存弹出层的id
let layerId = null;
// 2.显示新增窗口
function addCate() {
    layerId = layui.layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '添加文章分类',
        content: $('#tpl-window').html()
    });

}
// 3.执行新增/编辑
function doAdd(e) {
    e.preventDefault();
    // 获取弹出层标题
    let title = $('.layui-layer-title').text().trim();
    // 新增操作
    if (title == "添加文章分类") {
        // a.获取数据
        let dataStr = $(this).serialize();
        // 将数据字符串中的id =& 替换成空字符串
        dataStr = dataStr.replace('Id=&', '')
        // 需要判断当前提交 是【新增】 还是编辑【编辑】操作
        // b.异步提交
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: dataStr,
            success(res) {
                layui.layer.msg(res.message)
                if (res.status != 0) return
                // c.重新获取分类列表
                initArtCateList();
                // d.关闭弹出窗口
                layui.layer.close(layerId);
            }
        })
    } else {
        $.ajax({
            url: '/my/article/updatecate',
            method: 'POST',
            data: $(this).serialize(),
            success(res) {
                layui.layer.msg(res.message);
                if (res.status != 0) return;
                // c重新获取分类列表
                initArtCateList();
                // d关闭弹出窗口
                console.log(layerId);
                layui.layer.close(layerId)
            }
        })
    }

}
// 4.执行删除
function doDelete() {
    let id = this.getAttribute('data-id');
    // 如果用户点击确认，则执行回调函数
    layui.layer.confirm('您确定要退出吗?', function (index) {
        // h5中提供了获取data- 属性的快捷语法:
        // let id = this.dataset.id;
        // 发送异步请求
        $.ajax({
            url: '/my/article/deletecate/' + id,
            method: 'GET',
            success(res) {
                layui.layer.msg(res.message);
                if (res.status != 0) return
                // 如果删除成功，则重新请求列表数据
                initArtCateList();
            }
        });
        // 关闭当前确认框
        layui.layer.close(layerId)
    });
}
// 5.显示编辑
function doEdit() {
    // a.弹出层
    layerId = layui.layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '编辑文章分类',
        content: $('#tpl-window').html()
    });
    // b.获取id
    let id = this.dataset.id;
    // c.查询数据
    $.ajax({
        url: '/my/article/cates/' + id,
        method: 'GET',
        success(res) {
            // 将获取的文章分类数据 自动装填到表单元素中
            layui.form.val('formData', res.data)
        }
    })
}
