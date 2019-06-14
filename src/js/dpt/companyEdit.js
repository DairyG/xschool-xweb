layui.use(['element', 'laydate', 'layedit', 'form'], function () {
    var element = layui.element,
        laydate = layui.laydate,
        layedit = layui.layedit,
        layform = layui.form;

    laydate.render({
        elem: '#date1'
    });
    layIntro = layedit.build('LAY_Intro', {
        height: 180
    });
    layCulture = layedit.build('LAY_Culture', {
        height: 180
    });
    layHistory = layedit.build('LAY_History', {
        height: 180
    });

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
