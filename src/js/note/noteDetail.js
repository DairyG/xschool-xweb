var vm = new Vue({
    el: '#noteMsg',
    data: {
        noteDetail: [],//通知公告详情
        browsed: [],//已浏览人数列表
        noBrowsed: []//未浏览人数列表
    },
    mounted: function () {
        var _this = this;
        var id = GetPara("id");
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
                    layer_alter("传入参数错误，请从正确接口访问！");
                    return false;
                }

                _this.getNoteDetail(id);
            })
        },
        getNoteDetail: function (id) {
            var _this = this;
            layer_load();
            Serv.Get("gc/note/GetSigleNote?id=" + id, {}, function (result) {
                layer_load_lose();
                if (result.succeed) {
                    _this.noteDetail = result.data;
                    _this.noteDetail.title = result.data.title;
                    _this.noteDetail.createDate = result.data.createDate;
                    _this.noteDetail.publisherId = result.data.publisherId;
                    _this.noteDetail.content = decodeURIComponent(result.data.content);
                    $("#content").html(_this.noteDetail.content);
                }
                else {
                    layer_alter("未获取到相应数据！");
                }
            })
        }
    }
})