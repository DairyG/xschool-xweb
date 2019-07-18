var monthlyCol = [
    [{
            'field': 'bm',
            'title': '人员',
            minWidth: '80'
        },
        {
            'field': 'm1',
            'title': '一月',
            templet: function(d) {
                if (d.m1 != '') {
                    return '<a href="人员考核详情.html" class="text-add">' + d.m1 + '</a>'
                } else {
                    return '<a href="人员考核.html" class="text-add">考核</a>'
                }
            }
        },
        {
            'field': 'm2',
            'title': '二月',
            templet: function(d) {
                if (d.m2 != '') {
                    return '<a href="人员考核详情.html" class="text-add">' + d.m2 + '</a>'
                } else {
                    return '<a href="人员考核.html" class="text-add">考核</a>'
                }
            }
        },
        {
            'field': 'm3',
            'title': '三月',
            templet: function(d) {
                if (d.m3 != '') {
                    return '<a href="人员考核详情.html" class="text-add">' + d.m3 + '</a>'
                } else {
                    return '<a href="人员考核.html" class="text-add">考核</a>'
                }
            }
        },
        {
            'field': 'm4',
            'title': '四月',
            templet: function(d) {
                if (d.m4 != '') {
                    return '<a href="人员考核详情.html" class="text-add">' + d.m4 + '</a>'
                } else {
                    return '<a href="人员考核.html" class="text-add">考核</a>'
                }
            }
        },
        {
            'field': 'm5',
            'title': '五月',
            templet: function(d) {
                if (d.m5 != '') {
                    return '<a href="人员考核详情.html" class="text-add">' + d.m5 + '</a>'
                } else {
                    return '<a href="人员考核.html" class="text-add">考核</a>'
                }
            }
        },
        {
            'field': 'm6',
            'title': '六月',
            templet: function(d) {
                if (d.m6 != '') {
                    return '<a href="人员考核详情.html" class="text-add">' + d.m6 + '</a>'
                } else {
                    return '<a href="人员考核.html" class="text-add">考核</a>'
                }
            }
        },
        {
            'field': 'm7',
            'title': '七月',
            templet: function(d) {
                if (d.m7 != '') {
                    return '<a href="人员考核详情.html" class="text-add">' + d.m7 + '</a>'
                } else {
                    return '<a href="人员考核.html" class="text-add">考核</a>'
                }
            }
        },
        {
            'field': 'm8',
            'title': '八月',
            templet: function(d) {
                if (d.m8 != '') {
                    return '<a href="人员考核详情.html" class="text-add">' + d.m8 + '</a>'
                } else {
                    return '<a href="人员考核.html" class="text-add">考核</a>'
                }
            }
        },
        {
            'field': 'm9',
            'title': '九月',
            templet: function(d) {
                if (d.m9 != '') {
                    return '<a href="人员考核详情.html" class="text-add">' + d.m9 + '</a>'
                } else {
                    return '<a href="人员考核.html" class="text-add">考核</a>'
                }
            }
        },
        {
            'field': 'm10',
            'title': '十月',
            templet: function(d) {
                if (d.m10 != '') {
                    return '<a href="人员考核详情.html" class="text-add">' + d.m10 + '</a>'
                } else {
                    return '<a href="人员考核.html" class="text-add">考核</a>'
                }
            }
        },
        {
            'field': 'm11',
            'title': '十一月',
            minWidth: '80',
            templet: function(d) {
                if (d.m11 != '') {
                    return '<a href="人员考核详情.html" class="text-add">' + d.m11 + '</a>'
                } else {
                    return '<a href="人员考核.html" class="text-add">考核</a>'
                }
            }
        },
        {
            'field': 'm12',
            'title': '十二月',
            minWidth: '80',
            templet: function(d) {
                if (d.m12 != '') {
                    return '<a href="人员考核详情.html" class="text-add">' + d.m12 + '</a>'
                } else {
                    return '<a href="人员考核.html" class="text-add">考核</a>'
                }
            }
        },
        {
            'field': 'pj',
            'title': '平均数',
            minWidth: '80'
        }
    ]
];
var quarterCol = [
    [{
            'field': 'bm',
            'title': '人员'
        },
        {
            'field': 'm1',
            'title': '第一季度'
        },
        {
            'field': 'm2',
            'title': '第二季度'
        },
        {
            'field': 'm3',
            'title': '第三季度'
        },
        {
            'field': 'm4',
            'title': '第四季度'
        }
    ]
];
var halfYearCol = [
    [{
            'field': 'userName',
            'title': '人员'
        },
        {
            'field': 'score1',
            'title': '上半年'
        },
        {
            'field': 'score2',
            'title': '下半年'
        },
    ]
];
var annualCol = [
    [{
            'field': 'bm',
            'title': '人员'
        },
        {
            'field': 'm1',
            'title': '2019年'
        },
    ]
];

var currTab = 1;
var parameter = {
    companyId: '',
    dptId: '',
    year: 2019,
    kpiId: 1,
    kpiType: 1,
};

var lstPager;
layui.use(['table', 'element'], function() {
    var table = layui.table,
        element = layui.element;
    var dptZTree = new ZTreeRadio('dptTree', {}, function(event, treeId, treeNode) {
        var companyId = treeNode.companyId;
        var dptId = '';
        if (treeNode.id > 0) {
            dptId = treeNode.id;
        }
        switch (currTab) {
            case 1:
                monthlyPara.companyId = companyId;
                monthlyPara.dptId = dptId;
                monthlyPager.search();
                break;
            case 2:
                quarterPara.companyId = companyId;
                quarterPara.dptId = dptId;
                quarterPager.search();
                break;
            case 3:
                halfYearPara.companyId = companyId;
                halfYearPara.dptId = dptId;
                halfYearPager.search();
                break;
            case 4:
                annualPara.companyId = companyId;
                annualPara.dptId = dptId;
                annualPager.search();
                break;
        }

    });
    dptZTree.reload();
    var dptZTreeObj = dptZTree.obj();
    var nodes = dptZTreeObj.getNodes();
    if (nodes.length > 0) {
        parameter.companyId = nodes[0].companyId;
        dptZTreeObj.selectNode(nodes[0]);
    }

    var monthlyPara = parameter;
    monthlyPara.kpiId = 1;
    quarterPara = parameter;
    quarterPara.kpiId = 2;
    halfYearPara = parameter;
    halfYearPara.kpiId = 3;
    annualPara = parameter;
    annualPara.kpiId = 4;

    console.log(monthlyPara);

    //一些事件监听
    element.on('tab(contentTabs)', function(data) {
        var text = $(this).text();
        switch (text) {
            case '月度考核':
                monthlyPager.search();
                break;
            case '月度考核':
                quarterPager.search();
                break;
            case '月度考核':
                halfYearPager.search();
                break;
            case '月度考核':
                annualPager.search();
                break;
        }
    });

    function monthlySearch() {
        return monthlyPara;
    }

    function quarterSearch() {
        return quarterPara;
    }

    function halfYearSearch() {
        return halfYearPara;
    }

    function annualSearch() {
        return annualPara;
    }

    monthlyPager = Pager(
        table, //lay-ui的table控件
        '部门考核模板', //列表名称
        'monthlyLst', //绑定的列表Id
        'toolbar', //绑定的工具条Id
        monthlyCol, //表头的显示行
        'gc/kpievaluation/querymanage', //action url 只能post提交
        monthlySearch, //获取查询条件的函数
        null, //如果在显示之前需要对数据进行整理需要实现，否则传null
        null, //有选择行才能有的操作，实现该方法,否则传null
        null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
        null,
        'full-100'
    );
    quarterPara = Pager(
        table, //lay-ui的table控件
        '部门考核模板', //列表名称
        'quarterLst', //绑定的列表Id
        'toolbar', //绑定的工具条Id
        quarterCol, //表头的显示行
        'gc/kpievaluation/querymanage', //action url 只能post提交
        quarterSearch, //获取查询条件的函数
        null, //如果在显示之前需要对数据进行整理需要实现，否则传null
        null, //有选择行才能有的操作，实现该方法,否则传null
        null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
        null,
        'full-100'
    );
    halfYearPara = Pager(
        table, //lay-ui的table控件
        '部门考核模板', //列表名称
        'halfYearLst', //绑定的列表Id
        'toolbar', //绑定的工具条Id
        halfYearCol, //表头的显示行
        'gc/kpievaluation/querymanage', //action url 只能post提交
        halfYearSearch, //获取查询条件的函数
        null, //如果在显示之前需要对数据进行整理需要实现，否则传null
        null, //有选择行才能有的操作，实现该方法,否则传null
        null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
        null,
        'full-100'
    );
    annualPager = Pager(
        table, //lay-ui的table控件
        '部门考核模板', //列表名称
        'annualLst', //绑定的列表Id
        'toolbar', //绑定的工具条Id
        annualCol, //表头的显示行
        'gc/kpievaluation/querymanage', //action url 只能post提交
        annualSearch, //获取查询条件的函数
        null, //如果在显示之前需要对数据进行整理需要实现，否则传null
        null, //有选择行才能有的操作，实现该方法,否则传null
        null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
        null,
        'full-100'
    );

});