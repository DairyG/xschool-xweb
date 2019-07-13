var lstPager;

var parameter = {
    Title: '',
    IsRead:0
};
layui.use(['table', 'element', 'laydate'], function () {
    var table = layui.table,
        form=layui.form,
        element = layui.element;


    //基本信息
    form.on('submit(search)', function (laydata) {
        lstPager = Pager2(table,//lay-ui的table控件
            '通知公告列表',//列表名称
            "lst",//绑定的列表Id
            'bar',//绑定的工具条Id
            data_col,//表头的显示行
            "gc/note/GetNotePage",//action url 只能post提交
            search,
            null,//如果在显示之前需要对数据进行整理需要实现，否则传null
            null,//有选择行才能有的操作，实现该方法,否则传null
            null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
            null,
            'full-100'
        );
        return false;
    });

    function search() {
        parameter.Title = $("input[name='title']").val();
        return parameter;
    }

    //分页初始化
    lstPager = Pager2(table,//lay-ui的table控件
        '通知公告列表',//列表名称
        "lst",//绑定的列表Id
        'bar',//绑定的工具条Id
        data_col,//表头的显示行
        "gc/note/GetNotePage",//action url 只能post提交
        search,
        null,//如果在显示之前需要对数据进行整理需要实现，否则传null
        null,//有选择行才能有的操作，实现该方法,否则传null
        null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
        null,
        'full-100'
    );

    table.on('tool(lst)', function (obj) {
        var layEvent = obj.event;
        if (layEvent == "info") {
            window.location.href = "/pages/note/noteDetail.html?id=" + obj.data.id;
        }
        if (layEvent == "edit") {
            window.location.href = "/pages/note/noteAdd.html?id=" + obj.data.id;
        }
        if (layEvent == "del") {
            layer_load();
            Serv.Get("gc/note/DeleteNote?id=" + obj.data.id, {}, function (result) {
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
    table.on('toolbar(lst)', function (obj) {
        var layEvent = obj.event;
        if (layEvent == "add") {
            window.location.href = "/pages/note/noteAdd.html";
        }
    });
});