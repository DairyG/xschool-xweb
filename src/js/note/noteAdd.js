var rec_type;



layui.use(['table', 'element', 'form', 'layedit'], function () {
    var table = layui.table,
        element = layui.element,
        layform = layui.form,
        layedit = layui.layedit;

    var index = layedit.build('Content', { height: 360 });
    layform.on('submit(noteAdd)', function (laydata) {
        layer_load();
        var param = laydata.field;
        param.Content = encodeURIComponent($("#Content")[0].value);
        if (param.Content.length == 0) {
            layer_alert("请填写公告内容！");
            layer_load_lose();
            return
        }
        Serv.Post('gc/note/AddNote', param, function (result) {
            layer_load_lose();
            if (result.code == "00") {
                window.location.href = "/pages/note/noteManage.html";
            } else {
                layer_alert(result.message);
            }
        })
        return false;
    })
    layform.on('submit(noteAddAgain)', function (laydata) {
        layer_load();
        var param = laydata.field;
        param.Content = encodeURIComponent($("#Content")[0].value);
        if (param.Content.length == 0) {
            layer_alert("请填写公告内容！");
            layer_load_lose();
            return false;
        }
        Serv.Post('gc/note/AddNote', param, function (result) {
            layer_load_lose();
            if (result.code == "00") {
                layer_confirm('添加成功，是否继续添加？', function () {
                    $("input[name='Title']").val('');
                }, backhistory);
            } else {
                layer_alert(result.message);
            }
        })
        return false;
    })

    var id = GetPara("id");
    if (id > 0) {
        layer_load();
        Serv.Get("gc/note/GetSigleNote?id=" + id, {}, function (result) {
            layer_load_lose();
            if (result.succeed) {
                $("input[name='Title']").val(result.data.title);
                $("input[name=IsNeedRead][value='0']").attr("checked", result.data.isNeedRead == 0 ? true : false);
                $("input[name=IsNeedRead][value='1']").attr("checked", result.data.isNeedRead == 1 ? true : false);
                $("input[name='id']").val(result.data.id);
                var content = decodeURIComponent(result.data.content);
                layedit.setContent(index, content, true);
                layform.render();
            }
            else {
                layer_alter("未获取到相应数据！");
            }
        })
    }
})
function backhistory() {
    window.location.href = "/pages/note/noteManage.html";
}
