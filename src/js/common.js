
/**
 * 日期格式转换
 * @param Boolean true=显示时间，false=不显示时间
 */
String.prototype.FormatDate = function(hasTime) {
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
 * 格式化日期对象
 * @param Object date
 * @param boolean 
 */
function FormatDate(date, hasTime) {
    if (hasTime) {
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    } else {
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }
}
/**
 * 验证空值
 */
String.prototype.IsEmpty = function() {
    if (this == null || this == undefined || this == '') {
        return true;
    }
    return false;
}
/**
 * 验证邮件
 */
String.prototype.IsEmail = function() {
    var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    return reg.test(this);
}
/**
 * 验证手机号码
 */
String.prototype.IsMobile = function() {
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    return reg.test(this);
}
/**
 * 验证座机号码
 */
String.prototype.IsTelPhone = function() {
    var reg = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;
    return reg.test(this);
}
/**
 * 验证座机/手机/400/800
 */
String.prototype.IsTel2 = function() {
    var reg = /(^(\d{3,4}-)?\d{6,8}$)|(^1[3456789]\d{9}$)|(^400[0-9]{7})|(^800[0-9]{7})|(^(400)-(\d{3})-(\d{4}$))/;
    return reg.test(this);
}
/**
 * 验证Url地址
 */
String.prototype.IsUrl = function() {
    var reg = /^(http:||https:)\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
    return reg.test(this);
}
/**
 * 验证数字
 */
String.prototype.IsNum = function() {
    var reg = /^[0-9\.]+$/;
    return reg.test(this);
}

/**
 * 整数或浮点数(1-2位小数)
 */
String.prototype.IsDecimal = function() {
    return /^[0-9]+[.]?[0-9]{1,2}$/.test(this) || /^\d+$/.test(this);
}


$.fn.scrollFixed = function(fixed_w = '') { //页面滚动时tab-title始终在页面上方
    var offset = this.offset().top;
    var _this = this;
    if (fixed_w == '') {
        fixed_w = _this.parents('.childrenBody').width();
    }
    var w = _this.width();
    var padd = (fixed_w - w) / 2;
    $(window).scroll(function(event) {
        if ($(window).scrollTop() > offset) {
            _this.css({
                'position': 'fixed',
                'top': '0',
                'left': '15px',
                'width': w,
                'zIndex': '9999',
                'background': '#fff',
                'paddingTop': '15px',
                'paddingLeft': padd,
                'paddingRight': padd
            });
        } else {
            _this.removeAttr('style');
        }
    });
}

//验证是否是JSON
function IsJson(value) {
    if (typeof value == 'string') {
        try {
            JSON.parse(value);
        } catch (e) {
            return false;
        }
        return true;
    }
    return false;
}

//验证身份证号码
function IsCard(value) {
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
 * 时间比较>=
 * @param string t1 日期
 * @param string t2 日期
 */
function compareDate(t1, t2) {
    return new Date(t1.replace(/-/g, "/")) >= new Date(t2.replace(/-/g, "/"));
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

String.prototype.RTrim = function(c) {
    if (!c) {
        c = ' ';
    }
    var reg = new RegExp('([' + c + ']*$)', 'gi');
    return this.replace(reg, '');
}
String.prototype.LTrim = function(c) {
    if (!c) {
        c = ' ';
    }
    var reg = new RegExp('(^[' + c + '])', 'gi');
    return this.replace(reg, '');
}

/**
 * 弹出用户选择框
 * @param Object obj 显示选中内容的对象
 * @param string allow_sels ('user,department,company,position,dpt_position')
 * @param int num 最大选择数(大于零时限制选址数量，否者不限制)
 * @param boolean is_close_other 是否关闭其他弹窗
 * @param function callback 回调函数
 */

function user_popup(obj = null, allow_sels, num, is_close_other = false, callback) {
    if (is_close_other) {
        layer.closeAll();
    }

    var has_user = allow_sels.indexOf('user') > -1 ? true : false;
    var has_department = allow_sels.indexOf('department') > -1 ? true : false;
    var has_company = allow_sels.indexOf('company') > -1 ? true : false;
    var has_dpt_position = allow_sels.indexOf('dpt_position') > -1 ? true : false;
    if (has_dpt_position) {
        var has_position = allow_sels.indexOf(',position') > -1 || allow_sels.indexOf('position,') > -1 ? true : false;
    } else {
        var has_position = allow_sels.indexOf('position') > -1 ? true : false;
    }
    var sel_type = '';

    window.sels = null;
    if (typeof obj == 'object') {
        if ($(obj).attr('type') == 'text') {
            var arr = $(obj).siblings('input[name="sels"]').val();
        } else {
            var arr = $(obj).find('input[name="sels"]').val();
        }
        if (arr) {
            sels = JSON.parse(arr);
            sel_type = sels.sel_type;
        }
    }
    if (sel_type == '') {
        if (has_user || has_company || has_department) {
            sel_type = 'org';
        } else if (has_position) {
            sel_type = 'position';
        } else {
            sel_type = 'dpt_position';
        }
    }
    var num = parseInt(num);
    var url = '../../pages/public/user_select.html?sel_type=' + sel_type + '&num=' + num + '&has_user=' + has_user + '&has_department=' + has_department + '&has_company=' + has_company + '&has_position=' + has_position + '&has_dpt_position=' + has_dpt_position;

    layer.open({
        type: 2,
        title: '用户选择',
        btn: ['确认', '取消'],
        String: false,
        closeBtn: 1,
        skin: 'layui-layer-rim',
        area: ['760px', '480px'],
        content: url,
        yes: function(index, layero) {
            var win = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象
            var sels = win.sels;
            if (typeof obj == 'object') {
                var html = getSelStr(sels);
                if ($(obj).attr('type') == 'text') {
                    $(obj).val(html);
                    var hide_ipt = $(obj).next('input[type="hidden"]');
                    if (hide_ipt.length > 0) {
                        hide_ipt.val(JSON.stringify(sels));
                    } else {
                        $(obj).after('<input type="hidden" name="sels" value=\'' + JSON.stringify(sels) + '\'>');
                    }
                } else {
                    html += '&gt;&gt;';
                    $(obj).html(html);
                    var hide_ipt = $(obj).find('input[type="hidden"]');
                    if (hide_ipt.length > 0) {
                        hide_ipt.val(JSON.stringify(sels));
                    } else {
                        $(obj).append('<input type="hidden" name="sels" value=\'' + JSON.stringify(sels) + '\'>');
                    }
                }
            };

            if (typeof callback === 'function') {
                callback(sels);
            }
            layer.close(index);
        },
        btn2: function(index, layero) {
            if (typeof callback === 'function') {
                callback(null);
            }
            layer.close(index);
        }
    });
}

function getSelStr(sels) {
    var html = '';
    var L1 = sels.user.length,
        L2 = sels.department.length,
        L3 = sels.company.length,
        L4 = sels.position.length,
        L5 = sels.dpt_position.length;
    if ((L1 + L2 + L3 + L4 + L5) > 1) {
        html = "等" + (L1 + L2 + L3 + L4 + L5) + '项';
    }
    if (L1 > 0) {
        html = sels.user[0].name + html;
    } else if (L2 > 0) {
        html = sels.department[0].name + html;
    } else if (L3 > 0) {
        html = sels.company[0].name + html;
    } else if (L4 > 0) {
        html = sels.position[0].name + html;
    } else if (L5 > 0) {
        html = sels.dpt_position[0].name + html;
    }
    return html;
}

/**
 * 解析用户选择项
 */

function parse_sels(data, businessType) {
    if (data == "") {
        return [];
    }

    var dataType_arr = {
        'org': 1,
        'position': 2,
        'dpt_position': 3
    };
    data = JSON.parse(data);
    var dataType = data.sel_type;
    var c = data.company;
    var d = data.department;
    var u = data.user;
    var p = data.position;
    var dp = data.dpt_position;
    var res = [],
        data;
    if (c != '') {
        for (var i = 0; i < c.length; i++) {
            data = {
                businessType: businessType,
                dataType: dataType_arr[dataType],
                companyId: c[i].id,
                companyName: c[i].name,
                depId: 0,
                dpeName: '',
                userId: 0,
                userName: '',
                jobDepId: 0,
                jobDepNmae: '',
                jobId: 0,
                jobName: '',
            }
            res.push(data);
        }
    }
    if (d != '') {
        for (var i = 0; i < d.length; i++) {
            data = {
                businessType: businessType,
                dataType: dataType_arr[dataType],
                companyId: 0,
                depId: d[i].id,
                userId: 0,
                jobDepId: 0,
                jobId: 0,
                companyName: '',
                dpeName: d[i].name,
                userName: '',
                jobDepNmae: '',
                jobName: '',
            }
            res.push(data);
        }
    }
    if (u != '') {
        for (var i = 0; i < u.length; i++) {
            data = {
                businessType: businessType,
                dataType: dataType_arr[dataType],
                companyId: 0,
                depId: 0,
                userId: u[i].id,
                jobDepId: 0,
                jobId: 0,
                companyName: '',
                dpeName: '',
                userName: u[i].name,
                jobDepNmae: '',
                jobName: '',
            }
            res.push(data);
        }
    }
    if (p != '') {
        for (var i = 0; i < p.length; i++) {
            data = {
                businessType: businessType,
                dataType: dataType_arr[dataType],
                companyId: 0,
                depId: 0,
                userId: 0,
                jobDepId: 0,
                jobId: p[i].id,
                companyName: '',
                dpeName: '',
                userName: '',
                jobDepNmae: '',
                jobName: p[i].name,
            }
            res.push(data);
        }
    }
    if (dp != '') {
        for (var i = 0; i < dp.length; i++) {
            var r = dp[i].id.split('_');
            data = {
                businessType: businessType,
                dataType: dataType_arr[dataType],
                companyId: 0,
                depId: 0,
                userId: 0,
                jobDepId: r[0],
                jobId: r[1],
                companyName: '',
                dpeName: '',
                userName: '',
                jobDepNmae: dp[i].dpt_name,
                jobName: dp[i].name
            }
            res.push(data);
        }
    }
    return res;
}


/**
 * 
 * @param {*} obj 
 * @param {*} company_id 
 * @param {*} callback 
 */
function formart_sels(data) {
    if (data == undefined) {
        return false;
    }
    var result = {
        sel_type: "org",
        user: [],
        department: [],
        company: [],
        position: [],
        dpt_position: []
    };
    var dataType_arr = {
        1: 'org',
        2: 'position',
        3: 'dpt_position'
    };
    if (data.length == 0) {
        return JSON.stringify(result);
    }
    result.sel_type = dataType_arr[data[0].dataType];
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var d = {
            id: '',
            name: ''
        };
        if (item.userId > 0) {
            d.id = item.userId;
            d.name = item.userName;
            result.user.push(d);
        } else if (item.depId > 0) {
            d.id = item.depId;
            d.name = item.depName;
            result.department.push(d);
        } else if (item.companyId > 0) {
            d.id = item.companyId;
            d.name = item.companyName;
            result.company.push(d);
        } else if (item.jobDepId > 0) {
            d.id = item.jobDepId + '_' + item.jobId;
            d.name = item.jobDepNmae;
            d.dpt_name = item.jobName;
            d.dpt_id = item.jobId;
            result.dpt_position.push(d);
        } else if (item.jobId > 0) {
            d.id = item.jobId;
            d.name = item.jobName;
            result.position.push(d);
        }
    }
    return result;
}

/**
 * 费用项选择弹出框
 */
function payitem_pop(obj = null, company_id, callback) {
    if (parseInt(company_id) <= 0) {
        layer.alert('请选择公司');
    }
    $('body').append('<div id="popup_content" data-company_id="' + company_id + '"></div>');
    $('#popup_content').load("../../pages/public/payitem_select.html");

    layer.open({
        type: 1,
        title: '费用科目选择',
        btn: ['确认', '取消'],
        String: false,
        closeBtn: 1,
        skin: 'layui-layer-rim',
        area: ['760px', '480px'],
        content: $('#popup_content'),
        yes: function(index, layero) {
            //以下方式可获取到选中的 公司 部门 人员

            if (typeof obj == 'object') {

            };

            if (typeof callback === 'function') {
                callback(arr);
            }
            layer.close(index);
        },
        btn2: function(index, layero) {
            layer.close(index);
        }
    });
}

/**
 * 考核项选择框
 */
function assess_popup(obj, type = 'checkbox', callback) {
    var table;
    layui.use(['table'], function() {
        table = layui.table;
    });
    $('body').append('<div id="popup_content" data-type=' + type + '></div>');
    $('#popup_content').load("../../pages/public/assess.html");

    layer.open({
        type: 1,
        title: '选择考核项',
        String: false,
        closeBtn: 1,
        btn: ['确认', '取消'],
        yes: function(index) {
            var checkStatus = table.checkStatus('assess_lst'),
                data = checkStatus.data;
            if (typeof callback === 'function') {
                callback(data);
            }
            layer.close(index);
        },
        skin: 'layui-layer-rim',
        area: ['850px', '450px'],
        content: $('#popup_content')
    });
}


function convertCurrency(money) {
    //汉字的数字  
    var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
    //基本单位  
    var cnIntRadice = new Array('', '拾', '佰', '仟');
    //对应整数部分扩展单位  
    var cnIntUnits = new Array('', '万', '亿', '兆');
    //对应小数部分单位  
    var cnDecUnits = new Array('角', '分', '毫', '厘');
    //整数金额时后面跟的字符  
    var cnInteger = '整';
    //整型完以后的单位  
    var cnIntLast = '元';
    //最大处理的数字  
    var maxNum = 999999999999999.9999;
    //金额整数部分  
    var integerNum;
    //金额小数部分  
    var decimalNum;
    //输出的中文金额字符串  
    var chineseStr = '';
    //分离金额后用的数组，预定义  
    var parts;
    if (money == '') {
        return '';
    }
    money = parseFloat(money);
    if (money >= maxNum) {
        //超出最大处理数字  
        return '';
    }
    if (money == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
    }
    //转换为字符串  
    money = money.toString();
    if (money.indexOf('.') == -1) {
        integerNum = money;
        decimalNum = '';
    } else {
        parts = money.split('.');
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
    }
    //获取整型部分转换  
    if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0;
        var IntLen = integerNum.length;
        for (var i = 0; i < IntLen; i++) {
            var n = integerNum.substr(i, 1);
            var p = IntLen - i - 1;
            var q = p / 4;
            var m = p % 4;
            if (n == '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                }
                //归零  
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
        }
        chineseStr += cnIntLast;
    }
    //小数部分  
    if (decimalNum != '') {
        var decLen = decimalNum.length;
        for (var i = 0; i < decLen; i++) {
            var n = decimalNum.substr(i, 1);
            if (n != '0') {
                chineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
        }
    }
    if (chineseStr == '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNum == '') {
        chineseStr += cnInteger;
    }
    return chineseStr;
}
/**
 * 
 * 获取当前时间
 */
function GetTimeNow() {
    var myDate = new Date();
    //获取当前年
    var year = myDate.getFullYear();
    //获取当前月
    var month = myDate.getMonth() + 1;
    //获取当前日
    var date = myDate.getDate();
    var h = myDate.getHours(); //获取当前小时数(0-23)
    var m = myDate.getMinutes(); //获取当前分钟数(0-59)
    var s = myDate.getSeconds();
    var now = year + '-' + getNow(month) + "-" + getNow(date) + " " + getNow(h) + ':' + getNow(m) + ":" + getNow(s);
    return now;
}
//获取本月
function GetMonthNow() {
    var myDate = new Date();
    //获取当前年
    var year = myDate.getFullYear();
    //获取当前月
    var month = myDate.getMonth() + 1;
    var now = year + '-' + getNow(month);
    return now;
}
//获取今年
function GetYearNow() {
    var myDate = new Date();
    //获取当前年
    var year = myDate.getFullYear();
    var now = year;
    return now;
}

function getNow(s) {
    return s < 10 ? '0' + s : s;
}

/**
 * 首字母大写
 */
String.prototype.FirstUpperCase = function() {
    return this.substring(0, 1).toUpperCase() + this.substring(1)
}

$(function() {
    $('.back_history').click(function() {
        window.history.back(-1);
    });
});
//根据指定日期获取上个月
function GetLastMonth(dt) {
    var arr = dt.split('-');
    var year = parseInt(arr[0]);
    var month = parseInt(arr[1]) - 1;
    if (month <= 0) {
        year = year - 1;
        month = 12;
    }
    var res = getNow(year) + "-" + getNow(month);
    return res;
}

//是否是图片
function IsImage(value) {
    if (!value) {
        return false;
    }
    return /.(bmp|gif|jpg|jpeg|png)$/.test(value.toLowerCase());
}

//文件删除
function delFileNode(obj) {
    var pObj = $(obj).parents('li');
    layer_confirm('确定删除吗？', function() {
        pObj.remove();
    });
}
//设置图片
function setImageHtml(value) {
    var htmls =
        '<li>' +
        '<div class="img-box click-bor">' +
        '  <input data-name="image" type="hidden" value="' + value + '">' +
        '  <img src="' + value + '" width="120" height="90" />' +
        '  <a class="btn default btn-del black" onclick="delFileNode(this)" title="删除图片"><i class="fa fa-trash-o"></i>删除</a>' +
        '</div>' +
        '</li>';
    return htmls;
}
/**
 * 设置附件
 * @param {*} value 值
 * @param {*} hideDel 是否隐藏删除按钮
 */
function setAttachHtml(value, hideDel) {
    let pos = value.lastIndexOf('\/'); // 查找最后一个/的位置
    var fileName = value.substring(pos + 1); // 截取最后一个/位置到字符长度，也就是截取文件名
    var htmls = '<li><i class="icon-attachment"></i><input data-name="attach" type="hidden" value="' + value + '">';
    if (hideDel != 1) {
        htmls += '<a href="javascript:;" onclick="delFileNode(this);" class="del" title="删除附件"><i class="layui-icon layui-icon-close"></i></a>';
    }
    htmls += '<div class="title">' + fileName + '</div><div class="info"><a href="' + value + '" target="_blank">点击下载</a></div></li>';
    return htmls;
}