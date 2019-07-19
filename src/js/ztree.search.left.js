/**
 * ZTree Radio
 * @param string zTreeDom zTree对象Id，如："treeDemo"
 * @param json option 参数设置，如：{"text":"name","key":"id","parentKey":"pId"}
 * @param function callBack 回调函数
 */
function ZTreeRadio(zTreeDom, option, callBack) {
    var zTreeObj;
    var options = {
        text: option.text ? option.text : 'dptName',
        key: option.key ? option.key : 'id',
        parentKey: option.parentKey ? option.parentKey : 'pid',
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
            onAsyncSuccess: function(event, treeId, treeNode, msg) {
                var nodes = zTree.getNodes();
                var node = nodes.length > 0 ? nodes[0] : null;
                if (node != null) {
                    zTree.expandNode(node, true, false, false);
                }
            }
        }
    };
    return {
        reload: function(data) {
            var companys = window.globCache.getCompany();
            var dpts = window.globCache.getDepartment();
            var array = $.map(companys, function(item) {
                return {
                    id: item.id * -1,
                    dptName: item.companyName,
                    companyId: item.id,
                    pid: 0,
                    open: true
                };
            });
            var dptArray = $.map(dpts, function(item) {
                if (item.pid == 0) {
                    item.pid = item.companyId * -1;
                    return item;
                }
                return item;
            });
            $.each(dptArray, function(index, item) {
                array.push(item);
            });

            zTreeObj = $.fn.zTree.init(options.zTreeDOM, setting, array);
            var nodes = zTreeObj.getNodes();
            if (nodes.length > 0) {
                zTreeObj.expandNode(nodes[0], true);
            }
        },
        obj: function() {
            return zTreeObj;
        }
    }
}