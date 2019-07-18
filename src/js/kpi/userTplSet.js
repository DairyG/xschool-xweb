layui.use(['laytpl', 'table', 'form'], function() {
    var table = layui.table,
        form = layui.form,
        laytpl = layui.laytpl;

    var getTpl = kpiContentTpl.innerHTML,
        kpiConObj = $('#kpiContentBody'),
        kpiAuditBody = $('#kpiAuditBody'),
        hasKpiConInit = 0; //是否第一次设置
    var defaultSel = '<span class="text-85">点击选择</span>';

    var para = decodeURIComponent(decodeURIComponent(GetPara('para'))) || '';
    if (!isJson(para)) {
        layer_alert('参数错误，请从正确入口进入');
        $('#submitKpi').hide();
        return false;
    }
    var paraJson = JSON.parse(para);
    if (!paraJson.kpiType.toString().IsNum() || !paraJson.batch.toString().IsNum()) {
        layer_alert('参数错误，请从正确入口进入');
        $('#submitKpi').hide();
        return false;
    }
    if (paraJson.kpiType != 2) {
        layer_alert('参数错误，请从正确入口进入');
        $('#submitKpi').hide();
        return false;
    }
    if (paraJson.batch != 1) {
        $('#kpiObjectPopup').hide();
    }
    if (paraJson.kpiId.toString().IsNum()) {
        $('#kpiSelect').val(paraJson.kpiId).attr('disabled', 'disabled');
        form.render('select');
    }
    if (paraJson.employeeId.toString().IsNum() && paraJson.employeeId >= 0) {
        var showValue = (paraJson.companyName.length > 9 ? (paraJson.companyName.substr(0, 9) + '...') : paraJson.companyName) + ' - ' +
            paraJson.dptName + ' - ' + paraJson.userName;

        var userSelVal = getUserPopModel();
        userSelVal.user.push({
            id: paraJson.employeeId,
            name: paraJson.userName,
            dpt_id: paraJson.dptId,
            dpt_name: paraJson.dptName,
            company_id: paraJson.companyId,
            company_name: paraJson.companyName
        });

        $('#kpiObject').html(showValue + '<input type="hidden" name="sels" value=\'' + JSON.stringify(userSelVal) + '\'>');
    }
    if (paraJson.id.toString().IsNum()) {
        getTemplatRecord(paraJson.id);
    }

    //考核人设置
    kpiAuditBody.on('click', '.kpiAudit', function() {
        var valObj = $(this).find('.kpiAuditValue');
        user_popup(valObj, 'dpt_position', 1, false, function(result) {
            if (result != null) {
                var jobJson = result.dpt_position[0];
                setAuit(jobJson, result, valObj);
            }
        });
    });

    //初始化
    getKpiContent();

    kpiConObj.on('click', '.evaluationPopup', function() {
        assess_popup(null, 'checkbox', function(result) {
            setEvaluationData(result, 0);
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
        var dataUser = [];
        var userValue = $('#kpiObject').find('input[name="sels"]').val();
        if (!userValue) {
            layer_alert('请选择考核对象');
            return false;
        }
        var userJson = JSON.parse(userValue).user;
        if (userJson.length == 0) {
            layer_alert('请选择考核对象');
            return false;
        }

        //考核审核
        var dataAudit = [],
            errorAudit = '';
        kpiAuditBody.find('tr').each(function() {
            var pObj = $(this);
            var error = true;
            pObj.find('.kpiAudit').each(function() {
                var cObj = $(this);
                var spanObj = cObj.find('.kpiAuditValue');
                var value = spanObj.find('input[name="sels"]').val();
                if (!value) {
                    errorAudit = '请设置相关审核人';
                    error = false;
                    return false;
                }
                var vJson = JSON.parse(value);
                var model = vJson.dpt_position[0];
                dataAudit.push({
                    steps: cObj.attr('data-steps'),
                    companyId: model.company_id,
                    companyName: model.company_name,
                    dptId: model.dpt_id,
                    dptName: model.dpt_name,
                    jobId: model.job_id,
                    jobName: model.name,
                });
            });
            if (!error) {
                return false;
            }
        });
        if (!errorAudit.isEmpty()) {
            layer_alert(errorAudit);
            return false;
        }
        if (dataAudit.length == 0) {
            layer_alert('请设置审核人');
            return false;
        }
        // console.log(dataAudit);

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
                evaluationId: valJson.evaluationId,
                evaluationName: valJson.evaluationName,
                evaluationType: valJson.evaluationType,
                weight: weightVal,
                explain: explainVal
            });
        });
        if (dataDetail.length == 0) {
            layer_alert('请设置考核内容');
            return false;
        }
        // console.log(dataDetail);

        var kpiId = $('#kpiSelect').val(),
            kpiName = $('#kpiSelect').find('option:selected').text();
        $.each(userJson, function(i, item) {
            dataUser.push({
                id: paraJson.id || 0,
                kpiType: paraJson.kpiType,
                kpiId: kpiId,
                kpiName: kpiName,
                companyId: item.company_id,
                companyName: item.company_name,
                dptId: item.dpt_id,
                dptName: item.dpt_name,
                employeeId: item.id,
                userName: item.name,
                contents: JSON.stringify(dataDetail),
                audits: JSON.stringify(dataAudit)
            });
        });

        //验证是否是 同一个部门下面的
        for (var i = 0; i < dataUser.length; i++) {
            var flag = true;
            for (var j = i + 1; j < dataUser.length; j++) {
                //第一个等同于第二个，splice方法删除第二个
                if (dataUser[i].companyId != dataUser[j].companyId || dataUser[i].dptId != dataUser[j].dptId) {
                    dataUser.splice(j, 1);
                    j--;
                    flag = false;
                }
            }
            if (!flag) {
                layer_alert('您设置的考核对象包含不同公司和部门，请检查');
                return false;
            }
        }
        if (dataUser.length == 0) {
            layer_alert('请选择考核对象');
            return false;
        }

        var modelSub = {
            kpiType: paraJson.kpiType,
            kpiId: kpiId,
            templateRecord: dataUser
        };

        Serv.Post('gc/kpievaluation/edittemplat', modelSub, function(result) {
            layer_load_lose();
            if (result.succeed) {
                layer_alert(result.message, function() {
                    window.location.href = '/pages/kpi/userTplList.html';
                });
            } else {
                layer_alert(result.message);
            }
        });

        return false;
    });

    //获取详情
    function getTemplatRecord(value) {
        layer_load();
        Serv.Get('gc/kpievaluation/gettemplatrecord/' + value, {}, function(result) {
            layer_load_lose();
            if (result) {

                if (isJson(result.contents)) {
                    setEvaluationData(JSON.parse(result.contents), 1);
                }
                if (isJson(result.audits)) {
                    var auditsData = JSON.parse(result.audits);
                    $.each(auditsData, function(i, item) {
                        var obj = kpiAuditBody.find('[data-steps="' + item.steps + '"]');
                        if (obj.length > 0) {
                            var valObj = obj.find('.kpiAuditValue');
                            var tempModel = {
                                id: item.dptId + '_' + item.jobId,
                                name: item.jobName,
                                job_id: item.jobId,
                                dpt_id: item.dptId,
                                dpt_name: item.dptName,
                                company_id: item.companyId,
                                company_name: item.companyName
                            };
                            var userSelVal = getUserPopModel();
                            userSelVal.dpt_position.push(tempModel);
                            setAuit(tempModel, userSelVal, valObj);
                        }
                    });
                }
            } else {
                layer_alert(result.message);
            }
        });
    }

    //设置考核内容
    function setEvaluationData(data, type) {
        if (data.length > 0) {
            var dataNew = data;
            if (type == 0) {
                dataNew = [];
                dataNew = $.map(data, function(item) {
                    var parentObj = kpiConObj.find('tr[data-id="' + item.id + '"]');
                    if (parentObj.length == 0) {
                        return {
                            evaluationId: item.id,
                            evaluationName: item.name,
                            evaluationType: item.evaluationTypeName,
                            weight: item.weight || '',
                            explain: item.explain || '',
                        };
                    }
                });
            }
            if (hasKpiConInit == 0) {
                kpiConObj.empty();
            }
            hasKpiConInit = 1;
            if (dataNew.length > 0) {
                kpiConObj.find('tr[data-id=""]').remove();
                kpiConObj.append(getKpiContent(dataNew));
            }
        }
    }
    //获取考核内容模板
    function getKpiContent(data) {
        data = data || [];
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
                layer_alert('请输入[' + valJson.evaluationName + ']栏中的[权重(分值)]项');
                hasResult = false;
                return false;
            }
            if (!weightVal.IsNum()) {
                layer_alert('[' + valJson.evaluationName + ']栏中的[权重(分值)]项的格式错误(只能为数字)');
                hasResult = false;
                return false;
            }
        });
        return hasResult;
    }

    //设置审核人
    function setAuit(model, data, obj) {
        var showValue = defaultSel;
        if (model) {
            showValue = (model.company_name.length > 9 ? (model.company_name.substr(0, 9) + '...') : model.company_name) + ' - ' + model.name;
        }
        obj.html(showValue + '<input type="hidden" name="sels" value=\'' + JSON.stringify(data) + '\'>');
    }

});