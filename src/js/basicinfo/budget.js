var layer_linePop;
var lstPager;
var data_col = [[
    { type: 'numbers', title: '序号' },
    { field: 'name', title: '费用项名称' },
    { field: 'BgStatus', title: '状态', width: 100, templet: function (d) { if (d.bgStatus == 2) { return "<span class='text-span'>启用</span>"; } else { return "<span class='text-del'>停用</span>"; } } },
    { field: 'sortId', title: '显示顺序', width: 100 },
    { field: 'memo', title: '备注' },
    { toolbar: '#bar', title: '操作', width: 120, fixed: 'right' }
]];
var datas;
layui.config({
    base: '../../layui/modules/'
}).extend({
    treetable: 'treetable'
}).use(['table', 'element', 'treetable', 'form'], function () {
    var table = layui.table,
        element = layui.element;
        treetable = layui.treetable,
        layform = layui.form;

        var initTable = function(){
            Serv.Post('gc/Budget/Get', { search: $("input[name='Type_Chinese']").attr('e-value') }, function (result) {
                datas = result;
                treetable.render({
                    treeColIndex: 1,
                    treeSpid: 0,
                    treeIdName: 'id',
                    treePidName: 'pid',
                    treeDefaultClose: false,
                    treeLinkage: false,
                    elem: '#lst',
                    data: datas,
                    cols: data_col,
                    toolbar: '#toolbar'
                });
            });
            
        }
        initTable();
        

        table.on("tool(lst)",function(layEvent){
            var data = layEvent.data;
            if (data.isSystem == 1) {
                layer_alert("该项为系统数据，无法进行该操作！");
            }
            else {
                if (layEvent.event === 'edit') {
                    editSelect(data.levelMap,data.id);
                    layer_linePop = layer.open({
                        type: 1,
                        title: '修改' + $("input[name='Type_Chinese']").val(),
                        String: false,
                        closeBtn: 1,
                        skin: 'layui-layer-rim',
                        area: '750px',
                        content: $('.linePop')
                    });
                    GetSingle(data.id);
                } else if (layEvent.event === "del") {
                    console.log(data);
                    if (data.bgStatus == 1) {
                        data.bgStatus = 2;
                        layer_confirm('确定启用信息吗？', function () {
                            layer_load();
                            Serv.Post('gc/Budget/Delete', data, function (result) {
                                if (result.code == "00") {
                                    layer_alert(result.message, function () {
                                        window.location.reload();
                                        Serv.Post('gc/budget/get', {'search':''}, window.globCache.setBudgets);
                                    });
                                } else {
                                    layer_alert(result.message);
                                }
                            });
                        });
                    }
                    else {
                        var r = GetChild(data.id);
                        if(r){
                            data.bgStatus = 1;
                            layer_confirm('确定停用信息吗？', function () {
                                layer_load();
                                Serv.Post('gc/Budget/Delete', data, function (result) {
                                    if (result.code == "00") {
                                        layer_alert(result.message, function () {
                                            window.location.reload();
                                            Serv.Post('gc/budget/get', {'search':''}, window.globCache.setBudgets);
                                        });
                                    } else {
                                        layer_alert(result.message);
                                    }
                                });
                            });
                        }
                        else{
                            layer_alert("当前包含正在使用的下级，无法停用！"); 
                        }
                    }
                }
                
            }
        });

    table.on('toolbar(lst)', function (data) {
        if (data.event == 'add') {
            EmptyModel();
            loadSelect(0);
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

    layform.on('submit(formDemo)', function (laydata) {
        layer_load();
        if (laydata.field.Id == "") {
            laydata.field.Id = 0;
            laydata.field.IsSystem = 0;
            laydata.field.Type = $("input[name='Type_Chinese']").attr('e-value');
            laydata.field.Pid = $("select[name='selParent'][value!='0']:last").val();
            if($("select[name='selParent'][value!='0']:last").length <= 0){
                laydata.field.LevelMap = "0,";
            }
            else{
                laydata.field.LevelMap = $("select[name='selParent'][value!='0']:last").find("option:selected").attr("levelMap") + $("select[name='selParent'][value!='0']:last").val() + ",";
            }
            
            //console.log(laydata.field);
            Serv.Post('gc/Budget/add', { budget: laydata.field }, function (response) {
                if (response.code == "00") {
                    initTable(initTable);
                    Serv.Post('gc/budget/get', {'search':''}, window.globCache.setBudgets);
                    layer_alert("添加成功!",layer.closeAll());
                } else {
                    layer_alert(response.message);
                }

            })
        } else {
            if (laydata.field.isSystem == 1) {
                layer_alert($("input[name='Type_Chinese']").val() + "为系统数据，无法进行修改操作！");
            }
            else {
                Serv.Post('gc/Budget/update', laydata.field, function (response) {
                    if (response.code == "00") {
                        Serv.Post('gc/budget/get', {'search':''}, window.globCache.setBudgets);
                        layer_alert(response.message,function(){ window.location.reload()});
                        closePop();
                    } else {
                        layer_alert(response.message);
                    }
                })
            }
        }
        return false;
    });

    layform.on('select(selParent)', function (laydata) {
        $(laydata.othis).parent().nextAll().remove();
        if(laydata.value != 0)
        {
            loadSelect(laydata.value);
        }
    });
});

function editSelect(levelm,id){
    if(levelm != ""){
        $("#divsel").empty();
        var lms = levelm.split(",");
        for(var i=0;i<lms.length - 1;i++)
        {
            loadSelect(lms[i],false,id);  
            $("select[name='selParent']:last").val(lms[i + 1]);
            layui.form.render("select");
        }
    }
}

function loadSelect(Pid,showall=true,id){
    var htmlsel = "";
    if(datas.length <= 0)
    {
        htmlsel += '<div class="layui-block margin-b-10">';
        htmlsel += '<select name="selParent" lay-filter="selParent">';
        htmlsel += '<option value="0">==请选择==</option>';
        htmlsel += '</select>';
        $("#divsel").append(
            htmlsel
        );        
        layui.form.render('select');
    }
    else{
        var newdata = $.grep(datas,function(b,i){
            return b.pid == Pid;
        },false);
        if(newdata.length > 0)
        {
            htmlsel += '<div class="layui-block margin-b-10">';
            htmlsel += '<select name="selParent" lay-filter="selParent">';
            htmlsel += '<option value="0">==请选择==</option>';
            for(var i = 0;i < newdata.length;i++){
                if(showall){
                    htmlsel += '<option value="'+newdata[i].id+'" levelmap="'+newdata[i].levelMap+'">'+newdata[i].name+'</option>';
                }
                else if(!showall && newdata[i].id != id){
                    htmlsel += '<option value="'+newdata[i].id+'" levelmap="'+newdata[i].levelMap+'">'+newdata[i].name+'</option>';
                }
            }
            htmlsel += '</select>';
            $("#divsel").append(
                htmlsel
            );        
            layui.form.render('select');
        }
    }
}

function GetChild(pid)
{
    var r = true;
    if(datas.length <= 0)
    {
        return r;
    }
    else{
        var newdata = $.grep(datas,function(b,i){
            return b.pid == pid;
        },false);
        if(newdata.length > 0)
        {
            for(var i = 0;i < newdata.length;i++){
                if(newdata[i].bgStatus == 2){
                    r = false;
                }
            }
        }
        return r;
    }
}

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
    bgStatus: 1,
    type: '',
    isSystem: '',
    levelMap:''
};
var vm = new Vue({ el: '#budgetForm', data: model });
function GetSingle(wId) {
    Serv.Post('gc/Budget/GetSingle', { Id: wId }, function (response) {
        model.id = response.id;
        model.name = response.name;
        model.sortId = response.sortId;
        model.memo = response.memo;
        model.bgStatus = response.bgStatus;
        model.type = response.type;
        model.isSystem = response.isSystem;
        model.levelMap = response.levelMap;
        vm.$set({ data: model });
    })
}
function EmptyModel() {
    model.id = "";
    model.pid = "0";
    model.name = "";
    model.sortId = "1";
    model.memo = "";
    model.bgStatus = 1;
    model.type = 1;
    model.isSystem = 0;
    model.levelMap = "0,";
    $("#divsel").empty();
    vm.$set({ data: model });
}