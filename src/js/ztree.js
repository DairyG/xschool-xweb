
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
            , pIdKey: 'pid'
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
function initTree() {
    Serv.Get('uc/department/GetByCompany/' + 1, {}, function (response) {
        zTreeObj = $.fn.zTree.init($("#ztree"), setting, response);
    })
}

initTree();
