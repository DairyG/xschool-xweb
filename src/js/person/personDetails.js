var vm = new Vue({
    el: '#personBody',
    data: {
        hasInit: {
            training: true,
        },
        person: null,
        familyData: [], //家庭成员
        educationData: [], //教育经历
        workData: [], //职位

        trainingData: [], //成长记录
    },
    mounted: function() {
        var _this = this;
        var id = GetPara('id');
        id = !id ? '' : id;
        _this.initLayui(id);
    },
    methods: {
        initLayui: function(id) {
            var _this = this;
            layui.use(['element', 'form', 'table'], function() {
                var element = layui.element,
                    table = layui.table,
                    form = layui.form;

                if (!id.IsNum()) {
                    layer_alert('传入参数错误，请从正确入口访问');
                    return false;
                }

                _this.getPerson(id, table);

                //一些事件监听
                element.on('tab(component-tabs)', function(data) {
                    var text = $(this).text();
                    if (text == '成长记录' && _this.hasInit.training) {
                        _this.getTraining(id);
                    }
                });
            });
        },
        //获取员工
        getPerson: function(value, table) {
            var _this = this;
            layer_load();
            Serv.Get('uc/employee/get/' + value, {}, function(result) {
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

                    // console.log(_this.workData);

                } else {
                    layer_alert('未获取到相关数据');
                }
            });
        },
        //获取成长管理
        getTraining: function(value) {
            var _this = this;
            layer_load();
            Serv.Get('gc/training/query/' + value, {}, function(result) {
                layer_load_lose();
                if (result) {
                    _this.hasInit.training = false;
                    _this.trainingData = result;
                }
            });
        },

        //替换地址/
        replaceAdd: function(value) {
            if (!value) {
                return '';
            }
            return value.replace(/\//g, '');
        },
        //替换换行
        replaceLine: function(value) {
            if (!value) {
                return '';
            }
            value = value.replace(/\r\n/g, '<br>');
            value = value.replace(/\n/g, '<br>');
            return value;
        },
        //格式化时间
        formatDate: function(value, hasTime) {
            if (!value) {
                return '';
            }
            return value.FormatDate(hasTime);
        }
    }
});