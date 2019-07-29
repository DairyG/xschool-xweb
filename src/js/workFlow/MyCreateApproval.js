var dataCol = [
    [
        {
            type:"numbers",width:60,title:'序号'
        },
        {
            field: 'businessCode',
            title: '流程编号',
            minWidth: 80
        },
        {
            field: 'subjectName',
            title: '流程名称',
            minWidth: 80
        },
        {
            field: 'createtime',
            title: '申请时间',
            minWidth: 80,
            templet:function(d){
                return d.createtime ? d.createtime.FormatDate(true) : '';
            }
        },
        {
            field: 'endTime',
            title: '完成时间',
            minWidth: 80,
            templet:function(d){
                return d.endTime ? d.endTime.FormatDate(true) : '';
            }
        },
        {
            field: 'deptId',
            title: '申请部门',
            minWidth: 80,
            templet:function(d){
                return globCache.getDptName(d.deptId);
            }
        },
        {
            field: 'createUserName',
            title: '申请人',
            minWidth: 80
        },
        {
            field: 'passStatus',
            title: '流程状态',
            templet:function(d){
                return arrPassStatus[d.passStatus];
            }
        },
        {
            field: 'waitApprovalName',
            title: '当前审批人',
            minWidth: 60
        },
        {
            title: '操作',
            toolbar: '#bar',
            width: 200
        }
    ]
];
var arrPassStatus = {
    1 : '已撤销',
    2:'同意',
    3 : '不同意',
    4:'审批中'
}

var parameter = {
    SubjectName: '',
    BusinessCode: '',
    Createtime: '',
    DeptId: 0,
    CreateUserName: ''
};

var form;
layui.use(['table', 'element', 'form','laydate'], function() {
    var table = layui.table,
        element = layui.element,
        laydate = layui.laydate;
        form = layui.form;
    laydate.render({
        'elem':'#data'
    });
         //基本信息
    form.on('submit(search)', function(laydata) {
        parameter = laydata.field;
        lstPager.search();
        return false;
    });
var onTools = function(layEvent, data) {
        layer_load();
        if (layEvent === 'view') {
           window.location.href = 'ApprovalDetails.html?id=' + data.id
        } 
		 if (layEvent === 'zj') {
             if(data.passStatus!=4)
             {
                layer.msg('失败:此数据不允更换审批人！', {icon:2});
                layer_load_lose();
                return;
             }
           //window.location.href = 'ApprovalDetails.html?id=' + data.id
           user_popup(null,'user',1,false,function(res){
                var subData = {
                    Id:data.id,
                    AuditidUserId:res.user[0].id,
                    AuditidUserName:res.user[0].name
                }

                    Serv.Post('lc/WorkflowMain/ApprovalPerson',subData,function(resultData){
                        if(resultData.succeed)
                        {
                            layer.msg("成功...", {icon:1});
                            setTimeout(function(){
                                window.location.reload();
                            },1000);
                        }else{
                            layer.msg('失败:'+resultData.message, {icon:2});
                        }
                     })
           });
        }
		 if (layEvent === 'cx') {
			 var dataValue={Id:data.id};
           Serv.Post('lc/WorkflowMain/Revoke',dataValue,function(resultData){
						if(resultData.succeed)
						{
                            layer.msg("成功...", {icon:1});
                            window.location.reload();
						}else{
							layer.msg('失败:'+resultData.message, {icon:2});
						}
					})
        }
		layer_load_lose();
    };
    function search() {
        
        return parameter;
    }
    
    //分页初始化
    var lstPager = Pager(table, //lay-ui的table控件
        '待我审核', //列表名称
        'lst', //绑定的列表Id
        '', //绑定的工具条Id
        dataCol, //表头的显示行
        'lc/WorkflowMain/MyCreateApproval', //action url 只能post提交
        search, //获取查询条件的函数
        null, //如果在显示之前需要对数据进行整理需要实现，否则传null
        null, //有选择行才能有的操作，实现该方法,否则传null
        onTools, //如果有每行的操作栏的操作回调，实现该方法，否则传null
        null,
        'full-100'
    );
})
