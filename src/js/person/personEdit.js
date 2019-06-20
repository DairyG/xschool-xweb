new Vue({
    el: '#personBody',
    data: {
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
            departmentId: 0,
            positionId: 0,
            employeeNo: '',
            officePhone: '',
            officeEmail: '',
            faxNumber: '',
            referees: '',
            officeAddress: '',
            positionDescribe: '',
        },

        basicArrival: [], //到岗时间
        basicEducation: [], //学历
        basicProperties: [], //教育性质
        basicRelations: [], //社会关系
        basicRecruitment: [], //招聘来源

        familyData: [], //家庭成员
        educationData: [], //教育经历
        workData: [], //工作经历
    },
    mounted: function () {
        var _this = this;
        layui.use(['element', 'form', 'table', 'laydate'], function () {
            var element = layui.element,
                table = layui.table,
                laydate = layui.laydate,
                form = layui.form;

            _this.getBasic(table);
            _this.onBasicSelect(form);

            $("._idCardArea").jarea();
            $("._idCardArea").jarea('val');
            $("._liveArea").jarea();
            $("._liveArea").jarea('val');

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
                console.log(laydata.field);
                // layer_load();
                // Serv.Post('company/edit', laydata.field, function (result) {
                //     if (result.code == '00') {
                //         _this.company.id = result;
                //         _this.bankInfo.companyId = result;
                //         layer_alert(result.message);
                //     } else {
                //         layer_alert(result.message);
                //     }
                // });
                return false;
            });
        });


    },
    methods: {
        //获取基础信息
        getBasic: function (table) {
            var _this = this;
            layer_load();
            Serv.Get('workerinfield/getdata?type=1,3,4,5,6', {}, function (result) {
                layer_load_lose();
                if (result) {
                    _this.basicArrival = result.workerInField;
                    _this.basicEducation = result.education;
                    _this.basicProperties = result.properties;
                    _this.basicRelations = result.socialRelations;
                    _this.basicRecruitment = result.recruitmentSource;

                    _this.intiFamily(table);
                    _this.initEducation(table);
                    _this.initWork(table);

                    _this.$nextTick(function () {
                        layui.form.render('select');
                    });
                } else {
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
                        field: 'id',
                        title: '序号',
                        width: 90,
                        templet: function (d) {
                            return _this.getOperationTpl('family');
                        }
                    },
                    {
                        field: 'name',
                        title: '姓名',
                        templet: function (d) {
                            return _this.getInputTpl('name', d.name, 10);
                        }
                    },
                    {
                        field: 'relations',
                        title: '关系',
                        templet: function (d) {
                            return _this.getSelectTpl(_this.basicRelations, 'relations', d.relations);
                        }
                    },
                    {
                        field: 'linkPhone',
                        title: '电话',
                        templet: function (d) {
                            return _this.getInputTpl('linkPhone', d.linkPhone, 20);
                        }
                    },
                    {
                        field: 'address',
                        title: '通讯地址',
                        templet: function (d) {
                            return _this.getInputTpl('address', d.address, 100);
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
                    var hasResult = _this.validateFamily(obj);
                    if (!hasResult) {
                        layer_load_lose();
                        return false;
                    }

                    _this.intiFamilyData(false);
                    _this.reloadTable('familyTable', table, _this.familyData);
                } else if (obj.event == 'familyDel') {
                    layer_confirm('确定删除吗？', function () {
                        if (_this.familyData.length > 1) {
                            _this.removeData(obj.data.id, _this.familyData);
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
                "id": _this.familyData + 1,
                "name": '',
                "relations": '',
                "linkPhone": '',
                "address": ''
            });
        },
        //验证 家庭成员
        validateFamily: function (obj) {
            var _this = this;
            var hasResult = true;
            _this.familyData = [];
            obj.tr.parents('table').find('tr').each(function () {
                var name = $.trim($(this).find('input[name="name"]').val());
                if (!name) {
                    layer_alert('请输入姓名');
                    hasResult = false;
                    return false;
                }
                var relations = $(this).find('select[name="relations"]').val();
                if (!relations) {
                    layer_alert('请选择关系');
                    hasResult = false;
                    return false;
                }
                var linkPhone = $(this).find('input[name="linkPhone"]').val();
                if (!linkPhone) {
                    layer_alert('请输入电话');
                    hasResult = false;
                    return false;
                }
                if (!linkPhone.IsMobile() && !linkPhone.IsTelPhone()) {
                    layer_alert('电话格式错误');
                    hasResult = false;
                    return false;
                }
                var address = $.trim($(this).find('input[name="address"]').val());
                if (!address) {
                    layer_alert('请输入通讯地址');
                    hasResult = false;
                    return false;
                }

                _this.familyData.push({
                    "id": _this.educationData.length + 1,
                    "name": name,
                    "relations": relations,
                    "linkPhone": linkPhone,
                    "address": address
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
                        field: 'id',
                        title: '序号',
                        width: 90,
                        templet: function (d) {
                            return _this.getOperationTpl('education');
                        }
                    },
                    {
                        field: 'finishSchool',
                        title: '毕业院校',
                        templet: function (d) {
                            return _this.getInputTpl('finishSchool', d.finishSchool, 50);
                        }
                    },
                    {
                        field: 'degree',
                        title: '学历',
                        templet: function (d) {
                            return _this.getSelectTpl(_this.basicEducation, 'degree', d.degree);
                        }
                    },
                    {
                        field: 'nature',
                        title: '性质',
                        templet: function (d) {
                            return _this.getSelectTpl(_this.basicProperties, 'nature', d.nature);
                        }
                    },
                    {
                        field: 'professional',
                        title: '专业',
                        templet: function (d) {
                            return _this.getInputTpl('professional', d.professional, 50);
                        }
                    },
                    {
                        field: 'eduTime',
                        title: '学习年限',
                        event: 'eduTime',
                        templet: function (d) {
                            return _this.getTimeTpl(d.id, 'eduTime', d.eduTime);
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
                if (obj.event == 'eduTime') {
                    _this.showLaydate('.eduTime-' + obj.data.id);
                } else if (obj.event == 'educationAdd') {
                    layer_load();
                    var hasResult = _this.validateEducation(obj);
                    if (!hasResult) {
                        layer_load_lose();
                        return false;
                    }

                    _this.initEducationData(false);
                    _this.reloadTable('educationTable', table, _this.educationData);
                } else if (obj.event == 'educationDel') {
                    layer_confirm('确定删除吗？', function () {
                        if (_this.educationData.length > 1) {
                            _this.removeData(obj.data.id, _this.educationData);
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
                "id": _this.educationData.length + 1,
                "finishSchool": '',
                "degree": '',
                "nature": '',
                "professional": '',
                "eduTime": ''
            });
        },
        //验证 教育经历
        validateEducation: function (obj) {
            var _this = this;
            var hasResult = true;
            _this.educationData = [];
            obj.tr.parents('table').find('tr').each(function () {
                var finishSchool = $.trim($(this).find('input[name="finishSchool"]').val());
                if (!finishSchool) {
                    layer_alert('请输入毕业院校');
                    hasResult = false;
                    return false;
                }
                var degree = $(this).find('select[name="degree"]').val();
                if (!degree) {
                    layer_alert('请选择学历');
                    hasResult = false;
                    return false;
                }
                var nature = $(this).find('select[name="nature"]').val();
                if (!nature) {
                    layer_alert('请选择性质');
                    hasResult = false;
                    return false;
                }
                var professional = $.trim($(this).find('input[name="professional"]').val());
                if (!professional) {
                    layer_alert('请输入专业');
                    hasResult = false;
                    return false;
                }
                var eduTime = $.trim($(this).find('input[name="eduTime"]').val());
                if (!eduTime) {
                    layer_alert('请选择学习年限');
                    hasResult = false;
                    return false;
                }

                _this.educationData.push({
                    "id": _this.educationData.length + 1,
                    "finishSchool": finishSchool,
                    "degree": degree,
                    "nature": nature,
                    "professional": professional,
                    "eduTime": eduTime
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
                        field: 'id',
                        title: '序号',
                        width: 90,
                        templet: function (d) {
                            return _this.getOperationTpl('work');
                        }
                    },
                    {
                        field: 'workTime',
                        title: '工作年限',
                        event: 'workTime',
                        templet: function (d) {
                            return _this.getTimeTpl(d.id, 'workTime', d.workTime);
                        }
                    },
                    {
                        field: 'companyName',
                        title: '公司名称',
                        templet: function (d) {
                            return _this.getInputTpl('companyName', d.companyName, 50);
                        }
                    },
                    {
                        field: 'department',
                        title: '部门',
                        templet: function (d) {
                            return _this.getInputTpl('department', d.department, 50);
                        }
                    },
                    {
                        field: 'position',
                        title: '职位',
                        templet: function (d) {
                            return _this.getInputTpl('position', d.position, 50);
                        }
                    },
                    {
                        field: 'workDescribe',
                        title: '主要成绩',
                        templet: function (d) {
                            return _this.getTextareaTpl('workDescribe', d.workDescribe);
                        }
                    },
                    {
                        field: 'quitReason',
                        title: '离职原因',
                        templet: function (d) {
                            return _this.getInputTpl('quitReason', d.quitReason, 200);
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
                if (obj.event == 'workTime') {
                    _this.showLaydate('.workTime-' + obj.data.id);
                } else if (obj.event == 'workAdd') {
                    layer_load();
                    var hasResult = _this.validateWork(obj);
                    if (!hasResult) {
                        layer_load_lose();
                        return false;
                    }

                    _this.initWorkData(false);
                    _this.reloadTable('workTable', table, _this.workData);
                } else if (obj.event == 'workDel') {
                    layer_confirm('确定删除吗？', function () {
                        if (_this.workData.length > 1) {
                            _this.removeData(obj.data.id, _this.workData);
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
                "id": _this.workData.length + 1,
                "workTime": '',
                "companyName": '',
                "department": '',
                "position": '',
                "workDescribe": '',
                "quitReason": '',
            });
        },
        //验证 工作经历
        validateWork: function (obj) {
            var _this = this;
            var hasResult = true;
            _this.workData = [];
            obj.tr.parents('table').find('tr').each(function () {
                var workTime = $.trim($(this).find('input[name="workTime"]').val());
                if (!workTime) {
                    layer_alert('请选择工作年限');
                    hasResult = false;
                    return false;
                }
                var companyName = $.trim($(this).find('input[name="companyName"]').val());
                if (!companyName) {
                    layer_alert('请输入公司名称');
                    hasResult = false;
                    return false;
                }
                var department = $.trim($(this).find('input[name="department"]').val());
                if (!department) {
                    layer_alert('请输入部门');
                    hasResult = false;
                    return false;
                }
                var position = $.trim($(this).find('input[name="position"]').val());
                if (!position) {
                    layer_alert('请输入职位');
                    hasResult = false;
                    return false;
                }
                var workDescribe = $.trim($(this).find('textarea[name="workDescribe"]').val());
                if (!workDescribe) {
                    layer_alert('请输入主要成绩');
                    hasResult = false;
                    return false;
                }
                var quitReason = $.trim($(this).find('input[name="quitReason"]').val());
                if (!quitReason) {
                    layer_alert('请输入离职原因');
                    hasResult = false;
                    return false;
                }

                _this.workData.push({
                    "id": _this.workData.length + 1,
                    "workTime": workTime,
                    "companyName": companyName,
                    "department": department,
                    "position": position,
                    "workDescribe": workDescribe,
                    "quitReason": quitReason
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
                if (data[i].id == id) {
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
    }
})