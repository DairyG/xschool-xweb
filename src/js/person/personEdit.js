var data = {
    hasInit: {
        roles: true,
    },

    currTab: '',

    person: {},
    training: {
        id: 0,
        course: '',
        institutions: '',
        startDate: '',
        endDate: '',
        address: '',
        content: '',
        honor: '',
        attachment: ''
    },

    companyId: 0,
    employeeId: 0,

    basicArrival: [], //到岗时间
    basicEducation: [], //学历
    basicProperties: [], //教育性质
    basicRelations: [], //社会关系
    basicRecruitment: [], //招聘来源

    basicJob: [], //所属职位
    departmentData: [], //部门数据

    familyData: [], //家庭成员
    educationData: [], //教育经历
    workData: [], //职位
};

layui.use(['element', 'form', 'table', 'laydate', 'upload'], function() {
    var element = layui.element,
        table = layui.table,
        laydate = layui.laydate,
        form = layui.form,
        upload = layui.upload;

    var formBasic = $('#formBasic'),
        formJobs = $('#formJobs'),
        formRoles = $('#formRoles'),
        formTraining = $('#formTraining');
    var dptZTreeObj = null,
        dptInputObj = $('#dptName');
    var seltDegree = $('#seltDegree'),
        seltRecruitment = $('#seltRecruitment'),
        seltArrival = $('#seltArrival'),
        seltJob = $('#seltJob');

    var attachmentPanel = $('#attachmentPanel'),
        photoPathPanel = $('#photoPathPanel'),
        certificatePanel = $('#certificatePanel');

    var id = GetPara('id');
    id = !id ? '' : id;

    getBasic();

    dptZTreeObj = new ZTreeRadio('dptName', 'deptTreeContent', 'deptTree', {
        dataMode: 'dpt',
    }, function(event, treeId, treeNode) {
        if (treeNode.id < 0) {
            layer_msg('请选择公司下面的部门');
            return false;
        }
        setDpt(treeNode);
        dptZTreeObj.hideZTree();
    });
    dptZTreeObj.reload();
    dptInputObj.on('click', function() {
        dptZTreeObj.showZTree();
    });

    //身份证
    $('input[name="idCard"]').blur(function() {
        var value = $.trim($(this).val());
        if (value && IsCard(value) == '') {
            var birthday = getBirthdayFromIdCard(value);
            var age = getAgeFromIdCard(value);

            formBasic.find('input[name="age"]').val(age);
            formBasic.find('input[name="birthDay"]').val(birthday);
        }
    });
    //出生日期
    laydate.render({
        elem: '#birthDay'
    });
    //毕业时间
    laydate.render({
        elem: '#graduationDate'
    });
    //成长 开始时间
    laydate.render({
        elem: '#startDate'
    });
    //成长 结束时间
    laydate.render({
        elem: '#endDate'
    });

    //成长管理 图片上传
    upload.render({
        elem: '#attachmentBtn',
        url: Serv.ImageUrl,
        accept: 'images',
        acceptMime: 'image/*',
        headers: Serv.GetHeaders(),
        before: function(obj) {
            layer_load();
        },
        done: function(result) {
            layer_load_lose();
            attachmentPanel.append(setImageHtml(result.data[0]));
        },
        error: function() {
            layer_load_lose();
        }
    });
    //个人照片 图片上传
    upload.render({
        elem: '#photoPathBtn',
        url: Serv.ImageUrl,
        accept: 'images',
        acceptMime: 'image/*',
        headers: Serv.GetHeaders(),
        before: function(obj) {
            layer_load();
        },
        done: function(result) {
            layer_load_lose();
            photoPathPanel.append(setImageHtml(result.data[0]));
        },
        error: function() {
            layer_load_lose();
        }
    });
    //证书证件 上传
    upload.render({
        elem: '#certificateBtn',
        url: Serv.ImageUrl,
        accept: 'file',
        headers: Serv.GetHeaders(),
        before: function(obj) {
            layer_load();
        },
        done: function(result) {
            layer_load_lose();
            certificatePanel.append(setAttachHtml(result.data[0]));
        },
        error: function() {
            layer_load_lose();
        }
    });

    if (id.IsNum()) {
        getPerson(id);
    } else {
        initBasic();
    }

    element.on('tab(componentTabs)', function(event) {
        var text = $(this).text();
        if (text == '角色设置' && data.currTab != '角色设置') {
            data.currTab = text;
            getRoleRoles(id);
        }
    });

    //个人信息-> 提交
    form.on('submit(basicInfo)', function(laydata) {
        layer_load();

        laydata.field.idCardProvince = '';
        laydata.field.idCardCity = '';
        laydata.field.idCardCounty = '';
        laydata.field.idCardArea = '';
        //身份证地址
        if ($.trim(laydata.field.idCardAddress)) {
            var idCardAreaCode = formBasic.find('input[name="idCardArea"]').attr('data-areacode');
            var idCardAreaArr = idCardAreaCode.split(',');
            if (!idCardAreaCode) {
                layer_alert('请选择身份证地址的省市区');
                return false;
            }
            if (idCardAreaArr.length != 3 && (idCardAreaCode != '710000' && idCardAreaCode != '810000' && idCardAreaCode != '820000')) {
                layer_alert('居住地址必须选择省市区');
                return false;
            }

            laydata.field.idCardProvince = idCardAreaArr[0] || '';
            laydata.field.idCardCity = idCardAreaArr[1] || '';
            laydata.field.idCardCounty = idCardAreaArr[2] || '';
            laydata.field.idCardArea = formBasic.find('input[name="idCardArea"]').val();
        }

        laydata.field.liveProvince = '';
        laydata.field.liveCity = '';
        laydata.field.liveCounty = '';
        //居住地址
        if ($.trim(laydata.field.liveAddress)) {
            var liveAreaCode = formBasic.find('input[name="liveArea"]').attr('data-areacode');
            var liveAreaArr = liveAreaCode.split(',');
            if (!liveAreaCode) {
                layer_alert('请选择居住地址的省市区');
                return false;
            }
            if (liveAreaArr.length != 3 && (liveAreaCode != '710000' && liveAreaCode != '810000' && liveAreaCode != '820000')) {
                layer_alert('居住地址必须选择省市区');
                return false;
            }

            laydata.field.liveProvince = liveAreaArr[0] || '';
            laydata.field.liveCity = liveAreaArr[1] || '';
            laydata.field.liveCounty = liveAreaArr[2] || '';
            laydata.field.liveArea = formBasic.find('input[name="liveArea"]').val();
        }

        var photoData = [];
        photoPathPanel.find('input[data-name="image"]').each(function() {
            photoData.push($(this).val());
        });
        laydata.field.photoPath = photoData.join(',');

        var certificateData = [];
        certificatePanel.find('input[data-name="attach"]').each(function() {
            certificateData.push($(this).val());
        });
        laydata.field.certificatePath = certificateData.join(',');

        //家庭成员
        var hasFamily = validateFamily($('#familyPanel').find('div.layui-table-body'), true);
        if (!hasFamily) {
            return false;
        }
        laydata.field.family = '';
        if (data.familyData.length > 0) {
            laydata.field.family = JSON.stringify(data.familyData);
        }

        //教育经历
        var hasEducation = validateEducation($('#educationPanel').find('div.layui-table-body'), true);
        if (!hasEducation) {
            return false;
        }
        laydata.field.education = '';
        if (data.educationData.length > 0) {
            laydata.field.education = JSON.stringify(data.educationData);
        }

        //工作经历
        var hasWork = validateWork($('#workPanel').find('div.layui-table-body'), true);
        if (!hasWork) {
            return false;
        }
        laydata.field.work = '';
        if (data.workData.length > 0) {
            laydata.field.work = JSON.stringify(data.workData);
        }
        // console.log(laydata.field);

        Serv.Post('uc/employee/edit?operation=1', laydata.field, function(result) {
            layer_load_lose();
            if (result.succeed) {
                data.employeeId = result.data;
                $('input[name="id"]').val(result.data);

                data.person = {};
                $.extend(true, data.person, laydata.field);

                layer_alert(result.message);
            } else {
                layer_alert(result.message);
            }
        });
        return false;
    });

    //职位信息-> 提交
    form.on('submit(positionInfo)', function(laydata) {
        layer_load();
        if (data.person.id <= 0) {
            layer_alert('请先填写个人信息');
            return false;
        }
        if (laydata.field.status == 0) {
            layer_alert('请选择在职状态');
            return false;
        }

        $.extend(true, data.person, laydata.field);
        Serv.Post('uc/employee/edit?operation=2', data.person, function(result) {
            layer_load_lose();
            if (result.succeed) {
                layer_alert(result.message);
            } else {
                layer_alert(result.message);
            }
        });
        return false;
    });

    //角色设置-> 选择
    // form.on('select(multi)', function (data) { // 打开控制台查看效果
    //     onsole.log(data.elem); //得到select原始DOM对象
    //     console.log(data.value); //得到被选中的值（数组类型）
    //     console.log(data.othis); //得到美化后的DOM对象
    //     console.log(data.current_value); //当前操作的值（选中或取消的值）
    // })
    //角色设置-> 提交
    form.on('submit(submitRoles)', function(laydata) {
        layer_load();
        if (data.person.id <= 0) {
            layer_alert('请先填写个人信息');
            return false;
        }
        var status = formJobs.find('select[name="status"]').val();
        if (status == 3) {
            layer_alert('请勿操作离职人员数据');
            return false;
        }
        if (!laydata.field.roleRoles) {
            layer_alert('请选择角色');
            return false;
        }

        var roleIds = [];
        $.each(laydata.field.roleRoles, function(i, item) {
            roleIds.push(parseInt(item));
        });
        if (roleIds.length == 0) {
            layer_alert('请选择角色');
            return false;
        }
        Serv.Post('gc/power/editrolebyemployee', {
            employeeId: data.person.id,
            roleIds: roleIds
        }, function(result) {
            layer_load_lose();
            if (result.succeed) {
                layer_alert(result.message);
            } else {
                layer_alert(result.message);
            }
        });
        return false;
    });

    //成长管理-> 提交
    form.on('submit(training)', function(laydata) {
        layer_load();
        if (data.employeeId <= 0) {
            layer_alert('请先填写个人信息');
            return false;
        }
        if (!compareDate(laydata.field.endDate, laydata.field.startDate)) {
            layer_alert('结束时间不能小于开始时间');
            return false;
        }
        laydata.field.employeeId = data.employeeId;

        var attData = [];
        attachmentPanel.find('input[data-name="image"]').each(function() {
            attData.push($(this).val());
        });
        laydata.field.attachment = attData.join(',');

        Serv.Post('gc/training/edit', laydata.field, function(result) {
            layer_load_lose();
            if (result.succeed) {
                formTraining.find('input[name="id"]').val(result.data);
                layer_confirm('操作成功，确定继续吗？', function() {
                    attachmentPanel.find('li').remove();
                    form.val("formTraining", data.training);
                });
            } else {
                layer_alert(result.message);
            }
        });
        return false;
    });

    //个人信息-> 初始化
    function initBasic(result) {
        intiFamily();
        initEducation();
        initWork();

        $('._idCardArea').jarea();
        $('._idCardArea').jarea('val');
        $('._liveArea').jarea();
        $('._liveArea').jarea('val');

        getSelectHtml(seltDegree, data.basicEducation, result ? result.degree : '');
        getSelectHtml(seltRecruitment, data.basicRecruitment, result ? result.recruitSource : '');
        getSelectHtml(seltArrival, data.basicArrival, result ? result.arrivalTime : '');
    }
    //个人信息-> 获取人员信息
    function getPerson(value) {
        layer_load();
        Serv.Get('uc/employee/get/' + value, {}, function(result) {
            layer_load_lose();
            if (result) {
                data.employeeId = result.id;
                data.companyId = result.companyId;

                data.person = {};

                result.birthDay = result.birthDay.FormatDate(false);
                result.graduationDate = result.graduationDate.FormatDate(false);
                $.extend(true, data.person, result);
                form.val("formBasic", result);
                form.val("formPosition", result);

                var idCardAreaCode = '';
                if (result.idCardProvince == '710000' || result.idCardProvince == '810000' || result.idCardProvince == '820000') {
                    idCardAreaCode = result.idCardProvince;
                } else if (result.idCardProvince && result.idCardCity && result.idCardCounty) {
                    idCardAreaCode = result.idCardProvince + ',' + result.idCardCity + ',' + result.idCardCounty;
                }
                formBasic.find('input[name="idCardArea"]').attr('data-areacode', idCardAreaCode).val(result.idCardArea);

                var liveAreaCode = '';
                if (result.liveProvince == '710000' || result.liveProvince == '810000' || result.liveProvince == '820000') {
                    liveAreaCode = result.liveProvince;
                } else if (result.liveProvince && result.liveCity && result.liveCounty) {
                    liveAreaCode = result.liveProvince + ',' + result.liveCity + ',' + result.liveCounty;
                }
                formBasic.find('input[name="liveArea"]').attr('data-areacode', liveAreaCode).val(result.liveArea);

                if (result.photoPath) {
                    var fileArr = result.photoPath.split(',');
                    $.each(fileArr, function(i, item) {
                        photoPathPanel.append(setImageHtml(item));
                    });

                    imagesViewer();
                }
                if (result.certificatePath) {
                    var fileArr = result.certificatePath.split(',');
                    $.each(fileArr, function(i, item) {
                        certificatePanel.append(setAttachHtml(item));
                    });
                }

                if (result.family) {
                    data.familyData = JSON.parse(result.family);
                }
                if (result.education) {
                    data.educationData = JSON.parse(result.education);
                }
                if (result.work) {
                    data.workData = JSON.parse(result.work);
                }

                dptInputObj.attr('data-id', result.dptId);
                dptZTreeObj.setCheck();
                getJob(data.person.companyId, result.jobId);

                initBasic(result);
            } else {
                $('.hasSubmit').hide();
                layer_alert(result.message);
            }
        });
    }
    //个人信息-> 获取基础信息
    function getBasic() {
        data.basicArrival = window.globCache.getArrival() || [];
        data.basicEducation = window.globCache.getEducation() || [];
        data.basicProperties = window.globCache.getProperties() || [];
        data.basicRelations = window.globCache.getRelations() || [];
        data.basicRecruitment = window.globCache.getRecruitment() || [];
    }
    //个人信息-> 获取下拉Html
    function getSelectHtml(obj, data, value) {
        obj.empty().append('<option value="">请选择</option>');
        $.each(data, function(i, item) {
            obj.append('<option value="' + item.id + '" ' + (item.id == value ? 'selected' : '') + '>' + item.name + '</option>');
        });
        form.render('select');
    }
    //个人信息-> 设置部门
    function setDpt(model) {
        dptInputObj.prev().val(model.id);
        dptInputObj.val(model.dptName).attr('data-id', model.id);
        if (data.companyId != model.companyId) {
            data.companyId = model.companyId;
            $('input[name="companyId"]').val(model.companyId);
            getJob(model.companyId);
        }
    }
    //个人信息-> 获取职位
    function getJob(cId, value) {
        Serv.Post('uc/job/get', {
            page: 1,
            limit: 50,
            companyId: cId
        }, function(result) {
            layer_load_lose();
            if (result) {
                getSelectHtml(seltJob, result.items, value || '');
            } else {
                layer_alert(result.message);
            }
        });
    }

    //个人信息-> 初始化 家庭成员
    function intiFamily() {
        var len = data.familyData.length;
        if (len == 0) {
            intiFamilyData(true);
        }

        var cols = [
            [{
                    field: 'Number',
                    title: '序号',
                    width: 90,
                    templet: function(d) {
                        return getOperationTpl('family');
                    }
                },
                {
                    field: 'FamName',
                    title: '姓名',
                    templet: function(d) {
                        return getInputTpl('FamName', d.FamName, 10);
                    }
                },
                {
                    field: 'FamRelations',
                    title: '关系',
                    templet: function(d) {
                        return getSelectTpl(data.basicRelations, 'FamRelations', d.FamRelations);
                    }
                },
                {
                    field: 'FamLinkPhone',
                    title: '电话',
                    templet: function(d) {
                        return getInputTpl('FamLinkPhone', d.FamLinkPhone, 20);
                    }
                },
                {
                    field: 'FamAddress',
                    title: '通讯地址',
                    templet: function(d) {
                        return getInputTpl('FamAddress', d.FamAddress, 100);
                    }
                }
            ]
        ];

        table.render({
            elem: '#familyTable',
            data: data.familyData,
            cols: cols
        });

        table.on('tool(familyTable)', function(obj) {
            if (obj.event == 'familyAdd') {
                layer_load();
                var hasResult = validateFamily(obj.tr, false);
                if (!hasResult) {
                    layer_load_lose();
                    return false;
                }

                intiFamilyData(false);
                reloadTable('familyTable', data.familyData);
            } else if (obj.event == 'familyDel') {
                layer_confirm('确定删除吗？', function() {
                    if (data.familyData.length > 1) {
                        removeData(obj.data.Number, data.familyData);
                        obj.tr.remove();
                    } else {
                        intiFamilyData(true);
                        reloadTable('familyTable', data.familyData);
                    }
                });
            }
        });
    }
    //个人信息-> 初始化 家庭成员数据
    function intiFamilyData(hasInit) {
        if (hasInit) {
            data.familyData = [];
        }
        data.familyData.push({
            "Number": data.familyData.length + 1,
            "FamName": '',
            "FamRelations": '',
            "FamLinkPhone": '',
            "FamAddress": ''
        });
    }
    //个人信息-> 验证 家庭成员
    function validateFamily(obj, hasSubmit) {
        var hasResult = true;
        data.familyData = [];
        obj = hasSubmit ? obj : obj.parents('table');

        obj.find('tr').each(function() {
            var name = $.trim($(this).find('input[data-name="FamName"]').val());
            var relations = $(this).find('select[data-name="FamRelations"]').val();
            var linkPhone = $(this).find('input[data-name="FamLinkPhone"]').val();
            var address = $.trim($(this).find('input[data-name="FamAddress"]').val());

            //是否提交数据
            if (hasSubmit && (!name && !relations && !linkPhone && !address)) {
                hasResult = true;
                return false;
            }

            if (!name) {
                layer_alert('请输入[家庭成员项]中的姓名');
                hasResult = false;
                return false;
            }

            if (!relations) {
                layer_alert('请选择[家庭成员项]中的关系');
                hasResult = false;
                return false;
            }

            if (!linkPhone) {
                layer_alert('请输入[家庭成员项]中的电话');
                hasResult = false;
                return false;
            }
            if (!linkPhone.IsMobile() && !linkPhone.IsTelPhone()) {
                layer_alert('[家庭成员项]中的电话格式错误');
                hasResult = false;
                return false;
            }
            if (!address) {
                layer_alert('请输入[家庭成员项]中的通讯地址');
                hasResult = false;
                return false;
            }

            data.familyData.push({
                "Number": data.familyData.length + 1,
                "FamName": name,
                "FamRelations": relations,
                "FamLinkPhone": linkPhone,
                "FamAddress": address
            });
        });

        return hasResult;
    }

    //个人信息-> 初始化 教育经历
    function initEducation() {
        var len = data.educationData.length;
        if (len == 0) {
            initEducationData(true);
        }

        var cols = [
            [{
                    field: 'Number',
                    title: '序号',
                    width: 90,
                    templet: function(d) {
                        return getOperationTpl('education');
                    }
                },
                {
                    field: 'EduFinishSchool',
                    title: '毕业院校',
                    templet: function(d) {
                        return getInputTpl('EduFinishSchool', d.EduFinishSchool, 50);
                    }
                },
                {
                    field: 'EduDegree',
                    title: '学历',
                    templet: function(d) {
                        return getSelectTpl(data.basicEducation, 'EduDegree', d.EduDegree);
                    }
                },
                {
                    field: 'EduNature',
                    title: '性质',
                    templet: function(d) {
                        return getSelectTpl(data.basicProperties, 'EduNature', d.EduNature);
                    }
                },
                {
                    field: 'EduProfessional',
                    title: '专业',
                    templet: function(d) {
                        return getInputTpl('EduProfessional', d.EduProfessional, 50);
                    }
                },
                {
                    field: 'EduTime',
                    title: '学习年限',
                    event: 'EduTime',
                    templet: function(d) {
                        return getTimeTpl(d.Number, 'EduTime', d.EduTime);
                    }
                }
            ]
        ];

        table.render({
            elem: '#educationTable',
            data: data.educationData,
            cols: cols
        });

        table.on('tool(educationTable)', function(obj) {
            if (obj.event == 'EduTime') {
                showLaydate('.EduTime-' + obj.data.Number);
            } else if (obj.event == 'educationAdd') {
                layer_load();
                var hasResult = validateEducation(obj.tr, false);
                if (!hasResult) {
                    layer_load_lose();
                    return false;
                }

                initEducationData(false);
                reloadTable('educationTable', data.educationData);
            } else if (obj.event == 'educationDel') {
                layer_confirm('确定删除吗？', function() {
                    if (data.educationData.length > 1) {
                        removeData(obj.data.Number, data.educationData);
                        obj.tr.remove();
                    } else {
                        initEducationData(true);
                        reloadTable('educationTable', data.educationData);
                    }
                });
            }
        });
    }
    //个人信息-> 初始化 教育经历数据
    function initEducationData(hasInit) {
        if (hasInit) {
            data.educationData = [];
        }
        data.educationData.push({
            "Number": data.educationData.length + 1,
            "EduFinishSchool": '',
            "EduDegree": '',
            "EduNature": '',
            "EduProfessional": '',
            "EduTime": ''
        });
    }
    //个人信息-> 验证 教育经历
    function validateEducation(obj, hasSubmit) {
        var hasResult = true;
        data.educationData = [];

        obj = hasSubmit ? obj : obj.parents('table');

        obj.find('tr').each(function() {
            var finishSchool = $.trim($(this).find('input[data-name="EduFinishSchool"]').val());
            var degree = $(this).find('select[data-name="EduDegree"]').val();
            var nature = $(this).find('select[data-name="EduNature"]').val();
            var professional = $.trim($(this).find('input[data-name="EduProfessional"]').val());
            var eduTime = $.trim($(this).find('input[data-name="EduTime"]').val());

            //是否提交数据
            if (hasSubmit && (!finishSchool && !degree && !nature && !professional && !eduTime)) {
                hasResult = true;
                return false;
            }

            if (!finishSchool) {
                layer_alert('请输入[教育经历项]中的毕业院校');
                hasResult = false;
                return false;
            }
            if (!degree) {
                layer_alert('请选择[教育经历项]中的学历');
                hasResult = false;
                return false;
            }
            if (!nature) {
                layer_alert('请选择[教育经历项]中的性质');
                hasResult = false;
                return false;
            }
            if (!professional) {
                layer_alert('请输入[教育经历项]中的专业');
                hasResult = false;
                return false;
            }
            if (!eduTime) {
                layer_alert('请选择[教育经历项]中的学习年限');
                hasResult = false;
                return false;
            }

            data.educationData.push({
                "Number": data.educationData.length + 1,
                "EduFinishSchool": finishSchool,
                "EduDegree": degree,
                "EduNature": nature,
                "EduProfessional": professional,
                "EduTime": eduTime
            });
        });

        return hasResult;
    }

    //个人信息-> 初始化 工作经历
    function initWork() {
        var len = data.workData.length;
        if (len == 0) {
            initWorkData(true);
        }

        var cols = [
            [{
                    field: 'Number',
                    title: '序号',
                    width: 90,
                    templet: function(d) {
                        return getOperationTpl('work');
                    }
                },
                {
                    field: 'WorkTime',
                    title: '工作年限',
                    event: 'WorkTime',
                    templet: function(d) {
                        return getTimeTpl(d.Number, 'WorkTime', d.WorkTime);
                    }
                },
                {
                    field: 'WorkCompanyName',
                    title: '公司名称',
                    templet: function(d) {
                        return getInputTpl('WorkCompanyName', d.WorkCompanyName, 50);
                    }
                },
                {
                    field: 'WorkDepartment',
                    title: '部门',
                    templet: function(d) {
                        return getInputTpl('WorkDepartment', d.WorkDepartment, 50);
                    }
                },
                {
                    field: 'WorkPosition',
                    title: '职位',
                    templet: function(d) {
                        return getInputTpl('WorkPosition', d.WorkPosition, 50);
                    }
                },
                {
                    field: 'WorkDescribe',
                    title: '主要成绩',
                    templet: function(d) {
                        return getTextareaTpl('WorkDescribe', d.WorkDescribe);
                    }
                },
                {
                    field: 'WorkQuitReason',
                    title: '离职原因',
                    templet: function(d) {
                        return getInputTpl('WorkQuitReason', d.WorkQuitReason, 200);
                    }
                }
            ]
        ];

        table.render({
            elem: '#workTable',
            data: data.workData,
            cols: cols
        });

        table.on('tool(workTable)', function(obj) {
            if (obj.event == 'WorkTime') {
                showLaydate('.WorkTime-' + obj.data.Number);
            } else if (obj.event == 'workAdd') {
                layer_load();
                var hasResult = validateWork(obj.tr, false);
                if (!hasResult) {
                    layer_load_lose();
                    return false;
                }

                initWorkData(false);
                reloadTable('workTable', data.workData);
            } else if (obj.event == 'workDel') {
                layer_confirm('确定删除吗？', function() {
                    if (data.workData.length > 1) {
                        removeData(obj.data.Number, data.workData);
                        obj.tr.remove();
                    } else {
                        initWorkData(true);
                        reloadTable('workTable', data.workData);
                    }
                });
            }
        });
    }
    //个人信息-> 初始化 工作经历数据
    function initWorkData(hasInit) {
        if (hasInit) {
            data.workData = [];
        }
        data.workData.push({
            "Number": data.workData.length + 1,
            "WorkTime": '',
            "WorkCompanyName": '',
            "WorkDepartment": '',
            "WorkPosition": '',
            "WorkDescribe": '',
            "WorkQuitReason": '',
        });
    }
    //个人信息-> 验证 工作经历
    function validateWork(obj, hasSubmit) {
        var hasResult = true;
        data.workData = [];

        obj = hasSubmit ? obj : obj.parents('table');

        obj.find('tr').each(function() {
            var workTime = $.trim($(this).find('input[data-name="WorkTime"]').val());
            var companyName = $.trim($(this).find('input[data-name="WorkCompanyName"]').val());
            var department = $.trim($(this).find('input[data-name="WorkDepartment"]').val());
            var position = $.trim($(this).find('input[data-name="WorkPosition"]').val());
            var workDescribe = $.trim($(this).find('textarea[data-name="WorkDescribe"]').val());
            var quitReason = $.trim($(this).find('input[data-name="WorkQuitReason"]').val());

            //是否提交数据
            if (hasSubmit && (!workTime && !companyName && !department && !position && !workDescribe && !quitReason)) {
                hasResult = true;
                return false;
            }

            if (!workTime) {
                layer_alert('请选择[工作经历项]中的工作年限');
                hasResult = false;
                return false;
            }
            if (!companyName) {
                layer_alert('请输入[工作经历项]中的公司名称');
                hasResult = false;
                return false;
            }
            if (!department) {
                layer_alert('请输入[工作经历项]中的部门');
                hasResult = false;
                return false;
            }
            if (!position) {
                layer_alert('请输入[工作经历项]中的职位');
                hasResult = false;
                return false;
            }
            if (!workDescribe) {
                layer_alert('请输入[工作经历项]中的主要成绩');
                hasResult = false;
                return false;
            }
            if (!quitReason) {
                layer_alert('请输入[工作经历项]中的离职原因');
                hasResult = false;
                return false;
            }

            data.workData.push({
                "Number": data.workData.length + 1,
                "WorkTime": workTime,
                "WorkCompanyName": companyName,
                "WorkDepartment": department,
                "WorkPosition": position,
                "WorkDescribe": workDescribe,
                "WorkQuitReason": quitReason
            });
        });

        return hasResult;
    }

    //个人信息-> 重新渲染 家庭成员/教育经历/工作经历
    function reloadTable(elem, data) {
        table.reload(elem, {
            data: data,
            done: function() {
                layer_load_lose();
            }
        });
    }
    //个人信息-> 移除数据 家庭成员/教育经历/工作经历
    function removeData(id, data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].Number == id) {
                data.splice(i, 1);
                return false;
            }
        }
    }
    //个人信息-> 显示日期 家庭成员/教育经历/工作经历
    function showLaydate(elem) {
        laydate.render({
            elem: elem,
            type: 'month',
            show: true,
            range: '~'
        });
    }
    //个人信息-> 时间范围模板 家庭成员/教育经历/工作经历
    function getTimeTpl(id, name, value) {
        return '<input type="text" data-name="' + name + '" class="layui-input ' + name + '-' + id + '" readonly value="' + value + '" />';
    }
    //个人信息-> 操作模板 家庭成员/教育经历/工作经历
    function getOperationTpl(name) {
        return '<span class="table-btn-jia" lay-event="' + name + 'Add">+</span><span class="table-btn-jian" lay-event="' + name + 'Del">-</span>';
    }
    //个人信息-> input模板 家庭成员/教育经历/工作经历
    function getInputTpl(name, value, maxlength) {
        maxlength = !maxlength ? 50 : maxlength;
        return '<input type="text" data-name="' + name + '" maxlength="' + maxlength + '" class="layui-input" value="' + value + '" />';
    }
    //个人信息-> textarea模板 家庭成员/教育经历/工作经历
    function getTextareaTpl(name, value) {
        return '<textarea class="layui-input" data-name="' + name + '" style="resize:none" readonly onclick="layui_prompt(this)">' + value + '</textarea>';
    }
    //个人信息-> select模板 家庭成员/教育经历/工作经历
    function getSelectTpl(data, name, value) {
        var html = '<select data-name="' + name + '">';
        html += '<option value="">请选择</option>';
        $.each(data, function(i, item) {
            html += '<option value="' + item.name + '" ' + (item.name == value ? "selected" : "") + '>' + item.name + '</option>';
        })
        html += '</select>';
        return html;
    }


    //角色设置-> 获取角色
    function getRoleRoles(employeeId) {
        layer_load('数据加载中，请耐心等待...');
        Serv.Get('gc/power/queryrole', {}, function(result) {
            layer_load_lose();
            if (result) {
                var rolesSelObj = formRoles.find('select[name="roleRoles"]');
                rolesSelObj.empty().append('<option value="">请选择角色</option>');
                $.each(result, function(i, item) {
                    rolesSelObj.append('<option value="' + item.id + '">' + item.name + '</option>');
                });
                if (employeeId.IsNum()) {
                    getRoleRoleByEmployee(employeeId);
                } else {
                    form.render();
                }
            } else {
                layer_alert(tips.noDataTip);
            }
        });
    }
    //角色设置-> 获取角色
    function getRoleRoleByEmployee(value) {
        layer_load('数据加载中，请耐心等待...');
        Serv.Get('gc/power/queryrolebyemployee/' + value, {}, function(result) {
            layer_load_lose();
            if (result) {
                var roleIds = [];
                $.each(result, function(i, item) {
                    roleIds.push(item.secondId);
                });
                formRoles.find('select[name="roleRoles"]').val(roleIds);

                form.render();
            } else {
                form.render();
            }
        });
    }

    //成长管理-> 表单赋值
    form.val('formTraining', data.training);


    //图片预览
    function imagesViewer() {
        $(".v-images").viewer({
            title: false
        });
    }
});