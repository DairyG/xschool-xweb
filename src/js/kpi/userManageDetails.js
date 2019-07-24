layui.use(['table', 'form', 'element', 'laytpl'], function() {
    var table = layui.table,
        form = layui.form,
        element = layui.element,
        laytpl = layui.laytpl;

    $('.backBtn').on('click', function() {
        window.location.href = '/pages/kpi/userManageList.html';
    });

    var dbRecord = {},
        dbDetail = [],
        dbAuditRecord = [];

    var employee = window.globCache.getEmployee();
    var para = decodeURIComponent(decodeURIComponent(GetPara('para'))) || '';
    if (!IsJson(para)) {
        layer_alert('参数错误，请从正确入口进入');
        return false;
    }
    var paraJson = JSON.parse(para);
    if (!paraJson.kpiType.toString().IsNum() || !paraJson.kpiId.toString().IsNum() ||
        !paraJson.companyId.toString().IsNum() || !paraJson.dptId.toString().IsNum() || !paraJson.employeeId.toString().IsNum() ||
        !paraJson.year.toString().IsNum() || !paraJson.kpiDate.toString().IsNum()) {
        layer_alert('参数错误，请从正确入口进入');
        return false;
    }

    $('#kpiTitle').html(paraJson.dptName + '—' + paraJson.userName + '—' + paraJson.year + '年' +
        (paraJson.kpiId == 1 ? paraJson.kpiDate + '月' : paraJson.kpiId == 2 ? paraJson.kpiDate + '季度' : paraJson.kpiId.kpiId == 3 ? (paraJson.kpiDate == 1 ? '上半年' : '下半年') : '') +
        '—' + paraJson.kpiName);


    getKpiRecord(paraJson);

    //获取考核记录
    function getKpiRecord(parameter) {
        layer_load();
        Serv.Post('gc/kpievaluation/getmanagerecord', parameter, function(result) {
            layer_load_lose();
            if (result.succeed) {
                dbRecord = result.data.record || [];
                dbDetail = result.data.detail || [];
                dbAuditRecord = result.data.auditRecord || [];
                var getTpl = auditRecordTpl.innerHTML;
                $('#auditRecordPanel').html(laytpl(getTpl).render(dbAuditRecord));

                getSchedule(dbRecord.employeeId, dbRecord.kpiId, result.data.startDate, result.data.endDate);

                initKpiDetail();
            } else {
                layer_alert(result.message);
            }
        });
    }
    //初始化 考核记录
    function initKpiDetail() {
        table.render({
            elem: '#kpiLst',
            data: dbDetail,
            cols: [
                [{
                        field: 'id',
                        title: '序号'
                    },
                    {
                        field: 'evaluationName',
                        title: '考核项目'
                    },
                    {
                        field: 'explain',
                        title: '说明',
                        totalRowText: '总计'
                    },
                    {
                        field: 'weight',
                        title: '权重(分值)',
                        totalRow: true
                    },
                    {
                        field: 'selfScore',
                        title: '自评分',
                        totalRow: true
                    },
                    {
                        field: 'oneScore',
                        title: '初审分',
                        totalRow: true
                    },
                    {
                        field: 'twoScore',
                        title: '终审分',
                        totalRow: true
                    },
                ],
            ],
            height: '280',
            totalRow: true
        });
    }

    //获取任务情况
    function getSchedule(employeeId, kpiId, startDate, endDate) {
        layer_load();
        Serv.Post('gc/schedule/getbykpi', {
            eid: employeeId,
            planId: kpiId,
            startDate: startDate,
            endDate: endDate,
        }, function(result) {
            layer_load_lose();
            initSchedule(result);
        });
    }
    //初始化考核记录
    function initSchedule(data) {
        table.render({
            elem: '#scheduleLst',
            data: data,
            cols: [
                [{
                    field: 'id',
                    title: '序号'
                }, {
                    field: 'kpiManageRecordName',
                    title: '考核项目'
                }, {
                    field: 'title',
                    title: '任务名称'
                }, {
                    field: 'beginTime',
                    title: '开始时间'
                }, {
                    field: 'endTime',
                    title: '截止时间'
                }, {
                    field: 'finishTime',
                    title: '完成时间'
                }, {
                    field: 'completion',
                    title: '完成情况',
                    template: function(d) {
                        return d.completion == '已完成' ? '<font class="text-span">已完成</font>' : '<font class="text-del">未完成</font>';
                    }
                }]
            ]
        });
    }

});