
var zTreeObj;

var setting = {
    view: {
        dblClickExpand: false
    },
    data: {
        key: { name: 'dptName', title: 'dptName' }
        , simpleData: {
            enable: true
            , idKey: 'id'
            , pIdKey: 'higherLevel'
            , rootPId: '0'
        }
    },
    callback: {
        onClick: function (e, treeId, treeNode) {
            var tree = $.fn.zTree.getZTreeObj(treeId);
            tree.expandNode(treeNode);
            tnode = treeNode;
            currentid = treeNode.id;
            $('input[name="NodeId"]').val(currentid);
            GetSingle(currentid);

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
    belongCompany: '',
    higherLevel: '0'
    , dptName: ''
    , dptCode: ''
    , dptPositions: ''
    , positionsPhone: ''
    , dptDeputy: ''
    , deputyPhone: ''
    , dptSecretary: ''
    , secretaryPhone: ''
    , dutiesDescription: ''
    , dptStatus: ''
    , levelMap: ''
};
var vm = new Vue({ el: '#dptForm', data: model });
function GetSingle(Id) {
    Serv.Post('Department/GetSingle', { Id: Id }, function (response) {
        model.id = response.id;
        model.belongCompany = response.belongCompany;
        model.higherLevel = response.higherLevel;
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
        vm.$set({ data: model });
    })
}
function ClearModel(dpt) {
    model.id = dpt.id;
    model.belongCompany = dpt.belongCompany;
    model.higherLevel = dpt.higherLevel;
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
    vm.$set({ data: model });
}
function ClickAdd() {
    var dpt = {
        id: 0,
        belongCompany: 1,
        higherLevel: $("input[name='NodeId']").val(),
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
    });
    $("a[lay-filter='btnEdit']").click(function () {
        $("input[name='Id']").val($("input[name='NodeId']").val());
    });
});
layui.use(['table', 'element', 'laydate', 'form'], function () {
    var table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        layform = layui.form;

    function initTree() {
        Serv.Get('department/gettree', {}, function (response) {
            zTreeObj = $.fn.zTree.init($("#ztree"), setting, response.data);
        })
    }

    initTree();

    table.render({
        elem: '#lst'
    });
    layform.on('submit(dptInfo)', function (laydata) {
        layer_load();
        if ($("input[name='Id']").val() == "0") {
            console.log(laydata.field.HigherLevel);
            laydata.field.LevelMap = $("input[name='LevelMap']").val() + laydata.field.HigherLevel + ",";
            Serv.Post('Department/add', laydata.field, function (response) {
                layer_confirm('添加成功，是否继续添加？', ClickAdd());
                layer_load_lose();
                initTree();
            })
        } else {
            Serv.Post('Department/update', laydata.field, function (response) {
                layer_alert(response.message, initTree());
            })
        }
        return false;
    });
    layform.on('submit(dptAdd)', function (laydata) {
        layer_load();
        if ($("input[name='Id']").val() == "0") {
            Serv.Post('Department/add', laydata.field, function (response) {
                layer_alert(response.message, ClickAdd());
                initTree();
            })
        } else {
            Serv.Post('Department/update', laydata.field, function (response) {
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
        }
        else {
            laydata.field.DptStatus = 0;
            Serv.Post('Department/update', laydata.field, function (response) {
                layer_alert(response.message, function () { window.location.reload() });
            })
        }

    });
});
