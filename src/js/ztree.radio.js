/**
 * ZTree Radio
 * @param string nameDom 显示文本框Id，例："ztreeName"
 * @param string boxDom zTreeDom对象的父级Id，如："menuContent"
 * @param string zTreeDom zTree对象Id，如："treeDemo"
 * @param json option 参数设置，如：{"text":"name","key":"id","parentKey":"pId"}
 * @param string iscompany 是否可以选择公司，1-是，0-否
 * @param function callBack 回调函数
 */
function ZTreeRadio(nameDom, menuContent, zTreeDom, option, iscompany, callBack) {
    var zTreeObj;
    var options = {
        text: option.text || 'dptName',
        key: option.key || 'id',
        parentKey: option.parentKey || 'pid',
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
    var setCheck = function() {
        var value = options.nameDOM.attr('data-id');
        var node = zTreeObj.getNodeByParam('id', value, null);
        if (node != null) {
            zTreeObj.selectNode(node, true, false);
        }
    };

    //用于捕获勾选或取消勾选之前的事件回调函数
    function beforeClick(treeId, treeNode) {
        if (iscompany == 0 && treeNode.id < 0) {
            return false;
        }
    }
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
        showZTree: function() {
            showZTree();
        },
        setCheck: function() {
            setCheck();
        },
    };
}