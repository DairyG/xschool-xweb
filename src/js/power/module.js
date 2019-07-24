var moduleCol = [
    [{
            type: 'checkbox',
            fixed: 'left'
        },
        {
            field: 'name',
            title: '模块名称',
            width: 120
        },
        {
            field: 'url',
            title: 'Url'
        },
        {
            field: 'icon',
            title: '图标',
            templet: function(d) {
                if (d.icon_name) {
                    return '<i class="layui-icon">' + d.icon_name + '</i>';
                } else {
                    return '';
                }
            },
            width: 60
        },
        {
            field: 'displayOrder',
            title: '排序',
            sort: true,
            width: 80
        },
        {
            fixed: 'right',
            templet: function() {
                return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="detail">查看菜单</a>';
            },
            width: 90
        }
    ]
];

layui.use(['table', 'form'], function() {
    var table = layui.table,
        form = layui.form;

    var paramModel = {
        monduleHasFirst: false,
        elementHasFirst: false,
        mondule: {
            id: ''
        },
        element: {}
    };


    function monduleSearch() {
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
        search, //获取查询条件的函数
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