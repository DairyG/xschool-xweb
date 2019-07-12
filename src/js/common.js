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
	if (this == null || this == undefined || this == '') {
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

String.prototype.RTrim = function (c) {
	if (!c) {
		c = ' ';
	}
	var reg = new RegExp('([' + c + ']*$)', 'gi');
	return this.replace(reg, '');
}
String.prototype.LTrim = function (c) {
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

function user_popup(obj = null,allow_sels,num = 0,is_close_other = false,callback){
	if (is_close_other) {
		layer.closeAll();
	}
	
	var has_user = allow_sels.indexOf('user') > -1 ? true : false;
	var has_department = allow_sels.indexOf('department') > -1 ? true : false;
	var has_company = allow_sels.indexOf('company') > -1 ? true : false;
	var has_position = allow_sels.indexOf('position') > -1 ? true : false;
	var has_dpt_position = allow_sels.indexOf('dpt_position') > -1 ? true : false;
	var sel_type = 'org';
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
	
	var num = parseInt(num);
	var url = '../../pages/public/user_select.html?num='+num+'&has_user='+has_user+'&has_department='+has_department+'&has_company='+has_company+'&has_position='+has_position+'&has_dpt_position='+has_dpt_position;
	
	layer.open({
		type: 2,
		title: '用户选择',
		btn: ['确认', '取消'],
		String: false,
		closeBtn: 1,
		skin: 'layui-layer-rim',
		area: ['760px', '480px'],
		content: url,
		yes: function (index, layero) {
			var win = window[layero.find('iframe')[0]['name']];//得到iframe页的窗口对象
			var sels = win.sels;
			if (typeof obj == 'object') {
				var html = "";
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
		btn2: function (index, layero) {
			if (typeof callback === 'function') {
				callback(null);
			}
			layer.close(index);
		}
	});
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
		yes: function (index, layero) {
			//以下方式可获取到选中的 公司 部门 人员

			if (typeof obj == 'object') {

			};

			if (typeof callback === 'function') {
				callback(arr);
			}
			layer.close(index);
		},
		btn2: function (index, layero) {
			layer.close(index);
		}
	});
}

/**
 * 考核项选择框
 */
function assess_popup(obj, type = 'checkbox', callback) {
	var table;
	layui.use(['table'], function () {
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
		yes: function (index) {
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

/**
 * 解析用户选择项
 */

function formart_sels(data, businessType) {
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
				depId: 0,
				userId: 0,
				jobDepId: 0,
				jobId: 0
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
				jobId: 0
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
				jobId: 0
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
				jobId: p[i].id
			}
			res.push(data);
		}
	}
	if (dp != '') {
		for (var i = 0; i < dp.length; i++) {
			var r = dp[i].id.split('|');
			data = {
				businessType: businessType,
				dataType: dataType_arr[dataType],
				companyId: 0,
				depId: 0,
				userId: 0,
				jobDepId: r[0],
				jobId: r[1]
			}
			res.push(data);
		}
	}
	return res;
}