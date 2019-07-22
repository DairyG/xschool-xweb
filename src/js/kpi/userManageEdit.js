var datas2 = [{
    title: '<a href="../任务管理/任务详情.html" class="text-add">销售任务</a>',
    date1: '2019-1-1 10:59:10',
    date2: '2019-1-1 10:59:10',
    date3: '2019-1-1 10:59:10',
    info: '<font class="text-span">已完成</font>',
    kh: '销售指标'
}, {
    title: '<a href="../任务管理/任务详情.html" class="text-add">报表统计任务</a>',
    date1: '2019-1-1 10:59:10',
    date2: '2019-1-1 10:59:10',
    date3: '',
    info: '<font class="text-del">未完成</font>',
    kh: '报表考核'
}, {
    title: '<a href="../任务管理/任务详情.html" class="text-add">访客任务</a>',
    date1: '2019-1-1 10:59:10',
    date2: '2019-1-1 10:59:10',
    date3: '',
    info: '<font class="text-del">未完成</font>',
    kh: ''
}, {
    title: '<a href="../任务管理/任务详情.html" class="text-add">推广任务</a>',
    date1: '2019-1-1 10:59:10',
    date2: '2019-1-1 10:59:10',
    date3: '',
    info: '<font class="text-del">未完成</font>',
    kh: ''
}];
layui.use(['table', 'form', 'element'], function() {
    var table = layui.table,
        form = layui.form,
        element = layui.element;

    var formSubimt = $('#formSubimt');
    $('.backBtn').on('click', function() {
        window.location.href = '/pages/kpi/userManageList.html';
    });

    var dbRecord = {},
        dbDetail = [],
        dbAuditRecord = [],
        dbAudits = {},
        hasHandle = false,
        hasIam = false;

    var employee = window.globCache.getEmployee();
    var para = decodeURIComponent(decodeURIComponent(GetPara('para'))) || '';
    if (!IsJson(para)) {
        layer_alert('参数错误，请从正确入口进入');
        formSubimt.hide();
        return false;
    }
    var paraJson = JSON.parse(para);
    if (!paraJson.kpiType.toString().IsNum() || !paraJson.kpiId.toString().IsNum() ||
        !paraJson.companyId.toString().IsNum() || !paraJson.dptId.toString().IsNum() || !paraJson.employeeId.toString().IsNum() ||
        !paraJson.year.toString().IsNum() || !paraJson.kpiDate.toString().IsNum()) {
        layer_alert('参数错误，请从正确入口进入');
        formSubimt.hide();
        return false;
    }

    $('#kpiTitle').html(paraJson.dptName + '—' + paraJson.userName + '—' + paraJson.year + '年' +
        (paraJson.kpiId == 1 ? paraJson.kpiDate + '月' : paraJson.kpiId == 2 ? paraJson.kpiDate + '季度' : paraJson.kpiId.kpiId == 3 ? (paraJson.kpiDate == 1 ? '上半年' : '下半年') : '') +
        '—' + paraJson.kpiName);

    var selfEvalPanel = $('#selfEvalPanel'),
        oneEvalPanel = $('#oneEvalPanel'),
        twoEvalPanel = $('#twoEvalPanel');

    getKpiRecord(paraJson);

    table.render({
        elem: '#lst2',
        data: datas2,
        cols: [
            [{
                type: 'numbers',
                title: '序号'
            }, {
                field: 'kh',
                title: '考核项目'
            }, {
                field: 'title',
                title: '任务名称'
            }, {
                field: 'date1',
                title: '开始时间'
            }, {
                field: 'date2',
                title: '截止时间'
            }, {
                field: 'date3',
                title: '完成时间'
            }, {
                field: 'info',
                title: '完成情况'
            }]
        ],
        height: 'full-180',
    });

    form.on('submit(formSubimt)', function(laydata) {
        layer_load();
        //自评
        if (!dbRecord) {
            layer_alert('未获取到相关提交记录，请刷新页面重试');
            return false;
        }
        if (dbDetail.length == 0) {
            layer_alert('未获取到相关提交记录，请刷新页面重试');
            return false;
        };
        if (dbRecord.status == 1 || dbRecord.status == -1) {
            layer_alert('该记录已被处理，请勿重复操作');
            return false;
        }

        var dataDetail = [],
            errorDetail = '';
        $.each(dbDetail, function(i, item) {
            var score = '',
                itemTip = '';
            var temp = {
                id: item.id,
                kpiManageRecordId: item.kpiManageRecordId,
                companyId: item.companyId,
                dptId: item.dptId,
                employeeId: item.employeeId,
                evaluationId: item.evaluationId,
                evaluationName: item.evaluationName,
                evaluationType: item.evaluationType,
                weight: item.weight,
                explain: item.explain,
                year: item.year,
                kpiDate: item.kpiDate
            };
            if (dbRecord.steps == 10) {
                score = $('input[name="selfScore' + item.evaluationId + '"]').val();
                itemTip = '自评分';
                temp.selfScore = score;
                temp.oneScore = item.oneScore;
                temp.twoScore = item.twoScore;
            } else if (dbRecord.steps == 11) {
                score = $('input[name="oneScore' + item.evaluationId + '"]').val();
                itemTip = '初审分';
                temp.selfScore = item.selfScore;
                temp.oneScore = score;
                temp.twoScore = item.twoScore;
            } else if (dbRecord.steps == 12) {
                score = $('input[name="twoScore' + item.evaluationId + '"]').val();
                itemTip = '终审分';
                temp.selfScore = item.selfScore;
                temp.oneScore = item.oneScore;
                temp.twoScore = score;
            }
            if (!score) {
                errorDetail = '请输入[' + item.evaluationName + ']栏中的' + itemTip + '项';
                return false;
            }
            if (!score.IsDecimal()) {
                errorDetail = '[' + item.evaluationName + ']栏中的' + itemTip + '项格式错误，只能输入(整数或小数(1-2位小数))';
                return false;
            }
            if (parseFloat(score) > parseFloat(item.weight)) {
                errorDetail = '[' + item.evaluationName + ']栏中的' + itemTip + '项不能大于对应的权重(分值)';
                return false;
            }
            dataDetail.push(temp);
        });
        if (!errorDetail.IsEmpty()) {
            layer_alert(errorDetail);
            return false;
        }
        if (dataDetail.length == 0) {
            layer_alert('未获取到相关提交记录，请刷新页面重试');
            return false;
        }

        var evalValue = '';
        if (dbRecord.steps == 10) {
            evalValue = $.trim($('.evaluation1').val());
        } else if (dbRecord.steps == 11) {
            evalValue = $.trim($('.evaluation2').val());
        } else if (dbRecord.steps == 12) {
            evalValue = $.trim($('.evaluation3').val());
        }

        var nextEmployee = {};
        if (dbRecord.steps == 10 || dbRecord.steps == 11) {
            //获取下一步处理人
            //获取下一步处理人，先写死 初审
            nextEmployee = {
                companyId: 7,
                companyName: "阿里巴巴",
                dptId: 74,
                dptName: "华东大区",
                employeeName: "杨华东主管",
                id: 7,
                jobId: 21,
                jobName: "主管"
            }

            //终审
            // var nextEmployee = {
            //     companyId: 7,
            //     companyName: "阿里巴巴",
            //     dptId: 74,
            //     dptName: "华东大区",
            //     employeeName: "杨华东主管",
            //     id: 4,
            //     jobId: 19,
            //     jobName: "经理"
            // }
        }

        layer_confirm('提交以后不可修改，确定提交吗？', function() {
            submitData(evalValue, nextEmployee, dataDetail);
        });

        return false;
    });

    //获取考核记录
    function getKpiRecord(parameter) {
        layer_load();
        Serv.Post('gc/kpievaluation/getmanagerecord', parameter, function(result) {
            layer_load_lose();
            if (result.succeed) {

                if (result.data.record.status == 1 || result.data.record.status == -1) {
                    // layer_alert('该记录已被处理，请勿重复操作');
                    disableAll();
                    // return false;
                }

                dbRecord = result.data.record || [];
                dbDetail = result.data.detail || [];
                dbAuditRecord = result.data.auditRecord || [];

                initKpiDetail();
            } else {
                layer_alert(result.message);
                formSubimt.hide();
            }
        });
    }
    //初始化 考核记录
    function initKpiDetail() {
        hasHandle = (dbRecord.stepsCompanyId == employee.companyId && dbRecord.stepsDptId == employee.dptId && dbRecord.stepsEmployeeId == employee.id);
        hasIam = (dbRecord.companyId == employee.companyId && dbRecord.dptId == employee.dptId && dbRecord.employeeId == employee.id);

        if (!hasHandle) {
            disableAll();
        }

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
                        totalRow: true,
                        templet: function(d) {
                            if (dbRecord.steps == 10 && hasHandle) {
                                return '<div><input type="text" name="selfScore' + d.evaluationId + '" class="layui-input" maxlength="6" value="" /></div>';
                            } else if (hasHandle || hasIam) {
                                return d.selfScore;
                            } else {
                                return '';
                            }
                        },
                    },
                    {
                        field: 'oneScore',
                        title: '初审分',
                        totalRow: true,
                        templet: function(d) {
                            if (dbRecord.steps == 10) {
                                return '';
                            } else if (dbRecord.steps == 11 && hasHandle) {
                                return '<div><input type="text" name="oneScore' + d.evaluationId + '" class="layui-input" maxlength="6" value="" /></div>';
                            } else if (dbRecord.steps == 11 && hasIam) {
                                return '';
                            } else if (hasHandle || hasIam) {
                                return d.oneScore;
                            } else {
                                return '';
                            }
                        },
                    },
                    {
                        field: 'twoScore',
                        title: '终审分',
                        totalRow: true,
                        templet: function(d) {
                            if (dbRecord.steps == 10 || dbRecord.steps == 11) {
                                return '';
                            } else if (dbRecord.steps == 12 && hasHandle) {
                                return '<div><input type="text" name="twoScore' + d.evaluationId + '" class="layui-input" maxlength="6" value="" /></div>';
                            } else if (dbRecord.steps == 12 && hasIam) {
                                return '';
                            } else if (hasHandle || hasIam) {
                                return d.oneScore;
                            } else {
                                return '';
                            }
                        },
                    },
                ],
            ],
            height: '280',
            totalRow: true
        });

        if (hasHandle || hasIam) {
            $.each(dbAuditRecord, function(i, item) {
                $('.evaluation' + (i + 1)).val(item.evaluation);
            });
        }

        if (dbRecord.steps == 10) {
            oneEvalPanel.find('textarea').remove();
            twoEvalPanel.find('textarea').remove();
        } else if (dbRecord.steps == 11) {
            selfEvalPanel.find('textarea').attr('readonly', 'readonly');
            twoEvalPanel.find('textarea').remove();
        } else if (dbRecord.steps == 12) {
            selfEvalPanel.find('textarea').attr('readonly', 'readonly');
            oneEvalPanel.find('textarea').attr('readonly', 'readonly');
        } else {
            $('.evaluation').find('textarea').attr('readonly', 'readonly');
        }
    }

    function submitData(evalValue, nextEmployee, dataDetail) {
        var modelSub = {
            evaluation: evalValue,
            employee: employee,
            nextEmployee: nextEmployee,
            manageRecord: dbRecord,
            manageDetails: dataDetail,
        }
        Serv.Post('gc/kpievaluation/editmanage', modelSub, function(result) {
            layer_load_lose();
            if (result.succeed) {
                layer_alert(result.message, function() {
                    window.location.href = window.location.href;
                });
            } else {
                layer_alert(result.message);
            }
        });
    }

    //禁用
    function disableAll() {
        formSubimt.hide();
        $('.evaluation').attr('readonly', 'readonly');
    }

});