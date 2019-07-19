var id = 0,info = {};
var ContractType_arr = {1:'收款合同',2:'付款合同',3:'事务合同'};
var PayNum_arr = {1:'单次付款',2:'多次付款'};
var IsInvoice_arr = {0:'不开票',2:'开票'};
var InvoiceToType_arr = {1:'个人',2:'企业'};
var InvoiceType_arr = {1:'企业增值税普通发票',2:'增值税专用发票',3:'组织（非企业）增值税普通发票'};

layui.use(['element','laytpl','layer'], function() {
	var element = layui.element,
		laytpl = layui.laytpl
		layer = layui.layer;
	layer_load();
	id = GetPara('id');
	Serv.Post('gc/Contract/GetSingle',{id:id},function(res){
		for(var k in res){
			res[k] = (res[k] == null || res[k] == 'null') ? '' : res[k];
		}
		res.startTime = res.startTime.FormatDate();
		res.endTime = res.endTime.FormatDate();
		res.jiaSignDate = res.jiaSignDate.FormatDate();
		res.yiSignDate = res.yiSignDate.FormatDate();
		$('#content').html(res.content);
		info = res;
	},false);
	var infoTpl = $('#infoTpl').html();
	laytpl(infoTpl).render(info,function(html){
		$('#info').html(html);
	});
	layer_load_lose();
});
$('.layui-tab-title').scrollFixed();
