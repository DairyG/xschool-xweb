layui.use(['table', 'form'], function () {
    var table = layui.table
    form = layui.form;

    form.on('select(sel)', function (obj) {
        var value = obj.value;
        var elem = obj.elem;
        if (value == 3) {
            user_popup(null, false, true, false, 1, false, (res) => {
                var id = res.department.ids.LTrim(',').RTrim(',');
                var val = res.department.names.LTrim(',').RTrim(',');
                var sel_last = $(elem).find('option:last');
                var sel_last_val = parseInt(sel_last.attr('value'));
                $(sel_last).find('option').removeAttr('selected');
                if (sel_last_val > 0) {
                    $(sel_last).attr('value', id);
                    $(sel_last).prop('selected', true);
                    $(sel_last).html(val);
                } else {
                    $(sel_last).after('<option value="' + id + '" selected >' + val + '</option>');
                }
                form.render('select');
            });
        }
    });
});