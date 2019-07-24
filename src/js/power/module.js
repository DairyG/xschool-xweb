var moduleCol = [
    [{
            type: 'checkbox',
            fixed: 'left'
        },
        {
            field: 'id',
            title: '序号',
            width: 60
        },
        {
            field: 'pid',
            title: 'pId',
            width: 60
        },
        {
            field: 'name',
            title: '模块名称',
            width: 160
        },
        {
            field: 'url',
            title: 'Url'
        },
        {
            field: 'icon',
            title: '图标',
            templet: function(d) {
                if (d.iconName) {
                    return '<i class="layui-icon ' + d.iconName + '"></i>';
                } else {
                    return '';
                }
            },
            width: 60
        },
        {
            field: 'displayOrder',
            title: '排序',
            width: 80
        },
        {
            fixed: 'right',
            templet: function() {
                return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="lsElement">查看菜单</a>';
            },
            width: 90
        }
    ]
];

var data = {
    mondule: {
        id: 0,
        name: '',
        url: '',
        iconName: 'layui-icon-circle-dot',
        pId: 0,
        displayOrder: 10
    }
}

var layer_linePop;
layui.use(['table', 'form', 'iconPicker', 'treeSelect'], function() {
    var table = layui.table,
        form = layui.form,
        iconPicker = layui.iconPicker,
        treeSelect = layui.treeSelect;

    var paramModel = {
        monduleHasFirst: false,
        elementHasFirst: false,
        mondule: {
            pid: 0
        },
        element: {
            moduleId: 0,
        }
    };

    var modulePop = $('#modulePop');

    iconPicker.render({
        // 选择器，推荐使用input
        elem: '#monduleIcon',
        type: 'fontClass',
        // 每个图标格子的宽度：'43px'或'20%'
        cellWidth: '20%',
        // 点击回调
        click: function(data) {
            $('#monduleIcon').val(data.icon);
        }
    });

    var searchTreeObj = $('#searchTree');

    var ztreeInput = $('#pName');
    var zTreeRadio = new ZTreeRadio('pName', 'treeContent', 'treeUl', {
        field: {
            text: 'name',
            key: 'id',
            parentKey: 'pid'
        },
        dataMode: 'mondule',
        isExpandAll: 1
    }, function(event, treeId, treeNode) {
        ztreeInput.prev().val(treeNode.id);
        ztreeInput.val(treeNode.name).attr('data-id', treeNode.id);
        zTreeRadio.hideZTree();
    });
    ztreeInput.on('click', function() {
        layer_load();
        Serv.Post('gc/power/querymodulesbytree', {
            mode: 3
        }, function(result) {
            layer_load_lose();
            zTreeRadio.reload(result);
            zTreeRadio.setCheck();
            zTreeRadio.showZTree();
        });
    });

    //操作时间
    $('#toolsOperation .layui-btn').on('click', function() {
        var type = $(this).data('type');
        var checkStatus = table.checkStatus('moduleLst'),
            datas = checkStatus.data;
        if (type == 'btnAdd') {
            iconPicker.checkIcon('monduleIcon', data.mondule.iconName);
            form.val('formModule', data.mondule);
            layPop('添加模块', modulePop);
            return false;
        } else if (type == 'btnEdit') {
            if (datas.length == 0) {
                layer_alert('勾选对应的数据进行操作');
                return false;
            }
            if (datas.length > 1) {
                layer_alert('不能勾选多条数据进行操作');
                return false;
            }
            if (datas[0].iconName) {
                iconPicker.checkIcon('monduleIcon', datas[0].iconName);
            }
            ztreeInput.attr('data-id', datas[0].pid);
            form.val('formModule', datas[0]);
            loadParentModule();
            layPop('编辑模块', modulePop);
            return false;
        } else if (type == 'btnDel') {
            active.btnDel();
            return false;
        } else if (type == 'btnAddMenu') {
            activeMenu.btnAdd();
            return false;
        } else if (type == 'btnEditMenu') {
            activeMenu.btnEdit();
            return false;
        } else if (type == 'btnDelMenu') {
            activeMenu.btnDel();
            return false;
        }
    });

    //模板提交
    form.on('submit(submitModule)', function(laydata) {
        layer_load();
        laydata.field.pid = laydata.field.pid || 0;
        laydata.field.iconName = (laydata.field.iconName == 'layui-icon-circle-dot' ? '' : laydata.field.iconName);
        Serv.Post('gc/power/editmodule', laydata.field, function(result) {
            layer_load_lose();
            if (result.succeed) {
                layer_alert(result.message, function() {
                    layer.closeAll();
                    loadSearchTree();
                    mondulePager.search();
                });
                // layer_confirm('操作成功，确定继续？', function() {}, function() {});
            } else {
                layer_alert(result.message);
            }
        });
    });

    //加载所属模块数据
    function loadParentModule() {
        var moduleData = window.globCache.getModule();
        moduleData.push({
            id: 0,
            name: '根节点',
            pid: 0,
            displayOrder: -99999
        });
        zTreeRadio.reload(moduleData);
        zTreeRadio.setCheck(1);
    };

    //弹窗
    function layPop(title, obj) {
        layer_linePop = layer.open({
            type: 1,
            title: title,
            string: false,
            closeBtn: 1,
            skin: 'layui-layer-rim',
            offset: '100px',
            area: '750px',
            content: obj
        });
    }

    loadSearchTree();

    //加载搜索栏树
    function loadSearchTree() {
        //销毁
        treeSelect.destroy('searchTree');
        //搜索下拉树
        treeSelect.render({
            // 选择器
            elem: '#searchTree',
            // 数据
            url: 'gc/power/querymodulesbytree',
            // 异步加载方式：get/post，默认get
            type: 'post',
            //参数
            args: {
                mode: 2
            },
            //input 高度
            height: 30,
            //占位符
            placeholder: '模块筛选',
            //点击回调
            click: function(d) {
                searchTreeObj.val(d.current.id);
            },
            success: function(d) {
                var value = searchTreeObj.val();
                if (value.toString().IsNum()) {
                    treeSelect.checkNode('searchTree', value);
                }
            }
        });
    }

    //搜索
    $('#searchSubmit').on('click', function() {
        mondulePager.search();
    });

    function monduleSearch() {
        var value = $.trim(searchTreeObj.val());
        paramModel.mondule.pid = value || 0;
        return paramModel.mondule;
    }

    function elementSearch() {
        return paramModel.element;
    }

    var mondulePager = Pager(
        table, //lay-ui的table控件
        '模板管理', //列表名称
        'moduleLst', //绑定的列表Id
        '', //绑定的工具条Id
        moduleCol, //表头的显示行
        'gc/power/querymodule', //action url 只能post提交
        monduleSearch, //获取查询条件的函数
        null, //如果在显示之前需要对数据进行整理需要实现，否则传null
        null, //有选择行才能有的操作，实现该方法,否则传null
        null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
        function() {
            // this.where = {};
            // this.where = paramModel.monthly;
        },
        'full-160'
    );

    // var elementPager = Pager(
    //     table, //lay-ui的table控件
    //     '模板元素管理', //列表名称
    //     'moduleLst', //绑定的列表Id
    //     '', //绑定的工具条Id
    //     moduleCol, //表头的显示行
    //     'gc/kpievaluation/querymanage', //action url 只能post提交
    //     search, //获取查询条件的函数
    //     null, //如果在显示之前需要对数据进行整理需要实现，否则传null
    //     null, //有选择行才能有的操作，实现该方法,否则传null
    //     null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
    //     function() {
    //         // this.where = {};
    //         // this.where = paramModel.monthly;
    //     },
    //     'full-160'
    // );

});

function closePop() {
    layer.close(layer_linePop);
}