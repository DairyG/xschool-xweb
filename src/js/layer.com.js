/**
 * 弹出加载层
 * @param string message 提示信息
 */
function layer_load(message) {
	if(typeof layer == undefined || typeof layer == 'undefined'){
		layui.use(['layer'],function(){
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
		window.layer_loading_id = layer.load(3, {
		    shade: 0.3
		});
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
    }, function (index) {
        layer.close(index);
        callBack && callBack();
    });
}

function isPhone(value) {
    return /^(1[345789][0-9])[0-9]{8}$/.test(value);
}

function isNum(value) {
    return /^[0-9\.]+$/.test(value);
}