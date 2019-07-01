/**
 * ZTree Radio
 * @param string nameDom 显示文本框Id，例："ztreeName"
 * @param string boxDom zTreeDom对象的父级Id，如："menuContent"
 * @param string zTreeDom zTree对象Id，如："treeDemo"
 */
function ZTreeRadio(nameDom, menuContent, zTreeDom) {
    var zTreeObj;
    var options = {
        text: 'dptName',
        key: 'id',
        parentKey: 'pid',
        nameDOM: $('#' + nameDom),
        menuContentDOM: $('#' + menuContent),
        zTreeDOM: $('#' + zTreeDom),
    };

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
            beforeClick: beforeClick,
            onCheck: onCheck
        }
    };

    //body点击事件
    function onBodyDown(event) {
        if (!(event.target.id == menuContent || $(event.target).parents('#' + menuContent).length > 0)) {
            hideZTree();
        }
    };
    //显示
    var showZTree = function () {
        var obj = options.nameDOM;
        var ztreeOffset = options.nameDOM.offset();
        options.menuContentDOM.css({
            left: ztreeOffset.left + 'px',
            top: ztreeOffset.top + obj.outerHeight() + 'px',
            width: obj.outerWidth() + 'px'
        }).slideDown('fast');

        $('body').bind('mousedown', onBodyDown);
    };
    //隐藏
    function hideZTree() {
        options.menuContentDOM.fadeOut('fast');
        $('body').unbind('mousedown', onBodyDown);
    };
    //设置初始值
    var setCheck = function () {
        var value = options.nameDOM.attr('data-id');
        var node = zTreeObj.getNodeByParam('id', value, null);
        if (node != null) {
            zTreeObj.checkNode(node, true, false);
            // zTreeObj.selectNode(node, true, false);
        }
    };

    //用于捕获radio被勾选或取消勾选的事件回调函数
    function onCheck(event, treeId, treeNode) {
        var nodes = zTreeObj.getCheckedNodes(true);
        var ids = nodes.map(function (e) {
            return e.id;
        }).join(',');
        var names = nodes.map(function (e) {
            return e.dptName
        }).join(',');

        options.nameDOM.attr('data-id', ids).val(names);
    }
    //用于捕获勾选或取消勾选之前的事件回调函数
    function beforeClick(treeId, treeNode) {
        zTreeObj.checkNode(treeNode, !treeNode.checked, null, true);
        return false;
    }
    return {
        reload: function (data) {
            zTreeObj = $.fn.zTree.init(options.zTreeDOM, setting, data);
            var nodes = zTreeObj.getNodes();
            if (nodes.length > 0) {
                zTreeObj.expandNode(nodes[0], true);
            }
        },
        showZTree: function () {
            showZTree();
        },
        setCheck: function () {
            setCheck();
        }
    }
}