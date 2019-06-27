var vm = new Vue({
    el: '#personBody',
    data: {
        hasSubmit: false,
        person: {
            id: 0,
            //先给默认值
            companyId: 1,
            userName: '',
            englishName: '',
            gender: 1,
            linkPhone: '',
            email: '',
            qq: '',
            folk: '',
            nativePlace: '',
            politicalStatus: '',
            idCard: '',
            age: '',
            birthDay: '',
            graduateInstitutions: '',
            professional: '',
            degree: '',
            graduationDate: '',
            stature: '',
            weight: '',
            marriage: '未婚',
            children: '无',
            recruitSource: '',
            jobCandidates: '',
            expectSalary: '',
            arrivalTime: '',
            idCardProvince: '',
            idCardCity: '',
            idCardCounty: '',
            idCardArea: '',
            idCardAddress: '',
            liveProvince: '',
            liveCity: '',
            liveCounty: '',
            liveArea: '',
            liveAddress: '',
            hobby: '',
            photoPath: '',
            certificatePath: '',
            family: '',
            education: '',
            work: '',
            departmentId: '0',
            positionId: '0',
            employeeNo: '',
            officePhone: '',
            officeEmail: '',
            faxNumber: '',
            referees: '',
            officeAddress: '',
            positionDescribe: '',
            status: 0,
        },

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

        dptZTreeObj: null, //部门树
    },
    mounted: function () {
        var _this = this;
        var id = GetPara('id');
        id = !id ? '' : id;

        _this.dptZTreeObj = new ZTreeRadio('departmentName', 'deptTreeContent', 'deptTree');
        _this.initLayui(id);
    },
    methods: {
        initLayui: function (id) {
            var _this = this;
            layui.use(['element', 'form', 'table', 'laydate'], function () {
                var element = layui.element,
                    table = layui.table,
                    laydate = layui.laydate,
                    form = layui.form;

                _this.getBasic(table, id);
                _this.onBasicSelect(form);

                _this.getDept(_this.person.companyId);
                _this.getJob(_this.person.companyId);

                //所属部门
                $('#departmentName').on('click', function () {
                    _this.dptZTreeObj.showZTree();
                });

                //分管部门
                $('#deptPopup').on('click', function () {
                    user_popup($('#deptPopupPanel'), false, true, false);
                });

                //出生日期
                laydate.render({
                    elem: '#birthDay',
                    done: function (value, date, endDate) {
                        _this.person.birthDay = value;
                    }
                });
                //毕业时间
                laydate.render({
                    elem: '#graduationDate',
                    done: function (value, date, endDate) {
                        _this.person.graduationDate = value;
                    }
                });

                //身份证
                $('input[name="idCard"]').blur(function () {
                    var value = $.trim($(this).val());
                    if (value && isCard(value) == '') {
                        var birthday = getBirthdayFromIdCard(value);
                        var age = getAgeFromIdCard(value);
                        _this.person.birthDay = birthday;
                        _this.person.age = age;
                    }
                });

                //基本信息
                form.on('submit(basicInfo)', function (laydata) {
                    layer_load();

                    _this.person.idCardProvince = '';
                    _this.person.idCardCity = '';
                    _this.person.idCardCounty = '';
                    _this.person.idCardArea = '';
                    //身份证地址
                    if ($.trim(_this.person.idCardAddress)) {
                        var idCardAreaCode = $('input[name="idCardArea"]').attr('data-areacode');
                        var idCardAreaArr = idCardAreaCode.split(',');
                        if (!idCardAreaCode) {
                            layer_alert('请选择身份证地址的省市区');
                            return false;
                        }
                        if (idCardAreaArr.length != 3) {
                            layer_alert('身份证地址必须选择省市区');
                            return false;
                        }

                        _this.person.idCardProvince = idCardAreaArr[0];
                        _this.person.idCardCity = idCardAreaArr[1];
                        _this.person.idCardCounty = idCardAreaArr[2];
                        _this.person.idCardArea = $('input[name="idCardArea"]').val();
                    }

                    _this.person.liveProvince = '';
                    _this.person.liveCity = '';
                    _this.person.liveCounty = '';
                    _this.person.liveArea = '';
                    //居住地址
                    if ($.trim(_this.person.liveAddress)) {
                        var liveAreaCode = $('input[name="liveArea"]').attr('data-areacode');
                        var liveAreaArr = liveAreaCode.split(',');
                        if (!liveAreaCode) {
                            layer_alert('请选择居住地址的省市区');
                            return false;
                        }
                        if (liveAreaArr.length != 3) {
                            layer_alert('居住地址必须选择省市区');
                            return false;
                        }

                        _this.person.liveProvince = liveAreaArr[0];
                        _this.person.liveCity = liveAreaArr[1];
                        _this.person.liveCounty = liveAreaArr[2];
                        _this.person.liveArea = $('input[name="liveArea"]').val();
                    }

                    //家庭成员
                    var hasFamily = _this.validateFamily($('#familyPanel').find('div.layui-table-body'), true);
                    if (!hasFamily) {
                        return false;
                    }
                    _this.person.family = '';
                    if (_this.familyData.length > 0) {
                        var familyJson = JSON.stringify(_this.familyData);
                        // laydata.field.family = familyJson;
                        _this.person.family = familyJson;
                    }

                    //教育经历
                    var hasEducation = _this.validateEducation($('#educationPanel').find('div.layui-table-body'), true);
                    if (!hasEducation) {
                        return false;
                    }
                    _this.person.education = '';
                    if (_this.educationData.length > 0) {
                        var educationJson = JSON.stringify(_this.educationData);
                        // laydata.field.education = educationJson;
                        _this.person.education = educationJson;
                    }

                    //工作经历
                    var hasWork = _this.validateWork($('#workPanel').find('div.layui-table-body'), true);
                    if (!hasWork) {
                        return false;
                    }
                    _this.person.work = '';
                    if (_this.workData.length > 0) {
                        var workJson = JSON.stringify(_this.workData);
                        _this.person.work = workJson;
                    }

                    console.log(_this.person);

                    Serv.Post('uc/employee/edit?operation=1', _this.person, function (result) {
                        if (result.code == '00') {
                            _this.person.id = result.data;
                            layer_alert(result.message);
                        } else {
                            layer_alert(result.message);
                        }
                    });
                    return false;
                });

                //职位信息
                form.on('submit(positionInfo)', function (laydata) {
                    layer_load();
                    if (_this.person.id <= 0) {
                        layer_alert('请先填写个人信息');
                        return false;
                    }
                    _this.person.departmentId = $('input[name="departmentName"]').attr('data-id');
                    if (!_this.person.departmentId) {
                        layer_alert('请选择所属部门');
                        return false;
                    }
                    if (laydata.field.status == 0) {
                        layer_alert('请选择在职状态');
                        return false;
                    }

                    Serv.Post('uc/employee/edit?operation=2', _this.person, function (result) {
                        if (result.code == '00') {
                            layer_alert(result.message);
                        } else {
                            layer_alert(result.message);
                        }
                    });
                    return false;

                });

            });
        },
        //获取基础信息
        getBasic: function (table, id) {
            var _this = this;
            layer_load();
            Serv.Get('workerinfield/getdata?type=1,3,4,5,6', {}, function (result) {
                layer_load_lose();
                if (result) {
                    _this.hasSubmit = true;

                    _this.basicArrival = result.workerInField;
                    _this.basicEducation = result.education;
                    _this.basicProperties = result.properties;
                    _this.basicRelations = result.socialRelations;
                    _this.basicRecruitment = result.recruitmentSource;

                    // console.log(_this.basicEducation);

                    if (id.IsNum()) {
                        _this.getPerson(id, table);
                    } else {
                        _this.intiFamily(table);
                        _this.initEducation(table);
                        _this.initWork(table);

                        $("._idCardArea").jarea();
                        $("._idCardArea").jarea('val');
                        $("._liveArea").jarea();
                        $("._liveArea").jarea('val');

                        _this.$nextTick(function () {
                            layui.form.render('select');
                        });
                    }
                } else {
                    _this.hasSubmit = false;
                    layer_alert(result.message);
                }
            });
        },
        //获取员工
        getPerson: function (value, table) {
            var _this = this;
            layer_load();
            Serv.Get('uc/employee/get/' + value, {}, function (result) {
                layer_load_lose();
                if (result) {
                    _this.person = result;

                    _this.person.birthDay = result.birthDay.FormatDate(false);
                    _this.person.graduationDate = result.graduationDate.FormatDate(false);

                    var idCardAreaCode = '';
                    if (_this.person.idCardProvince && _this.person.idCardCity && _this.person.idCardCounty) {
                        idCardAreaCode = _this.person.idCardProvince + ',' + _this.person.idCardCity + ',' + _this.person.idCardCounty;
                    }
                    $('input[name="idCardArea"]').attr('data-areacode', idCardAreaCode).val(_this.person.idCardArea);

                    var liveAreaCode = '';
                    if (_this.person.liveProvince && _this.person.liveCity && _this.person.liveCounty) {
                        liveAreaCode = _this.person.liveProvince + ',' + _this.person.liveCity + ',' + _this.person.liveCounty;
                    }
                    $('input[name="liveArea"]').attr('data-areacode', liveAreaCode).val(_this.person.liveArea);

                    if (_this.person.family) {
                        _this.familyData = JSON.parse(_this.person.family);
                    }
                    if (_this.person.education) {
                        _this.educationData = JSON.parse(_this.person.education);
                    }
                    if (_this.person.work) {
                        _this.workData = JSON.parse(_this.person.work);
                    }

                    $('#departmentName').attr('data-id', _this.person.departmentId).val(result.departmentName);

                    _this.dptZTreeObj.setCheck();

                    _this.intiFamily(table);
                    _this.initEducation(table);
                    _this.initWork(table);

                    $("._idCardArea").jarea();
                    $("._idCardArea").jarea('val');
                    $("._liveArea").jarea();
                    $("._liveArea").jarea('val');

                    _this.$nextTick(function () {
                        layui.form.render('select');
                    });

                } else {
                    _this.hasSubmit = false;
                    layer_alert(result.message);
                }
            });
        },
        //个人信息下拉事件
        onBasicSelect: function (form) {
            var _this = this;
            //性别
            form.on('select(gender)', function (data) {
                _this.person.gender = data.value;
            });
            //最高学历
            form.on('select(degree)', function (data) {
                _this.person.degree = data.value;
            });
            //婚姻状况
            form.on('select(marriage)', function (data) {
                _this.person.marriage = data.value;
            });
            //有无子女
            form.on('select(children)', function (data) {
                _this.person.children = data.value;
            });
            //招聘来源
            form.on('select(recruitSource)', function (data) {
                _this.person.recruitSource = data.value;
            });
            //到岗时间
            form.on('select(arrivalTime)', function (data) {
                _this.person.arrivalTime = data.value;
            });
            //所属职位
            form.on('select(positionId)', function (data) {
                _this.person.positionId = data.value;
            });
            //在职状态
            form.on('select(status)', function (data) {
                _this.person.status = data.value;
            });

        },

        //初始化 家庭成员
        intiFamily: function (table) {
            var _this = this;

            var len = _this.familyData.length;
            if (len == 0) {
                _this.intiFamilyData(true);
            }

            var cols = [
                [{
                        field: 'Number',
                        title: '序号',
                        width: 90,
                        templet: function (d) {
                            return _this.getOperationTpl('family');
                        }
                    },
                    {
                        field: 'FamName',
                        title: '姓名',
                        templet: function (d) {
                            return _this.getInputTpl('FamName', d.FamName, 10);
                        }
                    },
                    {
                        field: 'FamRelations',
                        title: '关系',
                        templet: function (d) {
                            return _this.getSelectTpl(_this.basicRelations, 'FamRelations', d.FamRelations);
                        }
                    },
                    {
                        field: 'FamLinkPhone',
                        title: '电话',
                        templet: function (d) {
                            return _this.getInputTpl('FamLinkPhone', d.FamLinkPhone, 20);
                        }
                    },
                    {
                        field: 'FamAddress',
                        title: '通讯地址',
                        templet: function (d) {
                            return _this.getInputTpl('FamAddress', d.FamAddress, 100);
                        }
                    }
                ]
            ];

            table.render({
                elem: '#familyTable',
                data: _this.familyData,
                cols: cols,
            });

            table.on('tool(familyTable)', function (obj) {
                if (obj.event == 'familyAdd') {
                    layer_load();
                    var hasResult = _this.validateFamily(obj.tr, false);
                    if (!hasResult) {
                        layer_load_lose();
                        return false;
                    }

                    _this.intiFamilyData(false);
                    _this.reloadTable('familyTable', table, _this.familyData);
                } else if (obj.event == 'familyDel') {
                    layer_confirm('确定删除吗？', function () {
                        if (_this.familyData.length > 1) {
                            _this.removeData(obj.data.Number, _this.familyData);
                            obj.tr.remove();
                        } else {
                            _this.intiFamilyData(true);
                            _this.reloadTable('familyTable', table, _this.familyData);
                        }
                    });
                }
            });
        },
        //初始化 教育经历数据
        intiFamilyData: function (hasInit) {
            var _this = this;
            if (hasInit) {
                _this.familyData = [];
            }
            _this.familyData.push({
                "Number": _this.familyData + 1,
                "FamName": '',
                "FamRelations": '',
                "FamLinkPhone": '',
                "FamAddress": ''
            });
        },
        //验证 家庭成员
        validateFamily: function (obj, hasSubmit) {
            var _this = this;
            var hasResult = true;
            _this.familyData = [];
            obj = hasSubmit ? obj : obj.parents('table');

            obj.find('tr').each(function () {
                var name = $.trim($(this).find('input[name="FamName"]').val());
                var relations = $(this).find('select[name="FamRelations"]').val();
                var linkPhone = $(this).find('input[name="FamLinkPhone"]').val();
                var address = $.trim($(this).find('input[name="FamAddress"]').val());

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

                _this.familyData.push({
                    "Number": _this.educationData.length + 1,
                    "FamName": name,
                    "FamRelations": relations,
                    "FamLinkPhone": linkPhone,
                    "FamAddress": address
                });
            });

            return hasResult;
        },

        //初始化 教育经历
        initEducation: function (table) {
            var _this = this;
            var len = _this.educationData.length;
            if (len == 0) {
                _this.initEducationData(true);
            }

            var cols = [
                [{
                        field: 'Number',
                        title: '序号',
                        width: 90,
                        templet: function (d) {
                            return _this.getOperationTpl('education');
                        }
                    },
                    {
                        field: 'EduFinishSchool',
                        title: '毕业院校',
                        templet: function (d) {
                            return _this.getInputTpl('EduFinishSchool', d.EduFinishSchool, 50);
                        }
                    },
                    {
                        field: 'EduDegree',
                        title: '学历',
                        templet: function (d) {
                            return _this.getSelectTpl(_this.basicEducation, 'EduDegree', d.EduDegree);
                        }
                    },
                    {
                        field: 'EduNature',
                        title: '性质',
                        templet: function (d) {
                            return _this.getSelectTpl(_this.basicProperties, 'EduNature', d.EduNature);
                        }
                    },
                    {
                        field: 'EduProfessional',
                        title: '专业',
                        templet: function (d) {
                            return _this.getInputTpl('EduProfessional', d.EduProfessional, 50);
                        }
                    },
                    {
                        field: 'EduTime',
                        title: '学习年限',
                        event: 'EduTime',
                        templet: function (d) {
                            return _this.getTimeTpl(d.Number, 'EduTime', d.EduTime);
                        }
                    }
                ]
            ];

            table.render({
                elem: '#educationTable',
                data: _this.educationData,
                cols: cols,
            });

            table.on('tool(educationTable)', function (obj) {
                if (obj.event == 'EduTime') {
                    _this.showLaydate('.EduTime-' + obj.data.Number);
                } else if (obj.event == 'educationAdd') {
                    layer_load();
                    var hasResult = _this.validateEducation(obj.tr, false);
                    if (!hasResult) {
                        layer_load_lose();
                        return false;
                    }

                    _this.initEducationData(false);
                    _this.reloadTable('educationTable', table, _this.educationData);
                } else if (obj.event == 'educationDel') {
                    layer_confirm('确定删除吗？', function () {
                        if (_this.educationData.length > 1) {
                            _this.removeData(obj.data.Number, _this.educationData);
                            obj.tr.remove();
                        } else {
                            _this.initEducationData(true);
                            _this.reloadTable('educationTable', table, _this.educationData);
                        }
                    });
                }
            });
        },
        //初始化 教育经历数据
        initEducationData: function (hasInit) {
            var _this = this;
            if (hasInit) {
                _this.educationData = [];
            }
            _this.educationData.push({
                "Number": _this.educationData.length + 1,
                "EduFinishSchool": '',
                "EduDegree": '',
                "EduNature": '',
                "EduProfessional": '',
                "EduTime": ''
            });
        },
        //验证 教育经历
        validateEducation: function (obj, hasSubmit) {
            var _this = this;
            var hasResult = true;
            _this.educationData = [];

            obj = hasSubmit ? obj : obj.parents('table');

            obj.find('tr').each(function () {
                var finishSchool = $.trim($(this).find('input[name="EduFinishSchool"]').val());
                var degree = $(this).find('select[name="EduDegree"]').val();
                var nature = $(this).find('select[name="EduNature"]').val();
                var professional = $.trim($(this).find('input[name="EduProfessional"]').val());
                var eduTime = $.trim($(this).find('input[name="EduTime"]').val());

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

                _this.educationData.push({
                    "Number": _this.educationData.length + 1,
                    "EduFinishSchool": finishSchool,
                    "EduDegree": degree,
                    "EduNature": nature,
                    "EduProfessional": professional,
                    "EduTime": eduTime
                });
            });

            return hasResult;
        },

        //初始化 工作经历
        initWork: function (table) {
            var _this = this;

            var len = _this.workData.length;
            if (len == 0) {
                _this.initWorkData(true);
            }

            var cols = [
                [{
                        field: 'Number',
                        title: '序号',
                        width: 90,
                        templet: function (d) {
                            return _this.getOperationTpl('work');
                        }
                    },
                    {
                        field: 'WorkTime',
                        title: '工作年限',
                        event: 'WorkTime',
                        templet: function (d) {
                            return _this.getTimeTpl(d.Number, 'WorkTime', d.WorkTime);
                        }
                    },
                    {
                        field: 'WorkCompanyName',
                        title: '公司名称',
                        templet: function (d) {
                            return _this.getInputTpl('WorkCompanyName', d.WorkCompanyName, 50);
                        }
                    },
                    {
                        field: 'WorkDepartment',
                        title: '部门',
                        templet: function (d) {
                            return _this.getInputTpl('WorkDepartment', d.WorkDepartment, 50);
                        }
                    },
                    {
                        field: 'WorkPosition',
                        title: '职位',
                        templet: function (d) {
                            return _this.getInputTpl('WorkPosition', d.WorkPosition, 50);
                        }
                    },
                    {
                        field: 'WorkDescribe',
                        title: '主要成绩',
                        templet: function (d) {
                            return _this.getTextareaTpl('WorkDescribe', d.WorkDescribe);
                        }
                    },
                    {
                        field: 'WorkQuitReason',
                        title: '离职原因',
                        templet: function (d) {
                            return _this.getInputTpl('WorkQuitReason', d.WorkQuitReason, 200);
                        }
                    }
                ]
            ];

            table.render({
                elem: '#workTable',
                data: _this.workData,
                cols: cols,
            });

            table.on('tool(workTable)', function (obj) {
                if (obj.event == 'WorkTime') {
                    _this.showLaydate('.WorkTime-' + obj.data.Number);
                } else if (obj.event == 'workAdd') {
                    layer_load();
                    var hasResult = _this.validateWork(obj.tr, false);
                    if (!hasResult) {
                        layer_load_lose();
                        return false;
                    }

                    _this.initWorkData(false);
                    _this.reloadTable('workTable', table, _this.workData);
                } else if (obj.event == 'workDel') {
                    layer_confirm('确定删除吗？', function () {
                        if (_this.workData.length > 1) {
                            _this.removeData(obj.data.number, _this.workData);
                            obj.tr.remove();
                        } else {
                            _this.initWorkData(true);
                            _this.reloadTable('workTable', table, _this.workData);
                        }
                    });
                }
            });
        },
        //初始化 工作经历数据
        initWorkData: function (hasInit) {
            var _this = this;
            if (hasInit) {
                _this.workData = [];
            }
            _this.workData.push({
                "Number": _this.workData.length + 1,
                "WorkTime": '',
                "WorkCompanyName": '',
                "WorkDepartment": '',
                "WorkPosition": '',
                "WorkDescribe": '',
                "WorkQuitReason": '',
            });
        },
        //验证 工作经历
        validateWork: function (obj, hasSubmit) {
            var _this = this;
            var hasResult = true;
            _this.workData = [];

            obj = hasSubmit ? obj : obj.parents('table');

            obj.find('tr').each(function () {
                var workTime = $.trim($(this).find('input[name="WorkTime"]').val());
                var companyName = $.trim($(this).find('input[name="WorkCompanyName"]').val());
                var department = $.trim($(this).find('input[name="WorkDepartment"]').val());
                var position = $.trim($(this).find('input[name="WorkPosition"]').val());
                var workDescribe = $.trim($(this).find('textarea[name="WorkDescribe"]').val());
                var quitReason = $.trim($(this).find('input[name="WorkQuitReason"]').val());

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

                _this.workData.push({
                    "Number": _this.workData.length + 1,
                    "WorkTime": workTime,
                    "WorkCompanyName": companyName,
                    "WorkDepartment": department,
                    "WorkPosition": position,
                    "WorkDescribe": workDescribe,
                    "WorkQuitReason": quitReason
                });
            });

            return hasResult;
        },

        //重新渲染
        reloadTable(elem, table, data) {
            table.reload(elem, {
                data: data,
                done: function () {
                    layer_load_lose();
                }
            });
        },
        //移除数据
        removeData: function (id, data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].Number == id) {
                    data.splice(i, 1);
                    return false;
                }
            }
        },
        //显示日期
        showLaydate: function (elem) {
            layui.laydate.render({
                elem: elem,
                type: 'month',
                show: true,
                range: '~'
            });
        },
        //时间范围模板
        getTimeTpl: function (id, name, value) {
            return '<input type="text" name="' + name + '" class="layui-input ' + name + '-' + id + '" readonly value="' + value + '" />';
        },
        //操作模板
        getOperationTpl: function (name) {
            return '<span class="table-btn-jia" lay-event="' + name + 'Add">+</span><span class="table-btn-jian" lay-event="' + name + 'Del">-</span>';
        },
        //input 普通模板
        getInputTpl: function (name, value, maxlength) {
            maxlength = !maxlength ? 50 : maxlength;
            return '<input type="text" name="' + name + '" maxlength="' + maxlength + '" class="layui-input" value="' + value + '" />';
        },
        //Textarea模板
        getTextareaTpl: function (name, value) {
            return '<textarea class="layui-input" name="' + name + '" style="resize:none" readonly onclick="layui_prompt(this)">' + value + '</textarea>';
        },
        //select模板
        getSelectTpl: function (data, name, value) {
            var html = '<select name="' + name + '">';
            html += '<option value="">请选择</option>';
            $.each(data, function (i, item) {
                html += '<option value="' + item.name + '" ' + (item.name == value ? "selected" : "") + '>' + item.name + '</option>';
            })
            html += '</select>';
            return html;
        },

        //获取部门
        getDept: function (cId) {
            var _this = this;
            layer_load();
            Serv.Get('uc/department/gettree?companyId=' + cId, {}, function (result) {
                layer_load_lose();
                if (result) {
                    _this.dptZTreeObj.reload(result);
                } else {
                    _this.hasSubmit = false;
                    layer_alert(result.message);
                }
            });
        },
        //获取职位
        getJob: function (cId) {
            var _this = this;
            layer_load();
            Serv.Post('uc/job/get', {
                page: 1,
                limit: 50,
                companyId: cId
            }, function (result) {
                layer_load_lose();
                if (result) {
                    _this.basicJob = result.items;

                    _this.$nextTick(function () {
                        layui.form.render('select');
                    });
                } else {
                    _this.hasSubmit = false;
                    layer_alert(result.message);
                }
            });
        }
    }
});