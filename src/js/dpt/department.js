var zTreeObj;
var DptJobs;
var currentid = 0;

var setting = {
    view: {
        dblClickExpand: false
    },
    data: {
        key: {
            name: 'dptName',
            title: 'dptName'
        },
        simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid',
            rootPId: '0'
        }
    },
    callback: {
        onClick: function (e, treeId, treeNode) {
            //商家
            if (treeNode.level == 0) {
                currentid = 0;
                $('input[name="NodeId"]').val(0);
                ClickAdd();
            }
            //不是商家
            else if (treeNode.pid < 0 || treeNode.pid > 0) {
                var tree = $.fn.zTree.getZTreeObj(treeId);
                tree.expandNode(treeNode);
                tnode = treeNode;
                currentid = treeNode.id;
                $('input[name="NodeId"]').val(currentid);
                $("#dptForm input").prop("disabled", true);
                $("#dptForm button").prop("disabled", true);
                $("#dptForm textarea").prop("disabled", true);
                $('#dptForm input[name="NodeId"]').val(currentid);
                GetSingle(currentid);
                layform.render('radio');
            }
        },
        onAsyncSuccess: function (event, treeId, treeNode, msg) {
            var nodes = zTree.getNodes();
            var node = nodes.length > 0 ? nodes[0] : null;
            //onsole.log(node);
            if (node != null) {
                zTree.expandNode(node, true, false, false);
            }

        }
    }
}; // zTree 的参数配置，后面详解
$(document).ready(function () {
    //zTreeObj = $.fn.zTree.init($("#ztree"), setting, zNodes);
})

var model = {
    id: '',
    companyId: '',
    pId: '0',
    dptName: '',
    dptCode: '',
    description: '',
    dptStatus: '',
    levelMap: ''
};
var vm = new Vue({
    el: '#dptForm',
    data: model
});

function GetSingle(Id) {
    Serv.Post('uc/Department/GetSingle', {
        Id: Id
    }, function (response) {
        model.id = response.id;
        model.companyId = response.companyId;
        model.pId = response.pid;
        model.dptName = response.dptName;
        model.dptCode = response.dptCode;
        model.description = response.description;
        model.dptStatus = response.dptStatus;
        model.levelMap = response.levelMap;
        DptJobs = response.bindings;
        PushJobHtml();
        vm.$set({
            data: model
        });
    })
}

function ClearModel(dpt) {
    model.id = dpt.id;
    model.companyId = dpt.companyId;
    model.pId = dpt.pId;
    model.dptName = dpt.dptName;
    model.dptCode = dpt.dptCode;
    model.description = dpt.description;
    model.dptStatus = dpt.dptStatus;
    vm.$set({
        data: model
    });
}

function ClickAdd() {
    var dpt = {
        id: 0,
        companyId: 1,
        pId: $("input[name='NodeId']").val(),
        dptName: '',
        dptCode: '',
        description: '',
        dptStatus: 1
    };
    ClearModel(dpt);
}
$(function () {
    $("a[lay-filter='btnAdd']").click(function () {
        ClickAdd();
        $("#dptForm input").prop("disabled", false);
        $("#dptForm button").prop("disabled", false);
        $("#dptForm textarea").prop("disabled", false);
        $("#firstAddJob").css("display", "none");
        $("#firstJobDiv").css("display", "none");
    });
    $("a[lay-filter='btnEdit']").click(function () {
        var zTree = $.fn.zTree.getZTreeObj('ztree');
        nodes = zTree.getSelectedNodes();
        if (nodes.length > 0) {
            var node = nodes[0];
            if (node.id != 0) {
                GetSingle(currentid);
            }
        }

        $("#dptForm input").prop("disabled", false);
        $("#dptForm button").prop("disabled", false);
        $("#dptForm textarea").prop("disabled", false);
        $("#dptForm input[name='Id']").val($("input[name='NodeId']").val());
        $("#firstAddJob").css("display", '');
        $("#firstJobDiv").css("display", "");
    });
});
var layform;
layui.use(['table', 'element', 'laydate', 'form', 'layer'], function () {
    var table = layui.table,
        element = layui.element,
        laydate = layui.laydate;
    layform = layui.form;

    var companys = window.globCache.getCompany();
    var dpts = window.globCache.getDepartment();

    var array = $.map(companys, function (item) { return { id: item.id * -1, dptName: item.companyName, companyId: item.id, pid: 0, open: true }; });
    var dptArray = $.map(dpts, function (item) {
        if (item.pid == 0) {
            item.pid = item.companyId * -1;
            return item;
        }
        return item;
    });
    $.each(dptArray, function (index, item) {
        array.push(item);
    });

    zTreeObj = $.fn.zTree.init($("#ztree"), setting, array);
    function initTree() {
        // Serv.Get('uc/department/GetByCompany/' + 1, {}, function (response) {
        //     zTreeObj = $.fn.zTree.init($("#ztree"), setting, response);
        // })
        Serv.Get('uc/department/query', {}, window.globCache.setDepartment);
    }
    initTree();

    table.render({
        elem: '#lst'
    });
    layform.on('submit(dptInfo)', function (laydata) {
        layer_load();

        if (laydata.field.Id == "0" || laydata.field.Id == "") {
            var nodes = zTreeObj.getSelectedNodes();
            console.log(nodes);
            if (nodes.length == 0) {
                layer_alert('请选择要添加部门的公司或者父级部门');
                return false;
            }
            laydata.field.CompanyId = nodes[0].companyId;
            if (parseInt(laydata.field.PId) <= 0) {
                laydata.field.LevelMap = "0,";
            } else if (parseInt(laydata.field.PId) > 0) {
                laydata.field.LevelMap = $("input[name='LevelMap']").val() + laydata.field.PId + ",";
            }
            Serv.Post('uc/Department/add', laydata.field, function (response) {
                if (response.code == "00") {
                    laydata.field.id = response.data;
                    laydata.field.dptName = laydata.field.DptName;
                    zTreeObj.addNodes(nodes[0], -1, laydata.field);

                    dpts.push({
                        id:response.data,
                        companyId:laydata.field.CompanyId,
                        pid:(laydata.field.PId == 0 ? parseInt(laydata.field.CompanyId) * -1 : laydata.field.PId),
                        dptName:laydata.field.DptName,
                        dptStatus:1,
                        levelMap:laydata.field.LevelMap,
                        description:laydata.field.Description,
                        dptCode : laydata.field.DptCode
                    });
                    window.globCache.setDepartment(dpts);
                    layer_confirm('添加成功，是否继续添加？', ClickAdd());
                    layer_load_lose();
                    initTree();
                } else {
                    layer_alert(response.message);
                }
            })
        } else {
            Serv.Post('uc/Department/edit', laydata.field, function (response) {
                var array = $.grep(dpts, function (i, n) {
                    if (n.id == laydata.field.id) {
                        return laydata.field;
                    }
                    return n;
                });
                var nodes = zTreeObj.getSelectedNodes();
                nodes[0].dptName = laydata.field.DptName;
                zTreeObj.updateNode(nodes[0]);
                window.globCache.setDepartment(array);
                layer_alert(response.message, initTree());
            })
        }
        return false;
    });
    layform.on('submit(dptAdd)', function (laydata) {
        layer_load();
        console.log(laydata);
        if ($("input[name='Id']").val() == "0") {
            Serv.Post('uc/Department/edit', laydata.field, function (response) {
                layer_alert(response.message, ClickAdd());
                //initTree();
            })
        } else {
            Serv.Post('uc/Department/edit', laydata.field, function (response) {
                layer_alert(response.message, ClickAdd());
                $("input[name='Id']").val("0");
                //initTree();
            })
        }
        return false;
    });
    layform.on('submit(btnDel)', function (laydata) {
        var zTree = $.fn.zTree.getZTreeObj('ztree');
        nodes = zTree.getSelectedNodes();
        var node = nodes[0];
        if (node.isParent) {
            //判断后做操作
            layer_alert("该部门含有下级，无法删除！");
        } else {
            //console.log(laydata.field.Id);
            //laydata.field.dptStatus = 0;
            Serv.Get('uc/Department/Delete/' + laydata.field.Id, null, function (response) {
                layer_alert(response.message, function () {
                    window.location.reload()
                });
            })
        }
    });

    Serv.Post("uc/Job/Get", { page: 1, limit: 50, companyId: 1 }, function (response) {
        if (response.totalCount > 0) {
            var jobs = response.items;
            var divhtml = "";
            $.each(jobs, function (i, job) {
                divhtml += '<input type="radio" name="pos[]" value="' + job.id + '" title="' + job.name + '" lay-skin="primary">';
            });
            $("#divJobs").append(divhtml);
            layform.render("radio");
        }
    }, false);
});

$('.set_btn').click(function () {
    layer_linePop = layer.open({
        type: 1,
        title: '设置领导职位',
        String: false,
        closeBtn: 1,
        btn: ['确定', '取消'],
        skin: 'layui-layer-rim',
        area: ['500px', '220px'],
        content: $('#linePopPostion'),
        yes: function (index) {
            var jobId = $("input[name='pos[]']:checked").val();
            var jobName = $("input[name='pos[]']:checked").attr("title");
            var dptId = $("input[name='Id']").val();
            if (dptId > 0) {

                Serv.Post("uc/Department/AddDptJobBinding", { Id: 0, CompanyId: 1, DptId: dptId, JobId: jobId }, function (response) {
                    if (response.code == "00") {
                        DptJobs.push({ jobId: jobId, jobName: jobName, employees: [] });
                        PushJobHtml();
                        layer.close(index);
                        layer_alert(response.message);
                    } else {
                        layer_alert(response.message);
                    }
                });
            } else {
                layer_alert("请选择要操作的部门！");
            }
        }
    });
});

function deleteBtn(btn) {
    var jobId = $(btn).attr("jobId");
    var empId = $(btn).attr("epId");
    var dptId = $("input[name='Id']").val();
    Serv.Post("uc/Department/DeleteDptJobBinding", { companyid: 1, dptId: dptId, jobId: jobId, employeeId: empId }, function (response) {
        if (response.code == "00") {
            //$(btn).parent().remove();
            DptJobs.splice($(btn).attr("index"), 1);
            PushJobHtml();
        }
        else {
            layer_alert(response.message);
        }
    });

}

function PushJobHtml() {
    $("#showJobs").empty();
    var showHtml = "";
    for (var i = 1; i <= DptJobs.length; i++) {
        showHtml += '<li>';
        showHtml += '<p class="p1">' + DptJobs[i - 1].jobName + '</p>';
        var Employees = DptJobs[i - 1].employees;
        var epmId = 0;
        if (Employees.length > 0) {
            epmId = Employees[0].id;
            showHtml += '<p class="p2">' + Employees[0].name + '</p>';
            showHtml += '<p class="p3">' + Employees[0].linkPhone + '</p>';
        };
        showHtml += '<i class="layui-icon layui-icon-close-fill del" index="' + (i - 1) + '" epId="' + epmId + '" jobId="' + DptJobs[i - 1].jobId + '" onclick="deleteBtn(this)"></i>';
        showHtml += '</li>';
        showHtml += '<li class="add_li">';
        showHtml += '</li>';
    }
    if (DptJobs.length > 0) {
        $("#firstAddJob").css("display", "none");
        $("#firstJobDiv").css("display", "");
    }
    else {
        $("#firstAddJob").css("display", "");
        $("#firstJobDiv").css("display", "none");
    }
    $("#showJobs").append(showHtml);
}
