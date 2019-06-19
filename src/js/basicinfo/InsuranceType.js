var layer_linePop;
var lstPager;
var data_col = [[
	// { field: 'id', title: '序号' },
	{ type:'numbers',title:'序号'},
	{ field: 'name', title: '到岗时间' },
    { field: 'sortId', title: '显示顺序' },
    { field: 'workinStatusName', title: '状态' },
	{ field: 'memo', title: '备注' },
	{ title: '操作', toolbar: '#bar', width: 180 }
]];

	layui.use(['table', 'element', 'laydate', 'form'], function () {
		var table = layui.table,
			element = layui.element;
		
		var search=function() {
			return {"search":$("input[name='Type_Chinese']").attr('e-value')};
		};
		//操作栏的回调函数
		var onTools = function (layEvent, data) {
			var value = data.id;
			if (data.isSystem == 1) {
				layer_alert($("input[name='Type_Chinese']").val() + "为系统数据，无法进行该操作！");
			}
			else {
				if (layEvent === 'edit') {
					layer_linePop = layer.open({
						type: 1,
						title: '修改' + $("input[name='Type_Chinese']").val(),
						String: false,
						closeBtn: 1,
						skin: 'layui-layer-rim',
						area: '750px',
						content: $('.linePop')
					});
					GetSingle(value);
				} else if (layEvent === "del") {
					layer_confirm('确定删除信息吗？', function () {
						layer_load();
						Serv.Post('WorkerInField/Delete', data, function (result) {
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
		};
        //数据整理回调函数	
        var parseData=function(items){
            $.each(items,function(i,item){
                item.workinStatusName=["","<font color=\'green\'>禁用</font>'","<font color=\'red\'>启用</font>"][item.workinStatus];                
            });
            return items;
        };
		//分页初始化
		lstPager = Pager(table,//lay-ui的table控件
			$("input[name='Type_Chinese']").val(),//列表名称
			"lst",//绑定的列表Id
			'toolbar',//绑定的工具条Id
			data_col,//表头的显示行
			"WorkerInField/Get",//action url 只能post提交
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
					title: '添加' + $("input[name='Type_Chinese']").val(),
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
				laydata.field.Type = $("input[name='Type_Chinese']").attr('e-value');
				console.log(laydata.field);
				Serv.Post('WorkerInField/add', {workerInField:laydata.field}, function (response) {
					if (response.code == "00") {
						layer_confirm('添加成功，是否继续添加？', function () {
							EmptyModel();
							layer_linePop = layer.open({
								type: 1,
								title: '修改' + $("input[name='Type_Chinese']").val(),
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
					layer_alert( $("input[name='Type_Chinese']").val() + "为系统数据，无法进行修改操作！");
				}
				else {
					Serv.Post('WorkerInField/update', laydata.field, function (response) {
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
		type: '',
		isSystem: ''
	};
	var vm = new Vue({ el: '#workerinForm', data: model });
	function GetSingle(wId) {
		Serv.Post('WorkerInField/GetSingle', { Id: wId }, function (response) {
			model.id = response.id;
			model.name = response.name;
			model.sortId = response.sortId;
			model.memo = response.memo;
			model.workinStatus = response.workinStatus;
			model.type = response.type;
			model.isSystem = response.isSystem;
			vm.$set({ data: model });
		})
	}
	function EmptyModel() {
		model.id = "";
		model.name = "";
		model.sortId = "1";
		model.memo = "";
		model.workinStatus = 1;
		model.type = 1;
		model.isSystem = 0;
		vm.$set({ data: model });
	}