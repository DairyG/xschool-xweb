var layer_linePop;
var lstPager;
var data_col = [[
    // { field: 'id', title: '序号' },
    { type: 'numbers', title: '序号' },
    { field: 'name', title: '考核项目' },
    { field: 'typename', title: '所属类型' },
    { field: 'index', title: '显示顺序' },
    { field: 'evaStatus', title: '状态' },
    { field: 'description', title: '备注' },
    { title: '操作', toolbar: '#bar', width: 180 }
]];
var datas;
layui.use(['table', 'element', 'laydate', 'form'], function () {
    var table = layui.table,
        element = layui.element;
    laydate = layui.laydate,
        layform = layui.form;

    Serv.Get('gc/EvaluationType/Get', {}, function (result) {
        datas = result;
        //console.log(datas);
    });

    var search = function () {

    };
    //操作栏的回调函数
    var onTools = function (layEvent, data) {
        var value = data.id;
        if (layEvent === 'edit') {
            loadSelect();
            $("select[name='EvaluationTypeId']").val(data.evaluationTypeId);
            layui.form.render("select");
            layer_linePop = layer.open({
                type: 1,
                title: '修改考核项目',
                String: false,
                closeBtn: 1,
                skin: 'layui-layer-rim',
                area: '750px',
                content: $('.linePop1')
            });
            GetSingle(value);
        } else if (layEvent === "del") {
            if (data.status == 1) {
                data.status = 2;
                layer_confirm('确定启用信息吗？', function () {
                    layer_load();
                    Serv.Post('gc/Evaluation/Delete', data, function (result) {
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
                data.status = 1;
                layer_confirm('确定停用信息吗？', function () {
                    layer_load();
                    Serv.Post('gc/Evaluation/Delete', data, function (result) {
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
    var parseData = function (items) {
        $.each(items, function (i, item) {
            var typenames = datas.filter(function(itype){
                return itype.id == item.evaluationTypeId; 
            });
            item.evaStatus = ["", "<font color=\'red\'>停用</font>", "<font color=\'green\'>启用</font>"][item.status];
            item.typename = typenames ? typenames[0].name : "";
        });
        return items;
    };
    //分页初始化
    lstPager = Pager(table,//lay-ui的table控件
        "奖惩类别",//列表名称
        "lst",//绑定的列表Id
        'toolbar',//绑定的工具条Id
        data_col,//表头的显示行
        "gc/Evaluation/Get",//action url 只能post提交
        search,
        parseData,//如果在显示之前需要对数据进行整理需要实现，否则传null
        null,//有选择行才能有的操作，实现该方法,否则传null
        onTools, //如果有每行的操作栏的操作回调，实现该方法，否则传null
        null,
        'full-100'
    );
    table.on('toolbar(lst)', function (data) {
        if (data.event == 'add') {
            loadSelect();
            layer_linePop = layer.open({
                type: 1,
                title: '添加考核项目',
                String: false,
                closeBtn: 1,
                skin: 'layui-layer-rim',
                area: '750px',
                content: $('.linePop1')
            });
        }
        if (data.event == 'add_cate') {
            layer_linePop = layer.open({
                type: 1,
                title: '添加考核分类',
                String: false,
                closeBtn: 1,
                skin: 'layui-layer-rim',
                area: '450px',
                content: $('.linePop2')
            });
        }
    });
    layform.on('submit(formDemo)', function (laydata) {
        layer_load();
        laydata.field.evaluationTypeId = $("select[name='EvaluationTypeId']").val();
        if (laydata.field.evaluationTypeId == 0) {
            layer_alert("请选择考核分类！");
            return false;
        }
        if (laydata.field.Id == "") {
            laydata.field.Id = 0;
            Serv.Post('gc/Evaluation/add', { model: laydata.field }, function (response) {
                if (response.code == "00") {
                    layer_confirm('添加成功，是否继续添加？', function () {
                        //EmptyModel();
                        layer_linePop = layer.open({
                            type: 1,
                            title: '添加考核项目',
                            String: false,
                            closeBtn: 1,
                            skin: 'layui-layer-rim',
                            area: '750px',
                            content: $('.linePop1')
                        });
                    }, layer.closeAll());
                    lstPager.refresh();
                } else {
                    layer_alert(response.message);
                }

            })
        } else {
            Serv.Post('gc/Evaluation/update', laydata.field, function (response) {
                if (response.code == "00") {
                    layer_alert(response.message);
                    lstPager.refresh();
                    closePop();
                } else {
                    layer_alert(response.message);
                }
            })
        }
        return false;
    });


    //添加考核类型
    layform.on('submit(formTypes)', function (laydata) {
        layer_load();
        laydata.field.id = 0;
        Typemodel = laydata.field;
        Serv.Post('gc/EvaluationType/add', { model: laydata.field }, function (response) {
            if (response.code == "00") {
                Typemodel.id = response.data;
                Typemodel.name = Typemodel.Name;
                datas.push(Typemodel);
                layer_confirm('添加成功，是否继续添加？', function () {
                    layer_linePop = layer.open({
                        type: 1,
                        title: '添加考核分类',
                        String: false,
                        closeBtn: 1,
                        skin: 'layui-layer-rim',
                        area: '450px',
                        content: $('.linePop2')
                    });
                }, layer.closeAll());
            } else {
                layer_alert(response.message);
            }

        })
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

var Typemodel = {
    id: '',
    name: ''
};

var model = {
    id: '',
    name: '',
    index: '0',
    description: '',
    status: 1,
    evaluationTypeId: ''
};
var vm = new Vue({ el: '#evaluationForm', data: model });
function GetSingle(wId) {
    Serv.Post('gc/Evaluation/GetSingle', { Id: wId }, function (response) {
        model.id = response.id;
        model.name = response.name;
        model.index = response.index;
        model.description = response.description;
        model.status = response.status;
        model.evaluationTypeId = response.evaluationTypeId;
        vm.$set({ data: model });
        layui.form.render("select");
    })
}

// function loadSelect() {
//     $("#divsel").empty();
//     Serv.Get('gc/EvaluationType/Get',{}, function (result) {
//         datas = result;
//         var htmlsel = "";
//         if (datas) {
//             htmlsel += '<div class="layui-block margin-b-10">';
//             htmlsel += '<select name="EvaluationTypeId" lay-filter="selParent">';
//             htmlsel += '<option value="0">==请选择考核分类==</option>';
//             for (var i = 0; i < datas.length; i++) {
//                 htmlsel += '<option value="' + datas[i].id + '">' + datas[i].name + '</option>';
//             }
//             htmlsel += '</select>';
//             $("#divsel").append(
//                 htmlsel
//             );
//             layui.form.render('select');
//         }
//         else {
//             htmlsel += '<div class="layui-block margin-b-10">';
//             htmlsel += '<select name="EvaluationTypeId" lay-filter="selParent">';
//             htmlsel += '<option value="0">==请先创建考核分类==</option>';
//             htmlsel += '</select>';
//             $("#divsel").append(
//                 htmlsel
//             );
//             layui.form.render('select');
//         }
//     });

// }

function loadSelect() {
    $("#divsel").empty();
    var htmlsel = "";
    if (datas && datas.length > 0) {
        htmlsel += '<div class="layui-block margin-b-10">';
        htmlsel += '<select name="EvaluationTypeId" lay-filter="selParent">';
        htmlsel += '<option value="0">==请选择考核分类==</option>';
        for (var i = 0; i < datas.length; i++) {
            htmlsel += '<option value="' + datas[i].id + '">' + datas[i].name + '</option>';
        }
        htmlsel += '</select>';
        $("#divsel").append(
            htmlsel
        );
        layui.form.render('select');
    }
    else {
        htmlsel += '<div class="layui-block margin-b-10">';
        htmlsel += '<select name="EvaluationTypeId" lay-filter="selParent">';
        htmlsel += '<option value="0">==请先添加考核分类==</option>';
        htmlsel += '</select>';
        $("#divsel").append(
            htmlsel
        );
        layui.form.render('select');
    }
}