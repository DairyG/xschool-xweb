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
            if (/^(1[345789][0-9])[0-9]{8}$/.test(value) == false) {
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
            if (value == "") {
                return;
            }
            if (/^[0-9\.]+$/.test(value) == false) {
                return $(obj).attr("placeholder") + "必须为数字";
            }
        },
        //验证身份证号码
        card: function (value, obj) {
            var city = {
                11: "北京",
                12: "天津",
                13: "河北",
                14: "山西",
                15: "内蒙古",
                21: "辽宁",
                22: "吉林",
                23: "黑龙江 ",
                31: "上海",
                32: "江苏",
                33: "浙江",
                34: "安徽",
                35: "福建",
                36: "江西",
                37: "山东",
                41: "河南",
                42: "湖北 ",
                43: "湖南",
                44: "广东",
                45: "广西",
                46: "海南",
                50: "重庆",
                51: "四川",
                52: "贵州",
                53: "云南",
                54: "西藏 ",
                61: "陕西",
                62: "甘肃",
                63: "青海",
                64: "宁夏",
                65: "新疆",
                71: "台湾",
                81: "香港",
                82: "澳门",
                91: "国外 "
            };
            if (!value || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value)) {
                return $(obj).attr("placeholder") + "格式错误";
            } else if (!city[value.substr(0, 2)]) {
                //验证身份证地址
                return $(obj).attr("placeholder") + "格式错误";
            } else {
                //18位身份证需要验证最后一位校验位
                if (value.length == 18) {
                    value = value.split('');
                    //∑(ai×Wi)(mod 11)
                    //加权因子
                    var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                    //校验位
                    var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                    var sum = 0;
                    var ai = 0;
                    var wi = 0;
                    for (var i = 0; i < 17; i++) {
                        ai = value[i];
                        wi = factor[i];
                        sum += ai * wi;
                    }
                    var last = parity[sum % 11];
                    if (parity[sum % 11] != value[17]) {
                        return $(obj).attr("placeholder") + "格式错误";
                    }
                }
            }
        },
        //统一社会信用代码
        credit: function (value, obj) {
            value = value.replace(/(^\s*)|(\s*$)/g, '');
            if (value == "" || value.length == 0) {
                return;
            }
            if (/[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g.test(value) == false) {
                return $(obj).attr("placeholder") + "格式错误";
            }
        },
        emailHas: function (value, obj) {
            value = value.replace(/(^\s*)|(\s*$)/g, '');
            if (value == "" || value.length == 0) {
                return;
            }
            if (/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(value) == false) {
                return $(obj).attr("placeholder") + "格式错误";
            }
        },
        urlHas: function (value, obj) {
            value = value.replace(/(^\s*)|(\s*$)/g, '');
            if (value == "" || value.length == 0) {
                return;
            }
            if (/^(http:||https:)\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(value) == false) {
                return $(obj).attr("placeholder") + "格式错误";
            }
        },
        phoneHas: function (value, obj) {
            value = value.replace(/(^\s*)|(\s*$)/g, '');
            if (value == "" || value.length == 0) {
                return;
            }
            if (/^1[3456789]\d{9}$/.test(value) == false) {
                return $(obj).attr("placeholder") + "格式错误";
            }
        },
        telHas: function (value, obj) {
            value = value.replace(/(^\s*)|(\s*$)/g, '');
            if (value == "" || value.length == 0) {
                return;
            }
            if (/(^(\d{3,4}-)?\d{6,8}$)|(^1[3456789]\d{9}$)/.test(value) == false) {
                return $(obj).attr("placeholder") + "格式错误";
            }
        },
        faxHas: function (value, obj) {
            value = value.replace(/(^\s*)|(\s*$)/g, '');
            if (value == "" || value.length == 0) {
                return;
            }
            if (/^(\d{3,4}-)?\d{7,8}$/.test(value) == false) {
                return $(obj).attr("placeholder") + "格式错误";
            }
        },
        numHas: function (value, obj) {
            value = value.replace(/(^\s*)|(\s*$)/g, '');
            if (value == "" || value.length == 0) {
                return;
            }
            if (/^[0-9]+$/.test(value) == false) {
                return $(obj).attr("placeholder") + "必须为数字";
            }
        },
        areaHas: function (value, obj) {
            value = value.replace(/(^\s*)|(\s*$)/g, '');
            if (value == "" || value.length == 0) {
                return;
            }
            var code = $(obj).attr('data-areacode');
            if (code.split(',').length != 3) {
                return $(obj).attr("placeholder") + "必须选择省市区";
            }
        },
    });
});