var rec_type;

layui.use(['table', 'element', 'form', 'layedit'], function () {
    var table = layui.table,
        element = layui.element,
        layform = layui.form,
        layedit = layui.layedit;

    var index = layedit.build('Content', { height: 360 });
    layform.on('submit(noteAdd)', function (laydata) {
        layer_load();
        CheckData(laydata, function (resultData) {
            if (resultData.succeed) {
                Serv.Post('gc/note/AddNote', resultData.data, function (result) {
                    layer_load_lose();
                    if (result.code == "00") {
                        window.location.href = "/pages/note/noteManage.html";
                    } else {
                        layer_alert(result.message);
                    }
                })
            }
            else{
                layer_load_lose();
                layer_alert(resultData.data);
            }
        })   
        return false;
    })
    layform.on('submit(noteAddAgain)', function (laydata) {
        layer_load();
        CheckData(laydata, function (resultData) {
            if (resultData.succeed) {
                Serv.Post('gc/note/AddNote', resultData.data, function (result) {
                    layer_load_lose();
                    if (result.code == "00") {
                        layer_confirm('添加成功，是否继续添加？', function () {
                            $("input[name='Title']").val('');
                        }, backhistory);
                    } else {
                        layer_alert(result.message);
                    }
                })
            }
            else {
                layer_load_lose();
                layer_alert(resultData.data);
            }
        })
        return false;
    })
    function CheckData(laydata, callback) {
        var result = new Array;
        var sels = laydata.field.sels;
        if (encodeURIComponent($("#Content")[0].value).length == 0) {
            result.succeed = false;
            result.data="请填写公告内容！";
        }
        if (sels == undefined) {
            result.succeed = false;
            result.data="请公告阅读范围！";
        }
        else {
            var param = laydata.field;
            param.Content = encodeURIComponent($("#Content")[0].value);
            param.PublisherId = window.globCache.getEmployee().id;
            param.PublisherName = window.globCache.getEmployee().employeeName;
            param.DepartmentName = window.globCache.getEmployee().dptName;
            param.UserList = JSON.parse(laydata.field["sels"]).user;
            param.DepList = JSON.parse(laydata.field["sels"]).department;
            param.ComList = JSON.parse(laydata.field["sels"]).company;
            param.PositionList = JSON.parse(laydata.field["sels"]).position;
            param.SelType=JSON.parse(laydata.field["sels"]).sel_type;
            result.succeed = true;
            result.data=param;
        }
        callback(result);
    }

    var id = GetPara("id");
    if (id > 0) {
        layer_load();
        Serv.Get("gc/note/GetSigleNote?id=" + id, {}, function (result) {
            layer_load_lose();
            if (result.succeed) {
                $("input[name='Title']").val(result.data.noteDetail.title);
                $("input[name=IsNeedRead][value='0']").attr("checked", result.data.noteDetail.isNeedRead == 0 ? true : false);
                $("input[name=IsNeedRead][value='1']").attr("checked", result.data.noteDetail.isNeedRead == 1 ? true : false);
                $("input[name='id']").val(result.data.noteDetail.id);
                
                var sels=result.data.chooseUser;
                var html = "";
                var L1 = sels.user.length,
                    L2 = sels.department.length,
                    L3 = sels.company.length,
                    L4 = sels.position.length;
                    //L5 = sels.dpt_position.length;
                if ((L1 + L2 + L3 + L4) > 1) {
                    html = "等" + (L1 + L2 + L3 + L4) + '项';
                }
                if (L1 > 0) {
                    html = sels.user[0].name + html;
                } else if (L2 > 0) {
                    html = sels.department[0].name + html;
                } else if (L3 > 0) {
                    html = sels.company[0].name + html;
                } else if (L4 > 0) {
                    html = sels.position[0].name + html;
                }
                $("div[id='rec_box']").text(html);
                $("div[id='rec_box']").append('<input type="hidden" name="sels" value=\'' + JSON.stringify(result.data.chooseUser) + '\'>');
                var content = decodeURIComponent(result.data.noteDetail.content);
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
