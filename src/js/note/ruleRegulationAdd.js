var rec_type;
var certificatePanel = $('#certificatePanel');
layui.use(['table', 'element', 'form', 'layedit', 'upload'], function () {
    var table = layui.table,
        element = layui.element,
        form = layui.form,
        layedit = layui.layedit;
    upload = layui.upload;

    //var index = layedit.build('editor1', { height: 360 });
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

    form.on('submit(noteAdd)', function (laydata) {
        layer_load();
        CheckData(laydata, function (resultData) {
            if (resultData.succeed) {
                Serv.Post('gc/note/RuleRegulationAdd', resultData.data, function (response) {
                    layer_load_lose();
                    if (response.code == "00") {
                        window.location.href = "/pages/note/ruleRegulation.html";
                    } else {
                        layer_alert(response.message);
                    }
                })
            } else {
                layer_load_lose();
                layer_alert(resultData.data);
            }
        })
        return false;
    })
    form.on('submit(noteAddAgain)', function (laydata) {
        layer_load();
        CheckData(laydata, function (resultData) {
            if (resultData.succeed) {
                Serv.Post('gc/note/RuleRegulationAdd', resultData.data, function (response) {
                    layer_load_lose();
                    if (response.code == "00") {
                        layer_confirm('添加成功，是否继续添加？', function () {
                            $("input[name='Title']").val('');
                        }, backhistory);
                    } else {
                        layer_alert(response.message);
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
        Serv.Get("gc/note/RuleRegulationDetail?id=" + id, {}, function (result) {
            layer_load_lose();
            if (result.succeed) {
                $("input[name='title']").val(result.data.ruleRegulationDetail.title);
                $("input[name='id']").val(result.data.ruleRegulationDetail.id);
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
                var fjHtml=splitAttach(result.data.ruleRegulationDetail.enclosureUrl,2);                
                $("#certificatePanel").html(fjHtml);

                var content = result.data.ruleRegulationDetail.content;
                //layedit.setContent(index, content, true);
                $("input[name='content']").val(content);
                eContent.txt.html(content);

                var zTree = $.fn.zTree.getZTreeObj('treeDemo');
                var nodes = zTree.getNodesByParam("id", result.data.ruleRegulationDetail.typeId, null);
                if (nodes.length > 0) {
                    zTree.checkNode(nodes[0], true, true);
                    var cityObj = $("#treeIpt");
                    cityObj.attr("value", nodes[0].ruleName);
                }
                form.render();
            }
            else {
                layer_alter("未获取到相应数据！");
            }
        })
    }
})

function CheckData(laydata, callback) {
    var result = new Array;
    var sels = laydata.field.sels;
    var zTree = $.fn.zTree.getZTreeObj('treeDemo');
    var nodes = zTree.getCheckedNodes();
    var certificateData = [];
    certificatePanel.find('input[data-name="attach"]').each(function () {
        certificateData.push($(this).val());
    });
    var EnclosureUrl = certificateData.join(',');
    if ($.trim(laydata.field.content) == 0) {
        result.succeed = false;
        result.data = "请填写公告内容！";
    }
    if (nodes.length == 0) {
        layer_alert("请选择制度类别！");
        return;
    }
    else {
        var param = laydata.field;
        param.TypeId = nodes[0].id; 
        param.Content =encodeURIComponent(laydata.field.content);
        param.PublisherId = window.globCache.getEmployee().id;
        param.PublisherName = window.globCache.getEmployee().employeeName;
        param.DepartmentName = window.globCache.getEmployee().dptName;
        param.UserList = JSON.parse(laydata.field["sels"]).user;
        param.DepList = JSON.parse(laydata.field["sels"]).department;
        param.ComList = JSON.parse(laydata.field["sels"]).company;
        param.PositionList = JSON.parse(laydata.field["sels"]).position;
        param.SelType = JSON.parse(laydata.field["sels"]).sel_type;
        param.EnclosureUrl = EnclosureUrl;
        result.succeed = true;
        result.data = param;
    }
    callback(result);
}

function backhistory() {
    window.location.href = "/pages/note/ruleRegulation.html";
}
function on_select(this_type, value, text) {
    if (value > -1) {
        if (value == 0) {
            $("#rec_box").html('');
        } else {
            $("#rec_box input").each(function (i, obj) {
                if ($(obj).val() == value || $(obj).val() == 0) {
                    sel_remove(obj);
                }
            });
        }
        if (rec_type == this_type) {
            var html = build_sel_html(this_type, value, text);
            $("#rec_box").append(html);
        }
    }
}
var setting = {
    check: {
        enable: true,
        chkStyle: "radio",
        radioType: "all"
    },
    view: {
        dblClickExpand: false
    },
    data: {
        key: {
            name: 'ruleName',
            title: 'ruleName'
        },
        simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'parentId',
            rootPId: '0'
        },
    },
    callback: {
        beforeClick: beforeClick,
        onCheck: onCheck
    }
};

function beforeClick(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.checkNode(treeNode, !treeNode.checked, null, true);
    return false;
}

function onCheck(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
        nodes = zTree.getCheckedNodes(true),
        v = "";
    for (var i = 0, l = nodes.length; i < l; i++) {
        v += nodes[i].ruleName + ",";
    }
    if (v.length > 0) v = v.substring(0, v.length - 1);
    var cityObj = $("#treeIpt");
    cityObj.attr("value", v);
}

function showMenu() {
    var cityObj = $("#treeIpt");
    var cityOffset = $("#treeIpt").offset();
    $("#menuContent").css({ left: cityOffset.left + "px", top: cityOffset.top + cityObj.outerHeight() + "px", width: cityObj.outerWidth() + "px" }).slideDown("fast");

    $("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "treeIpt" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
        hideMenu();
    }
}

$(document).ready(function () {
    Serv.Post('gc/note/GetRuleRegulationTypeList', {}, function (result) {
        result.data[0].open = true;
        zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, result.data);
    })
});
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