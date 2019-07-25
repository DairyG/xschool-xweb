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
            field: 'code',
            title: 'code',
            width: 120
        },
        {
            field: 'name',
            title: '模块名称',
            width: 120
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
            field: 'pName',
            title: '父节点名称',
            templet: function(d) {
                console.log(d);
                return (d.pName || '根节点');
            }
        },
        {
            field: 'url',
            title: 'Url'
        },
        {
            fixed: 'right',
            templet: function(d) {
                if (d.pid > 0) {
                    return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="lsElement">查看元素</a>';
                } else {
                    return '';
                }
            },
            width: 90
        }
    ]
];
var elementCol = [
    [{
        type: 'checkbox',
        fixed: 'left'
    }, {
        field: 'name',
        title: '名称'
    }, {
        field: 'position',
        title: '显示位置',
        templet: function(d) {
            return ['', 'Table上方', 'Table右边'][d.position];
        }
    }, {
        field: 'attr',
        title: '附加属性'
    }, {
        field: 'class',
        title: '样式',
        templet: '#elementBtnTpl',
        width: 120
    }, {
        field: 'isSystem',
        title: '默认',
        templet: function(d) {
            return ["否", "是"][d.isSystem];
        },
        width: 60
    }]
];

var data = {
    mondule: {
        id: 0,
        name: '',
        url: '',
        iconName: 'layui-icon-circle-dot',
        pId: 0,
        code: '',
        displayOrder: 10
    },
    element: {
        id: 0,
        moduleId: 0,
        name: '',
        attr: '',
        iconName: 'layui-icon-circle-dot',
        class: '',
        position: 1,
        displayOrder: 10,
    }
}

var layer_linePop, layer_resource;
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

    var modulePop = $('#modulePop'),
        elementPop = $('#elementPop');

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
    iconPicker.render({
        elem: '#elementIcon',
        type: 'fontClass',
        cellWidth: '20%',
        click: function(data) {
            $('#elementIcon').val(data.icon);
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
        dataMode: 'mondule'
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

    //操作
    $('#toolsOperation .layui-btn').on('click', function() {
        var type = $(this).data('type');
        if (type == 'btnAdd') {

            iconPicker.checkIcon('monduleIcon', data.mondule.iconName);
            ztreeInput.val('').attr('data-id', '');
            form.val('formModule', data.mondule);
            layPop('添加模块', modulePop);

            return false;
        } else if (type == 'btnEdit') {

            var checkStatus = table.checkStatus('moduleLst'),
                datas = checkStatus.data;
            if (datas.length == 0) {
                layer_alert('请勾选模块数据进行操作');
                return false;
            }
            if (datas.length > 1) {
                layer_alert('不能勾选多条模块数据进行操作');
                return false;
            }
            if (datas[0].iconName) {
                iconPicker.checkIcon('monduleIcon', datas[0].iconName);
            }
            ztreeInput.val(datas[0].pName).attr('data-id', datas[0].pid);
            form.val('formModule', datas[0]);
            layPop('编辑模块', modulePop);

            return false;
        } else if (type == 'btnDel') {

            var checkStatus = table.checkStatus('moduleLst'),
                datas = checkStatus.data;
            if (datas.length == 0) {
                layer_alert('请勾选模块数据进行操作');
                return false;
            }
            var ids = [];
            $.each(datas, function(i, item) {
                ids.push(item.id);
            });
            layer_confirm('确定删除吗？', function() {
                delElement(ids);
            });

            return false;
        } else if (type == 'btnAddMenu') {

            var checkStatus = table.checkStatus('moduleLst'),
                datas = checkStatus.data;
            if (datas.length == 0) {
                layer_alert('请勾选模块数据进行操作');
                return false;
            }
            if (datas.length > 1) {
                layer_alert('不能勾选多条模块数据进行操作');
                return false;
            }
            if (datas[0].pid <= 0) {
                layer_alert('请勿勾选模块数据根节点进行操作');
                return false;
            }
            data.element.moduleId = datas[0].id;

            iconPicker.checkIcon('elementIcon', data.element.iconName);
            form.val('formElement', data.element);
            layPop('添加元素', elementPop);

            return false;
        } else if (type == 'btnEditMenu') {

            var checkStatus = table.checkStatus('elementLst'),
                datas = checkStatus.data;
            if (datas.length == 0) {
                layer_alert('请勾选元素数据进行操作');
                return false;
            }
            if (datas.length > 1) {
                layer_alert('不能勾选多条元素数据进行操作');
                return false;
            }
            if (datas[0].iconName) {
                iconPicker.checkIcon('elementIcon', datas[0].iconName);
            }
            form.val('formElement', datas[0]);
            layPop('编辑元素', elementPop);

            return false;
        } else if (type == 'btnDelMenu') {

            var checkStatus = table.checkStatus('elementLst'),
                datas = checkStatus.data;
            if (datas.length == 0) {
                layer_alert('请勾选元素数据进行操作');
                return false;
            }
            var ids = [];
            $.each(datas, function(i, item) {
                ids.push(item.id);
            });
            layer_confirm('确定删除吗？', function() {
                delElement(ids);
            });

            return false;
        }
    });
    //删除 模块
    function delModule(ids) {
        layer_load();
        Serv.Post('gc/power/deletemodule', {
            ids: ids
        }, function(result) {
            layer_load_lose();
            if (result.succeed) {
                layer_alert(result.message, function() {
                    mondulePager.search();
                    elementPager.search();
                });
            } else {
                layer_alert(result.message);
            }
        });
    }
    //删除 元素
    function delElement(ids) {
        layer_load();
        Serv.Post('gc/power/deleteelement', {
            ids: ids
        }, function(result) {
            layer_load_lose();
            if (result.succeed) {
                layer_alert(result.message, function() {
                    elementPager.search();
                });
            } else {
                layer_alert(result.message);
            }
        });
    }

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

                    paramModel.element.moduleId = 0;
                    elementPager.search();
                });
                // layer_confirm('操作成功，确定继续？', function() {}, function() {});
            } else {
                layer_alert(result.message);
            }
        });
    });
    //元素提交
    form.on('submit(submitElement)', function(laydata) {
        layer_load();
        laydata.field.iconName = (laydata.field.iconName == 'layui-icon-circle-dot' ? '' : laydata.field.iconName);
        Serv.Post('gc/power/editelement', laydata.field, function(result) {
            layer_load_lose();
            if (result.succeed) {
                layer_alert(result.message, function() {
                    layer.closeAll();
                    paramModel.element.moduleId = laydata.field.moduleId;
                    elementPager.search();
                });
            } else {
                layer_alert(result.message);
            }
        });
    });

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

    //元素样式
    $('#elementClassLab').on('click', function() {
        layer_resource = layer.open({
            type: 1,
            title: '查询按钮样式',
            string: false,
            closeBtn: 1,
            skin: 'layui-layer-rim',
            offset: '100px',
            area: '750px',
            content: $('#resourceButPop')
        });
    });
    //点击选择
    $('.resourceBut').on('click', function() {
        $('#elementClassIpt').val($(this).attr('data-value'));
        layer.close(layer_resource);
    });

    //搜索
    $('#searchSubmit').on('click', function() {
        mondulePager.search();
    });

    function monduleSearch() {
        var value = $.trim(searchTreeObj.val());
        paramModel.mondule.pid = value || 0;
        return paramModel.mondule;
    }
    var mondulePager = Pager(
        table, //lay-ui的table控件
        '模板管理', //列表名称
        'moduleLst', //绑定的列表Id
        'moduleTpl', //绑定的工具条Id
        moduleCol, //表头的显示行
        'gc/power/querymodule', //action url 只能post提交
        monduleSearch, //获取查询条件的函数
        null, //如果在显示之前需要对数据进行整理需要实现，否则传null
        null, //有选择行才能有的操作，实现该方法,否则传null
        null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
        null,
        'full-160'
    );
    //监听table事件
    table.on('tool(moduleLst)', function(obj) {
        var data = obj.data;
        if (obj.event == 'lsElement') { //查看
            paramModel.element.moduleId = data.id;
            elementPager.search();
        }
    });

    function elementSearch() {
        return paramModel.element;
    }
    var elementPager = Pager(
        table, //lay-ui的table控件
        '菜单管理', //列表名称
        'elementLst', //绑定的列表Id
        'elementTpl', //绑定的工具条Id
        elementCol, //表头的显示行
        'gc/power/queryelement', //action url 只能post提交
        elementSearch, //获取查询条件的函数
        null, //如果在显示之前需要对数据进行整理需要实现，否则传null
        null, //有选择行才能有的操作，实现该方法,否则传null
        null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
        function() {
            // this.where = {};
            // this.where = paramModel.monthly;
        },
        'full-160'
    );

});

function closePop() {
    layer.close(layer_linePop);
}