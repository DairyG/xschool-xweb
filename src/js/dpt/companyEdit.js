var model = {
    id: 0
    , companyName: ''
    , englishName: ''
    , credit: ''
    , companyType: ''
    , legalPerson: ''
    , registeredCapital: ''
    , responsible: ''
    , responsiblePhone: ''
    , registeredTime: ''
    , businessDate: ''
    , businessAddress: ''
    , businessScope: ''
    , logo: ''
    , companyPhone: ''
    , email: ''
    , officeAddress: ''
    , webSite: ''
    , intro: ''
    , culture: ''
    , history: ''
};

var vmBasic = new Vue({ el: '#form_basicInfo', data: model });

layui.use(['element', 'laydate', 'layedit', 'form'], function () {
    var element = layui.element,
        laydate = layui.laydate,
        layedit = layui.layedit,
        layform = layui.form;

    laydate.render({
        elem: '#date1'
        , done: function (value) {
            model.registeredTime = value;
            vmBasic.$set({ data: model });
        }
    });
    var layIntro = layedit.build('LAY_Intro', {
        height: 180
    });
    var layCulture = layedit.build('LAY_Culture', {
        height: 180
    });
    var layHistory = layedit.build('LAY_History', {
        height: 180
    });

    var id = GetPara('id');
    var operation = GetPara('operation');
    if (!IsNum(id)) {
        id = 0;
    } else {
        initData(id);
    }
    if (!isEmpty(operation)) {
        $('.btnHidden').hide();
    }
    layform.verify({
        Intro: function () {
            layedit.sync(layIntro);
        },
        Culture: function () {
            layedit.sync(layCulture);
        },
        History: function () {
            layedit.sync(layHistory);
        }
    });

    //初始化
    function initData(value) {
        Serv.Get('company/getInfo/' + value, {}, function (result) {
            if (result.code == "00") {
                model.id = result.data.id;
                model.companyName = result.data.companyName;
                model.englishName = result.data.englishName;
                model.credit = result.data.credit;
                model.companyType = result.data.companyType;
                model.legalPerson = result.data.legalPerson;
                model.registeredCapital = result.data.registeredCapital;
                model.responsible = result.data.responsible;
                model.responsiblePhone = result.data.responsiblePhone;
                model.registeredTime = result.data.registeredTime.FormatDate(false);
                model.businessDate = result.data.businessDate;
                model.businessAddress = result.data.businessAddress;
                model.businessScope = result.data.businessScope;
                model.logo = result.data.logo;
                model.companyPhone = result.data.companyPhone;
                model.email = result.data.email;
                model.officeAddress = result.data.officeAddress;
                model.webSite = result.data.webSite;
                model.intro = result.data.intro;
                model.culture = result.data.culture;
                model.history = result.data.history;
                vmBasic.$set({ data: model });

                layedit.setContent(layIntro, result.data.intro);
                layedit.setContent(layCulture, result.data.culture);
                layedit.setContent(layHistory, result.data.history);
            } else {
                layer_alert(result.message);
            }
        });
    }

    $('#form_basicInfo').find('input[name="BusinessAddress"]').blur(function () {
        $('#form_bankInfo').find('input[name="BusinessAddress"]').val($(this).val());
    });

    //基本信息
    layform.on('submit(basicInfo)', function (laydata) {
        layer_load();
        Serv.Post('company/edit', laydata.field, function (result) {
            if (result.code == "00") {
                $('#form_basicInfo').find('input[name="Id"]').val(result.data);
                $('#form_bankInfo').find('input[name="CompanyId"]').val(result.data);
                layer_alert(result.message);
            } else {
                layer_alert(result.message);
            }
        });
        return false;
    });

    //开户信息
    layform.on('submit(bankInfo)', function (laydata) {
        if (laydata.field.CompanyId == 0) {
            layer_alert('请先填写基本信息栏');
            return false;
        }
        layer_load();
        Serv.Post('company/editbank', laydata.field, function (result) {
            if (result.code == "00") {
                $('#form_bankInfo').find('input[name="Id"]').val(result.data);
                layer_alert(result.message);
            } else {
                layer_alert(result.message);
            }
        });
        return false;
    });
});
