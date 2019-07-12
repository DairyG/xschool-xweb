layui.use(['laytpl', 'table', 'form'], function () {
    var table = layui.table,
        form = layui.form,
        laytpl = layui.laytpl;

    var getTpl = kpiContentTpl.innerHTML,
        kcbObj = $('#kpiContentBody'),
        hasKpiConInit = 0;

    //初始化
    getKpiContent();

    kcbObj.on('click', '.evaluationPopup', function () {
        assess_popup(null, 'checkbox', function (result) {
            setEvaluationData(result);
        });
    });
    kcbObj.on('click', '.kpiContentAdd', function () {
        layer_load();
        var hasResult = validateKpiContent();
        if (!hasResult) {
            layer_load_lose();
            return false;
        }

        kcbObj.append(getKpiContent());
        layer_load_lose();
    });
    kcbObj.on('click', '.kpiContentDel', function () {
        var obj = $(this);
        layer_confirm('确定删除吗？', function () {
            var length = kcbObj.find('tr').length;
            obj.parents('tr').remove();
            if (length <= 1) {
                kcbObj.append(getKpiContent());
            }
        });
    });

    //提交
    form.on('submit(submitKpi)', function (laydata) {
        layer_load();
        var hasResult = validateKpiContent();
        if (!hasResult) {
            layer_load_lose();
            return false;
        }

        //考核对象
        var dataUser = [{
            id: 0,
            kpiType: 2,
            kpiId: 1,
            kpiName: '月度考核方案',
            objectType: 1,
            companyId: 1,
            companyName: '阿里巴巴（中国）有限公司成都分公司',
            dptId: '1',
            dptName: '技术部',
            employeeId: '3',
            userName: '3',
        }];
        if (dataUser.length == 0) {
            layer_alert('请选择考核对象');
            return false;
        }

        //考核审核
        var dataAudit = [{
                objectType: 1,
                steps: 1,
                companyId: 1,
                companyName: '阿里巴巴（中国）有限公司成都分公司',
                dptId: '1',
                dptName: '技术部',
                jobId: 1,
                jobName: '专员',
            },
            {
                objectType: 1,
                steps: 2,
                companyId: 1,
                companyName: '阿里巴巴（中国）有限公司成都分公司',
                dptId: '1',
                dptName: '技术部',
                jobId: 2,
                jobName: '主管',
            },
            {
                objectType: 2,
                steps: 1,
                companyId: 1,
                companyName: '阿里巴巴（中国）有限公司成都分公司',
                dptId: '1',
                dptName: '技术部',
                jobId: 1,
                jobName: '专员',
            },
            {
                objectType: 2,
                steps: 2,
                companyId: 1,
                companyName: '阿里巴巴（中国）有限公司成都分公司',
                dptId: '1',
                dptName: '技术部',
                jobId: 2,
                jobName: '主管',
            }
        ];
        if (dataAudit.length == 0) {
            layer_alert('请设置考核人');
            return false;
        }

        //考核内容
        var dataDetail = [];
        kcbObj.find('tr').each(function () {
            var valJson = JSON.parse($(this).find('input[name="evaluationName"]').attr('data-value'));
            var weightVal = $.trim($(this).find('input[name="weight"]').val());
            var explainVal = $.trim($(this).find('input[name="explain"]').val());

            dataDetail.push({
                id: 0,
                evaluationId: valJson.id,
                evaluationName: valJson.name,
                evaluationType: valJson.evaluationTypeName,
                weight: weightVal,
                explain: explainVal
            });
        });
        if (dataDetail.length == 0) {
            layer_alert('请设置考核内容');
            return false;
        }
        console.log(dataDetail);

        return false;
    });

    //设置考核内容
    function setEvaluationData(data) {
        if (data.length > 0) {
            var dataNew = $.map(data, function (item) {
                var parentObj = kcbObj.find('tr[data-id="' + item.id + '"]');
                if (parentObj.length == 0) {
                    return {
                        id: item.id,
                        name: item.name,
                        evaluationTypeId: item.evaluationTypeId,
                        evaluationTypeName: item.evaluationTypeName
                    };
                }
            });

            if (hasKpiConInit == 0) {
                kcbObj.empty();
            }
            hasKpiConInit = 1;
            kcbObj.append(getKpiContent(dataNew));
        }
    }
    //获取考核内容模板
    function getKpiContent(data) {
        data = data ? data : [];
        return laytpl(getTpl).render(data);
    }
    //验证考核内容
    function validateKpiContent() {
        var hasResult = true;
        kcbObj.find('tr').each(function () {
            var value = $(this).find('input[name="evaluationName"]').attr('data-value');
            if (!value) {
                layer_alert('请选择考核项目');
                hasResult = false;
                return false;
            }
            var valJson = JSON.parse(value);
            var weightVal = $.trim($(this).find('input[name="weight"]').val());
            if (weightVal.isEmpty()) {
                layer_alert('请输入[' + valJson.name + ']栏中的[权重(分值)]项');
                hasResult = false;
                return false;
            }
            if (!weightVal.IsNum()) {
                layer_alert('[' + valJson.name + ']栏中的[权重(分值)]项的格式错误(只能为数字)');
                hasResult = false;
                return false;
            }
        });
        return hasResult;
    }

});