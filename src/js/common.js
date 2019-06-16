/**
 * 弹出加载层
 */
function layer_load() {
    window.layer_loading_id = layer.load(3, { shade: 0.3 });
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
    layer.alert((message || '成功'), { title: '提示', closeBtn: 0 }, function (index) {
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
        title: '确定信息'
        , resize: false
        , btn: ['确定', '取消']
        , btnAlign: 'c'
        , closeBtn: 0
        , anim: 0
        , icon: 3
    }, function (index) {
        layer.close(index);
        confirmBack && confirmBack();
    }, function (index) {
        layer.close(index);
        cancelBack && cancelBack();
    });
}

/**
 * 弹出用户选择框
 */
function user_popup(obj) {
    if (!$('#popup_content').length) {
        $('body').append('<div id="popup_content"></div>');
        $('#popup_content').load("../public/user_select.html");
    }
    var table;
    layui.use(['table'], function () {
        table = layui.table;
    });
    layer.open({
        type: 1,
        title: false,
        btn: ['确认', '取消'],
        String: false,
        closeBtn: 1,
        skin: 'layui-layer-rim',
        area: ['850px', '450px'],
        content: $('#popup_content'),
        yes: function (index, layero) {
            var checkStatus = table.checkStatus('user_select_lst');
            console.log(checkStatus.data) //获取选中行的数据
        },
        btn2: function (index, layero) {

            layer.close(index);
        }
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
        area: ['350px', '120px'] //自定义文本域宽高
    }, function (value, index, elem) {
        $(obj).val(value);
        layer.close(index);
    });
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
    if (!this) { return ""; }
    //try {
    //    var d = new Date(Date.parse(this));
    //    if (!d) { return ""; }
    //    if (hasTime) {
    //        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    //    } else {
    //        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    //    }
    //} catch (ex) {
    //    return "";
    //}

    var fmt = 'yyyy-MM-dd';
    if (hasTime) {
        fmt = 'yyyy-MM-dd hh:mm:ss'
    }

    try {
        var date = new Date(Date.parse(this));
        if (!date) { return '' }

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        var o = {
            'M+': date.getMonth() + 1
            , 'd+': date.getDate()
            , 'h+': date.getHours()
            , 'm+': date.getMinutes()
            , 's+': date.getSeconds()
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
/**
 * 验证空值
 * @param string 待验证的值
 */
function isEmpty(value) {
    if (value === null || value == undefined || value === '') {
        return true;
    }
    return false;
}

/**
 * 验证数字
  * @param string 待验证的值
 */
function IsNum(value) {
    return /^[0-9\.]+$/.test(value)
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
    document.getElementById(pyId).value = "";//清空下拉框
    var first = document.getElementById(pyId);
    first.value = arrRslt;
}