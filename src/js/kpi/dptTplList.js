var dataCol = [
    [{
            field: 'id',
            title: '序号',
        },
        {
            field: 'dptName',
            title: '部门',
            minWidth: '80'
        },
        {
            'field': 'monthly',
            'title': '月度',
            templet: function(d) {
                if (d.monthly > 0) {
                    var urlParam = setUrlParam(0, 1, 1, d.companyId, d.companyName, d.dptId, d.dptName, d.employeeId, d.userName, d.monthly);
                    return '<a href="/pages/kpi/dptTplSet.html?para=' + encodeURIComponent(encodeURIComponent(urlParam)) + '" class="text-add">修改</a>';
                } else {
                    var urlParam = setUrlParam(0, 1, 1, d.companyId, d.companyName, d.dptId, d.dptName, d.employeeId, d.userName);
                    return '<a href="/pages/kpi/dptTplSet.html?para=' + encodeURIComponent(encodeURIComponent(urlParam)) + '" class="text-edit">设置</a>';
                }
            }
        },
        {
            'field': 'quarter',
            'title': '季度',
            templet: function(d) {
                if (d.quarter > 0) {
                    var urlParam = setUrlParam(0, 1, 2, d.companyId, d.companyName, d.dptId, d.dptName, d.employeeId, d.userName, d.quarter);
                    return '<a href="/pages/kpi/dptTplSet.html?para=' + encodeURIComponent(encodeURIComponent(urlParam)) + '" class="text-add">修改</a>';
                } else {
                    var urlParam = setUrlParam(0, 1, 2, d.companyId, d.companyName, d.dptId, d.dptName, d.employeeId, d.userName);
                    return '<a href="/pages/kpi/dptTplSet.html?para=' + encodeURIComponent(encodeURIComponent(urlParam)) + '" class="text-edit">设置</a>';
                }
            }
        },
        {
            'field': 'halfYear',
            'title': '半年',
            templet: function(d) {
                if (d.halfYear > 0) {
                    var urlParam = setUrlParam(0, 1, 3, d.companyId, d.companyName, d.dptId, d.dptName, d.employeeId, d.userName, d.halfYear);
                    return '<a href="/pages/kpi/dptTplSet.html?para=' + encodeURIComponent(encodeURIComponent(urlParam)) + '" class="text-add">修改</a>';
                } else {
                    var urlParam = setUrlParam(0, 1, 3, d.companyId, d.companyName, d.dptId, d.dptName, d.employeeId, d.userName);
                    return '<a href="/pages/kpi/dptTplSet.html?para=' + encodeURIComponent(encodeURIComponent(urlParam)) + '" class="text-edit">设置</a>';
                }
            }
        },
        {
            'field': 'annual',
            'title': '年度',
            templet: function(d) {
                if (d.annual > 0) {
                    var urlParam = setUrlParam(0, 2, 4, d.companyId, d.companyName, d.dptId, d.dptName, d.employeeId, d.userName, d.halfYear);
                    return '<a href="/pages/kpi/dptTplSet.html?para=' + encodeURIComponent(encodeURIComponent(urlParam)) + '" class="text-add">修改</a>';
                } else {
                    var urlParam = setUrlParam(0, 2, 4, d.companyId, d.companyName, d.dptId, d.dptName, d.employeeId, d.userName);
                    return '<a href="/pages/kpi/dptTplSet.html?para=' + encodeURIComponent(encodeURIComponent(urlParam)) + '" class="text-edit">设置</a>';
                }
            }
        }
    ],
];

var parameter = {
    companyId: '',
    dptId: [],
    kpiType: 1,
};

var lstPager;
layui.use(['table', 'element'], function() {
    var table = layui.table,
        element = layui.element;

    var dptZTree = new ZTreeRadio('dptTree', {}, function(event, treeId, treeNode) {
        parameter.companyId = treeNode.companyId;
        var dptId = [];
        if (treeNode.id > 0 && treeNode.pid < 0) {
            dptId.push(treeNode.id);
            var nodes = dptZTreeObj.getNodesByParam("pid", treeNode.id, treeNode);
            $.each(nodes, function(i, item) {
                dptId.push(item.id);
            });
        } else if (treeNode.id > 0 && treeNode.pid > 0) {
            dptId.push(treeNode.id);
        }

        parameter.dptId = [];
        parameter.dptId = dptId;

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

    //监听事件
    table.on('toolbar(lst)', function(obj) {
        switch (obj.event) {
            case 'batchAdd':
                var urlParam = setUrlParam(1, 1);
                window.location.href = '/pages/kpi/dptTplSet.html?para=' + encodeURI(urlParam);
                break;
        };
    });

    //分页初始化
    lstPager = Pager(
        table, //lay-ui的table控件
        '部门考核模板', //列表名称
        'lst', //绑定的列表Id
        'toolbar', //绑定的工具条Id
        dataCol, //表头的显示行
        'gc/kpievaluation/querytemplat', //action url 只能post提交
        search, //获取查询条件的函数
        null, //如果在显示之前需要对数据进行整理需要实现，否则传null
        null, //有选择行才能有的操作，实现该方法,否则传null
        null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
        function() {
            this.where = {};
            this.where = parameter;
        },
        'full-100'
    );
});

//设置参数
function setUrlParam(batch, kpiType, kpiId, companyId, companyName, dptId, dptName, employeeId, userName, id) {
    return JSON.stringify({
        batch: batch,
        kpiType: kpiType,
        kpiId: kpiId || '',
        companyId: companyId || '',
        companyName: companyName || '',
        dptId: dptId || '',
        dptName: dptName || '',
        employeeId: employeeId || '',
        userName: userName || '',
        id: id || ''
    });
}