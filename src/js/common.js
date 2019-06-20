/**
 * 弹出加载层
 */
function layer_load() {
    window.layer_loading_id = layer.load(3, {
        shade: 0.3
    });
};

/**
 * 关闭加载层
 */
function layer_load_lose() {
    layer.close(window.layer_loading_id);
}

/**
 * 弹出 信息框
 * @param string message 提示信息
 * @param function callBack 回调函数
 */
function layer_alert(message, callBack) {
    layer_load_lose();
    layer.alert((message || '成功'), {
        title: '提示',
        closeBtn: 0
    }, function (index) {
        layer.close(index);
        callBack && callBack();
    });
}

/**
 * 确认框；
 * @param string message 提示信息
 * @param function confirmBack 点击确定的回调函数
 * @param function cancelBack 点击取消的回调函数
 */
function layer_confirm(message, confirmBack, cancelBack) {
    layer.confirm((message || '确定提交数据吗?'), {
        title: '确定信息',
        resize: false,
        btn: ['确定', '取消'],
        btnAlign: 'c',
        closeBtn: 0,
        anim: 0,
        icon: 3
    }, function (index) {
        layer.close(index);
        confirmBack && confirmBack();
    }, function (index) {
        layer.close(index);
        cancelBack && cancelBack();
    });
}

/** 
 * 弹出输入层
 */
function layui_prompt(obj) {
    var default_val = $(obj).val();
    layer.prompt({
        formType: 2,
        value: default_val,
        title: '请输入',
        area: ['350px', '120px'],
        yes: function (index, elem) {
            var value = elem.find(".layui-layer-input").val();
            $(obj).val(value);
            layer.close(index);
        }
    });
}

/**
 * 弹出用户选择框
 * @param Object obj 显示选中内容的对象
 * @param boolean has_user 是否可选用户
 * @param boolean has_department 是否可选部门
 * @param boolean hsa_company 是否可选公司
 * @param int num 最大选择数(大于零时限制选址数量，否者不限制)
 * @param boolean is_close_other 是否关闭其他弹窗
 * @param function callback 回调函数
 */
function user_popup(obj, has_user, has_department, hsa_company, num, is_close_other, callback) {
    if (is_close_other) {
        layer.closeAll();
    }
    var table;
    layui.use(['table'], function () {
        table = layui.table;
    });
    $('body').append('<div id="popup_content"></div>');
    $('#popup_content').load("../../pages/public/user_select2.html");

    layer.open({
        type: 1,
        title: '用户选择',
        btn: ['确认', '取消'],
        String: false,
        closeBtn: 1,
        skin: 'layui-layer-rim',
        area: ['760px', '480px'],
        content: $('#popup_content'),
        yes: function (index, layero) {
            var checkStatus = table.checkStatus('user_select_lst');
            var values = $(obj).val(),
                ids = $(obj).attr('ids');
            for (var i = 0; i < checkStatus.data.length; i++) {
                var value = checkStatus.data[i].id;
                $(obj).find('input').each(function () {
                    if ($(this).val() == value || $(this).val() == 0) {
                        sel_remove(this);
                    }
                });
                var html = build_sel_html('user', value, checkStatus.data[i].name);
                $(obj).append(html);
            }
            layer.close(index);
        },
        btn2: function (index, layero) {

            layer.close(index);
        }
    });
}

/**
 * 创建选中项html
 * @param string type (user,company,department,position)
 * @param string value 选中项的值
 * @param string text 选中项文本
 */
function build_sel_html(type, value, text) {
    var html = '<span class="layui-badge layui-badge2 layui-bg-cyan">' + text + '<input type="hidden" class="' + type + '_ipt" value="' + value + '"><i class="layui-icon layui-icon-close" onclick="sel_remove(this)"></i></span>';
    return html;
}

/** 
 * 删除选中项
 * @param Object obj
 */
function sel_remove(obj) {
    $(obj).parents('span').remove();
}


String.prototype.RTrim = function (c) {
    if (!c) {
        c = ' ';
    }
    var reg = new RegExp('([' + c + ']*$)', 'gi');
    return this.replace(reg, '');
}
/**
 * 日期格式转换
 * @param Boolean true=显示时间，false=不显示时间
 */
String.prototype.FormatDate = function (hasTime) {
    if (!this) {
        return "";
    }
    var fmt = 'yyyy-MM-dd';
    if (hasTime) {
        fmt = 'yyyy-MM-dd hh:mm:ss'
    }

    try {
        var date = new Date(Date.parse(this));
        if (!date) {
            return ''
        }

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        var o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        };
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                var str = o[k] + '';
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
            }
        }
        return fmt;
    } catch (e) {
        return '';
    }
}
/**
 * 验证空值
 */
String.prototype.isEmpty = function () {
    if (this === null || this == undefined || this === '') {
        return true;
    }
    return false;
}
/**
 * 验证邮件
 */
String.prototype.IsEmail = function () {
    var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    return reg.test(this);
}
/**
 * 验证手机号码
 */
String.prototype.IsMobile = function () {
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    return reg.test(this);
}
/**
 * 验证座机号码
 */
String.prototype.IsTelPhone = function () {
    var reg = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;
    return reg.test(this);
}
/**
 * 验证座机/手机/400/800
 */
String.prototype.IsTel2 = function () {
    var reg = /(^(\d{3,4}-)?\d{6,8}$)|(^1[3456789]\d{9}$)|(^400[0-9]{7})|(^800[0-9]{7})|(^(400)-(\d{3})-(\d{4}$))/;
    return reg.test(this);
}
/**
 * 验证Url地址
 */
String.prototype.IsUrl = function () {
    var reg = /^(http:||https:)\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
    return reg.test(this);
}
/**
 * 验证数字
 */
String.prototype.IsNum = function () {
    var reg = /^[0-9\.]+$/;
    return reg.test(this);
}

//验证身份证号码
function isCard(value) {
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
        return "身份证格式错误";
    } else if (!city[value.substr(0, 2)]) {
        //验证身份证地址
        return "身份证格式错误";
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
                return "身份证格式错误";
            }
        }
    }
    return '';
}

//根据身份证获取出生年月日
function getBirthdayFromIdCard(idCard) {
    var birthday = "";
    if (idCard != null && idCard != "") {
        if (idCard.length == 15) {
            birthday = "19" + idCard.substr(6, 6);
        } else if (idCard.length == 18) {
            birthday = idCard.substr(6, 8);
        }

        birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
    }

    return birthday;
}
//根据身份证获取年龄
function getAgeFromIdCard(idCard) {
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var age = myDate.getFullYear() - idCard.substring(6, 10) - 1;
    if (idCard.substring(10, 12) < month || idCard.substring(10, 12) == month && idCard.substring(12, 14) <= day) {
        age++;
    }
    return age;
}

/**
 * 左边自动补全0
 */
function padLeftZero(value) {
    return ('00' + value).substr(value.length);
}

/**
 * 写入cookie
 * @param string cookie名称
 * @param string cookie值
 */
function SetCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

/**
 * 获取cookie
 * @param string cookie名称
 */
function GetCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

/**
 * 删除cookie
 * @param string cookie名称
 */
function DelCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

/**
 * 获取get参数
 * @param string 参数名称
 */
function GetPara(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}

function QueryHZPY(id, pyId) {
    var str = document.getElementById(id).value.trim();
    if (str == "") return;
    var arrRslt = makePy(str);
    //循环将值到下拉框
    var option = null;
    document.getElementById(pyId).value = ""; //清空下拉框
    var first = document.getElementById(pyId);
    first.value = arrRslt;
}