var layer_linePop;
var lstPager;
var data_col = [[
    // { field: 'id', title: '序号' },
    { type: 'numbers', title: '序号' },
    { field: 'name', title: '职位名称' },
    { field: 'index', title: '显示顺序' },
    { field: 'description', title: '岗位职责' },
    { field: 'require', title: '入职要求' },
    { title: '操作', toolbar: '#bar', width: 180 }
]];

layui.use(['table', 'element', 'laydate', 'form'], function () {
    var table = layui.table,
        element = layui.element;

    var search = function () {
        return {"companyId":1};
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
                    title: '修改职位',
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
                    Serv.Get('uc/job/Delete/' + value,null, function (result) {
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
    lstPager = Pager(table,//lay-ui的table控件
        $("input[name='Type_Chinese']").val(),//列表名称
        "lst",//绑定的列表Id
        'toolbar',//绑定的工具条Id
        data_col,//表头的显示行
        "uc/job/Get",//action url 只能post提交
        search,
        null,//如果在显示之前需要对数据进行整理需要实现，否则传null
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
                title: '添加职位',
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
            laydata.field.CompanyId = 1;
            //laydata.field.IsSystem = 0;
            //laydata.field.Type = $("input[name='Type_Chinese']").attr('e-value');
            console.log(laydata.field);
            Serv.Post('uc/job/edit', { positionSetting: laydata.field }, function (response) {
                if (response.code == "00") {
                    layer_confirm('添加成功，是否继续添加？', function () {
                        EmptyModel();
                        layer_linePop = layer.open({
                            type: 1,
                            title: '修改职位',
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
                layer_alert($("input[name='Type_Chinese']").val() + "为系统数据，无法进行修改操作！");
            }
            else {
                Serv.Post('uc/job/edit', laydata.field, function (response) {
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
    companyId : '1',
    name: '',
    description : '',
    require : '' ,
    index : 0,
};
var vm = new Vue({ el: '#workerinForm', data: model });
function GetSingle(wId) {
    Serv.Get('uc/job/Get/'+wId,null, function (response) {
        model.id = response.id;
        model.companyId = response.companyId;
        model.name = response.name;
        model.index = response.index;
        model.description = response.description;
        model.require = response.require;
        model.fileUrl = response.fileUrl;
        // model.workinStatus = response.workinStatus;
        // model.isSystem = response.isSystem;
        vm.$set({ data: model });
    })
}
function EmptyModel() {
    model.id = "";
    model.companyId = "1";
    model.name = "";
    model.index = "0";
    model.description = "";
    model.require = "";
    model.fileUrl = "";
    // model.workinStatus = 1;
    // model.isSystem = 0;
    vm.$set({ data: model });
}