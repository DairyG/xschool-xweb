var verifyModel = {
    pwd: {
        client_id: '725A78E65DD14658A8947F68C27BD322',
        client_secret: '367CA1C1E7F64A2883B978DD7CEC043B',
        grant_type: 'password',
    },
    phone: {
        client_id: 'phone_number_authentication',
        client_secret: '367CA1C1E7F64A2883B978DD7CEC043B',
        grant_type: 'phone_number_token',
    },
    salt: {
        letter1: '$$$',
        letter2: '7CD955AE-6A04-41BC-952F-0366D2532C95'
    }
}

function getYears(year) {
    year = year || 2017;
    var nowYear = new Date().getFullYear();
    var data = [];
    for (var index = year; index <= nowYear; index++) {
        data.push({
            year: index,
            selected: (index == nowYear ? 1 : 0)
        });
    }
    return data;
}

var tips = {
    noDataTip: '未获取到数据'
};

function getUserPopModel() {
    return {
        sel_type: 'org',
        user: [],
        department: [],
        company: [],
        position: [],
        dpt_position: []
    }
}

var Serv = {
    // ServiceUrl: "http://114.116.54.157:8000/api/v1/",
    ServiceUrl: "http://localhost:8000/api/v1/",
    ImageUrl: "http://114.116.54.157:8000/api/v1/imger/uploader/upload",
    UCenterUrl: "",
    // Code: "JDWL",//站点名称
    Token: "", //用户的Token
    GetToken: function() {
        if (this.Token == "" || this.Token == null) {
            this.Token = localStorage.getItem("Service_Token");
        }
        return this.Token;
    },
    SetToken: function(val) {
        if (val == "") {
            return false;
        }
        Token = val;
        localStorage.setItem("Service_Token", val);
        return true;
    },
    RemoveToken: function() {
        Token = "";
        localStorage.removeItem("Service_Token");
    },
    GetHeaders: function() {
        return {
            "Authorization": Serv.GetToken()
        }
    },
    GetUrl: function(url) {
        return Serv.ServiceUrl + url;
    },
    Get: function(url, args, callback, async) {
        this.Send(url, "GET", args, callback, async);
    },
    Post: function(url, args, callback, async) {
        this.Send(url, "POST", args, callback, async);
    },
    Send: function(url, type, args, callback, async) {
        jQuery.support.cors = true;
        $.ajax({
            //xhrFields: {withCredentials: true},
            crossDomain: true,
            dataType: "json",
            url: Serv.ServiceUrl + url,
            headers: {
                //"_CODE_": Serv.Code,
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Authorization": Serv.GetToken(),
                //"Access-Control-Allow-Origin":"*"
            },
            type: type,
            data: args,
            async: async !=undefined ? async :true,
            success: function(data) {
                callback(data);
            },
            error: function(data) {
                console.log(data);
                layer_load_lose();
                if (data.status == 400) {
                    var json = JSON.parse(data.responseText);
                    if (json.error == 'invalid_client') {
                        layer.alert(json.error_description, {
                            icon: 2,
                            title: '登陆提示'
                        });
                    } else {
                        layer.alert(json.error_description, {
                            icon: 2,
                            title: '登陆提示'
                        });
                    }
                } else {
                    layer.alert('服务器异常，请稍后再试');
                }
                // console.log("err:", data);
            }
        });
    },
    ChkLogin: function() {
        if (this.GetToken() == null || this.GetToken() == "") {
            window.location.href = 'login.html';
        }
    },
    getUserInit: function() {

    },
    Upload: function(options) {
        var layer, upload;
        var defaults = {
            accept: 'images',
            acceptMime: 'image/*',
        }
        var config = $.extend({}, defaults, options);
        layui.use(['layer', 'upload'], function() {
            upload = layui.upload;
            layer = layui.layer;
        });
        upload.render({
            elem: config.elem,
            url: this.ImageUrl,
            accept: config.accept,
            acceptMime: config.acceptMime,
            headers: {
                "Authorization": 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImE3YTNlOWFjNDRlNDI4OGE2NDc0ZWMxZDI4MjJkMTRlIiwidHlwIjoiSldUIn0.eyJuYmYiOjE1NjM4MDI0MjMsImV4cCI6MTU2MzgwNjAyMywiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4NTAwIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3Q6ODUwMC9yZXNvdXJjZXMiLCJnY2VudGVyIiwiSWRlbnRpdHlTZXJ2ZXJBcGkiLCJpbWdlciIsImxjZW50ZXIiXSwiY2xpZW50X2lkIjoiNzI1QTc4RTY1REQxNDY1OEE4OTQ3RjY4QzI3QkQzMjIiLCJzdWIiOiJTSlhKMTY3REY5QkQiLCJhdXRoX3RpbWUiOjE1NjM4MDI0MjMsImlkcCI6ImxvY2FsIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJTSlhKMTY3REY5QkQiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA5LzA5L2lkZW50aXR5L2NsYWltcy9hY3RvciI6IiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL21vYmlsZXBob25lIjoiMTM5MDAwMDAwMDEiLCJpZGNhcmQiOiI1MTA1MjQxOTcyMTAxMDAxNTgiLCJvcmdhbml6YXRpb25jb2RlIjoiIiwiZGlzcGxheU5hbWUiOiLlvKDli4ciLCJqdGkiOiJiMzZlZWEzNDFmYjUxMThiYjg4OWU1MWFhYjlhYjRmMCIsInNjb3BlIjpbIm9wZW5pZCIsInByb2ZpbGUiLCJnY2VudGVyIiwiSWRlbnRpdHlTZXJ2ZXJBcGkiLCJpbWdlciIsImxjZW50ZXIiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.VVMcEgtElrifcO269fEJ1BkBY4CYl_m5X14TZW654xfujxLze-cCjXWmJFArljiln9garOW7owuQAO6DwkoqrL_5syzNN-yzkG0DbOXvy8l6264eXnmVMdGdCQewpzZX-DfUw4mEHoMlxvtEtZ0mpayTPyxEwEcLaMx5bfYhMhTcBoRAo7pctFVTvQiEGurd93bMlPhMzw0rWukWLk3CtuX8rNSN6Qe5H0BA9im3WCHMS8cTMDIy-QqkCDHZo5bWoJUJT6aOrZtXgRMUuvN16785pvRGz3no2OYZfY8ZLQAufyMjwkaLb9ehOuR8IrZh3JwSSA18KvMU0089FTht1w'
            },
            crossDomain: true,
            before: function(obj) {
                layer_load();
            },
            done: function(res) {
                if (typeof config.done === 'function') {
                    done(res);
                }
            },
            error: function() {
                if (typeof config.error === 'function') {
                    layer.msg('上传失败！');
                }
            }
        });
    }
};