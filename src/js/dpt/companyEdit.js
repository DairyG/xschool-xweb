new Vue({
    el: "#formEdit",
    data() {
        return {
            hasSubmit: true,
            hasReadonly: false,
            company: {
                id: 0,
                companyName: '',
                englishName: '',
                credit: '',
                companyType: '',
                legalPerson: '',
                registeredCapital: '',
                responsible: '',
                responsiblePhone: '',
                registeredTime: '',
                businessDate: '',
                businessAddress: '',
                businessScope: '',
                logo: '',
                companyPhone: '',
                email: '',
                officeAddress: '',
                webSite: '',
                intro: '',
                culture: '',
                history: ''
            },
            bankInfo: {
                id: 0,
                companyId: 0,
                openBank: '',
                openBankName: '',
                bankAccount: '',
                linkPhone: '',
                remarks: ''
            },
            bankData: []
        }
    },
    mounted() {
        let _this = this;

        layui.use(['element', 'laydate', 'form'], function () {
            var element = layui.element,
                laydate = layui.laydate,
                layform = layui.form;

            laydate.render({
                elem: '#date1',
                done: function (value) {
                    _this.company.registeredTime = value;
                }
            });

            var E = window.wangEditor
            var eIntro = new E('#E_intro');
            eIntro.customConfig.onchange = function (html) {
                $('input[name="intro"]').val(html);
            };
            eIntro.create();
            var eCulture = new E('#E_culture');
            eCulture.customConfig.onchange = function (html) {
                $('input[name="culture"]').val(html);
            };
            eCulture.create();
            var eHistory = new E('#E_history');
            eHistory.customConfig.onchange = function (html) {
                $('input[name="history"]').val(html);
            };
            eHistory.create();

            var id = GetPara('id');
            id = !id ? '' : id;
            var operation = GetPara('operation');
            if ((operation == 'view' || operation == 'edit') && !id.IsNum()) {
                layer_alert('参数错误');
                _this.hasSubmit = false;
                return false;
            }
            if (id.IsNum()) {
                initData(id);
            }

            if (operation == 'view') {
                _this.hasSubmit = false;
            }

            //初始化
            function initData(value) {
                layer_load();
                Serv.Get('company/getInfo/' + value, {}, function (result) {
                    layer_load_lose();
                    if (result) {
                        _this.hasReadonly = true;

                        _this.company.id = result.id;
                        _this.company.companyName = result.companyName;
                        _this.company.englishName = result.englishName;
                        _this.company.credit = result.credit;
                        _this.company.companyType = result.companyType;
                        _this.company.legalPerson = result.legalPerson;
                        _this.company.registeredCapital = result.registeredCapital;
                        _this.company.responsible = result.responsible;
                        _this.company.responsiblePhone = result.responsiblePhone;
                        _this.company.registeredTime = result.registeredTime.FormatDate(false);
                        _this.company.businessDate = result.businessDate;
                        _this.company.businessAddress = result.businessAddress;
                        _this.company.businessScope = result.businessScope;
                        _this.company.logo = result.logo;
                        _this.company.companyPhone = result.companyPhone;
                        _this.company.email = result.email;
                        _this.company.officeAddress = result.officeAddress;
                        _this.company.webSite = result.webSite;
                        _this.company.intro = result.intro;
                        _this.company.culture = result.culture;
                        _this.company.history = result.history;

                        eIntro.txt.html(result.intro);
                        eCulture.txt.html(result.culture);
                        eHistory.txt.html(result.history);

                        _this.bankInfo.companyId = result.id;

                        _this.bankData = result.bank;
                    } else {
                        layer_alert(result.message);
                    }
                });
            }

            //基本信息
            layform.on('submit(basicInfo)', function (laydata) {
                layer_load();
                Serv.Post('company/edit', laydata.field, function (result) {
                    if (result.code == "00") {
                        _this.company.id = result.data;
                        _this.bankInfo.companyId = result.data;

                        _this.hasReadonly = true;

                        layer_alert(result.message);
                    } else {
                        layer_alert(result.message);
                    }
                });
                return false;
            });

            $("#addBlank").click(function () {
                _this.bankInfo.id = 0;
                _this.bankInfo.openBank = '';
                _this.bankInfo.openBankName = '';
                _this.bankInfo.bankAccount = '';
                _this.bankInfo.linkPhone = '';
                _this.bankInfo.remarks = '';
                _this.bankPop('添加');
            });

            //开户信息
            layform.on('submit(backInfo)', function (laydata) {
                if (laydata.field.companyId <= 0) {
                    layer_alert('请先填写基本信息');
                    return false;
                }
                layer_load();
                Serv.Post('company/editbank', laydata.field, function (result) {
                    if (result.code == "00") {
                        layer_alert(result.message, function () {
                            layer.closeAll();
                            _this.getBank();
                        });
                    } else {
                        layer_alert(result.message);
                    }
                });
                return false;
            });
        });

    },
    methods: {
        bankEdit: function (data) {
            var _this = this;

            _this.bankInfo.id = data.id;
            _this.bankInfo.openBank = data.openBank;
            _this.bankInfo.openBankName = data.openBankName;
            _this.bankInfo.bankAccount = data.bankAccount;
            _this.bankInfo.linkPhone = data.linkPhone;
            _this.bankInfo.remarks = data.remarks;
            _this.bankPop('修改');
        },
        bankDel: function (value) {
            var _this = this;
            layer_confirm('确定删除吗？', function () {
                layer_load();
                Serv.Get('company/delbank/' + value, {}, function (result) {
                    if (result.code == "00") {
                        layer_alert(result.message, function () {
                            _this.getBank();
                        });
                    } else {
                        layer_alert(result.message);
                    }
                });
            });
        },
        getBank: function () {
            var _this = this;
            layer_load();
            Serv.Get('company/getbank/' + _this.company.id, {}, function (result) {
                layer_load_lose();
                if (result) {
                    _this.bankData = result;
                } else {
                    layer_alert(result.message);
                }
            });
        },
        bankPop: function (operation) {
            var _this = this;
            if (_this.bankInfo.companyId <= 0) {
                layer_alert('请先填写基本信息');
                return false;
            }
            layer.open({
                type: 1,
                title: operation + '银行账户',
                String: false,
                closeBtn: 1,
                skin: 'layui-layer-rim',
                area: '750px',
                content: $('#bankPop')
            });
        }
    }
});