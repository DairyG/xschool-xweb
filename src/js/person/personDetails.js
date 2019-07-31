var vm = new Vue({
    el: '#personBody',
    data: {
        hasInit: {
            training: true,
            scheing: true,
            mysche: true,
        },
        person: null,
        familyData: [], //家庭成员
        educationData: [], //教育经历
        workData: [], //职位

        trainingData: [], //成长记录
    },
    mounted: function () {
        var _this = this;
        var id = GetPara('id');
        id = !id ? '' : id;
        _this.initLayui(id);
    },
    methods: {
        initLayui: function (id) {
            var _this = this;
            layui.use(['element', 'form', 'table'], function () {
                var element = layui.element,
                    table = layui.table,
                    form = layui.form;

                if (!id.IsNum()) {
                    layer_alert('传入参数错误，请从正确入口访问');
                    return false;
                }

                _this.getPerson(id, table);

                //一些事件监听
                element.on('tab(component-tabs)', function (data) {
                    var text = $(this).text();
                    if (text == '成长记录' && _this.hasInit.training) {
                        _this.getTraining(id);
                    }
                    else if (text == '代办事宜' && _this.hasInit.scheing) {
                        _this.getScheduleDoing(id);
                    }
                    else if (text == '日程安排' && _this.hasInit.mysche) {
                        _this.getSchedule(id);
                    }
                });
            });
        },
        //获取员工
        getPerson: function (value, table) {
            var _this = this;
            layer_load();
            Serv.Get('uc/employee/get/' + value, {}, function (result) {
                layer_load_lose();
                if (result) {
                    _this.person = result;

                    _this.person.statusText = ['未入职', '试用', '转正', '离职'][result.status];
                    _this.person.gender = ['', '男', '女'][result.gender];
                    _this.person.birthDay = result.birthDay.FormatDate(false);
                    _this.person.graduationDate = result.graduationDate.FormatDate(false);

                    // console.log(_this.person);

                    if (_this.person.family) {
                        _this.familyData = JSON.parse(_this.person.family);
                    }
                    if (_this.person.education) {
                        _this.educationData = JSON.parse(_this.person.education);
                    }
                    if (_this.person.work) {
                        _this.workData = JSON.parse(_this.person.work);
                    }

                    _this.$nextTick(function () {
                        _this.imagesViewer();
                    });

                } else {
                    layer_alert('未获取到相关数据');
                }
            });
        },
        //获取成长管理
        getTraining: function (value) {
            var _this = this;
            layer_load();
            Serv.Get('gc/training/query/' + value, {}, function (result) {
                layer_load_lose();
                if (result) {
                    _this.hasInit.training = false;
                    _this.trainingData = result;

                    _this.$nextTick(function () {
                        _this.imagesViewer();
                    });
                }
            });
        },
        //获取代办事宜
        getScheduleDoing: function (value) {
            var _this = this;
            layer_load();
            var bd_datas = [];
            Serv.Post('gc/Schedule/Get', { eid: value, catalog: 'Doing' }, function (response) {
                layer_load_lose();
                if (response) {
                    _this.hasInit.scheing = false;
                    for (var i = 0; i < response.length; i++) {
                        //执行人
                        var exeNames = "";
                        var execu = JSON.parse(response[i].sche.executorsJson);
                        for (var j = 0; j < execu.length; j++) {
                            if (j > 0) {
                                exeNames += ",";
                            }
                            exeNames += execu[j].name;
                        }
                        response[i].sche.executorsJson = exeNames;
                        //抄送人
                        var srcNames = "";
                        var srcib = JSON.parse(response[i].sche.scribblesJson);
                        for (var k = 0; k < srcib.length; k++) {
                            if (k > 0) {
                                srcNames += ",";
                            }
                            srcNames += srcib[k].name;
                        }
                        response[i].sche.scribblesJson = srcNames;
                    }
                    bd_datas = response;
                }
            }, false);
            var db_cols = [[
                { type: 'numbers', title: '序号' },
                { field: 'date', title: '发布时间', minWidth: '150', templet: function (d) { return d.sche.addTime.FormatDate(true) } },
                { field: 'title', title: '标题', minWidth: '160', templet: function (d) { return d.sche.title } },
                { field: 'emergencyName', title: '紧急' },
                { field: 'fb', title: '发布人', minWidth: '100', templet: function (d) { return d.sche.employeeName } },
                { field: 'zx', title: '执行人', minWidth: '160', templet: function (d) { return d.sche.executorsJson } },
                { field: 'cs', title: '抄送人', minWidth: '160', templet: function (d) { return d.sche.scribblesJson } },
                { field: 'completion', title: '完成情况', minWidth: '120' },
                { field: 'date2', title: '截止时间', minWidth: '310', templet: function (d) { return d.sche.beginTime.FormatDate(true) + '~' + d.sche.endTime.FormatDate(true) } },
                { field: 'plan', title: '考核方案', minWidth: '120' },
                { field: 'xm', title: '考核项目', minWidth: '120' },
                { toolbar: '#db_bar', title: '操作', fixed: 'right', width: '70' }
            ]];
            layui.use(['table', 'element', 'laydate'], function () {
                var table = layui.table,
                    element = layui.element,
                    laydate = layui.laydate;
                table.render({
                    elem: '#db_lst',
                    title: '用户表',
                    page: true,
                    even: true,
                    height: 'full-140',
                    cols: db_cols,
                    data: bd_datas,
                });
                table.on('tool(db_lst)', function (data) {
                    if (data.event == 'info') {
                        window.location.href = '../schedule/detailschedule.html?id=' + data.data.sche.id;
                    }
                });
            });
        },
        //获取代办事宜
        getSchedule: function (value) {
            var color_arr = { 1: '#3788d8', 2: '#FF5722', 3: '#FFB800', 0: '#5FB878' };
            var state_arr = { 0: '未完成', 1: '已完成' };
            var type_arr = { 1: '一般', 2: '紧急', 3: '重要' };
            var _this = this;
            layer_load();
            var dataSche = [];
            Serv.Get('gc/Schedule/Get/' + value, {}, function (response) {
                layer_load_lose();
                _this.hasInit.mysche = false;
                for (var i = 0; i < response.length; i++) {
                    var model = {
                        id: response[i].id,
                        title: response[i].title,
                        start: response[i].beginTime.FormatDate(true),
                        end: response[i].endTime.FormatDate(true),
                        state: 1,
                        type: response[i].emergency,
                        backgroundColor: color_arr[response[i].emergency],
                        borderColor: color_arr[response[i].emergency],
                        textColor: '#fff'
                    };
                    dataSche.push(model);
                }
            }, false);

            var calendar;
            var calendarEl = document.getElementById('calendar');
            calendar = new FullCalendar.Calendar(calendarEl, {
                plugins: ['interaction', 'dayGrid', 'timeGrid'],
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                defaultView: 'dayGridMonth',
                locale: 'zh-cn',
                navLinks: true,
                selectable: true,
                selectMirror: true,
                slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false, meridiem: 'short' },
                editable: true,
                eventLimit: true,
                fixedWeekCount: false,
                eventStartEditable: false,
                eventResourceEditable: false,
                eventDurationEditable: false,
                eventResizableFromStart: false,
                eventMouseEnter: function (info) {
                    var state = state_arr[info.event.extendedProps.state];
                    var type = type_arr[info.event.extendedProps.type];
                    var start = info.event.start ? FormatDate(info.event.start) : '';
                    var end = info.event.end ? FormatDate(info.event.end) : '';
                    var html = '<h3>' + info.event.title + '</h3>\
                                    <p>开始时间：<span class="padding-l-15 padding-r-30 tips_span">'+ start + '</span>状态：<span class="padding-l-15">' + state + '</span></p>\
                                    <p>结束时间：<span class="padding-l-15 padding-r-30 tips_span" >'+ end + '</span>紧急：<span class="padding-l-15">' + type + '</span></p>';
                    layer.tips(html, info.el, {
                        tips: [3, '#2F4056'],
                        time: 400000,
                        area: '280px'
                    });
                },
                eventMouseLeave: function (info) {
                    layer.closeAll('tips');
                },
                eventClick: function (arg) {
                    layer.open({
                        type: 2,
                        title: '任务详情',
                        scrollbar: false,
                        skin: 'layui-layer-rim',
                        closeBtn: 1,
                        area: ['100%', '100%'],
                        anim: 2,
                        move: false,
                        content: '../schedule/detailschedule.html?is_pop=1&id=' + arg.event.id
                    });
                },
                events: dataSche
            });

            calendar.render();
        },
        /**
         * 分割附件
         * @param {*} value 值
         * @param {*} type 1=图片，2-附件
         */
        splitAttach: function (value, type) {
            if (!value) {
                return '';
            }
            var htmls = '';
            var fileArr = value.split(',');
            if (type == 1) {
                $.each(fileArr, function (i, item) {
                    htmls += '<img src="' + item + '" style="margin:10px;max-height:90px; max-width:99%; cursor:pointer" />';
                });
            } else if (type == 2) {
                $.each(fileArr, function (i, item) {
                    htmls += setAttachHtml(item, 1);
                });
            }
            return htmls;
        },

        //替换地址/
        replaceAdd: function (value) {
            if (!value) {
                return '';
            }
            return value.replace(/\//g, '');
        },
        //替换换行
        replaceLine: function (value) {
            if (!value) {
                return '';
            }
            value = value.replace(/\r\n/g, '<br>');
            value = value.replace(/\n/g, '<br>');
            return value;
        },
        //格式化时间
        formatDate: function (value, hasTime) {
            if (!value) {
                return '';
            }
            return value.FormatDate(hasTime);
        },
        //图片预览
        imagesViewer: function () {
            $(".v-images").viewer({
                title: false
            });
        }
    }
});