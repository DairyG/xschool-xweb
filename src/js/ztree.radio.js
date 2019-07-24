/**
 * ZTree Radio
 * @param string nameDom 显示文本框Id，例："ztreeName"
 * @param string boxDom zTreeDom对象的父级Id，如："menuContent"
 * @param string zTreeDom zTree对象Id，如："treeDemo"
 * @param json option 参数
 * parameter 参数说明：
    {
        //字段自定义
        field: { 
            text: "name",
            key: "id",
            parentKey: "pid"
        },
        //数据加载方式：company=公司，dpt=部门
        dataMode: "company/dpt/mondule",
        //是否可以选择公司
        iscompany：0/1,
        isExpandAll：0/1, //是否展开全部
    }
 * @param function callBack 回调函数
 */
function ZTreeRadio(nameDom, menuContent, zTreeDom, parameter, callBack) {
    var option = {
        field: {
            text: 'dptName',
            key: 'id',
            parentKey: 'pid'
        },
        dataMode: 'dpt',
        iscompany: 0,
        isExpandAll: 0,
    }
    $.extend(true, option, parameter);

    var zTreeObj;
    var options = {
        text: option.field.text,
        key: option.field.key,
        parentKey: option.field.parentKey,
        nameDOM: $('#' + nameDom),
        menuContentDOM: $('#' + menuContent),
        zTreeDOM: $('#' + zTreeDom),
    };

    var setting = {
        view: {
            dblClickExpand: false,
        },
        view: {
            dblClickExpand: false,
        },
        data: {
            key: {
                name: options.text,
                title: options.text,
            },
            simpleData: {
                enable: true,
                idKey: options.key,
                pIdKey: options.parentKey,
                rootPId: '0',
            },
        },
        callback: {
            onClick: callBack,
            beforeClick: beforeClick
        },
    };

    //body点击事件
    function onBodyDown(event) {
        if (!(event.target.id == menuContent || $(event.target).parents('#' + menuContent).length > 0)) {
            hideZTree();
        }
    }
    //显示
    var showZTree = function() {
        var obj = options.nameDOM;
        var ztreeOffset = options.nameDOM.offset();
        options.menuContentDOM
            .css({
                left: ztreeOffset.left + 'px',
                top: ztreeOffset.top + obj.outerHeight() + 'px',
                width: obj.outerWidth() + 'px',
            })
            .slideDown('fast');

        $('body').bind('mousedown', onBodyDown);
    };
    //隐藏
    function hideZTree() {
        options.menuContentDOM.fadeOut('fast');
        $('body').unbind('mousedown', onBodyDown);
    }
    //设置初始值
    var setCheck = function(hasDefault) {
        var value = options.nameDOM.attr('data-id');
        var node = zTreeObj.getNodeByParam('id', value, null);
        if (node != null && value) {
            if (hasDefault == 1) {
                options.nameDOM.val(node[options.text]);
            }
            zTreeObj.selectNode(node, true, false);
        }
    };

    //用于捕获勾选或取消勾选之前的事件回调函数
    function beforeClick(treeId, treeNode) {
        if (option.dataMode == 'dpt' && option.iscompany == 0 && treeNode.id < 0) {
            return false;
        }
    }
    return {
        reload: function(data) {
            var array = [];
            if (option.dataMode == 'mondule') {
                array = data;
            } else {
                var companys = window.globCache.getCompany();
                if (option.dataMode == 'dpt') {
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
                } else {
                    array = companys;
                }
            }
            zTreeObj = $.fn.zTree.init(options.zTreeDOM, setting, array);
            if (option.isExpandAll == 1) {
                zTreeObj.expandAll(true);
            } else {
                var nodes = zTreeObj.getNodes();
                if (nodes.length > 0) {
                    zTreeObj.expandNode(nodes[0], true);
                }
            }
        },
        showZTree: function() {
            showZTree();
        },
        hideZTree: function() {
            hideZTree();
        },
        //设置值，hasDefault=1，此函数里面给值
        setCheck: function(hasDefault) {
            setCheck(hasDefault);
        },
        obj: function() {
            return zTreeObj;
        }
    };
}