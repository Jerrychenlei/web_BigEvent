$(() => {
    initCropper();
})
// 裁剪区的全局配置选项
let $image = null;
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

function initCropper() {
    $image = $('#image')
    // 1.3 创建裁剪区域
    $image.cropper(options)
    // 1.4为上传按钮 添加点击事件
    $('#btnUpload').on('click', chooseFile)
    // 1.5为文件选择框 绑定onchange事件，获取选中文件信息
    $('#file').on('change', fileChange)
    // 为确定按钮添加点击事件
    $('#btnOk').on('click', upload)
}
// 1.选择文件
function chooseFile() {
    $('#file').click();
}
// 2.选中文件
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
// 3.确定上传
function upload() {
    // a.获取选中的裁剪后的图片数据
    var dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // b.提交到服务器接口
    $.ajax({
        url: '/my/update/avatar',
        method: 'POST',
        data: {
            avatar: dataURL
        },
        success(res) {
            layui.layer.msg(res.message)
            if (res.status != 0) return;
            // c.如果上传成功，则调用父页面的方法 重新渲染用户信息
            window.top.getUserInfo();
        }
    })

} 