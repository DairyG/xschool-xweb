var dataCol = [
    [{
            field: 'id',
            title: '序号',
        },
        {
            field: 'dptName',
            title: '部门',
            templet: function(d) {
                return $.map(d.bindings, function(item) {
                    return item.dptName;
                }).join('|');
            },
            minWidth: 80
        },
        {
            field: 'jobName',
            title: '职位',
            width: 80,
            templet: function(d) {
                return $.map(d.bindings, function(item) {
                    return item.jobName;
                }).join('|');
            },
        },
        {
            field: 'userName',
            title: '姓名',
            templet: function(d) {
                return '<a class="text-add" href="/pages/person/personDetails.html?id=' + d.id + '">' + d.userName + '</a>';
            },
            width: 80,
        },
        {
            field: 'status',
            title: '状态',
            templet: function(d) {
                return ['未入职', '试用', '转正', '离职'][d.status];
            },
            width: 100,
        },
        {
            field: 'isOpenAccount',
            title: '开通账户',
            templet: function(d) {
                return d.isOpenAccount ? '<span class="text-span">已开通</span>' : '<span class="text-del">未开通</span>';
            },
            width: 120,
        },
        {
            field: 'employeeNo',
            title: '工号',
        },
        {
            field: 'roles',
            title: '角色',
        },
        {
            field: 'gender',
            title: '性别',
            width: 60,
            templet: function(d) {
                return ['', '男', '女'][d.gender];
            },
        },
        {
            field: 'linkPhone',
            title: '电话',
            width: 120,
        },
        {
            field: 'officePhone',
            title: '办公电话',
            width: 120,
        },
        {
            title: '操作',
            toolbar: '#toolbar',
            minWidth: 170,
        },
    ],
];

var parameter = {
    companyId: '',
    dptId: '',
};

var lstPager;
layui.use(['table'], function() {
    var table = layui.table;
    var dptZTree = new ZTreeRadio('dptTree', {}, function(event, treeId, treeNode) {
        parameter.companyId = treeNode.companyId;
        parameter.dptId = '';
        if (treeNode.id > 0) {
            parameter.dptId = treeNode.id;
        }
        lstPager.search();
    });
    dptZTree.reload();
    var dptZTreeObj = dptZTree.obj();
    var nodes = dptZTreeObj.getNodes();
    if (nodes.length > 0) {
        parameter.companyId = nodes[0].companyId;
        dptZTreeObj.selectNode(nodes[0]);
    }

    function search() {
        return parameter;
    }
    //分页初始化
    lstPager = Pager(
        table, //lay-ui的table控件
        '员工列表', //列表名称
        'lst', //绑定的列表Id
        '', //绑定的工具条Id
        dataCol, //表头的显示行
        'uc/employee/get', //action url 只能post提交
        search, //获取查询条件的函数
        null, //如果在显示之前需要对数据进行整理需要实现，否则传null
        null, //有选择行才能有的操作，实现该方法,否则传null
        null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
        null,
        'full-100'
    );
});