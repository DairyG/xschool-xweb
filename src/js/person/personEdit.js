new Vue({
    el: '#personBody',
    data() {
        return {
            person: {
                id: 0,
                //先给默认值
                companyId: 1,
                userName: '',
                englishName: '',
                gender: 1,
                linkPhone: '',
                email: '',
                qq: '',
                folk: '',
                nativePlace: '',
                politicalStatus: '',
                idCard: '',
                age: '',
                birthDay: '',
                graduateInstitutions: '',
                professional: '',
                degree: '',
                graduationDate: '',
                stature: '',
                weight: '',
                marriage: '未婚',
                children: '无',
                recruitSource: '',
                jobCandidates: '',
                expectSalary: '',
                arrivalTime: '',
                idCardProvince: '',
                idCardCity: '',
                idCardCounty: '',
                idCardAddress: '',
                liveProvince: '',
                liveCity: '',
                liveCounty: '',
                liveAddress: '',
                hobby: '',
                photoPath: '',
                certificatePath: '',
                family: '',
                education: '',
                work: '',
                departmentId: 0,
                positionId: 0,
                employeeNo: '',
                officePhone: '',
                officeEmail: '',
                faxNumber: '',
                referees: '',
                officeAddress: '',
                positionDescribe: '',
            },
            arrivalData: [],
            interviewMethod: [],
            education: [],
            properties: [],
        }
    },
    mounted() {
        let _this = this;

        layui.use(['table', 'element', 'laydate', 'rate', 'form', 'layedit'], function () {
            var table = layui.table,
                element = layui.element,
                laydate = layui.laydate,
                form = layui.form,
                rate = layui.rate,
                layedit = layui.layedit;

            //性别
            form.on('select(gender)', function (data) {
                _this.person.gender = data.value;
            });
            //最高学历
            form.on('select(degree)', function (data) {
                _this.person.degree = data.value;
            });
            //婚姻状况
            form.on('select(marriage)', function (data) {
                _this.person.marriage = data.value;
            });
            //有无子女
            form.on('select(children)', function (data) {
                _this.person.children = data.value;
            });
            //招聘来源
            form.on('select(recruitSource)', function (data) {
                _this.person.recruitSource = data.value;
            });
            //到岗时间
            form.on('select(arrivalTime)', function (data) {
                _this.person.arrivalTime = data.value;
            });

            //出生日期
            laydate.render({
                elem: '#birthDay',
                done: function (value, date, endDate) {
                    _this.person.birthDay = value;
                }
            });
            //毕业时间
            laydate.render({
                elem: '#graduationDate',
                done: function (value, date, endDate) {
                    _this.person.graduationDate = value;
                }
            });

            //身份证
            $('input[name="idCard"]').blur(function () {
                var value = $.trim($(this).val());
                if (value && isCard(value) == '') {
                    var birthday = getBirthdayFromIdCard(value);
                    var age = getAgeFromIdCard(value);
                    _this.person.birthDay = birthday;
                    _this.person.age = age;
                }
            });

            // $("#idCardAddress").jarea({
            //     getVal:function(){
            //         console.log(1);
            //     }
            // });

            $('#idCardAddress').pickArea({
                'width': 'auto',
                'borderColor': '#e6e6e6', //文本边框的色值
                'arrowColor': '#c2c2c2', //箭头颜色
                'listBdColor': '#c2c2c2', //下拉框父元素ul的border色值
                'hoverColor': '#5FB878',
                'fontSize': '14px', //字体大小
                'getVal': function () { //这个方法是每次选中一个省、市或者县之后，执行的方法
                    // console.log($('.pick-area-hidden').val())
                    //console.log($('.pick-area-dom').val())
                    //返回的是调用这个插件的元素pick-area，$('.pick-area-dom').val()的值是该元素的另一个class名，这个class名在dom结构中是唯一的，不会有重复，可以通过这个class名来识别这个pick-area
                    var thisdom = $('.' + $('.pick-area-dom').val());
                    //$('.pick-area-hidden').val()是页面中隐藏域的值，存放着每次选中一个省、市或者县的时候，当前文本存放的省市县的最新值，每点击一次下拉框里的li，这个值就会立即更新
                    thisdom.next().val($('.pick-area-hidden').val());

                    _this.person.idCardAddress = $('.pick-area-hidden').val().replace(/ /g, '/');
                    var code = $(thisdom).find('.pick-area').attr('data-areacode');
                    if (code != '') {
                        arr = code.split(',');
                        _this.person.idCardProvince = arr[0];
                        if (arr.length >= 2) {
                            _this.person.idCardCity = arr[1];
                        }
                        if (arr.length >= 3) {
                            _this.person.idCardCounty = arr[2];
                        }
                    }
                }
            });

            //基本信息
            form.on('submit(basicInfo)', function (laydata) {
                console.log(laydata.field);
                // layer_load();
                // Serv.Post('company/edit', laydata.field, function (result) {
                //     if (result.code == '00') {
                //         _this.company.id = result;
                //         _this.bankInfo.companyId = result;
                //         layer_alert(result.message);
                //     } else {
                //         layer_alert(result.message);
                //     }
                // });
                return false;
            });

            _this.getBasic();

        });

    },
    methods: {
        //获取基础信息
        getBasic: function () {
            var _this = this;
            layer_load();
            Serv.Get('workerinfield/getdata?type=1,2', {}, function (result) {
                layer_load_lose();
                if (result) {
                    _this.arrivalData = result.workerInField;
                    _this.interviewMethod = result.interviewMethod;
                    _this.education = result.education;
                    _this.properties = result.properties;

                    _this.$nextTick(function(){
                        layui.form.render();
                    });
                } else {
                    layer_alert(result.message);
                }
            });
        }
    },
});