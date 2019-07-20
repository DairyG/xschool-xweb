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
    ServiceUrl: "http://114.116.54.157:8000/api/v1/",
    // ServiceUrl: "http://localhost:8000/api/v1/",
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
                layer.closeAll('loading');
                console.log(data);
                // layer.closeAll();
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

    }
};