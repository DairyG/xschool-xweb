var lstPager;


layui.use(['table', 'element', 'laydate'], function () {
    var table = layui.table,
        element = layui.element;

    var search = function () {
        return { "search": $("input[name='title']").attr('e-value') };
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
						Serv.Post('gc/WorkerInField/Delete', data, function (result) {
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

    //分页初始化
    lstPager = Pager2(table,//lay-ui的table控件
        $("input[name='title']").val(),//列表名称
        "lst",//绑定的列表Id
        'bar',//绑定的工具条Id
        data_col,//表头的显示行
        "gc/note/GetNotePage",//action url 只能post提交
        search,
        null,//如果在显示之前需要对数据进行整理需要实现，否则传null
        null,//有选择行才能有的操作，实现该方法,否则传null
        onTools, //如果有每行的操作栏的操作回调，实现该方法，否则传null
        null,
        'full-100'
    );

    table.on('tool(lst)', function (obj) {
        var layEvent = obj.event;
        if (layEvent == "info") {
            window.location.href = "/pages/note/noteDetail.html?id="+obj.data.id;
		}
		if (layEvent == "del") {
			layer_load();
            Serv.Get("gc/note/DeleteNote?id=" + obj.data.id, {}, function (result) {
                layer_load_lose();
                if (result.succeed) {
					lstPager.refresh();
                }
                else {
                    layer_alter("未获取到相应数据！");
                }
            })
        }
    });
    table.on('toolbar(lst)', function (obj) {
        var layEvent = obj.event;
        if (layEvent == "add") {
            window.location.href = "/pages/note/noteAdd.html";
        }
    });
});