layui.use(['element', 'form', 'layer', 'jquery', 'sliderVerify'], function() {
    var element = layui.element,
        form = layui.form,
        sliderVerify = layui.sliderVerify,
        $ = layui.jquery;

    var hasSlider = false;
    sliderVerify.render({
        elem: '#slider',
        isAutoVerify: false,
        onOk: function() { //当验证通过回调
            hasSlider = true;
        }
    });

    changeAstate();

    //表单输入效果
    $('.login-main .input-item').click(function(e) {
        e.stopPropagation();
        $(this).addClass('layui-input-focus').find('.layui-input').focus();
    });
    $('.login-main .input-item .layui-input').focus(function() {
        $(this).parent().addClass('layui-input-focus');
    });
    $('.login-main .input-item .layui-input').blur(function() {
        $(this).parent().removeClass('layui-input-focus');
        if ($(this).val() != '') {
            $(this).parent().addClass('layui-input-active');
        } else {
            $(this).parent().removeClass('layui-input-active');
        }
    });

    //刷新验证码
    $('#verify').click(function() {
        var verifyimg = $('#verify').attr('src');
        $('#verify').attr('src', verifyimg.replace(/\?.*$/, '') + '?' + Math.random());
    });

    form.on('submit(login)', function(data) {
        layer_load();
        var username = $.trim(data.field.username);
        if (!username) {
            layer_alert('请输入手机号码/账号/身份证号码');
            return false;
        }
        var pwd = data.field.password;
        if (!pwd) {
            layer_alert('请输入密码');
            return false;
        }
        if (!hasSlider) {
            layer_alert('请先通过滑块验证');
            return false;
        }

        data.field.client_id = verifyModel.pwd.client_id;
        data.field.client_secret = verifyModel.pwd.client_secret;
        data.field.grant_type = verifyModel.pwd.grant_type;
        data.field.password = $.md5(data.field.password + verifyModel.salt.letter1 + verifyModel.salt.letter2).toUpperCase();
        Serv.Post('uc/account/signin', data.field, function(result) {
            layer_load_lose();
            setData(result);
        });
        return false;
    });

    form.on('submit(phone)', function(data) {
        layer_load();
        var phone = $.trim(data.field.phone_number);
        if (!phone) {
            layer_alert('请输入手机号码');
            return false;
        }
        if (!isPhone(phone)) {
            layer_alert('手机号码格式不正确');
            return false;
        }
        var token = $.trim(data.field.verify_token);
        if (!token) {
            layer_alert('请输入验证码');
            return false;
        }

        data.field.client_id = verifyModel.phone.client_id;
        data.field.client_secret = verifyModel.phone.client_secret;
        data.field.grant_type = verifyModel.phone.grant_type;
        Serv.Post('uc/account/signin', data.field, function(result) {
            layer_load_lose();
            setData(result);
            // Serv.Get('user/init', null, function (response) {
            // 	response.UserInfo = token;
            // 	var stringJson = JSON.stringify(response);
            // 	localStorage.setItem("LOCAL_USER_DATA", stringJson);
            // 	layer.closeAll();
            // 	window.location.href = 'pages/index.html';
            // });
        });
        return false;
    });
});

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
}

function setData(result) {
    layer_load('登录成功，数据拉取中...');
    console.log(result);
    Serv.SetToken(result.token_type + ' ' + result.access_token);
    var token = parseJwt(result.access_token);
    window.globCache.setUserToken(token);
    window.globCache.set(cacheModel.EMPLOYEE, null);
    Serv.Get(
        'uc/Employee/GetEmployeeByUserId/' + token['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'], {},
        function(response) {
            if (response) {
                window.globCache.setEmployee(response);
                window.location.href = 'index.html';
            } else {
                layer_alert('获取数据失败');
            }
        },
        false
    );
}

var sendAgainNo = 60;
var hasClick = false;

//初始化
function changeAstate() {
    $('#getPhoneNo').css('display', 'inline-block');
    $('#sendMsg').css('display', 'none');
}

//获取验证码
function onVerify() {
    var value = $.trim($('input[name="phone_number"]').val());
    if (!value) {
        layer_alert('请输入手机号码');
        return false;
    }
    if (!isPhone(value)) {
        layer_alert('手机号码格式不正确');
        return false;
    }
    if (hasClick) {
        return false;
    }
    hasClick = true;

    layer_load();
    Serv.Post(
        'uc/account/send_phonenumber_verify', {
            phoneNumber: value,
        },
        function(result) {
            layer_load_lose();
            if (result.succeed) {
                sendAgin();
                layer_alert('发送成功');
                $('input[name="verify_token"]').val(result.data);
            } else {
                layer_alert(result.message);
            }
        }
    );
    hasClick = false;
}

//发送成功
function sendAgin() {
    if (sendAgainNo == 0) {
        changeAstate();
        sendAgainNo = 60;
        hasClick = false;
    } else {
        $('#getPhoneNo').css('display', 'none');
        $('#sendMsg')
            .css('display', 'inline-block')
            .val('重新发送(' + sendAgainNo + ')s');
        sendAgainNo--;
        setTimeout(function() {
            sendAgin();
        }, 1000);
    }
}