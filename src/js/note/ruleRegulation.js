var zTreeObj;
var lstPager;

var setting = {
    view: {
        dblClickExpand: false
    },
    data: {
        key: {
            name: 'ruleName',
            title: 'ruleName'
        },
        simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'parentId',
            rootPId: '0'
        }
    }
}


var data_col = [[
    { type: 'id', title: '序号', templet: function (item) { return item.id; } },
    { field: 'title', title: '标题' },
    {
        field: 'createDate', title: '发布日期', templet: function (item) {
            return item.createDate.FormatDate();
        }
    },
    { field: 'TypeName', title: '制度类别' },
    { title: '操作', toolbar: '#toolbar', width: 180, fixed: 'right' }
]];
var parameter = {
    Title: '',
    TypeId:-1
};
layui.use(['form', 'element', 'layer', 'table'], function () {
    var table = layui.table,
        layform = layui.form,
        element = layui.element;

    Serv.Post('gc/note/GetRuleRegulationTypeList', {}, function (result) {
        result.data[0].open = true;
        zTreeObj = $.fn.zTree.init($("#ztree"), setting, result.data);
    })

    //基本信息
    layform.on('submit(search)', function (laydata) {
        //分页初始化
        var lstPager = Pager(table, //lay-ui的table控件
            "公司制度列表", //列表名称
            "lst", //绑定的列表Id
            "", //绑定的工具条Id
            data_col, //表头的显示行
            "gc/note/GetRuleRegulationPage",//action url 只能post提交
            search, //获取查询条件的函数
            null, //如果在显示之前需要对数据进行整理需要实现，否则传null
            null, //有选择行才能有的操作，实现该方法,否则传null
            null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
            null,
            'full-100'
        );
        return false;
    });

    var search= function() {
        parameter.Title = $("input[name='title']").val();
        parameter.TypeId = -1;

        var zTree = $.fn.zTree.getZTreeObj('ztree');
        if(zTree!=null)
        {
            var nodes = zTree.getSelectedNodes();
            if (nodes.length > 0)
                parameter.TypeId = nodes[0].id;
        }
        return parameter;
    };
    //分页初始化
    lstPager = Pager(table,//lay-ui的table控件
        '公司制度列表',//列表名称
        "lst",//绑定的列表Id
        'bar',//绑定的工具条Id
        data_col,//表头的显示行
        "gc/note/GetRuleRegulationPage",//action url 只能post提交
        search,
        null,//如果在显示之前需要对数据进行整理需要实现，否则传null
        null,//有选择行才能有的操作，实现该方法,否则传null
        null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
        null,
        'full-100'
    );

    table.on('toolbar(lst)', function (obj) {
        var layEvent = obj.event;
        if (layEvent == "add") {
            window.location.href = "/pages/note/ruleRegulationAdd.html";
        }
    });
    table.on('tool(lst)', function (obj) {
        var layEvent = obj.event;
        if(layEvent=="info"){
            window.location.href = "/pages/note/ruleRegulationDetail.html?id="+obj.data.id;
        }
        if (layEvent == "del") {
            layer_load();
            Serv.Get("gc/note/RuleRegulationDel?id=" + obj.data.id, {}, function (result) {
                layer_load_lose();
                if (result.succeed) {
                    lstPager.refresh();
                }
                else {
                    layer_alter("未获取到相应数据！");
                }
            })
        }
    });
})
