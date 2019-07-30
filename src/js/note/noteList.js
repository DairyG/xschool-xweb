var elemData = window.globCache.getElementData('040001', 'allHtml');
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
                if (item.isNeedRead == 1) return '是';
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
            width: 70,
            fixed: 'right'
        },
    ],
];
var parameter = {
    Title: '',
    IsRead: -1,
};

layui.use(['table', 'element', 'laydate'], function() {
    var table = layui.table,
        element = layui.element,
        form = layui.form,
        laydate = layui.laydate;

    form.on('submit(search)', function(laydata) {
        lstPager.search();
        return false;
    });

    function search() {
        parameter.CompanyId=window.globCache.getEmployee().companyId;
        parameter.DptId=window.globCache.getEmployee().dptId;
        parameter.JobId=window.globCache.getEmployee().jobId;
        parameter.UserId=window.globCache.getEmployee().userId;
        parameter.Title = $("input[name='title']").val();
        parameter.IsRead = $('.IsRead').val();
        parameter.SelectRange=1;//按权限查询数据
        return parameter;
    }

    //分页初始化
    lstPager = Pager2(
        table, //lay-ui的table控件
        '公告通知列表', //列表名称
        'lst', //绑定的列表Id
        'bar', //绑定的工具条Id
        data_col, //表头的显示行
        'gc/note/GetNotePage', //action url 只能post提交
        search,
        null, //如果在显示之前需要对数据进行整理需要实现，否则传null
        null, //有选择行才能有的操作，实现该方法,否则传null
        null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
        null,
        'full-140'
    );

    table.on('tool(lst)', function(obj) {
        var layEvent = obj.event;
        if (layEvent == 'info') {
            window.location.href = '/pages/note/noteDetail.html?NoteId=' + obj.data.id + '&UserId=' + window.globCache.getEmployee().id + '&UserName=' + window.globCache.getEmployee().employeeName + '&CompanyName=' + window.globCache.getEmployee().companyName + '&DptName=' + window.globCache.getEmployee().dptName;
        }
    });
});