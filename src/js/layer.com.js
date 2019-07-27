/**
 * 弹出加载层
 * @param string message 提示信息
 */
function layer_load(message) {
    if (typeof layer == undefined || typeof layer == 'undefined') {
        layui.use(['layer'], function() {
            window.layer = layui.layer;
            if (message) {
                window.layer_loading_id = layer.msg(message, {
                    icon: 16,
                    shade: 0.3,
                    time: 0
                });
            } else {
                window.layer_loading_id = layer.load(3, {
                    shade: 0.3
                });
            }
        });
    } else {
        if (message) {
            window.layer_loading_id = layer.msg(message, {
                icon: 16,
                shade: 0.3,
                time: 0
            });
        } else {
            window.layer_loading_id = layer.load(3, {
                shade: 0.3
            });
        }
    }
};

/**
 * 关闭加载层
 */
function layer_load_lose() {
    layer.close(window.layer_loading_id);
}

/**
 * 弹出 信息框
 * @param string message 提示信息
 * @param function callBack 回调函数
 */
function layer_alert(message, callBack) {
    layer_load_lose();
    layer.alert((message || '成功'), {
        title: '提示',
        closeBtn: 0
    }, function(index) {
        layer.close(index);
        callBack && callBack();
    });
}

/**
 * 弹出提示层
 */
function layer_msg(message) {
    layer.msg(message);
};

/**
 * 弹出 信息框
 * @param string message 提示信息
 * @param function callBack 回调函数
 */
function layer_alert(message, callBack) {
    layer_load_lose();
    layer.alert((message || '成功'), {
        title: '提示',
        closeBtn: 0
    }, function(index) {
        layer.close(index);
        callBack && callBack();
    });
}

/**
 * 确认框；
 * @param string message 提示信息
 * @param function confirmBack 点击确定的回调函数
 * @param function cancelBack 点击取消的回调函数
 */
function layer_confirm(message, confirmBack, cancelBack) {
    layer_load_lose();
    layer.confirm((message || '确定提交数据吗?'), {
        title: '确定信息',
        resize: false,
        btn: ['确定', '取消'],
        btnAlign: 'c',
        closeBtn: 0,
        anim: 0,
        icon: 3
    }, function(index) {
        layer.close(index);
        confirmBack && confirmBack();
    }, function(index) {
        layer.close(index);
        cancelBack && cancelBack();
    });
}

/** 
 * 弹出输入层
 */
function layui_prompt(obj, callback) {
    var default_val = $(obj).val();
    layer.prompt({
        formType: 2,
        value: default_val,
        title: '请输入',
        area: ['350px', '120px'],
        yes: function(index, elem) {
            var value = elem.find(".layui-layer-input").val();
            $(obj).val(value);
            if (typeof callback === 'function') {
                callback(obj, value);
            }
            layer.close(index);
        }
    });
}

function isPhone(value) {
    return /^(1[345789][0-9])[0-9]{8}$/.test(value);
}

function isNum(value) {
    return /^[0-9\.]+$/.test(value);
}