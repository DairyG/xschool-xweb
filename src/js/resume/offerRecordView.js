var id = GetPara('id');
var datas;
var workerinType;
layui.use(['table', 'element', 'laydate', 'form', 'rate'], function () {
    var table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        layform = layui.form,
        rate = layui.rate;
    Serv.Get('gc/WorkerInField/GetData?type=2', {}, function (result) {
        workerinType = result.interviewMethod;
        GetRecords();
    });
});

function GoDetails() {
    window.location.href = "/pages/recruit/offerDetails.html?id=" + id;
}

function GetRecords() {
    Serv.Get('gc/ResumeRecord/Get?id=' + id, {}, function (result) {
        datas = result;
        PushRecords();
    });
}

function PushRecords() {
    $("#divRecord").empty();
    var divHtml = "";
    $.each(datas, function (i, item) {
        var typenames = workerinType.filter(function(workerin){
            return workerin.id == item.workerInFieldId; 
        });

        divHtml += '<div class="layui-row margin-t-20">';
        divHtml += '<table class="layui-table">';
        divHtml += '<tr>';
        divHtml += '<th class="table_label" width="120">面试时间</th>';
        divHtml += '<th class="table_label">面试方式</th>';
        divHtml += '<th class="table_label">面试人</th>';
        divHtml += '</tr>';
        divHtml += '<tr>';
        divHtml += '<td>' + item.resumeTime.FormatDate() + '</td>';
        divHtml += '<td>' + typenames[0].name + '</td>';
        divHtml += '<td>' + item.interviewerNames + '</td>';
        divHtml += '</tr>';
        divHtml += '<tr>';
        divHtml += '<td class="table_label">仪容仪表</td>';
        divHtml += '<td class="table_label">沟通表达</td>';
        divHtml += '<td class="table_label">专业知识</td>';
        divHtml += '</tr>';
        divHtml += '<tr>';
        divHtml += '<td><div id="rate1" class="rate">';
        for(var i = 0;i < item.appearance;i++)
        {
            divHtml +='<i class="layui-icon layui-icon-rate-solid fc-FB80"></i>';
        }
        divHtml += '</div></td>';
        divHtml += '<td><div id="rate2" class="rate">';
        for(var i = 0;i < item.express;i++)
        {
            divHtml +='<i class="layui-icon layui-icon-rate-solid fc-FB80"></i>';
        }
        divHtml += '</div></td>';
        divHtml += '<td><div id="rate3" class="rate">';
        for(var i = 0;i < item.speciality;i++)
        {
            divHtml +='<i class="layui-icon layui-icon-rate-solid fc-FB80"></i>';
        }
        divHtml += '</div></td>';
        divHtml += '</tr>';
        divHtml += '<tr>';
        divHtml += '<td class="table_label">亲和力</td>';
        divHtml += '<td class="table_label">逻辑思维</td>';
        divHtml += '<td class="table_label">综合评分</td>';
        divHtml += '</tr>';
        divHtml += '<tr>';
        divHtml += '<td><div id="rate4" class="rate">';
        for(var i = 0;i < item.affinity;i++)
        {
            divHtml +='<i class="layui-icon layui-icon-rate-solid fc-FB80"></i>';
        }
        divHtml += '</div></td>';
        divHtml += '<td><div id="rate5" class="rate">';
        for(var i = 0;i < item.logic;i++)
        {
            divHtml +='<i class="layui-icon layui-icon-rate-solid fc-FB80"></i>';
        }
        divHtml += '</div></td>';
        divHtml += '<td><div id="rate6" class="rate">';
        for(var i = 0;i < item.socre;i++)
        {
            divHtml +='<i class="layui-icon layui-icon-rate-solid fc-FB80"></i>';
        }
        divHtml += '</div></td>';
        divHtml += '</tr>';
        divHtml += '<tr>';
        divHtml += '<td class="table_label">面试内容</td>';
        divHtml += '<td colspan="2">' + item.content + '</td>';
        divHtml += '</tr>';
        divHtml += '<tr>';
        divHtml += '<td class="table_label">面试建议</td>';
        divHtml += '<td colspan="2">' + item.opinion + '</td>';
        divHtml += '</tr>';
        divHtml += '</table>';
        divHtml += '</div>';
    });
    $("#divRecord").append(divHtml);
}
