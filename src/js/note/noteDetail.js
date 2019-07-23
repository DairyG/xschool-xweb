var vm = new Vue({
    el: '#noteMsg',
    data: {
        noteDetail: [],//通知公告详情
        browsed: [],//已浏览人数列表
        noBrowsed: []//未浏览人数列表
    },
    mounted: function () {
        var _this = this;
        var id = GetPara("NoteId");
        var UserId = window.globCache.getEmployee().id;
        var UserName = window.globCache.getEmployee().employeeName;
        var CompanyName = window.globCache.getEmployee().companyName;
        var DptName = window.globCache.getEmployee().dptName;
        id = !id ? '' : id;
        _this.initLayui(id,UserId,UserName,CompanyName,DptName);


        var data_col1 = [[
            {type: 'id', title: '序号', templet: function (item) { return item.id; }},
            { field: 'userName', title: '员工姓名' },
            { field: 'companyName', title: '公司' },
            { field: 'dptName', title: '部门' },
            { field: 'readDate', title: '浏览日期',templet:function(item){
                return item.readDate.FormatDate();
           } }
        ]];
        var data_col2 = [[
            {type: 'id', title: '序号', templet: function (item) { return item.id; }},
            { field: 'userName', title: '员工姓名' },
            { field: 'companyName', title: '公司' },
            { field: 'dptName', title: '部门' }
        ]];
        var parameter = {
            NoteId: 0,
            IsRead: 0
        };
        function search0() {
            parameter.NoteId = id;
            parameter.IsRead = 1;
            return parameter;
        }
        function search1() {
            parameter.NoteId = id;
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
                "gc/note/NoteReadRecord",//action url 只能post提交
                search0,
                null,//如果在显示之前需要对数据进行整理需要实现，否则传null
                null,//有选择行才能有的操作，实现该方法,否则传null
                null, //如果有每行的操作栏的操作回调，实现该方法，否则传null
                null,
                'full-100'
            );
            //分页初始化
            var lstPager1 = Pager2(table,//lay-ui的table控件
                '未读',//列表名称
                "lst2",//绑定的列表Id
                'bar',//绑定的工具条Id
                data_col1,//表头的显示行
                "gc/note/NoteReadRecord",//action url 只能post提交
                search1,
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

                _this.getNoteDetail(id,UserId,UserName,CompanyName,DptName);
            })
        },
        getNoteDetail: function (id,UserId,UserName,CompanyName,DptName) {
            var _this = this;
            layer_load();
            Serv.Get("gc/note/GetSigleNote?NoteId=" + id+"&UserId="+UserId+
            "&UserName="+UserName+"&CompanyName="+CompanyName+"&DptName="+DptName, {}, function (result) {
                layer_load_lose();
                if (result.succeed) {
                    _this.noteDetail = result.data.noteDetail;
                    _this.noteDetail.title = result.data.noteDetail.title;
                    _this.noteDetail.createDate = result.data.noteDetail.createDate.FormatDate();
                    _this.noteDetail.publisherId = result.data.noteDetail.publisherId;
                    _this.noteDetail.publisherName = result.data.noteDetail.publisherName;
                    _this.noteDetail.DepartmentName = result.data.noteDetail.departmentName;
                    _this.noteDetail.content = result.data.noteDetail.content; 
                    var fjHtml=splitAttach(result.data.noteDetail.enclosureUrl,2);                
                    $("#certificatePanel").html(fjHtml);
                    $("#content").html(_this.noteDetail.content);
                }
                else {
                    layer_alter("未获取到相应数据！");
                }
            })
        },
        GetReadRecord: function (id) {
            Serv.Post("gc/note/NoteReadRecord", { IsRead: 0, NoteId: id }, function (response) {
                datas = response;
            }, false);
            Serv.Get("gc/note/NoteReadRecord", { IsRead: 0, NoteId: id }, function (response) {
                datas = response;
            }, false);
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