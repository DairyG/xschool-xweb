var rec_type;



layui.use(['table','element','form','layedit'],function(){
    var table = layui.table,
    element = layui.element, 
    layform = layui.form,
    layedit = layui.layedit;

    layedit.build('Content', { height: 360 });
    layform.on('submit(noteAdd)',function(laydata){
        layer_load();
        Serv.Post('gc/note/AddNote', laydata.field, function (response) {
            if (response.code == "00") {
                // layer_confirm('添加成功，是否继续添加？');
                layer_load_lose();
            } else {
                layer_alert(response.message);
            }
        })
    })
})