var chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
var kpiName = ['monthly', 'quarter', 'halfYear', 'annual'];

var paramModel = {
    currTab: 'monthly',
    monthlyHasFirst: false,
    quarterHasFirst: false,
    halfYearHasFirst: false,
    annualHasFirst: false,
    monthly: {
        companyId: '',
        dptId: '',
        year: 2019,
        kpiId: 1,
        kpiType: 2,
    },
    quarter: {
        companyId: '',
        dptId: '',
        year: 2019,
        kpiId: 2,
        kpiType: 2,
    },
    halfYear: {
        companyId: '',
        dptId: '',
        year: 2019,
        kpiId: 3,
        kpiType: 2,
    },
    annual: {
        companyId: '',
        dptId: '',
        year: 2019,
        kpiId: 4,
        kpiType: 2,
    },
};

var monthlyCol0 = [{
    field: 'userName',
    title: '人员',
    minWidth: '80'
}];
for (var index = 1; index <= 12; index++) {
    var colData = {
        field: 'score' + index,
        title: chnNumChar[index] + '月',
        templet: function(d, colIndex) {
            var keyStatus = 'status' + colIndex,
                keyScore = 'score' + colIndex;
            return getStatusTxt(d[keyStatus], d[keyScore], d);
        }
    };
    monthlyCol0.push(colData);
}
monthlyCol0.push({
    field: 'aveScore',
    title: '平均数',
    minWidth: '80',
    templet: function(d) {
        var value = 0;
        for (var i = 1; i <= 12; i++) {
            value += d['score' + i];
        }
        return value;
    }
});
var monthlyCol = [monthlyCol0];

var quarterCol0 = [{
    field: 'userName',
    title: '人员',
    minWidth: '80'
}];
for (var index = 1; index <= 4; index++) {
    var colData = {
        field: 'score' + index,
        title: '第' + chnNumChar[index] + '季度',
        templet: function(d, colIndex) {
            var keyStatus = 'status' + colIndex,
                keyScore = 'score' + colIndex;

            return getStatusTxt(d[keyStatus], d[keyScore], d);
        }
    };
    quarterCol0.push(colData);
}
var quarterCol = [quarterCol0];

var halfYearCol0 = [{
    field: 'userName',
    title: '人员',
    minWidth: '80'
}];
for (var index = 1; index <= 2; index++) {
    var colData = {
        field: 'score' + index,
        title: index == 1 ? '上半年' : '下半年',
        templet: function(d, colIndex) {
            var keyStatus = 'status' + colIndex,
                keyScore = 'score' + colIndex;
            return getStatusTxt(d[keyStatus], d[keyScore], d);
        }
    };
    halfYearCol0.push(colData);
}
var halfYearCol = [halfYearCol0];

var annualCol = [
    [{
            field: 'userName',
            title: '人员',
            minWidth: '80'
        },
        {
            field: 'score1',
            title: paramModel.annual.year + '年',
            templet: function(d, colIndex) {
                return getStatusTxt(d.status1, d.score1, d);
            }
        },
    ]
];

layui.use(['laytpl', 'table', 'element', 'form'], function() {
    var table = layui.table,
        element = layui.element,
        form = layui.form,
        laytpl = layui.laytpl;

    var monthlyPager, quarterPager, halfYearPager, annualPager;

    var getTpl = toolbarTpl.innerHTML;
    var dataYear = getYears();

    for (var ki = 0; ki < kpiName.length; ki++) {
        var key = kpiName[ki];
        $('#' + key + 'Bar').html(laytpl(getTpl).render({
            kpiName: key,
            list: dataYear
        }));
    }

    var dptZTree = new ZTreeRadio('dptTree', {}, function(event, treeId, treeNode) {
        var companyId = treeNode.companyId;
        var dptId = '';
        if (treeNode.id > 0) {
            dptId = treeNode.id;
        }

        paramModel.monthly.companyId = companyId;
        paramModel.monthly.dptId = dptId;

        paramModel.quarter.companyId = companyId;
        paramModel.quarter.dptId = dptId;

        paramModel.halfYear.companyId = companyId;
        paramModel.halfYear.dptId = dptId;

        paramModel.annual.companyId = companyId;
        paramModel.annual.dptId = dptId;

        reloadData();
    });
    dptZTree.reload();
    var dptZTreeObj = dptZTree.obj();
    var nodes = dptZTreeObj.getNodes();
    if (nodes.length > 0) {
        var companyId = nodes[0].companyId;
        paramModel.monthly.companyId = companyId;
        paramModel.quarter.companyId = companyId;
        paramModel.halfYear.companyId = companyId;
        paramModel.annual.companyId = companyId;

        dptZTreeObj.selectNode(nodes[0]);
    }

    //一些事件监听
    element.on('tab(contentTabs)', function(data) {
        paramModel.currTab = $(this).attr('data-value');
        reloadData();
    });
    form.on('select(monthlyYear)', function(data) {
        paramModel.monthly.year = data.value;
        monthlyPager.search();
    });
    form.on('select(quarterYear)', function(data) {
        paramModel.quarter.year = data.value;
        quarterPager.search();
    });
    form.on('select(halfYearYear)', function(data) {
        paramModel.halfYear.year = data.value;
        halfYearPager.search();
    });
    form.on('select(annualYear)', function(data) {
        paramModel.annual.year = data.value;
        annualCol = [
            [{
                    field: 'userName',
                    title: '人员',
                    minWidth: '80'
                },
                {
                    field: 'score1',
                    title: paramModel.annual.year + '年',
                    templet: function(d, colIndex) {
                        return getStatusTxt(d.status1, d.score1, d);
                    }
                },
            ]
        ];
        initPager.initAnnual();
        // annualPager.search();
    });

    function search() {
        switch (paramModel.currTab) {
            case 'monthly':
                return paramModel.monthly;
            case 'quarter':
                return paramModel.quarter;
            case 'halfYear':
                return paramModel.halfYear;
            case 'annual':
                return paramModel.annual;
        }
    }

    function reloadData() {
        switch (paramModel.currTab) {
            case 'monthly':
                if (paramModel.monthlyHasFirst) {
                    console.log(monthlyPager);
                    monthlyPager.search();
                } else {
                    initPager.initMonthly();
                }
                break;
            case 'quarter':
                if (paramModel.quarterHasFirst) {
                    quarterPager.search();
                } else {
                    initPager.initQuarter();
                }
                break;
            case 'halfYear':
                if (paramModel.halfYearHasFirst) {
                    halfYearPager.search();
                } else {
                    initPager.initHalfYear();
                }
                break;
            case 'annual':
                if (paramModel.annualHasFirst) {
                    annualPager.search();
                } else {
                    initPager.initAnnual();
                }
                break;
        }
    }

    var initPager = {
        initMonthly: function() {
            if (!paramModel.monthlyHasFirst) {
                paramModel.monthlyHasFirst = true;
                monthlyPager = Pager(
                    table, //lay-ui的table控件
                    '人员考核管理-月度', //列表名称
                    'monthlyLst', //绑定的列表Id
                    'monthlyBar', //绑定的工具条Id
                    monthlyCol, //表头的显示行
                    'gc/kpievaluation/querymanage', //action url 只能post提交
                    search, //获取查询条件的函数
                    null, //如果在显示之前需要对数据进行整理需要实现，否则传null
                    null, //有选择行才能有的操作，实现该方法,否则传null
                    null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
                    function() {
                        $('#monthlyYear').val(paramModel.monthly.year);
                        form.render('select');
                    },
                    'full-100'
                );
            }
        },
        initQuarter: function() {
            if (!paramModel.quarterHasFirst) {
                paramModel.quarterHasFirst = true;
                quarterPager = Pager(
                    table, //lay-ui的table控件
                    '人员考核管理-季度', //列表名称
                    'quarterLst', //绑定的列表Id
                    'quarterBar', //绑定的工具条Id
                    quarterCol, //表头的显示行
                    'gc/kpievaluation/querymanage', //action url 只能post提交
                    search, //获取查询条件的函数
                    null, //如果在显示之前需要对数据进行整理需要实现，否则传null
                    null, //有选择行才能有的操作，实现该方法,否则传null
                    null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
                    function() {
                        $('#quarterYear').val(paramModel.quarter.year);
                        form.render('select');
                    },
                    'full-100'
                );
            }
        },
        initHalfYear: function() {
            if (!paramModel.halfYearHasFirst) {
                paramModel.halfYearHasFirst = true;
                halfYearPager = Pager(
                    table, //lay-ui的table控件
                    '人员考核管理-半年', //列表名称
                    'halfYearLst', //绑定的列表Id
                    'halfYearBar', //绑定的工具条Id
                    halfYearCol, //表头的显示行
                    'gc/kpievaluation/querymanage', //action url 只能post提交
                    search, //获取查询条件的函数
                    null, //如果在显示之前需要对数据进行整理需要实现，否则传null
                    null, //有选择行才能有的操作，实现该方法,否则传null
                    null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
                    function() {
                        $('#halfYearYear').val(paramModel.halfYear.year);
                        form.render('select');
                    },
                    'full-100'
                );
            }
        },
        initAnnual: function() {
            annualPager = Pager(
                table, //lay-ui的table控件
                '人员考核管理-年度', //列表名称
                'annualLst', //绑定的列表Id
                'annualBar', //绑定的工具条Id
                annualCol, //表头的显示行
                'gc/kpievaluation/querymanage', //action url 只能post提交
                search, //获取查询条件的函数
                null, //如果在显示之前需要对数据进行整理需要实现，否则传null
                null, //有选择行才能有的操作，实现该方法,否则传null
                null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
                function() {
                    $('#annualYear').val(paramModel.annual.year);
                    form.render('select');
                },
                'full-100'
            );

            // if (!paramModel.annualHasFirst) {
            //     paramModel.annualHasFirst = true;
            //     annualPager = Pager(
            //         table, //lay-ui的table控件
            //         '人员考核管理-年度', //列表名称
            //         'annualLst', //绑定的列表Id
            //         'annualBar', //绑定的工具条Id
            //         annualCol, //表头的显示行
            //         'gc/kpievaluation/querymanage', //action url 只能post提交
            //         search, //获取查询条件的函数
            //         null, //如果在显示之前需要对数据进行整理需要实现，否则传null
            //         null, //有选择行才能有的操作，实现该方法,否则传null
            //         null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
            //         function() {
            //             $('#annualYear').val(paramModel.annual.year);
            //             form.render('select');
            //         },
            //         'full-100'
            //     );
            // }
        }
    };

    initPager.initMonthly();

});

//获取状态文本
function getStatusTxt(status, score, model) {
    if (status == 0) {
        return '<span class="text-85">未开始</span>';
    } else if (status == -1) {
        return '<span class="text-85">无效</span>';
    } else if (status == 1) {
        return '<a href="人员考核详情.html" class="text-add">' + d[keyScore] + '</a>';
    } else if (status == 10 || d[keyStatus] == 11) {
        return '<a href="人员考核.html" class="text-add">考核</a>';
    } else {
        return '<span class="text-85">未知</span>';
    }
}