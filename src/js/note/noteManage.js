var elemData = window.globCache.getElementData('040002', 'allHtml');
$('#upBar').html(elemData.upHtml);
$('#rightBar').html(elemData.rightHtml);

var data_col = [
    [{
            field: 'id',
            title: '序号',
            width: 60
        },
        {
            field: 'title',
            title: '标题'
        },
        {
            field: 'createDate',
            title: '发布日期',
            templet: function(item) {
                return item.createDate.FormatDate();
            },
        },
        {
            field: 'readCount',
            title: '浏览次数',
            width: 100
        },
        {
            field: 'isNeedRead',
            title: '强制阅读',
            width: 100,
            templet: function(item) {
                if (item == 1) return '是';
                else return '否';
            },
        },
        {
            field: 'people',
            title: '查看人'
        },
        {
            title: '操作',
            toolbar: '#rightBar',
            width: 160,
            fixed: 'right'
        },
    ],
];

var lstPager;
var parameter = {
    Title: '',
    IsRead: -1
};
layui.use(['table', 'element', 'laydate'], function() {
    var table = layui.table,
        form = layui.form,
        element = layui.element;


    //基本信息
    form.on('submit(search)', function(laydata) {
        lstPager = Pager2(table, //lay-ui的table控件
            '通知公告列表', //列表名称
            "lst", //绑定的列表Id
            'bar', //绑定的工具条Id
            data_col, //表头的显示行
            "gc/note/GetNotePage", //action url 只能post提交
            search,
            null, //如果在显示之前需要对数据进行整理需要实现，否则传null
            null, //有选择行才能有的操作，实现该方法,否则传null
            null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
            null,
            'full-100'
        );
        return false;
    });

    function search() {
        parameter.Title = $("input[name='title']").val();
        parameter.IsRead = -1;
        return parameter;
    }

    //分页初始化
    lstPager = Pager2(table, //lay-ui的table控件
        '通知公告列表', //列表名称
        "lst", //绑定的列表Id
        'upBar', //绑定的工具条Id
        data_col, //表头的显示行
        "gc/note/GetNotePage", //action url 只能post提交
        search,
        null, //如果在显示之前需要对数据进行整理需要实现，否则传null
        null, //有选择行才能有的操作，实现该方法,否则传null
        null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
        null,
        'full-100'
    );

    table.on('tool(lst)', function(obj) {
        var layEvent = obj.event;
        if (layEvent == "info") {
            window.location.href = "/pages/note/noteDetail.html?NoteId=" + obj.data.id + "&UserId=" + window.globCache.getEmployee().id +
                "&UserName=" + window.globCache.getEmployee().employeeName + "&CompanyName=" + window.globCache.getEmployee().companyName + "&DptName=" + window.globCache.getEmployee().dptName;
        }
        if (layEvent == "edit") {
            window.location.href = "/pages/note/noteAdd.html?id=" + obj.data.id;
        }
        if (layEvent == "del") {
            layer_confirm('确定删除吗？', function() {
                layer_load();
                Serv.Get("gc/note/DeleteNote?id=" + obj.data.id, {}, function(result) {
                    if (result.succeed) {
                        layer_alert(result.message, function() {
                            lstPager.search();
                        });
                    } else {
                        layer_alert(result.message);
                    }
                });
            });
        }
    });
    table.on('toolbar(lst)', function(obj) {
        var layEvent = obj.event;
        if (layEvent == "add") {
            window.location.href = "/pages/note/noteAdd.html";
        }
    });
});