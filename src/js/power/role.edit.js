var data = {
    role: {
        id: 0,
        name: '',
        remarks: '',
        displayOrder: 10
    }
}

layui.use(['table', 'form', 'laytpl'], function() {
    var table = layui.table,
        form = layui.form,
        laytpl = layui.laytpl;

    var getTpl = monduleTpl.innerHTML,
        monduleBody = $('#monduleBody');

    $('.backBtn').on('click', function() {
        window.location.href = '/pages/power/roleList.html';
    });

    var roleId = GetPara('roleId') || '';
    if (roleId.toString().IsNum()) {
        getRole(roleId);
    } else {
        form.val('formRole', data.role);
        getModule(roleId);
    }

    //全选
    $('#treeBody').on('ifClicked', '.checkAll', function(event) {
        if (event.target.checked) {
            monduleBody.find('input[type="checkbox"]').iCheck('uncheck');
        } else {
            monduleBody.find('input[type="checkbox"]').iCheck('check');
        }
    });
    //各个项全选
    monduleBody.on('ifClicked', 'input[name="checkItemAll"]', function(event) {
        var value = $(this).val();
        if (event.target.checked) {
            $('.cb_item_' + value).iCheck('uncheck');
        } else {
            $('.cb_item_' + value).iCheck('check');
        }
    });
    //checkbox
    monduleBody.on('ifClicked', '.cb_item', function(event) {
        var valJson = JSON.parse($(this).attr('data-value')),
            elementCount = $(this).attr('data-elements');
        if (event.target.checked) {
            $('.item_all_' + valJson.moduleId).iCheck('uncheck');
        } else {
            var ckCount = $('.cb_item_' + valJson.moduleId + ':checkbox:checked').length;
            if (elementCount == (ckCount + 1)) {
                $('.item_all_' + valJson.moduleId).iCheck('check');
            }
        }
    });
    //提交
    form.on('submit(submitRole)', function(laydata) {
        layer_load('数据验证中，请耐心等待...');

        var data = [];
        $('.cb_item:checkbox').each(function() {
            if ($(this).is(':checked') == true) {
                data.push(JSON.parse($(this).attr('data-value')));
            }
        });
        if (data.length == 0) {
            layer_alert('请勾选对应的权限');
            return false;
        }

        laydata.field.elements = data;
        layer_confirm('确定提交数据吗？', function() {
            layer_load('数据处理中，请耐心等待...');
            Serv.Post('gc/power/editrole', laydata.field, function(result) {
                layer_load_lose();
                if (result.succeed) {
                    layer_alert(result.message, function() {
                        window.location.href = '/pages/power/roleList.html';
                    });
                } else {
                    layer_alert(result.message);
                }
            });
        });
    });

    //获取角色
    function getRole(value) {
        layer_load('数据加载中，请耐心等待...');
        Serv.Get('gc/power/getrole/' + value, {}, function(result) {
            layer_load_lose();
            if (result) {
                form.val('formRole', result);
                getModule(value);
            } else {
                layer_alert(tips.noDataTip);
            }
        });
    }

    //获取模块
    function getModule(value) {
        layer_load('数据加载中，请耐心等待...');
        Serv.Get('gc/power/querynav', {
            roleId: value || 0
        }, function(result) {
            layer_load_lose();
            if (result) {
                monduleBody.html(getModuleContent(result));
                initCategory();
                initCheck();

                // if (roleId.toString().IsNum()) {
                //     getRoleElement(roleId);
                // }
            } else {
                layer_alert(tips.noDataTip);
            }
        });
    }
    //获取模块模板
    function getModuleContent(data) {
        data = data || [];
        return laytpl(getTpl).render(data);
    }

    //获取角色对应的模块元素
    function getRoleElement(value) {
        layer_load('角色对应权限获取中，请耐心等待');
        Serv.Get('gc/power/queryelementbyrole', {
            roleId: value
        }, function(result) {
            layer_load_lose();
            if (result) {
                $.each(result, function(i, item) {
                    $('#cb_' + item.secondId).iCheck('check');
                    // $('#cb_' + item.secondId).prop('disabled', true).iCheck('check');
                });
            } else {
                layer_alert(tips.noDataTip);
            }
        });
    }

    //初始化iCheck
    function initCheck() {
        $('input').iCheck({
            radioClass: 'iradio_minimal-blue',
            checkboxClass: 'icheckbox_minimal-blue',
            increaseArea: '20%' // optional
        });
    }

    //初始化结构
    function initCategory() {
        //初始化分类的结构
        initCategoryHtml('.tree-list', 1);
        //初始化分类的事件
        $('.tree-list').initCategoryTree(true);
        initCheck();
    }

});