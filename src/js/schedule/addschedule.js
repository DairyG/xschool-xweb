var sid = GetPara('sid');
layui.use(['table', 'laydate', 'layedit', 'form'], function () {
    var table = layui.table
    laydate = layui.laydate,
        layedit = layui.layedit,
        form = layui.form;
    var E = window.wangEditor
    var eContent = new E('#E_Content');
    eContent.customConfig.onchange = function (html) {
        $('input[name="content"]').val(html);
    };
    eContent.create();
    var intnDate = function () {
        var employ = window.globCache.getEmployee();
        //console.log(employ);
        if (employ) {
            $("input[name='companyId']").val(employ.companyId);
            $("input[name='dptId']").val(employ.dptId);
            $("input[name='employeeId']").val(employ.id);
            $("input[name='employeeName']").val(employ.employeeName);
        }
        // 2019-07-13 00:00:00
        if ($.trim(window.parent.addData.start) != "") {
            $("input[name='beginTime']").val(window.parent.addData.start.FormatDate(true));
        }
        if ($.trim(window.parent.addData.end) != "") {
            $("input[name='endTime']").val(window.parent.addData.end.FormatDate(true));
        }
        $("input[name='allDay']").val(window.parent.addData.allDay);
    };
    intnDate();
    lay('.date').each(function () {
        laydate.render({
            elem: this,
            type: 'datetime'
        });
    });
    form.on('select(repeat)', function (obj) {
        if (obj.value > 0) {
            $("#repeat_time").show();
        } else {
            $("#repeat_time").hide();
        }
    });
    form.on('submit(formDemo)', function (laydate) {
        var intIds1 = "";
        var person1 = [];
        if ($("#user_sel_box1 input").length > 0) {
            var users1 = $.parseJSON($("#user_sel_box1").find("input[name='sels']").val()).user;
            for (var i = 0; i < users1.length; i++) {
                intIds1 += "," + users1[i].id;
                var model = {
                    id: users1[i].id,
                    name: users1[i].name
                };
                person1.push(model);
            }
            intIds1 += ",";
        }
        laydate.field.executors = intIds1;
        laydate.field.executorsJson = JSON.stringify(person1);

        var intIds2 = "";
        var person2 = [];
        if ($("#user_sel_box2 input").length > 0) {
            var users2 = $.parseJSON($("#user_sel_box2").find("input[name='sels']").val()).user;
            for (var i = 0; i < users2.length; i++) {
                intIds2 += "," + users2[i].id;
                var model = {
                    id: users2[i].id,
                    name: users2[i].name
                };
                person2.push(model);
            }
            intIds2 += ",";
        }
        laydate.field.scribbles = intIds2;
        laydate.field.scribblesJson = JSON.stringify(person2);

        laydate.field.kpiPlan = $("#selPlan").val();
        laydate.field.kpiId = 0;
        laydate.field.remindTime = $("#selRemindTime").val();
        laydate.field.remindWay = $("#selRemindWay").val();
        laydate.field.emergency = $("#selEmergency").val();
        laydate.field.repeat = $("#selRepeat").val();
        laydate.field.addTime = '2019-01-01 00:00:00';
        laydate.field.fileUrl = "";

        if ($.trim(laydate.field.executors) == "") {
            layer_alert("请选择执行人！");
            return false;
        }
        if ($.trim(laydate.field.beginTime) == "") {
            layer_alert("请选择开始时间！");
            return false;
        }
        if ($.trim(laydate.field.endTime) == "") {
            layer_alert("请选择截止时间！");
            return false;
        }
        if (parseInt(laydate.field.repeat) <= 0) {
            layer_alert("请选择重复方式！");
            return false;
        }
        if (parseInt(laydate.field.repeat) > 1 && $.trim(laydate.field.repeatEndTime) == "") {
            layer_alert("请选择重复结束时间！");
            return false;
        }
        if ($.trim(laydate.field.title) == "") {
            layer_alert("请输入任务标题");
            return false;
        }
        if ($.trim(laydate.field.content) == "") {
            layer_alert("请输入任务内容");
            return false;
        }
        Serv.Post('gc/Schedule/Add', laydate.field, function (response) {
            if (response.code == '00') {
                window.parent.addData.id = response.data;
                window.parent.addData.title = laydate.field.title;
                window.parent.addData.start = laydate.field.beginTime;
                window.parent.addData.end = laydate.field.endTime;
                window.parent.addData.colindex = laydate.field.emergency;
                //layer_alert("添加成功！");
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            }
            else {
                layer_alert(response.message);
            }
        });
        return false;
    });
    //layedit.build('content');
    if (sid > 0) {
        Serv.Get('gc/Schedule/GetSingle/' + sid, {}, function (response) {
            //console.log(response);
            if (response) {
                $("input[name='id']").val(response.sche.id);
                //执行人Start————————
                var executors = JSON.parse(response.sche.executorsJson);
                var names = "";
                var values = "";
                for (var i = 0; i < executors.length; i++) {
                    if (i > 0) {
                        names += ",";
                        values += ",";
                    }
                    names += executors[i].name;
                    values += '{&quot;id&quot;:' + executors[i].id + ',&quot;name&quot;:&quot;' + executors[i].name + '&quot;,&quot;dpt_id&quot;:&quot;1&quot;,&quot;dpt_name&quot;:&quot;&quot;,&quot;company_id&quot;:&quot;1&quot;,&quot;company_name&quot;:&quot;&quot;}';
                }
                var exeHtml = names;
                exeHtml += '<input type="hidden" name="sels" value="{&quot;sel_type&quot;:&quot;org&quot;,&quot;user&quot;:[';
                exeHtml += values;
                exeHtml += '],&quot;department&quot;:[],&quot;company&quot;:[],&quot;position&quot;:[],&quot;dpt_position&quot;:[]}">';
                $("#user_sel_box1").html(exeHtml);
                //执行人End————————
                //抄送人Start——————————
                var scribbles = JSON.parse(response.sche.scribblesJson);
                var names1 = "";
                var values1 = "";
                for (var i = 0; i < scribbles.length; i++) {
                    if (i > 0) {
                        names1 += ",";
                        values1 += ",";
                    }
                    names1 += scribbles[i].name;
                    values1 += '{&quot;id&quot;:' + scribbles[i].id + ',&quot;name&quot;:&quot;' + scribbles[i].name + '&quot;,&quot;dpt_id&quot;:&quot;1&quot;,&quot;dpt_name&quot;:&quot;&quot;,&quot;company_id&quot;:&quot;1&quot;,&quot;company_name&quot;:&quot;&quot;}';
                }
                var scrHtml = names1;
                scrHtml += '<input type="hidden" name="sels" value="{&quot;sel_type&quot;:&quot;org&quot;,&quot;user&quot;:[';
                scrHtml += values1;
                scrHtml += '],&quot;department&quot;:[],&quot;company&quot;:[],&quot;position&quot;:[],&quot;dpt_position&quot;:[]}">';
                $("#user_sel_box2").html(scrHtml);
                //抄送人End——————————
                //考核方案
                $("#selPlan").val(response.sche.kpiPlan);
                //开始时间
                $("input[name='beginTime']").val(response.sche.beginTime.FormatDate(true));
                //截止时间
                $("input[name='endTime']").val(response.sche.endTime.FormatDate(true));
                //提醒时间
                $("#selRemindTime").val(response.sche.remindTime);
                //提醒方式
                $("#selRemindWay").val(response.sche.remindWay);
                //紧急程度
                $("#selEmergency").val(response.sche.emergency);
                //重复
                $("#selRepeat").val(response.sche.repeat);
                if(response.sche.repeat > 1)
                {
                    $("#repeat_time").show();
                }
                //重复结束时间
                $("input[name='repeatEndTime']").val(response.sche.repeatEndTime.FormatDate(true));
                //标题
                $("input[name='title']").val(response.sche.title);
                //内容
                $("input[name='content']").val(response.sche.content);
                eContent.txt.html(response.sche.content);
                form.render("select");
            }
        });
    }
});


var is_pop = GetPara('is_pop');
if (is_pop == 1) {
    $(".childrenBody").removeClass('childrenBody');
    $(".layui-card-header").remove();
}
$('#close_btn').click(function () {
    if (is_pop == 1) {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    } else {
        history.back(-1);
    }
});