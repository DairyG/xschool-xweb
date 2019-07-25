var data_col2 = [[
    { field: 'id', title: '序号',width:60 },
    { field: 'userName', title: '员工姓名' },
    { field: 'companyName', title: '公司' },
    { field: 'dptName', title: '部门' }
]];
var parameter = {
    RuleRegulationId: 0,
    IsRead: 0
};
var vm = new Vue({
    el: '#ruleMsg',
    data: {
        ruleDetail: [],//通知公告详情
        browsed: [],//已浏览人数列表
        noBrowsed: []//未浏览人数列表
    },
    mounted: function () {
        var _this = this;
        var id = GetPara("id");
        var UserId = window.globCache.getEmployee().id;
        var UserName = window.globCache.getEmployee().employeeName;
        var CompanyName = window.globCache.getEmployee().companyName;
        var DptName = window.globCache.getEmployee().dptName;
        id = !id ? '' : id;
        _this.initLayui(id,UserId,UserName,CompanyName,DptName);


        var data_col1 = [[
            { field: 'id', title: '序号',width:60 },
            { field: 'userName', title: '员工姓名' },
            { field: 'companyName', title: '公司' },
            { field: 'dptName', title: '部门' },
            { field: 'readDate', title: '浏览日期',templet:function(item){
                return item.readDate.FormatDate();
           } }
        ]];
        function search0() {
            parameter.RuleRegulationId = id;
            parameter.IsRead = 1;
            return parameter;
        }
        function search1() {
            parameter.RuleRegulationId = id;
            parameter.IsRead = 0;
            return parameter;
        }
        layui.use(['table', 'element'], function () {
            var table = layui.table,
                element = layui.element;

            //分页初始化
            var lstPager = Pager2(table,//lay-ui的table控件
                '已读',//列表名称
                "lst1",//绑定的列表Id
                'bar',//绑定的工具条Id
                data_col1,//表头的显示行
                "gc/note/RuleRegulationRead",//action url 只能post提交
                search0,
                null,//如果在显示之前需要对数据进行整理需要实现，否则传null
                null,//有选择行才能有的操作，实现该方法,否则传null
                null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
                null,
                'full-100'
            );
        });
    },
    methods: {
        initLayui: function (id,UserId,UserName,CompanyName,DptName) {
            var _this = this;
            layui.use(['element', 'form', 'table'], function () {
                var element = layui.element,
                    table = layui.table,
                    form = layui.form;

                if (!id.IsNum()) {
                    layer_alter("传入参数错误，请从正确接口访问！");
                    return false;
                }

                _this.getruleDetail(id,UserId,UserName,CompanyName,DptName,function(resultUser){
                    var CompanyIds=[];
                    var DptIds=[];
                    var JobIds=[];
                    var EmployeeIds=[];
                    if(resultUser.company.length>0)
                    {
                        $.each(resultUser.company,function(item){
                            CompanyIds.push(resultUser.company[item].id);
                        })
                    }
                    if(resultUser.department.length>0)
                    {
                        $.each(resultUser.department,function(item){
                            DptIds.push(resultUser.department[item].id);
                        })
                    }
                    if(resultUser.user.length>0)
                    {
                        $.each(resultUser.user,function(item){
                            EmployeeIds.push(resultUser.user[item].id);
                        })
                    }
                    if(resultUser.position.length>0)
                    {
                        $.each(resultUser.position,function(item){
                            JobIds.push(resultUser.position[item].id);
                        })
                    }
                    lstPager1();
                    function lstPager1() {
                        var param={
                            IsRead:1,
                            RuleRegulationId:id,
                            page:1,
                            limit:500
                        };
                        var NotReadCount;
                        var IsRead;
                        Serv.Post("gc/note/RuleRegulationRead", param, function (response) {
                            IsRead = response;
                        }, false);
                        var param={
                            CompanyIds:CompanyIds,
                            DptIds:DptIds,
                            EmployeeIds:EmployeeIds,
                            JobIds:JobIds
                        };
                        Serv.Post("uc/Employee/GetEmployees",param,function(result){
                            if(IsRead.code=="00")
                            {
                                var IsReadCount=IsRead.data.items;
                                result=GetNotReadList(IsReadCount,result)
                            }
                            table.render({
                                elem: '#lst2',
                                data:result,
                                page:true,
                                limit:10,
                                cols:data_col2
                            })
                        })
                    }
                });
            })
        },
        getruleDetail: function (id,UserId,UserName,CompanyName,DptName,callback) {
            var _this = this;
            layer_load();
            Serv.Get("gc/note/RuleRegulationDetail?id=" + id+"&UserId="+UserId+
            "&UserName="+UserName+"&CompanyName="+CompanyName+"&DptName="+DptName, {}, function (result) {
                layer_load_lose();
                if (result.succeed) {
                    _this.ruleDetail = result.data.ruleRegulationDetail;
                    _this.ruleDetail.title = result.data.ruleRegulationDetail.title;
                    _this.ruleDetail.createDate = result.data.ruleRegulationDetail.createDate.FormatDate();
                    _this.ruleDetail.publisherId = result.data.ruleRegulationDetail.publisherId;
                    _this.ruleDetail.publisherName = result.data.ruleRegulationDetail.publisherName;
                    _this.ruleDetail.DepartmentName = result.data.ruleRegulationDetail.departmentName;
                    _this.ruleDetail.content = result.data.ruleRegulationDetail.content; 
                    $("#content").html(_this.ruleDetail.content);
                    var fjHtml=splitAttach(result.data.ruleRegulationDetail.enclosureUrl,2);                
                    $("#certificatePanel").html(fjHtml);
                    $("#content").html(_this.ruleDetail.content);
                    callback(result.data.chooseUser);
                }
                else {
                    layer_alter("未获取到相应数据！");
                }
            })
        }
    }
})


/**
 * 分割附件
 * @param {*} value 值
 * @param {*} type 1=图片，2-附件
 */
function splitAttach(value, type) {
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
    if (htmls != '')
        htmls = '<hr>' + htmls;
    return htmls;
}

function GetNotReadList(array1,array2) {
    var result = [];
    for (var i = 0; i < array2.length; i++) {
        var obj = array2[i];
        var num = obj.id;
        var isExist = false;
        for (var j = 0; j < array1.length; j++) {
            var aj = array1[j];
            var n = aj.userId;
            if (n == num) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            result.push(obj);
        }
    }
    return result;
}