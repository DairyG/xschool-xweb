var rec_type;

layui.use(['table', 'element', 'form', 'layedit'], function () {
    var table = layui.table,
        element = layui.element,
        form = layui.form,
        layedit = layui.layedit;

    var index = layedit.build('editor1', { height: 360 });
    form.on('select(rec_type)', function (data) {
        rec_type = data.value;
        $("#sel_item_box .sel_item").hide();
        $("#rec_box").html('');
        $("#sel_item_box select").val(-1);
        form.render('select');
        switch (rec_type) {
            case "user"://按人员
                $("#sel_item_box #sel_user_item").show();
                break;
            case "department"://部门
                $("#sel_item_box #sel_company_item,#sel_item_box #sel_department_item").show();
                break;
            case "company"://公司
                $("#sel_item_box #sel_company_item").show();
                break;
            case "position"://职位
                $("#sel_item_box #sel_company_item,#sel_item_box #sel_position_item").show();
                break;
            case "0":
                break;
        }
    });
    form.on('select(sel_company)', function (data) {
        var value = data.value;
        var text = data.elem[data.elem.selectedIndex].text;
        on_select('company', value, text);
    });
    form.on('select(sel_department)', function (data) {
        var value = data.value;
        var text = data.elem[data.elem.selectedIndex].text;
        on_select('department', value, text);
    });
    form.on('select(sel_position)', function (data) {
        var value = data.value;
        var text = data.elem[data.elem.selectedIndex].text;
        on_select('position', value, text);
    });

    form.on('submit(noteAdd)', function (laydata) {
        layer_load();
        var zTree = $.fn.zTree.getZTreeObj('treeDemo');
        var nodes = zTree.getCheckedNodes();
        if (nodes.length == 0) {
            layer_alert("请选择制度类别！");
            return;
        }
        var param = laydata.field;
        param.Content = encodeURIComponent($("#editor1")[0].value);
        param.TypeId = nodes[0].id;
        Serv.Post('gc/note/RuleRegulationAdd', param, function (response) {
            layer_load_lose();
            if (response.code == "00") {
                window.location.href = "/pages/note/ruleRegulation.html";
            } else {
                layer_alert(response.message);
            }
        })

        return false;
    })
    form.on('submit(noteAddAgain)', function (laydata) {
        layer_load();
        var zTree = $.fn.zTree.getZTreeObj('treeDemo');
        var nodes = zTree.getCheckedNodes();
        if (nodes.length == 0) {
            layer_alert("请选择制度类别！");
            return;
        }
        var param = laydata.field;
        param.Content = encodeURIComponent($("#editor1")[0].value);
        param.TypeId = nodes[0].id;
        Serv.Post('gc/note/RuleRegulationAdd', param, function (response) {
            layer_load_lose();
            if (response.code == "00") {
                layer_confirm('添加成功，是否继续添加？', function () {
                    $("input[name='Title']").val('');
                }, backhistory);
            } else {
                layer_alert(response.message);
            }
        })
        return false;
    })

    var id = GetPara("id");
    if (id > 0) {
        layer_load();
        Serv.Get("gc/note/RuleRegulationDetail?id=" + id, {}, function (result) {
            layer_load_lose();
            if (result.succeed) {
                $("input[name='title']").val(result.data.title);
                $("input[name='id']").val(result.data.id);
                var content = decodeURIComponent(result.data.content);
                layedit.setContent(index, content, true);

                var zTree = $.fn.zTree.getZTreeObj('treeDemo');
                var nodes = zTree.getNodesByParam("id", result.data.typeId, null);
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
});

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