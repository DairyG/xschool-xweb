var elemData = window.globCache.getElementData('040003', 'customHtml');
$('#toolbar').html(elemData);

var zTreeObj;
var setting = {
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
        }
    }
}

var layuiform;
layui.use(['form', 'element', 'layer'], function() {
    var table = layui.table,
        layform = layui.form,
        element = layui.element;

    layform.on('submit(ruleSave)', function(laydata) {
        layer_load();
        if ($("input[name='RuleName']").val().lenth == 0) {
            layer_alert("类别名称不能为空！");
        }
        //添加时父级id不为0
        else if (laydata.field.id == 0) {
            var zTree = $.fn.zTree.getZTreeObj('ztree');
            if (laydata.field.ParentId > 0) {
                Serv.Post('gc/note/RuleRegulationTypeAdd', {
                    ParentId: laydata.field.ParentId,
                    RuleName: $("input[name='RuleName']").val()
                }, function(result) {
                    window.location.reload()
                })
            } else if (zTree != null) {
                var nodes = zTree.getSelectedNodes();
                if (nodes.length > 0) {
                    Serv.Post('gc/note/RuleRegulationTypeAdd', {
                        ParentId: nodes[0].id,
                        RuleName: $("input[name='RuleName']").val()
                    }, function(result) {
                        window.location.reload()
                    })
                } else {
                    layer_alert("请选择要添加或者修改的左侧树节点,再点添加！");
                }
            } else {
                Serv.Post('gc/note/RuleRegulationTypeAdd', {
                    ParentId: laydata.field.ParentId,
                    RuleName: $("input[name='RuleName']").val()
                }, function(result) {
                    window.location.reload()
                })
            }
        }
        //修改时id不为0
        else if (laydata.field.id > 0) {
            Serv.Post('gc/note/RuleRegulationTypeEdit', {
                Id: laydata.field.id,
                ParentId: laydata.field.ParentId,
                RuleName: $("input[name='RuleName']").val()
            }, function(result) {
                window.location.reload()
            })
        } else {
            layer_alert("请刷新页面，重试！");
        }
        layer_load_lose();
    })
})

$(function() {
    Serv.Post('gc/note/GetRuleRegulationTypeList', {}, function(result) {
        result.data[0].open = true;
        zTreeObj = $.fn.zTree.init($("#ztree"), setting, result.data);
    })
    $("a[lay-filter='add']").click(function() {
        var zTree = $.fn.zTree.getZTreeObj('ztree');
        if (zTree != null) {
            nodes = zTree.getSelectedNodes();
            if (nodes.length == 0) {
                layer_alert('请选择要添加或者修改的左侧树节点');
                return
            }
            $("input[name='RuleName']").val("");
            $("input[name='id']").val(0);
            $("input[name='ParentId']").val(nodes[0].id);
        } else {
            $("input[name='RuleName']").val("");
            $("input[name='id']").val(0);
            $("input[name='ParentId']").val(0);
        }
    })
    $("a[lay-filter='edit']").click(function() {
        var zTree = $.fn.zTree.getZTreeObj('ztree');
        nodes = zTree.getSelectedNodes();
        if (nodes.length == 0) {
            layer_alert('请选择要添加或者修改的左侧树节点');
            return
        }
        $("input[name='id']").val(nodes[0].id);
        $("input[name='ParentId']").val(nodes[0].parentId);
        $("input[name='RuleName']").val(nodes[0].ruleName);
    })
    $("a[lay-filter='delete']").click(function() {
        var zTree = $.fn.zTree.getZTreeObj('ztree');
        nodes = zTree.getSelectedNodes();
        if (nodes.length == 0) {
            layer_alert('请选择要添加或者修改的左侧树节点');
            return
        }
        if (nodes[0].isParent) {
            layer_alert("含有下级的制度不允许删除！");
        } else {
            layer_confirm('确定删除吗？', function() {
                layer_load();
                Serv.Get('gc/note/RuleRegulationTypeDel?id=' + nodes[0].id, null, function(result) {
                    if (result.succeed) {
                        layer_alert(result.message, function() {
                            window.location.reload()
                        });
                    } else {
                        layer_alert(result.message);
                    }
                });
            });
        }
    })
})