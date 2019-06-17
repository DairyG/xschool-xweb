//自定义验证规则


layui.use(['form'], function () {
    var layform = layui.form

    layform.verify({
        name: function (value, obj) {
            if (!value) {
                return '请填写' + $(obj).attr("placeholder");
            }
            value = value.replace(/(^\s*)|(\s*$)/g, '');
            if (value == null || value.length == 0) {
                return '请填写' + $(obj).attr("placeholder");
            }
        },
        select: function (value, obj) {
            if (value == null || value.length == 0) {
                return '请选择' + $(obj).attr("placeholder");
            }
        },
        code: function (value, obj) {
            if (/^[a-zA-Z0-9]+$/.test(value) == false) {
                return $(obj).attr("placeholder") + "只能包含字母和数字";
            }
        },
        address: function (value, obj) {
            if (value.length == 0) {
                return '请填写' + $(obj).attr("placeholder");
            }
        },
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        tel: function (value, obj) {
            if (/^[0-9-]+$/.test(value) == false) {
                return $(obj).attr("placeholder") + "格式不正确";
            }
        },
        phone: function (value, obj) {
            if (/^1[3456789]\d{9}$/.test(value) == false) {
                return $(obj).attr("placeholder") + "格式不正确";
            }
        },
        tel2: function (value, obj) {
            if (/(^(\d{3,4}-)?\d{6,8}$)|(^1[3456789]\d{9}$)|(^400[0-9]{7})|(^800[0-9]{7})|(^(400)-(\d{3})-(\d{4}$))/.test(value) == false) {
                return $(obj).attr("placeholder") + "格式不正确";
            }
        },
        url: function (value, obj) {
            if (/^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(value) == false) {
                return $(obj).attr("placeholder") + "格式不正确";
            }
        },
        num: function (value, obj) {
            if (/^[0-9\.]+$/.test(value) == false) {
                return $(obj).attr("placeholder") + "必须为数字";
            }
        },
        num_ext: function (value, obj) {
            if (/^[0-9\.]+$/.test(value) == false) {
                return $(obj).attr("data-placeholder") + "必须为数字";
            }
        },
        numNotZore: function (value, obj) {
            if (/^[1-9\.]+$/.test(value) == false) {
                return $(obj).attr("placeholder") + "必须为大于0的整数";
            }
        },
        content: function (value) {
            layedit.sync(editIndex);
        },
        num2: function (value, obj) {
            if (value == "") { return; }
            if (/^[0-9\.]+$/.test(value) == false) {
                return $(obj).attr("placeholder") + "必须为数字";
            }
        },
        emailHas: function (value, obj) {
            if (value == "" || value.length == 0) { return; }
            if (/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(value) == false) {
                return $(obj).attr("placeholder") + "格式错误";
            }
        },
        urlHas: function (value, obj) {
            if (value == "" || value.length == 0) { return; }
            if (/^(http:||https:)\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(value) == false) {
                return $(obj).attr("placeholder") + "格式错误";
            }
        },
        phoneHas: function (value, obj) {
            if (value == "" || value.length == 0) { return; }
            if (/^1[3456789]\d{9}$/.test(value) == false) {
                return $(obj).attr("placeholder") + "格式错误";
            }
        },
    });
});

