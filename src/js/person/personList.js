var dataCol = [
    [{
            field: 'id',
            title: '序号'
        },
        {
            field: 'dptName',
            title: '部门',
            templet: function(d) {
                return $.map(d.bindings, function(item) {
                    return item.dptName
                }).join('|');
            },
			minWidth:80
        },
        {
            field: 'jobName',
            title: '职位',
            width: 80,
            templet: function(d) {
                return $.map(d.bindings, function(item) {
                    return item.jobName
                }).join('|');
            }
        },
        {
            field: 'userName',
            title: '姓名',
            width: 80
        },
        {
            field: 'status',
            title: '状态',
            templet: function(d) {
                return ['未入职', '试用', '转正', '离职'][d.status];
            },
			width: 100
        },
        {
            field: 'isOpenAccount',
            title: '开通账户',
            templet: function(d) {
                return d.isOpenAccount ? '<span class="text-span">已开通</span>' :
                    '<span class="text-del">未开通</span>';
            },
			width: 120
        },
        {
            field: 'employeeNo',
            title: '工号'
        },
        {
            field: 'roles',
            title: '角色'
        },
        {
            field: 'gender',
            title: '性别',
            width: 60,
            templet: function(d) {
                return ["", "男", "女"][d.gender]
            }
        },
        {
            field: 'linkPhone',
            title: '电话',
            width: 120
        },
        {
            field: 'officePhone',
            title: '办公电话',
            width: 120
        },
        {
            title: '操作',
            toolbar: '#toolbar',
            minWidth: 240
        }
    ]
];

var parameter = {
    companyId: 1,
    linkPhone: '',
    userName: ''
};

var dataJob = [];

layui.use(['table', 'element', 'form'], function() {
    var table = layui.table,
        element = layui.element,
        form = layui.form;

    //基本信息
    form.on('submit(search)', function(laydata) {
        parameter.userName = laydata.field.userName;
        parameter.linkPhone = laydata.field.linkPhone;

        lstPager.refresh();
    });

    function search() {
        return parameter;
    }
    //操作栏的回调函数
    var onTools = function(layEvent, data) {
        var value = data.id;
        if (layEvent === 'view') {
            window.location.href = '/pages/person/personDetails.html?id=' + value;
        } else if (layEvent === 'edit') {
            window.location.href = '/pages/person/personAdd.html?id=' + value;
        } else if (layEvent === 'openAccount') {
            layer_confirm('确定开通账户吗？', function() {
                layer_load();
                Serv.Get('uc/employee/openaccount/' + value, {}, function(result) {
                    if (result.succeed) {
                        layer_alert('开户成功', function() {
                            lstPager.refresh();
                        });
                    } else {
                        layer_alert(result.message);
                    }
                });
            });
        } else if (layEvent === "del") {
            layer_confirm('确定删除吗？', function() {
                layer_load();
                Serv.Get('uc/company/delete/' + value, {}, function(result) {
                    if (result.succeed) {
                        layer_alert(result.message, function() {
                            lstPager.refresh();
                        });
                    } else {
                        layer_alert(result.message);
                    }
                });
            });
        } else if (layEvent == 'userJob') {
            $('#employeeId').val(value);
            setUserJobPop(data.bindings);
        }
    };
    //分页初始化
    var lstPager = Pager(table, //lay-ui的table控件
        '员工列表', //列表名称
        'lst', //绑定的列表Id
        '', //绑定的工具条Id
        dataCol, //表头的显示行
        'uc/employee/get', //action url 只能post提交
        search, //获取查询条件的函数
        null, //如果在显示之前需要对数据进行整理需要实现，否则传null
        null, //有选择行才能有的操作，实现该方法,否则传null
        onTools, //如果有每行的操作栏的操作回调，实现该方法，否则传null
        null,
        'full-100'
    );

    var ujObj = $('#userJobBody');

    ujObj.on('click', '.userJobAdd', function() {
        layer_load();
        var hasResult = validateUserJob();
        if (!hasResult) {
            layer_load_lose();
            return false;
        }
        ujObj.append(getUserJobTpl());
        form.render();
        layer_load_lose();
    });
    ujObj.on('click', '.userJobDel', function() {
        var length = ujObj.find('tr').length;
        if (length <= 1) {
            layer_alert('请勿删除');
            return false;
        }
        var obj = $(this).parents('tr');
        layer_confirm('确定删除吗？', function() {
            obj.remove();
        });
    });
    ujObj.on('click', '.deptPopup', function() {
        var selObj = $(this).parents('tr').find('select[name="userJob"]');
        var obj = $(this);
        user_popup(this, 'department', 1, false, function(result) {
            if (result != null && result.department.length > 0) {
                var cName = result.department[0].company_name;
                obj.val((cName.length > 9 ? (cName.substr(0, 9) + '...') : +cName) + ' - ' + result.department[0].name);
                getJob(result.department[0].company_id, selObj, '');
            }
        });
    });


    form.on('submit(userJobSubmit)', function(laydata) {
        layer_load();
        var hasResult = validateUserJob();
        if (!hasResult) {
            layer_load_lose();
            return false;
        }

        var data = [];
        ujObj.find('tr').each(function() {
            var valJson = JSON.parse($(this).find('input[name="sels"]').val());
            var jobVal = $.trim($(this).find('select[name="userJob"]').val());
            data.push({
                companyId: valJson.department[0].company_id,
                dptId: valJson.department[0].id.toString(),
                jobId: jobVal.toString()
            });
        });

        if (data.length == 0) {
            layer_alert('请设置相关职位');
            return false;
        }

        Serv.Post('uc/employee/dptjobbinding', {
            employeeId: laydata.field.employeeId,
            bindings: data
        }, function(result) {
            layer_load_lose();
            if (result.succeed) {
                layer_alert(result.message, function() {
                    layer.closeAll();
                    lstPager.refresh();
                });
            } else {
                layer_alert(result.message);
            }
        });

        return false;
    });

    //打开 职位设置
    function openUserJobPop(data) {
        layer_load_lose();
        layer.open({
            type: 1,
            title: '职位设置',
            String: false,
            closeBtn: 1,
            skin: 'layui-layer-rim',
            area: ['750px', '450px'],
            content: $('#userJobPop')
        });

        //获取职位
        if (data.length > 0) {
            $.each(data, function(i, item) {
                getJob(item.companyId, $('.userJobSel' + item.jobId), item.jobId);
            });
        }
    }
    //设置值
    function setUserJobPop(data) {
        layer_load();
        if (data.length > 0) {

            var userSelVal = getUserPopModel();
            var index = 0;
            var htmls = '';
            $.each(data, function(i, item) {
                userSelVal.department = [];
                userSelVal.department.push({
                    id: item.dptId,
                    name: item.dptName,
                    company_id: item.companyId,
                    company_name: item.companyName
                });

                htmls += getUserJobTpl(item, userSelVal);
                index++;
            });
            if (index == data.length) {
                ujObj.html(htmls);
                form.render();
                openUserJobPop(data);
            }
        } else {
            ujObj.html(getUserJobTpl());
            form.render();
            openUserJobPop(data);
        }
    }
    //获取 职位设置模板值
    function getUserJobTpl(model, selVal) {
        var htmls = '';
        if (model) {
            var cName = model.companyName;
            htmls = '<tr>';
            htmls +=
                '<td><span class="table-btn-jia userJobAdd">+</span><span class="table-btn-jian userJobDel">-</span></td>';
            htmls +=
                '<td><input type="text" name="userDept" placeholder="请选择" class="layui-input deptPopup" value="' +
                ((cName != null && cName.length > 9) ? (cName.substr(0, 9) + '...') : +cName) + ' - ' + model.dptName +
                '" readonly />' +
                '<input type="hidden" name="sels" value=\'' + JSON.stringify(selVal) + '\'>' +
                '</td>';
            htmls += '<td><select name="userJob" class="userJobSel' + model.jobId + '"><option value="">请选择</option></select></td>';
            htmls += '</tr>';
        } else {
            htmls =
                '<tr>' +
                '<td><span class="table-btn-jia userJobAdd">+</span><span class="table-btn-jian userJobDel">-</span></td>' +
                '<td><input type="text" name="userDept" placeholder="请选择" class="layui-input deptPopup" readonly /></td>' +
                '<td><select name="userJob"><option value="">请选择</option></select></td>' +
                '</tr>';
        }
        return htmls;
    }
    //验证 职位设置
    function validateUserJob() {
        var hasResult = true;
        var data = [];
        ujObj.find('tr').each(function() {
            var value = $(this).find('input[name="sels"]').val();
            if (!value) {
                layer_alert('请选择部门');
                hasResult = false;
                return false;
            }
            var valJson = JSON.parse(value);
            if (valJson.department.length == 0) {
                layer_alert('请选择部门');
                hasResult = false;
                return false;
            }
            if (valJson.department.length > 1) {
                layer_alert('请勿选择多个部门');
                hasResult = false;
                return false;
            }
            var jobVal = $.trim($(this).find('select[name="userJob"]').val());
            if (!jobVal) {
                layer_alert('请选择[' + valJson.department[0].name + ']栏中的[职位]项');
                hasResult = false;
                return false;
            }

            data.push({
                companyId: valJson.department[0].company_id.toString(),
                dptId: valJson.department[0].id.toString(),
                jobId: jobVal.toString()
            });
        });

        for (var i = 0; i < data.length; i++) {
            var flag = true;
            for (var j = i + 1; j < data.length; j++) {
                //第一个等同于第二个，splice方法删除第二个
                if (JSON.stringify(data[i]) === JSON.stringify(data[j])) {
                    data.splice(j, 1);
                    j--;
                    flag = false;
                }
            }
            if (!flag) {
                layer_alert('您设置的部门和职位有重复，请检查');
                hasResult = false;
                return false;
            }
        }

        return hasResult;
    }

    //获取 职位
    function getJob(cId, obj, value) {
        layer_load();
        Serv.Post('uc/job/get', {
            page: 1,
            limit: 50,
            companyId: cId
        }, function(result) {
            layer_load_lose();
            if (result) {
                obj.empty().append('<option value="">请选择</option>');
                $.each(result.items, function(i, item) {
                    obj.append('<option value="' + item.id + '" ' + (item.id == value ? 'selected' : '') + '>' + item.name + '</option>');
                });

                layui.form.render('select');
            } else {
                layer_alert(result.message);
            }
        });
    }
});

//关闭 职位设置
function closePop() {
    $('#userJobBody').empty();
    layer.closeAll();
}