var elemData = window.globCache.getElementData('010003', 'allHtml');
$('#rightBar').html(elemData.rightHtml);

var dataCol = [
    [{
            field: 'id',
            title: '序号',
        },
        {
            field: 'companyName',
            title: '公司名称',
        },
        {
            field: 'credit',
            title: '信用代码',
        },
        {
            field: 'companyType',
            title: '公司类型',
        },
        {
            field: 'legalPerson',
            title: '法人代表',
        },
        {
            field: 'registeredCapital',
            title: '注册资本',
        },
        {
            field: 'registeredTime',
            title: '成立日期',
            templet: function(d) {
                return d.registeredTime.FormatDate(false);
            },
        },
        {
            title: '操作',
            toolbar: '#rightBar',
            width: 180,
        },
    ],
];
layui.use(['table', 'element'], function() {
    var table = layui.table,
        element = layui.element;

    function search() {}

    //操作栏的回调函数
    var onTools = function(layEvent, data) {
        var value = data.id;
        //console.log(value);
        if (layEvent === 'view') {
            window.location.href = '/pages/dpt/companyAdd.html?id=' + value + '&operation=view';
        } else if (layEvent === 'edit') {
            window.location.href = '/pages/dpt/companyAdd.html?id=' + value + '&operation=edit';
        } else if (layEvent === 'del') {
            layer_confirm('确定删除吗？', function() {
                layer_load();
                Serv.Get('uc/company/delete/' + value, {}, function(result) {
                    if (result.succeed) {
                        layer_alert(result.message, function() {
                            lstPager.refresh();
                        });
                    } else {
                        layer_alert(result.message);
                    }
                });
            });
        }
    };

    //分页初始化
    var lstPager = Pager(
        table, //lay-ui的table控件
        '公司列表', //列表名称
        'companylst', //绑定的列表Id
        '', //绑定的工具条Id
        dataCol, //表头的显示行
        'uc/company/get', //action url 只能post提交
        search, //获取查询条件的函数
        null, //如果在显示之前需要对数据进行整理需要实现，否则传null
        null, //有选择行才能有的操作，实现该方法,否则传null
        onTools, //如果有每行的操作栏的操作回调，实现该方法，否则传null
        null,
        'full-100'
    );
});