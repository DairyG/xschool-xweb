var roleCol = [
    [{
        field: 'id',
        title: '序号',
        width: 100
    }, {
        field: 'name',
        title: '角色名称'
    }, {
        field: 'remarks',
        title: '备注'
    }, {
        field: 'displayOrder',
        title: '排序',
        width: 100
    }, {
        toolbar: '#rightBar',
        title: '操作'
    }]
];

var data = {
    role: {
        id: 0,
        name: '',
        remarks: '',
        displayOrder: 10
    }
}

var layer_linePop;
layui.use(['table', 'form'], function() {
    var table = layui.table,
        form = layui.form;

    var rolePop = $('#rolePop');
    var parameter = {
        name: ''
    };

    function search() {
        return parameter;
    }
    var lstPager = Pager(
        table, //lay-ui的table控件
        '角色管理', //列表名称
        'roleLst', //绑定的列表Id
        'toolbar', //绑定的工具条Id
        roleCol, //表头的显示行
        'gc/power/queryrole', //action url 只能post提交
        search, //获取查询条件的函数
        null, //如果在显示之前需要对数据进行整理需要实现，否则传null
        null, //有选择行才能有的操作，实现该方法,否则传null
        null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
        null,
        'full-160'
    );
    //搜索
    form.on('submit(search)', function(laydata) {
        parameter.name = laydata.field.name;

        lstPager.search();
    });
    //上方
    table.on('toolbar(roleLst)', function(obj) {
        if (obj.event == 'add') {
            window.location.href = '/pages/power/roleEdit.html';
            return false;
        }
    });
    //右边
    table.on('tool(roleLst)', function(obj) {
        datas = obj.data;
        if (obj.event == "edit") {
            window.location.href = '/pages/power/roleEdit.html?roleId=' + datas.id;
            return false;
        } else if (obj.event == 'del') {
            var ids = [];
            ids.push(datas.id);
            layer_confirm('确定删除吗？', function() {
                delRole(ids);
            });

            return false;
        }
    });

    //删除
    function delRole(ids) {
        layer_load();
        Serv.Post('gc/power/deleterole', {
            ids: ids
        }, function(result) {
            layer_load_lose();
            if (result.succeed) {
                layer_alert(result.message, function() {
                    lstPager.search();
                });
            } else {
                layer_alert(result.message);
            }
        });
    }
});