var Employee = globCache.getEmployee();
var id = GetPara('id');
var info;
var PayItems = [];
var table,laytpl;
layui.use(['form','laydate','table','layedit','element','laytpl'], function() {
	var form = layui.form,
		laydate = layui.laydate,
		layedit = layui.layedit,
		element = layui.element;
	laytpl = layui.laytpl;
	table = layui.table;
	var initPage = function(){
		if(id > 0){
			layer_load();
			Serv.Post('gc/Contract/GetSingle',{id:id},function(res){
				info = res;
			},false);
			
			var data = {};
			var validDate = '';
			var total_money = 0,total_scale = 0;
			for(var key in info){
				var new_key = key.FirstUpperCase();
				data[new_key] = info[key];
			}
			$('#validDate').val(data.StartTime.FormatDate() + ' - ' + data.EndTime.FormatDate());
			if(data.PayNum > 1){
				$('#pay_table_item').show();
				PayItems = JSON.parse(data.PayItems);
				var tpl;
				tpl = $('#payItem_html').html();
				$('#pay_table_item tr').eq(1).remove();
				var tr_obj = $('#pay_table_item tr').eq(0);
				for(var i = 0;i < PayItems.length;i++){
					laytpl(tpl).render(PayItems[i], function(html){
						$(tr_obj).after(html);
					});
					total_money += PayItems[i].money;
					total_scale += PayItems[i].scale;
					
				}
			}
			$('#total_money').html(total_money);
			$('#total_scale').html(total_scale);
			data.PayNum = data.PayNum.toString();
			data.Invoice = data.Invoice.toString();
			form.val('info',data);
			if(data.Invoice == 1){
				$("#invoice_box").show();
				$('input[name="InvoiceTitle"]').attr('lay-verify','name');
				if(data.InvoiceToType == '2'){
					$("#type2_box").show();
				} else {
					$("#type2_box").hide();
				}
				set_verify();
			}
			layer_load_lose();
		} 
	}
	initPage();
	layedit.build('content');
	window.renderDate = function(){
		lay('.date').each(function(){
			laydate.render({
				elem:this,
				done: function(value, date, endDate){
					var index = $(this.elem).closest('tr').index();
					PayItems[index].time = value;
				}
			});
		});
	};
	renderDate();
	laydate.render({
		elem:'#validDate',
		range:true
	});
	form.on('radio(pay_num)',function(obj){
		if(obj.value == '1'){
			$("#pay_table_item").hide();
		} else {
			if(PayItems.length == 0){
				PayItems.push({name:'',scale:'',money:'',time:'',tips:''});
			}
			$("#pay_table_item").show();
		}
	});
	function set_verify(){
		// 发票类型 企业增值税普通发票 
			//税务登记证号 必填
		// 发票类型 增值税专用发票
			//全部必填
		// 发票类型组织（非企业）增值税普通发票
			//都非必填
		var t1 = $('#InvoiceType').val();
		var t2 = $('#InvoiceToType').val();
		
		$("#invoice_box input").removeAttr('lay-verify');
		if (t2 == 2){//企业
			switch(t1){
				case '1':
					$('#type2_box .t2 span').hide();
					$('#type2_box .t1 span').show();
					$('#type2_box .t1 input').each(function(){
						var verify = $(this).attr('data-lay-verify');
						$(this).attr('lay-verify',verify);
					});
					break;
				case '2':
					$('#type2_box .t2 span').show();
					$('#type2_box .t1 span').show();
					$('#type2_box input').each(function(){
						var verify = $(this).attr('data-lay-verify');
						$(this).attr('lay-verify',verify);
					});
					break;
				case '3':
					$('#type2_box .t2 span').hide();
					$('#type2_box .t1 span').hide();
					break;
			}
		} 
		var verify = $('input[name="InvoiceTitle"]').attr('data-lay-verify');
		$('input[name="InvoiceTitle"]').attr('lay-verify',verify);
	}
	form.on('radio(has_invoice)',function(obj){
		if(obj.value == '1'){
			$("#invoice_box").show();
			$('input[name="InvoiceTitle"]').attr('lay-verify','name');
			set_verify();
		} else {
			$("#invoice_box input").removeAttr('lay-verify');
			$("#invoice_box").hide();
		}
	});
	form.on('select(invoice_type)',function(obj){
		if(obj.value == '2'){
			$("#type2_box").show();
		} else {
			$("#type2_box").hide();
		}
		set_verify();
	});
	form.on('select(invoice_mold)',function(obj){//发票类型
		set_verify();
	});
	form.on('submit(save)',function(data){
		layer_load();
		var field = data.field;
		var validDate = $('#validDate').val();
		field.StartTime = validDate.substr(0,10);
		field.EndTime = validDate.substr(-10);
		field.PayNum = parseInt(field.PayNum);
		field.PayItems = PayItems;
		if(field.PayNum == 2){//多次付款时
			var items_total = 0;
			for(var i = 0;i < field.PayItems.length; i++){
				var item = field.PayItems[i];
				var td = $('#pay_table_item tr').eq(i+1);
				if(item.name == ""){
					var ipt = td.find('input[data-name="name"]');
					layer.msg('请填写费用项名称！');
					ipt.focus();
					return false;
				}
				if(item.money == ""){
					var ipt = td.find('input[data-name="money"]');
					layer.msg('请填写金额！');
					ipt.focus();
					return false;
				}
				items_total += field.PayItems[i].money;
			}
			
			if(items_total != parseFloat(field.Amount)){
				layer.msg('多次付款时，每次付款总额必须等于合同总金额！');
				return false;
			}
		}
		field.PayItems = JSON.stringify(field.PayItems);
		field.CompanyId = Employee.companyId;
		field.DptId = Employee.dptId;
		field.EmployeeId = Employee.id;
		field.EmployeeName = Employee.employeeName;
		if(id){
			field.Id = id;
			field.AddTime = info.addTime;
			console.log(field.AddTime);
		}
		Serv.Post('gc/Contract/Edit',field,function(res){
			layer_load_lose();
			if(res.succeed){
				var msg = id ? '合同修改成功！' : '合同添加成功,是否继续添加！';
				layer.confirm(msg, {
					btn: ['确认','取消'],
					shade: 0.1
				}, function(){
					window.location.reload();
				}, function(){
					window.location.href = 'contractIndex.html';
				});
			}
		});
		return false;
	});
});
//付款详情
function save_ipt(obj){
	var field_name = $(obj).attr('data-name');
	var value = $(obj).val().trim();
	if(field_name == 'money' || field_name == 'scale'){
		if(value != "" && isNaN(value)){
			$(obj).val('');
			layer.tips('请填写数字！',$(obj));
			return false;
		}
		value = parseFloat(value);
		$(obj).val(value.toFixed(2));
		if(field_name == 'money'){
			var total_money = $('#total_money').html();
				total_money = parseFloat(total_money);
			total_money += value;
			$('#total_money').html(total_money);
		}
		if(field_name == 'scale'){
			var total_scale = $('#total_scale').html();
				total_scale = parseFloat(total_scale);
			total_scale += value;
			$('#total_scale').html(total_scale);
		}
	}
	var index = $(obj).closest('tr').index();
	PayItems[index][field_name] = value;
}

function prompt(obj,val){
	var index = $(obj).closest('tr').index();
	PayItems[index].tips = val;
}

function show_search(){
	layer_linePop = layer.open({
		type: 1,
		title:'选择申请单',
		String: false,
		closeBtn: 1,
		btn:['确认','取消'],
		skin: 'layui-layer-rim',
		area: ['850px','450px'],
		content: $('.linePop1'),
		success:function(){
			table.render({
				elem:'#apply_lst',
				cols:[[
					{type:'radio','title':'序号'},
					{field:'no','title':'单号'},
					{field:'bm','title':'申请部门'},
					{field:'sqr','title':'申请人'},
					{field:'title','title':'费用名称'},
					{field:'date1','title':'申请日期'},
					{field:'date2','title':'审核日期'},
				]],
				data:[
					{'no':'1342353525',title:'物料费',date1:'2019-01-02',date2:'2019-01-02',bm:'销售部',sqr:'张三'},
					{'no':'1342353525',title:'物料费',date1:'2019-01-02',date2:'2019-01-02',bm:'销售部',sqr:'张三'},
					{'no':'1342353525',title:'物料费',date1:'2019-01-02',date2:'2019-01-02',bm:'销售部',sqr:'张三'},
				],
				height:'full-240',
				page:true
			});
		},
		yes:function(index){
			var data = table.checkStatus('apply_lst').data;
			if(data.length > 0){
				$('input[name="RelationNo"]').val(data[0].no);
			}
			layer.close(index);
		}
	});
}

function moneyStr(obj){
	var value = $(obj).val();
	if(isNaN(value)){
		$(obj).val('');
		$('#AmountStr').val('');
		layer.msg('请输入数字！');
		return false;
	}
	value = parseFloat(value);
	value =value.toFixed(2);
	$(obj).val(value);
	var str = convertCurrency(value);
	$('#AmountStr').val(str);
}
function payItems(obj,type){
	var index = $(obj).closest('tr').index();
		index = index + 1;
	if(type == 'add'){
		var tpl;
		tpl = $('#payItem_html').html();
		laytpl(tpl).render(null, function(html){
			$(obj).parents('tr').after(html);
		});
		PayItems.splice(index,0,{name:'',scale:'',money:'',time:'',tips:''});
	} else {
		if($(obj).parents('tbody').find('tr').length > 2){
			$(obj).parents('tr').remove();
			PayItems.splice(index,1);
		}
	}
	renderDate();
}
function closePop(){
	layer.close(layer_linePop);
}
$('.layui-tab-title').scrollFixed();