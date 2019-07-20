function Pager(table, title, tblId, toobarId, colData, action, searchFunc, parseFunc, toolBarFunc, toolFunc, doneFunc = null, height = 'full-300') {

    var tbl = table.render({
        elem: '#' + tblId,
        url: Serv.GetUrl(action), //数据接口
        method: "POST",
        where: function() {
            if (searchFunc) {
                return searchFunc();
            }
        }(),
        limits: [20, 30, 40, 50],
        limit: 20,
        title: title,
        headers: Serv.GetHeaders(),
        page: true, //开启分页
        toolbar: '#' + toobarId, //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
        //totalRow: true, //开启合计行
        even: true,
        height: height,
        cols: colData,
        parseData: function(res) { //res 即为原始返回的数据
            if (res && res["items"].length > 0) {
                if (parseFunc) {
                    res["items"] = parseFunc(res["items"]);
                }
                return {
                    "code": 0,
                    "msg": "",
                    "count": res["totalCount"],
                    "data": res["items"]
                };
            } else {
                return {
                    "code": 404,
                    "msg": "未找到相关数据",
                    "count": 0,
                    "data": []
                }
            }
        },
        done: doneFunc
    });

    if (searchFunc) {
        tbl.search = function() {

            tbl.reload({
                where: searchFunc(),
                page: {
                    curr: 1
                } //重新从第 1 页开始                    
            });
        }
    }

    tbl.refresh = function() {
        tbl.reload({
            page: {
                curr: 1
            } //重新从第 1 页开始                    
        });
    };

    //监听头工具栏事件
    if (toolBarFunc != null) {
        table.on('toolbar(' + tblId + ')', function(obj) {
            // var checkStatus = table.checkStatus(obj.config.id),
            // data = checkStatus.data; //获取选中的数据
            toolBarFunc(obj);
        });
    }
    if (toolFunc != null) { //监听行工具事件         
        table.on('tool(' + tblId + ')', function(obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            //console.log(obj.event);
            layEvent = obj.event
            data = obj.data;
            toolFunc(layEvent, data, obj); // 注：返回obj参数方便表格删除行
        });
    }
    return tbl;
}

function Pager2(table, title, tblId, toobarId, colData, action, searchFunc, parseFunc, toolBarFunc, toolFunc, doneFunc = null, height = 'full-300') {
    var tbl = table.render({
        elem: '#' + tblId,
        url: Serv.GetUrl(action), //数据接口
        method: "POST",
        where: function() {
            if (searchFunc) {
                return searchFunc();
            }
        }(),
        title: title,
        headers: Serv.GetHeaders(),
        page: true, //开启分页
        toolbar: '#' + toobarId, //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
        //totalRow: true, //开启合计行
        even: true,
        height: height,
        cols: colData,
        parseData: function(res) { //res 即为原始返回的数据
            res = res.data;
            if (res && res["items"].length > 0) {
                if (parseFunc) {
                    res["items"] = parseFunc(res["items"]);
                }
                return {
                    "code": 0,
                    "msg": "",
                    "count": res["totalCount"],
                    "data": res["items"]
                };
            } else {
                return {
                    "code": 404,
                    "msg": "未找到相关数据",
                    "count": 0,
                    "data": []
                }
            }
        },
        done: doneFunc
    });

    if (searchFunc) {
        tbl.search = function() {

            tbl.reload({
                where: searchFunc(),
                page: {
                    curr: 1
                } //重新从第 1 页开始                    
            });
        }
    }

    tbl.refresh = function() {
        tbl.reload({
            page: {
                curr: 1
            } //重新从第 1 页开始                    
        });
    };

    //监听头工具栏事件
    if (toolBarFunc != null) {
        table.on('toolbar(' + tblId + ')', function(obj) {
            // var checkStatus = table.checkStatus(obj.config.id),
            // data = checkStatus.data; //获取选中的数据
            toolBarFunc(obj);
        });
    }
    if (toolFunc != null) { //监听行工具事件         
        table.on('tool(' + tblId + ')', function(obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            //console.log(obj.event);
            layEvent = obj.event
            data = obj.data;
            toolFunc(layEvent, data, obj); // 注：返回obj参数方便表格删除行
        });
    }
    return tbl;
}