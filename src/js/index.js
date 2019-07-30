//Serv.ChkLogin();


layui.use(['form', 'element'], function() {
    var element = layui.element,
        form = layui.form;

    Serv.Get('uc/company/query', {}, window.globCache.setCompany);
    Serv.Get('uc/department/query', {}, window.globCache.setDepartment);
    Serv.Get('uc/job/query', {}, window.globCache.setJobs);
    Serv.Get('gc/workerinfield/getdata?type=1,3,4,5,6', {}, function(result) {
        window.globCache.setArrival(result.workerInField);
        window.globCache.setEducation(result.education);
        window.globCache.setProperties(result.properties);
        window.globCache.setRelations(result.socialRelations);
        window.globCache.setRecruitment(result.recruitmentSource);
    });
    Serv.Post('gc/budget/get', {
        'search': ''
    }, window.globCache.setBudgets);
    var UserToken = globCache.getUserToken();
    $('#account').html(UserToken.displayName + '-' + UserToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone']);

    //菜单
    var navCacheData = window.globCache.getModules();
    if (navCacheData.length > 0) {
        $('#LAY-system-side-menu').html(navBar(navCacheData));
        element.render(); //初始化页面元素
    }

    // getAuthStrategy();
    // //获取可访问的资源
    // function getAuthStrategy() {
    //     Serv.Get('gc/usersession/getauthstrategy/' + window.globCache.getEmployee().id, {}, function(result) {
    //         if (result) {
    //             window.globCache.setModules(result.modules);
    //             window.globCache.setElements(result.elements);

    //             $('#LAY-system-side-menu').html(navBar(result.modules));
    //             element.render(); //初始化页面元素
    //         } else {
    //             layer_alert('获取数据失败');
    //         }
    //     }, false);
    // }

    //定时器
    var timer = setInterval(checkToken, 60000);
    // var timer = setInterval(checkToken, 60000);

    function checkToken() {
        var tokenJson = Serv.GetTokenJson();
        if (tokenJson == null) {
            //跳转到Login
            clearInterval(timer);
            top.location.href = 'login.html';
        } else {
            var nowTime = new Date().getTime();
            var expiresTime = parseInt(tokenJson.expires_in);
            if (expiresTime < nowTime) {
                clearInterval(timer);
                refreshToken(tokenJson.refresh_token);
            }
        }
    }

    function refreshToken(value) {
        Serv.Post('uc/connect/token', {
            grant_type: verifyModel.refresh.grant_type,
            client_id: verifyModel.refresh.client_id,
            client_secret: verifyModel.refresh.client_secret,
            refresh_token: value
        }, function(result) {

        });
    }


    //需要渲染左侧菜单的html
    function navBar(navData) {

        //图标字符转换为html
        var convertIconHtml = function(icon) {
            var openTitle = '';
            if (icon) {
                openTitle += '<i class="layui-icon ' + icon + '"></i>';
            }
            return openTitle;
        }

        //递归获取子菜单html
        var getChildrenHtml = function(item) {
            var ulHtml = '<li class="layui-nav-item">';

            if (item.children != undefined && item.children.length > 0) {
                ulHtml += '<a title="' + item.item.name + '" href="javascript:;">';
                ulHtml += convertIconHtml(item.item.iconName);
                ulHtml += '<cite>' + item.item.name + '</cite>';
                ulHtml += '<span class="layui-nav-more"></span>';
                ulHtml += '</a>';

                ulHtml += '<dl class="layui-nav-child">';
                for (var i = 0; i < item.children.length; i++) {
                    ulHtml += getChildrenHtml2(item.children[i]);
                }
                ulHtml += "</dl>";
            } else {
                if (item.item.url) {
                    ulHtml += '<a title="' + item.item.name + '" lay-href="' + item.item.url + '">';
                } else {
                    ulHtml += '<a title="' + item.item.name + '" href="javascript:;">';
                }
                ulHtml += convertIconHtml(item.item.iconName);
                ulHtml += '<cite>' + item.item.name + '</cite></a>';
            }
            ulHtml += '</li>';
            return ulHtml;
        }
        var getChildrenHtml2 = function(item) {
            var ulHtml = '<dd>';

            if (item.children != undefined && item.children.length > 0) {
                ulHtml += '<a title="' + item.item.name + '" href="javascript:;">';
                ulHtml += convertIconHtml(item.item.iconName);
                ulHtml += '<cite>' + item.item.name + '</cite>';
                ulHtml += '<span class="layui-nav-more"></span>';
                ulHtml += '</a>';

                ulHtml += '<dl class="layui-nav-child">';
                for (var i = 0; i < item.children.length; i++) {
                    ulHtml += getChildrenHtml2(item.children[i]);
                }
                ulHtml += "</dl>";
            } else {
                if (item.item.url) {
                    ulHtml += '<a title="' + item.item.name + '" lay-href="' + item.item.url + '">';
                } else {
                    ulHtml += '<a title="' + item.item.name + '" href="javascript:;">';
                }
                ulHtml += convertIconHtml(item.item.iconName);
                ulHtml += '<cite>' + item.item.name + '</cite></a>';
            }
            ulHtml += '</dd>';
            return ulHtml;
        }

        //递归获取子菜单html
        // var getChildrenHtml = function(item) {
        //     var ulHtml = '<li class="layui-nav-item">';

        //     if (item.children != undefined && item.children.length > 0) {

        //         ulHtml += '<a title="' + item.item.name + '" href="javascript:;">';

        //         ulHtml += convertIconHtml(item.item.iconName);

        //         ulHtml += '<cite>' + item.item.name + '</cite>';
        //         ulHtml += '<span class="layui-nav-more"></span>';
        //         ulHtml += '</a>';
        //         ulHtml += '<ul class="layui-nav-child">';

        //         for (var i = 0; i < item.children.length; i++) {
        //             ulHtml += getChildrenHtml(item.children[i]);
        //         }

        //         ulHtml += "</ul>";

        //     } else {
        //         if (item.item.url) {
        //             ulHtml += '<a title="' + item.item.name + '" lay-href="' + item.item.url + '">';
        //         } else {
        //             ulHtml += '<a title="' + item.item.name + '" href="javascript:;">';
        //         }
        //         ulHtml += convertIconHtml(item.item.iconName);
        //         ulHtml += '<cite>' + item.item.name + '</cite></a>';
        //     }
        //     ulHtml += '</li>';
        //     return ulHtml;
        // }

        var ulHtml = '';
        for (var i = 0; i < navData.length; i++) {
            ulHtml += getChildrenHtml(navData[i]);
        }
        return ulHtml;
    }

    //退出
    $('#logout').on('click', function() {
        layer.confirm(
            '确定退出系统吗?', {
                title: '确定信息',
                resize: false,
                btn: ['确定', '取消'],
                btnAlign: 'c',
                closeBtn: 0,
                anim: 0,
                icon: 3,
            },
            function(index) {
                window.globCache.clear();
                Serv.Get('uc/account/signout', {}, window.globCache.setJobs);
                layer.close(index);
                window.location.href = 'login.html';
            }
        );
    });

});