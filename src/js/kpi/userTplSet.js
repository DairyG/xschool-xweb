layui.use(['laytpl', 'table', 'form'], function() {
    var table = layui.table,
        form = layui.form,
        laytpl = layui.laytpl;

    var getTpl = kpiContentTpl.innerHTML,
        kpiConObj = $('#kpiContentBody'),
        kpiAuditBody = $('#kpiAuditBody'),
        hasKpiConInit = 0; //是否第一次设置

    var defaultSel = '<span class="text-85">点击选择</span>';


    //考核人设置
    kpiAuditBody.on('click', '.kpiAudit', function() {
        var valObj = $(this).find('.kpiAuditValue');
        user_popup(valObj, 'dpt_position', 1, false, function(result) {
            if (result != null) {
                var jobJson = result.position[0];
                var showValue = defaultSel;
                if (jobJson) {
                    showValue = (jobJson.company_name.length > 9 ? (jobJson.company_name.substr(0, 9) + '...') : jobJson.company_name) + ' - ' + jobJson.name;
                }
                valObj.html(showValue + '<input type="hidden" name="sels" value=\'' + JSON.stringify(result) + '\'>');
            }
        });
    });

    //初始化
    getKpiContent();

    kpiConObj.on('click', '.evaluationPopup', function() {
        assess_popup(null, 'checkbox', function(result) {
            setEvaluationData(result);
        });
    });
    kpiConObj.on('click', '.kpiContentAdd', function() {
        layer_load();
        var hasResult = validateKpiContent();
        if (!hasResult) {
            layer_load_lose();
            return false;
        }

        kpiConObj.append(getKpiContent());
        layer_load_lose();
    });
    kpiConObj.on('click', '.kpiContentDel', function() {
        var obj = $(this);
        layer_confirm('确定删除吗？', function() {
            var length = kpiConObj.find('tr').length;
            obj.parents('tr').remove();
            if (length <= 1) {
                kpiConObj.append(getKpiContent());
            }
        });
    });

    //提交
    form.on('submit(submitKpi)', function(laydata) {
        layer_load();

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
        var errorAudit = '';
        kpiAuditBody.find('tr').each(function() {
            var pObj = $(this);
            var error = true;
            pObj.find('.kpiAudit').each(function() {
                var cObj = $(this);
                var spanObj = cObj.find('.kpiAuditValue');
                var value = spanObj.find('input[name="sels"]').val();
                var tip = cObj.attr('data-type') == 1 ? '部门负责人' : '部门员工';
                if (!value) {
                    errorAudit = '请设置[' + tip + ']栏中的相关审核人';
                    error = false;
                    return false;
                }
                var vJson = JSON.parse(value);
                dataAudit.push({
                    objectType: cObj.attr('data-type'),
                    steps: cObj.attr('data-steps'),
                    companyId: vJson.position[0].company_id,
                    companyName: vJson.position[0].company_name,
                    dptId: vJson.position[0].dpt_id,
                    dptName: vJson.position[0].dpt_name,
                    jobId: vJson.position[0].id,
                    jobName: vJson.position[0].name,
                });

                //JSON.parse($(this).find('input[name="sels"]').val());

                console.log(cObj.attr('data-type'));
                console.log(cObj.attr('data-steps'));
            });
            if (!error) {
                return false;
            }


            // if (paramObj.find('input[type="checkbox"]:checked').length - 1 < 0) {
            //     errorScope = '请您勾选[' + typeJson.param_name + ']相关参数';
            //     return false;
            // }
        });
        if (!errorAudit.isEmpty()) {
            layer_alert(errorAudit);
            return false;
        }
        if (dataAudit.length == 0) {
            layer_alert('请设置考核人');
            return false;
        }

        var hasResult = validateKpiContent();
        if (!hasResult) {
            layer_load_lose();
            return false;
        }
        //考核内容
        var dataDetail = [];
        kpiConObj.find('tr').each(function() {
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
            var dataNew = $.map(data, function(item) {
                var parentObj = kpiConObj.find('tr[data-id="' + item.id + '"]');
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
                kpiConObj.empty();
            }
            hasKpiConInit = 1;
            kpiConObj.append(getKpiContent(dataNew));
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
        kpiConObj.find('tr').each(function() {
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