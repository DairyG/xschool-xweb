var zTreeObj;
var DptJobs;
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
    dptPositions: '',
    positionsPhone: '',
    dptDeputy: '',
    deputyPhone: '',
    dptSecretary: '',
    secretaryPhone: '',
    dutiesDescription: '',
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
        model.dptPositions = response.dptPositions;
        model.positionsPhone = response.positionsPhone;
        model.dptDeputy = response.dptDeputy;
        model.deputyPhone = response.deputyPhone;
        model.dptSecretary = response.dptSecretary;
        model.secretaryPhone = response.secretaryPhone;
        model.dutiesDescription = response.dutiesDescription;
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
    model.dptPositions = dpt.dptPositions;
    model.positionsPhone = dpt.positionsPhone;
    model.dptDeputy = dpt.dptDeputy;
    model.deputyPhone = dpt.deputyPhone;
    model.dptSecretary = dpt.dptSecretary;
    model.secretaryPhone = dpt.secretaryPhone;
    model.dutiesDescription = dpt.dutiesDescription;
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
        dptPositions: '',
        positionsPhone: '',
        dptDeputy: '',
        deputyPhone: '',
        dptSecretary: '',
        secretaryPhone: '',
        dutiesDescription: '',
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
        $("#set_btn").css("display", "none");
        $("#showJobs").css("display", "none");
    });
    $("a[lay-filter='btnEdit']").click(function () {
        var zTree = $.fn.zTree.getZTreeObj('ztree');
        nodes = zTree.getSelectedNodes();
        if(nodes.length > 0){
            var node = nodes[0];
            if(node.id != 0)
            {
                GetSingle(currentid);
            }
        }
        
        $("#dptForm input").prop("disabled", false);
        $("#dptForm button").prop("disabled", false);
        $("#dptForm textarea").prop("disabled", false);
        $("#dptForm input[name='Id']").val($("input[name='NodeId']").val());
        $("#set_btn").css("display", '');
        $("#showJobs").css("display", "");
    });
});
var layform;
layui.use(['table', 'element', 'laydate', 'form', 'layer'], function () {
    var table = layui.table,
        element = layui.element,
        laydate = layui.laydate;
    layform = layui.form;

    function initTree() {
        Serv.Get('uc/department/GetByCompany/' + 1, {}, function (response) {
            zTreeObj = $.fn.zTree.init($("#ztree"), setting, response);
        })
    }
    initTree();

    table.render({
        elem: '#lst'
    });
    layform.on('submit(dptInfo)', function (laydata) {
        layer_load();
        if ($("input[name='Id']").val() == "0") {
            if (laydata.field.PId == 0) {
                laydata.field.LevelMap = "0,";
            } else {
                laydata.field.LevelMap = $("input[name='LevelMap']").val() + laydata.field.PId + ",";
            }

            Serv.Post('uc/Department/add', laydata.field, function (response) {
                if (response.code == "00") {
                    layer_confirm('添加成功，是否继续添加？', ClickAdd());
                    layer_load_lose();
                    initTree();
                } else {
                    layer_alert(response.message);
                }
            })
        } else {
            console.log(laydata.field);
            Serv.Post('uc/Department/edit', laydata.field, function (response) {
                layer_alert(response.message, initTree());
            })
        }
        return false;
    });
    layform.on('submit(dptAdd)', function (laydata) {
        layer_load();
        if ($("input[name='Id']").val() == "0") {
            Serv.Post('uc/Department/edit', laydata.field, function (response) {
                layer_alert(response.message, ClickAdd());
                initTree();
            })
        } else {
            Serv.Post('uc/Department/edit', laydata.field, function (response) {
                layer_alert(response.message, ClickAdd());
                $("input[name='Id']").val("0");
                initTree();
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

$('#set_btn').click(function () {
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
                        DptJobs.push({jobId:jobId,jobName :jobName});
                        PushJobHtml();
                        // var btnIndex = $("#showJobs").children("div").length;
                        // var showHtml = "";
                        // showHtml += '<div class="layui-form-item layui-col-md12 layui-col-sm12">';
                        // showHtml += '<label class="layui-form-label">职位' + (btnIndex + 1) + ' </label>';
                        // showHtml += '<div class="layui-input-inline">';
                        // showHtml += '<input type="tel" class="layui-input layui-disabled" id="' + jobId + '" value="' + jobName + '" readonly />';
                        // showHtml += '</div>';
                        // showHtml += '<a class="layui-btn layui-btn-danger" index="'+btnIndex+'" jobId="' + jobId + '" onclick="deleteBtn(this)">删除</a>';
                        // showHtml += '</div>';
                        // $("#showJobs").append(showHtml);
                        layer.close(index);
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
    var dptId = $("input[name='Id']").val();
    Serv.Post("uc/Department/DeleteDptJobBinding", { companyid: 1, dptId: dptId, jobId: jobId }, function (response) {
        if (response.code == "00") {
            //$(btn).parent().remove();
            DptJobs.splice($(btn).attr("index"),1);
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
        showHtml += '<div class="layui-form-item layui-col-md12 layui-col-sm12">';
        showHtml += '<label class="layui-form-label">职位' + i + ' </label>';
        showHtml += '<div class="layui-input-inline">';
        showHtml += '<input type="tel" class="layui-input layui-disabled" id="' + DptJobs[i - 1].jobId + '" value="' + DptJobs[i - 1].jobName + '" readonly />';
        showHtml += '</div>';
        showHtml += '<a class="layui-btn layui-btn-danger" index="'+(i - 1)+'" jobId="' + DptJobs[i - 1].jobId + '" onclick="deleteBtn(this)">删除</a>';
        showHtml += '</div>';
    }
    $("#showJobs").append(showHtml);
}
