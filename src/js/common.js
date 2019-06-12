/** 
 * 弹出输入层
 */
function layui_prompt(obj){
	var default_val = $(obj).val();
	layer.prompt({
		formType: 2,
		value: default_val,
		title: '请输入',
		area: ['350px', '120px'] //自定义文本域宽高
	}, function(value, index, elem){
		$(obj).val(value);
		layer.close(index);
	});
}

function layer_load(){
	layer.load(3,{shade:0.3});
};

/**
 * 弹出用户选择框
 */
function user_popup(obj){
	if(!$('#popup_content').length){
		$('body').append('<div id="popup_content"></div>');
		$('#popup_content').load("../public/user_select.html");
	}
	var table;
	layui.use(['table'],function(){
		table = layui.table;
	});
	layer.open({
		type: 1,
		title:false,
		btn:['确认','取消'],
		String: false,
		closeBtn: 1,
		skin: 'layui-layer-rim',
		area: ['850px','450px'],
		content: $('#popup_content'),
		yes:function(index, layero){
			var checkStatus = table.checkStatus('user_select_lst');
			console.log(checkStatus.data) //获取选中行的数据
		},
		btn2:function(index, layero){
			
			layer.close(index);
		}
	});
}