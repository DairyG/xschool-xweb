var rec_type;
var certificatePanel = $('#certificatePanel');

layui.use(['table', 'element', 'form', 'layedit','upload'], function () {
    var table = layui.table,
        element = layui.element,
        layform = layui.form,
        layedit = layui.layedit;
        upload = layui.upload;

    //var index = layedit.build('Content', { height: 360 });
    var E = window.wangEditor
    var eContent = new E('#E_Content');
    eContent.customConfig.uploadImgServer = Serv.ImageUrl;
    eContent.customConfig.uploadImgHeaders = Serv.GetHeaders();
    eContent.customConfig.uploadImgHooks = {
        customInsert: function(insertImg, result, editor) {
            if (result.succeed) {
                for (let index = 0; index < result.data.length; index++) {
                    insertImg(result.data[index])
                }
            }
        }
    };
    eContent.customConfig.onchange = function(html) {
        $('input[name="content"]').val(html);
    };
    eContent.create();


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
            else {
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
        var certificateData = [];
        certificatePanel.find('input[data-name="attach"]').each(function() {
            certificateData.push($(this).val());
        });
        var EnclosureUrl = certificateData.join(',');
        if ($.trim(laydata.field.content) == 0) {
            result.succeed = false;
            result.data = "请填写公告内容！";
        }
        if (sels == undefined) {
            result.succeed = false;
            result.data = "请公告阅读范围！";
        }
        else {
            var param = laydata.field;
            param.Content =encodeURIComponent(laydata.field.content);
            param.PublisherId = window.globCache.getEmployee().id;
            param.PublisherName = window.globCache.getEmployee().employeeName;
            param.DepartmentName = window.globCache.getEmployee().dptName;
            param.UserList = JSON.parse(laydata.field["sels"]).user;
            param.DepList = JSON.parse(laydata.field["sels"]).department;
            param.ComList = JSON.parse(laydata.field["sels"]).company;
            param.PositionList = JSON.parse(laydata.field["sels"]).position;
            param.SelType = JSON.parse(laydata.field["sels"]).sel_type;
            param.EnclosureUrl=EnclosureUrl;
            result.succeed = true;
            result.data = param;
        }
        callback(result);
    }

    //附件 上传
    upload.render({
        elem: '#certificateBtn',
        url: Serv.ImageUrl,
        accept: 'file',
        headers: Serv.GetHeaders(),
        before: function (obj) {
            layer_load();
        },
        done: function (result) {
            layer_load_lose();
            certificatePanel.append(setAttachHtml(result.data[0]));
        },
        error: function () {
            layer_load_lose();
        }
    });

    var id = GetPara("id");
    if (id > 0) {
        layer_load();
        Serv.Get("gc/note/GetSigleNote?NoteId=" + id, {}, function (result) {
            layer_load_lose();
            if (result.succeed) {
                $("input[name='Title']").val(result.data.noteDetail.title);
                $("input[name=IsNeedRead][value='0']").attr("checked", result.data.noteDetail.isNeedRead == 0 ? true : false);
                $("input[name=IsNeedRead][value='1']").attr("checked", result.data.noteDetail.isNeedRead == 1 ? true : false);
                $("input[name='id']").val(result.data.noteDetail.id);
                var fjHtml=splitAttach(result.data.noteDetail.enclosureUrl,2);                
                $("#certificatePanel").html(fjHtml);

                var sels = result.data.chooseUser;
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
                var content = result.data.noteDetail.content;
                //layedit.setContent(index, content, true);
                $("input[name='content']").val(content);
                eContent.txt.html(content);
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

/**
 * 分割附件
 * @param {*} value 值
 * @param {*} type 1=图片，2-附件
 */
function splitAttach(value, type) {
    if (!value) {
        return '';
    }
    var htmls = '';
    var fileArr = value.split(',');
    if (type == 1) {
        $.each(fileArr, function (i, item) {
            htmls += '<img src="' + item + '" style="margin:10px;max-height:90px; max-width:99%; cursor:pointer" />';
        });
    } else if (type == 2) {
        $.each(fileArr, function (i, item) {
            htmls += setAttachHtml(item, 1);
        });
    }
    return htmls;
}