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
        GetWorkerIn();
        GetRecords();
    });

    lay('.rate').each(function () {
        rate.render({
            elem: this
            , choose: function (value) {
                this.elem.attr("tscore", value);
            }
        });
    });


    //保存面试记录
    layform.on('submit(btnSave)', function (laydate) {
        var users = $.parseJSON($("input[name='sels']").val()).user;
        var intIds = "";
        var intNames = "";
        for(var i =0;i<users.length;i++){
            intIds += "," + users[i].id;
            intNames += "," + users[i].name;
        }
        intIds += ",";
        intNames += ",";
        laydate.field.id = 0;
        laydate.field.resumeId = id;
        laydate.field.interviewerIds = intIds;
        laydate.field.interviewerNames = intNames;
        laydate.field.appearance = $("#rate1").attr("tscore");
        laydate.field.express = $("#rate2").attr("tscore");
        laydate.field.speciality = $("#rate3").attr("tscore");
        laydate.field.affinity = $("#rate4").attr("tscore");
        laydate.field.logic = $("#rate5").attr("tscore");
        laydate.field.socre = $("#rate6").attr("tscore");
        laydate.field.interviewStatus = 2;
        laydate.field.resumeTime = getFormatDate();
        if (laydate.field.workerInFieldId == 0) {
            layer_alert("请选择面试方式！");
            return false;
        }
        if ($.trim(laydate.field.content) == "") {
            layer_alert("请输入面试内容！");
            return false;
        }
        if ($.trim(laydate.field.opinion) == "") {
            layer_alert("请输入面试意见！");
            return false;
        }
        datas.unshift(laydate.field);
        Serv.Post('gc/ResumeRecord/Add', { model: laydate.field }, function (result) {
            if (result.code == "00") {
                PushRecords();
                layer_alert("成功！");
            }
            else {
                layer_alert(result.message);
            }
        });
        return false;
    });

    //面试未通过
    layform.on('submit(btnNoPass)', function (laydate) {
        var users = $.parseJSON($("input[name='sels']").val()).user;
        var intIds = "";
        var intNames = "";
        for(var i =0;i<users.length;i++){
            intIds += "," + users[i].id;
            intNames += "," + users[i].name;
        }
        intIds += ",";
        intNames += ",";
        laydate.field.id = 0;
        laydate.field.resumeId = id;
        laydate.field.interviewerIds = intIds;
        laydate.field.interviewerNames = intNames;
        laydate.field.appearance = $("#rate1").attr("tscore");
        laydate.field.express = $("#rate2").attr("tscore");
        laydate.field.speciality = $("#rate3").attr("tscore");
        laydate.field.affinity = $("#rate4").attr("tscore");
        laydate.field.logic = $("#rate5").attr("tscore");
        laydate.field.socre = $("#rate6").attr("tscore");
        laydate.field.interviewStatus = 4;
        laydate.field.resumeTime = getFormatDate();
        if (laydate.field.workerInFieldId == 0) {
            layer_alert("请选择面试方式！");
            return false;
        }
        if ($.trim(laydate.field.content) == "") {
            layer_alert("请输入面试内容！");
            return false;
        }
        if ($.trim(laydate.field.opinion) == "") {
            layer_alert("请输入面试意见！");
            return false;
        }
        datas.unshift(laydate.field);
        Serv.Post('gc/ResumeRecord/Add', { model: laydate.field }, function (result) {
            if (result.code == "00") {
                PushRecords();
                layer_alert("成功！");
            }
            else {
                layer_alert(result.message);
            }
        });
        return false;
    });

    //发送OFFER
    layform.on('submit(btnOffer)', function (laydate) {
        var users = $.parseJSON($("input[name='sels']").val()).user;
        var intIds = "";
        var intNames = "";
        for(var i =0;i<users.length;i++){
            intIds += "," + users[i].id;
            intNames += "," + users[i].name;
        }
        intIds += ",";
        intNames += ",";
        laydate.field.id = 0;
        laydate.field.resumeId = id;
        laydate.field.interviewerIds = intIds;
        laydate.field.interviewerNames = intNames;
        laydate.field.appearance = $("#rate1").attr("tscore");
        laydate.field.express = $("#rate2").attr("tscore");
        laydate.field.speciality = $("#rate3").attr("tscore");
        laydate.field.affinity = $("#rate4").attr("tscore");
        laydate.field.logic = $("#rate5").attr("tscore");
        laydate.field.socre = $("#rate6").attr("tscore");
        laydate.field.interviewStatus = 3;
        laydate.field.resumeTime = getFormatDate();
        if (laydate.field.workerInFieldId == 0) {
            layer_alert("请选择面试方式！");
            return false;
        }
        if ($.trim(laydate.field.content) == "") {
            layer_alert("请输入面试内容！");
            return false;
        }
        if ($.trim(laydate.field.opinion) == "") {
            layer_alert("请输入面试意见！");
            return false;
        }
        datas.unshift(laydate.field);
        Serv.Post('gc/ResumeRecord/Add', { model: laydate.field }, function (result) {
            if (result.code == "00") {
                PushRecords();
                layer_alert("成功！");
            }
            else {
                layer_alert(result.message);
            }
        });
        return false;
    });
});

function GoDetails() {
    window.location.href = "/pages/recruit/resumeDetails.html?id=" + id;
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

function GetWorkerIn() {
    var htmlsel = "";
    if (workerinType && workerinType.length > 0) {
        htmlsel += '<div class="layui-block margin-b-10">';
        htmlsel += '<select name="workerInFieldId" lay-filter="selParent">';
        htmlsel += '<option value="0">==请选择面试方式==</option>';
        for (var i = 0; i < workerinType.length; i++) {
            htmlsel += '<option value="' + workerinType[i].id + '">' + workerinType[i].name + '</option>';
        }
        htmlsel += '</select>';
        $("#divsel").append(
            htmlsel
        );
        layui.form.render('select');
    }
    else {
        htmlsel += '<div class="layui-block margin-b-10">';
        htmlsel += '<select name="workerInFieldId" lay-filter="selParent">';
        htmlsel += '<option value="0">==请选择面试方式==</option>';
        htmlsel += '</select>';
        $("#divsel").append(
            htmlsel
        );
        layui.form.render('select');
    }
}


function getFormatDate(){
    var nowDate = new Date();
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
    var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
    var hour = nowDate.getHours()< 10 ? "0" + nowDate.getHours() : nowDate.getHours();
    var minute = nowDate.getMinutes()< 10 ? "0" + nowDate.getMinutes() : nowDate.getMinutes();
    var second = nowDate.getSeconds()< 10 ? "0" + nowDate.getSeconds() : nowDate.getSeconds();
    return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
}