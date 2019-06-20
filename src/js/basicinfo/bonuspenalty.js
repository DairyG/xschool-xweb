var layer_linePop;
var lstPager;
var data_col = [[
	// { field: 'id', title: '序号' },
	{ type: 'numbers', title: '序号' },
    { field: 'name', title: '奖惩类别' },
    { field: 'addSubtractioName', title: '加减类型' },
	{ field: 'workinStatusName', title: '状态' },
	{ field: 'sortId', title: '显示顺序' },
	{ field: 'memo', title: '备注' },
	{ title: '操作', toolbar: '#bar', width: 180 }
]];

layui.use(['table', 'element', 'laydate', 'form'], function () {
	var table = layui.table,
		element = layui.element;

	var search = function () {
		
	};
	//操作栏的回调函数
	var onTools = function (layEvent, data) {
		var value = data.id;
		if (data.isSystem == 1) {
			layer_alert("该数据为系统数据，无法进行该操作！");
		}
		else {
			if (layEvent === 'edit') {
				layer_linePop = layer.open({
					type: 1,
					title: '修改奖惩类别',
					String: false,
					closeBtn: 1,
					skin: 'layui-layer-rim',
					area: '750px',
					content: $('.linePop')
				});
				GetSingle(value);
			} else if (layEvent === "del") {
				if (data.workinStatus == 1) {
					data.workinStatus = 2;
					layer_confirm('确定启用信息吗？', function () {
						layer_load();
						Serv.Post('BonusPenalty/Delete', data, function (result) {
							if (result.code == "00") {
								layer_alert(result.message, function () {
									lstPager.refresh();
								});
							} else {
								layer_alert(result.message);
							}
						});
					});
				}
				else {
					data.workinStatus = 1;
					layer_confirm('确定停用信息吗？', function () {
						layer_load();
						Serv.Post('BonusPenalty/Delete', data, function (result) {
							if (result.code == "00") {
								layer_alert(result.message, function () {
									lstPager.refresh();
								});
							} else {
								layer_alert(result.message);
							}
						});
					});
				}
			}
		}
	};
	//数据整理回调函数
	var parseData = function (items) {
		$.each(items, function (i, item) {
            item.workinStatusName = ["", "<font color=\'red\'>停用</font>", "<font color=\'green\'>启用</font>"][item.workinStatus];
            item.addSubtractioName = ["", "增加", "扣除"][item.addSubtraction];
		});
		return items;
	};
	//分页初始化
	lstPager = Pager(table,//lay-ui的table控件
		"奖惩类别",//列表名称
		"lst",//绑定的列表Id
		'toolbar',//绑定的工具条Id
		data_col,//表头的显示行
		"BonusPenalty/Get",//action url 只能post提交
		search,
		parseData,//如果在显示之前需要对数据进行整理需要实现，否则传null
		null,//有选择行才能有的操作，实现该方法,否则传null
		onTools, //如果有每行的操作栏的操作回调，实现该方法，否则传null
		null,
		'full-100'
	);

	table.on('toolbar(lst)', function (data) {
		if (data.event == 'add') {
			EmptyModel();
			layer_linePop = layer.open({
				type: 1,
				title: '添加奖惩类别',
				String: false,
				closeBtn: 1,
				skin: 'layui-layer-rim',
				area: '750px',
				content: $('.linePop')
			});
		}
	});
	var table = layui.table,
		element = layui.element,
		laydate = layui.laydate,
		layform = layui.form;


	layform.on('submit(formDemo)', function (laydata) {
		layer_load();
		if (laydata.field.Id == "") {
			laydata.field.Id = 0;
			laydata.field.IsSystem = 0;
			console.log(laydata.field);
			Serv.Post('BonusPenalty/add', { bonusPenalty: laydata.field }, function (response) {
				if (response.code == "00") {
					layer_confirm('添加成功，是否继续添加？', function () {
						EmptyModel();
						layer_linePop = layer.open({
							type: 1,
							title: '修改奖惩类别',
							String: false,
							closeBtn: 1,
							skin: 'layui-layer-rim',
							area: '750px',
							content: $('.linePop')
						});
					}, layer.closeAll());
					lstPager.refresh();
				} else {
					layer_alert(response.message);
				}

			})
		} else {
			if (laydata.field.isSystem == 1) {
				layer_alert("该数据为系统数据，无法进行修改操作！");
			}
			else {
				Serv.Post('BonusPenalty/update', laydata.field, function (response) {
					if (response.code == "00") {
						layer_alert(response.message);
						lstPager.refresh();
						closePop();
					} else {
						layer_alert(response.message);
					}
				})
			}
		}
		return false;
	});

});



//关闭弹窗
$(".closePop").click(function () {
	layer.closeAll()
});
function closePop() {
	layer.close(layer_linePop);
}

var model = {
	id: '',
	name: '',
	sortId: '0',
	memo: '',
	workinStatus: 1,
    isSystem: '',
    addSubtraction : ''
};
var vm = new Vue({ el: '#workerinForm', data: model });
function GetSingle(wId) {
	Serv.Post('BonusPenalty/GetSingle', { Id: wId }, function (response) {
		$("select[name='AddSubtraction']").val(response.addSubtraction);
		model.id = response.id;
		model.name = response.name;
		model.sortId = response.sortId;
		model.memo = response.memo;
		model.workinStatus = response.workinStatus;
        model.isSystem = response.isSystem;
        model.addSubtraction = response.addSubtraction;
		vm.$set({ data: model });
		layui.form.render("select");
	})
}
function EmptyModel() {
	model.id = "";
	model.name = "";
	model.sortId = "1";
	model.memo = "";
	model.workinStatus = 1;
    model.isSystem = 0;
    model.addSubtraction = 0;
	vm.$set({ data: model });
}