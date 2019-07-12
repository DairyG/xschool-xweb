var zTreeObj;

var setting = {
    view: {
        dblClickExpand: false
    },
    data: {
        key: {
            name: 'ruleName',
            title: 'ruleName'
        },
        simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'parentId',
            rootPId: '0'
        }
    }
}
var model = {
    id: '',
    parentId: '',
    ruleName: ''
};
// var vm = new Vue({
//     el: '#RuleNameForm',
//     data: model
// });

function getSigle(id) {
    Serv.Post('gc/note/GetRuleRegulationType', { id: id }, function (result) {
        model.id = result.id,
            model.parentId = result.parentId,
            model.ruleName = result.ruleName
    })
}

var layuiform;
layui.use(['form', 'element', 'layer'], function () {
    var table = layui.table,
        form = layui.form,
        element = layui.element;

    Serv.Post('gc/note/GetRuleRegulationTypeList', {}, function (result) {
        var 
        zTreeObj = $.fn.zTree.init($("#ztree"), setting, result.data);
    })
})