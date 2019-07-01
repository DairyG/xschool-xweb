/**
 * ZTree Radio
 * @param string zTreeDom zTree对象Id，如："treeDemo"
 * @param json options 参数设置，如：{"text":"name","key":"id","parentKey":"pId"}
 * @param function callBack 回调函数
 */
function ZTreeRadio(zTreeDom, options, callBack) {
    var zTreeObj;
    var options = {
        text: options.text ? options.text : 'dptName',
        key: options.key ? options.key : 'id',
        parentKey: options.parentKey ? options.parentKey : 'pid',
        zTreeDOM: $('#' + zTreeDom),
    };

    var setting = {
        view: {
            dblClickExpand: false
        },
        data: {
            key: {
                name: options.text,
                title: options.text
            },
            simpleData: {
                enable: true,
                idKey: options.key,
                pIdKey: options.parentKey,
                rootPId: '0'
            }
        },
        callback: {
            onClick: callBack,
            onAsyncSuccess: function (event, treeId, treeNode, msg) {
                var nodes = zTree.getNodes();
                var node = nodes.length > 0 ? nodes[0] : null;
                if (node != null) {
                    zTree.expandNode(node, true, false, false);
                }

            }
        }
    };
    return {
        reload: function (data) {
            console.log(options.zTreeDOM);
            zTreeObj = $.fn.zTree.init(options.zTreeDOM, setting, data);
            var nodes = zTreeObj.getSelectedNodes();
            if (nodes.length > 0) {
                zTreeObj.expandNode(nodes[0], true, true, true);
            }
        }
    }
}