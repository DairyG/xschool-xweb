var data = {
    companyId: 0,
    level: 0,

    company: {},
    bankInfo: {
        id: 0,
        openBank: '',
        openBankName: '',
        bankAccount: '',
        linkPhone: '',
        remarks: ''
    },
    bankData: [],
    companyData: [],
};

layui.use(['element', 'laydate', 'laytpl', 'form', 'upload'], function() {
    var element = layui.element,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        form = layui.form,
        upload = layui.upload;

    resetCompanyData();

    var id = GetPara('id');
    id = !id ? '' : id;

    var operation = GetPara('operation');
    if ((operation == 'view' || operation == 'edit') && !id.IsNum()) {
        layer_alert('参数错误');
        $('.hasSubmit').hide();
        return false;
    }
    if (operation == 'view') {
        $('.hasSubmit').hide();
    }

    var seltCompany = $('#seltCompany');
    var formBasic = $('#formBasic');

    var getTpl = bankTpl.innerHTML,
        bankPanel = $('#bankPanel');

    var E = window.wangEditor
    var eIntro = new E('#E_intro');
    eIntro.customConfig.uploadImgServer = Serv.ImageUrl;
    eIntro.customConfig.uploadImgHeaders = Serv.GetHeaders();
    eIntro.customConfig.uploadImgHooks = {
        customInsert: function(insertImg, result, editor) {
            if (result.succeed) {
                for (let index = 0; index < result.data.length; index++) {
                    insertImg(result.data[index])
                }
            }
        }
    };
    eIntro.customConfig.onchange = function(html) {
        $('input[name="intro"]').val(html);
    };
    eIntro.create();

    var eCulture = new E('#E_culture');
    eCulture.customConfig.uploadImgServer = Serv.ImageUrl;
    eCulture.customConfig.uploadImgHeaders = Serv.GetHeaders();
    eCulture.customConfig.uploadImgHooks = {
        customInsert: function(insertImg, result, editor) {
            if (result.succeed) {
                for (let index = 0; index < result.data.length; index++) {
                    insertImg(result.data[index])
                }
            }
        }
    };
    eCulture.customConfig.onchange = function(html) {
        $('input[name="culture"]').val(html);
    };
    eCulture.create();

    var eHistory = new E('#E_history');
    eHistory.customConfig.uploadImgServer = Serv.ImageUrl;
    eHistory.customConfig.uploadImgHeaders = Serv.GetHeaders();
    eHistory.customConfig.uploadImgHooks = {
        customInsert: function(insertImg, result, editor) {
            if (result.succeed) {
                for (let index = 0; index < result.data.length; index++) {
                    insertImg(result.data[index])
                }
            }
        }
    };
    eHistory.customConfig.onchange = function(html) {
        $('input[name="history"]').val(html);
    };
    eHistory.create();

    if (id.IsNum()) {
        getCompanyInfo(id);
    } else {
        getCompanyTpl('');

        bankPanel.html(getBankContent());
    }

    //Logo上传
    upload.render({
        elem: '#logoBtn',
        url: Serv.ImageUrl,
        accept: 'images',
        acceptMime: 'image/*',
        headers: Serv.GetHeaders(),
        before: function(obj) {
            layer_load();
        },
        done: function(result) {
            layer_load_lose();
            $('#logoValue').val(result.data[0]);
            $('#logoImage').show().find('img').attr('src', result.data[0]);
        },
        error: function() {
            layer_load_lose();
        }
    });

    laydate.render({
        elem: '#registeredTime'
    });
    form.on('select(seltCompany)', function(datas) {
        if (datas.value > 0) {
            data.level = parseInt($(datas.elem).find('option:selected').attr('data-level')) + 1;
        } else {
            data.level = 0;
        }
    });
    //开户信息事件
    bankPanel.on('click', '.bankEdit', function() {
        form.val('formBack', JSON.parse($(this).attr('data-value')));
        bankPop('修改');
    });
    bankPanel.on('click', '.bankDel', function() {
        var value = $(this).attr('data-value');
        layer_confirm('确定删除吗？', function() {
            layer_load();
            Serv.Get('uc/bank/delete/' + value, {}, function(result) {
                if (result.succeed) {
                    layer_alert(result.message, function() {
                        getBank();
                    });
                } else {
                    layer_alert(result.message);
                }
            });
        });
    });
    $('#addBlank').click(function() {
        form.val('formBack', data.bankInfo);
        bankPop('添加');
    });

    //基本信息
    form.on('submit(basicInfo)', function(laydata) {
        layer_load();
        laydata.field.level = data.level;
        layer_load_lose();
        Serv.Post('uc/company/edit', laydata.field, function(result) {
            if (result.succeed) {
                data.companyId = result.data;
                formBasic.find('input[name=id]').val(result.data);
                setReadonly();
                resetCompanyData();
                layer_alert(result.message);
            } else {
                layer_alert(result.message);
            }
        });
        return false;
    });
    //开户信息
    form.on('submit(backInfo)', function(laydata) {
        layer_load();
        if (data.companyId <= 0) {
            layer_alert('请先填写基本信息');
            return false;
        }
        laydata.field.companyId = data.companyId;
        Serv.Post('uc/bank/edit', laydata.field, function(result) {
            if (result.succeed) {
                layer_alert(result.message, function() {
                    layer.closeAll();
                    getBank();
                });
            } else {
                layer_alert(result.message);
            }
        });
        return false;
    });

    //获取公司信息
    function getCompanyInfo(value) {
        layer_load();
        Serv.Get('uc/company/get/' + value, {}, function(result) {
            layer_load_lose();
            if (result) {
                setReadonly();

                data.company = {};
                result.registeredTime = result.registeredTime.FormatDate(false);
                $.extend(true, data.company, result);
                form.val("formBasic", result);

                eIntro.txt.html(result.intro);
                eCulture.txt.html(result.culture);
                eHistory.txt.html(result.history);

                data.companyId = result.id;
                data.level = result.level;

                if (result.logo) {
                    $('#logoImage').show().find('img').attr('src', result.logo);
                }

                getCompanyTpl(result.pid);

                seltCompany.val(result.pid).attr('disabled', 'disabled');
                form.render('select');

                bankPanel.html(getBankContent(result.banks));
            } else {
                layer_alert(result.message);
            }
        });
    }

    //设置 只读
    function setReadonly() {
        $('#credit').attr('readonly', 'readonly');
    }

    //重置公司数据
    function resetCompanyData() {
        Serv.Get('uc/company/query', {}, window.globCache.setCompany);
    }
    //获取公司模板
    function getCompanyTpl(value) {
        var data = window.globCache.getCompany();
        seltCompany.empty().append('<option value="0" data-level="0">请选择</option>');
        $.each(data, function(i, item) {
            seltCompany.append('<option value="' + item.id + '" ' + (item.id == value ? 'selected' : '') + ' data-level="' + item.level + '">' + item.companyName + '</option>');
        });
        layui.form.render('select');
    }

    //开户信息 获取
    function getBank() {
        layer_load();
        Serv.Get('uc/bank/query/' + data.companyId, {}, function(result) {
            layer_load_lose();
            if (result) {
                bankPanel.html(getBankContent(result));
            } else {
                layer_alert(result.message);
            }
        });
    }
    //开户信息 弹窗
    function bankPop(operation) {
        if (data.companyId <= 0) {
            layer_alert('请先填写基本信息');
            return false;
        }
        layer.open({
            type: 1,
            title: operation + '银行账户',
            String: false,
            closeBtn: 1,
            skin: 'layui-layer-rim',
            area: '750px',
            content: $('#bankPop')
        });
    }
    //开户信息 内容模板
    function getBankContent(data) {
        data = data || [];
        return laytpl(getTpl).render({
            businessAddress: $('#businessAddress').val(),
            list: data
        });
    }
});