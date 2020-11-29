
let $image = null;
let options = null;
// 定义文章的发布状态
let art_state = '已发布';
$(function () {
    initCateList();
    // 初始化富文本编辑器
    initEditor();
    // 为选择封面按钮 添加事件
    $('#btnChooseImage').on('click', () => {
        // 模拟文件选择框被点击
        $('#coverFile').click();
    })
    // 为文件选择 绑定change事件 获取选中文件信息
    $('#coverFile').on('change', fileChange)
    // 为发布和草稿 按钮绑定事件
    $('#btnPublish').on('click', publish);
    $('#btnDranft').on('click', draft)
    // 为表单绑定提交事件
    $('#form-pub').on('submit', doSubmit)
    // 1. 初始化图片裁剪器
    $image = $('#image')

    // 2. 裁剪选项
    options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)
})

// 1.请求分类下拉框数据并渲染下拉框
function initCateList() {
    // a.异步请求 分类列表数据
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success(res) {
            // b.读取模板 并结合res.data 生成下拉框html
            let strHtml = template('tpl-select', res.data)
            // c.将下拉框html设置给select标签
            $('select[name=cate_id]').html(strHtml);
            // d.重新 渲染layui下拉框
            layui.form.render();
        }
    })
}
function fileChange(e) {
    // 0.获取选中文件信息的数组
    let fileList = e.target.files;
    if (fileList.length == 0) return layui.layer.msg('请选择文件~！')
    // 1.获取选中的第一个文件 信息对象
    let file = fileList[0];
    // 2.创建文件虚拟路径
    var newImgURL = URL.createObjectURL(file)
    // 3.显示新图片:
    // 调用裁剪组件，销毁之前的图片，设置新的虚拟路径给ta,并重新创建裁剪区
    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域

}
function publish() {
    art_state = '已发布';
}




function draft() {
    art_state = '草稿';
}
function doSubmit(e) {
    e.preventDefault();
    let fd = new FormData(this);
    fd.append('state', art_state);
    $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img', blob);
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                processData: false,
                contentType: false,
                success(res) {
                    if (res.status != 0) return layui.layer.msg(res.message)
                    layui.layer.msg(res.message, { time: 2000 }, function () {
                        window.location = '/artcle/art_list.html'
                    }

                    );

                }
            })
        })
}