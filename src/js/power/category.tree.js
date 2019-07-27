//初始化Tree目录结构
function initCategoryHtml(parent, num) {
    $(parent).find('li.layer-' + num).each(function (i) {
        var liObj = $(this);
        var nextNum = num + 1;
        if (liObj.next('.layer-' + nextNum).length > 0) {
            initCategoryHtml(parent, nextNum);
            var newObj = $('<ul></ul>').appendTo(liObj);
            moveCategoryHtml(liObj, newObj, nextNum);
        }
    });
}
function moveCategoryHtml(liObj, newObj, num) {
    if (liObj.next('.layer-' + num).length > 0) {
        liObj.next('.layer-' + num).appendTo(newObj);
        moveCategoryHtml(liObj, newObj, num);
    }
}

$.fn.initCategoryTree = function (isOpen) {
    var fCategoryTree = function (parentObj) {
        //遍历所有的UL
        parentObj.find("ul").each(function (i) {
            //遍历UL第一层LI
            $(this).children("li").each(function () {
                var liObj = $(this);
                //判断是否有子菜单和设置距左距离
                var parentIconLenght = liObj.parent().parent().children(".tbody").children(".index").children(".icon").length; //父节点的左距离
                var indexObj = liObj.children(".tbody").children(".index"); //需要树型的目录列
                //设置左距离
                if (parentIconLenght == 0) {
                    parentIconLenght = 1;
                }
                for (var n = 0; n <= parentIconLenght; n++) { //注意<=
                    $('<i class="icon"></i>').prependTo(indexObj); //插入到index前面
                }
                //设置按钮和图标
                indexObj.children(".icon").last().addClass("iconfont icon-folder"); //设置最后一个图标
                //如果有下级菜单
                if (liObj.children("ul").length > 0) {
                    //如果要求全部展开
                    if (isOpen) {
                        indexObj.children(".icon").eq(-2).addClass("expandable iconfont icon-open"); //设置图标展开状态
                    } else {
                        indexObj.children(".icon").eq(-2).addClass("expandable iconfont icon-close"); //设置图标闭合状态
                        liObj.children("ul").hide(); //隐藏下级的UL
                    }
                    //绑定单击事件
                    indexObj.children(".expandable").click(function () {
                        //如果菜单已展开则闭合
                        if ($(this).hasClass("icon-open")) {
                            //设置自身的右图标为+号
                            $(this).removeClass("icon-open");
                            $(this).addClass("icon-close");
                            //隐藏自身父节点的UL子菜单
                            $(this).parent().parent().parent().children("ul").slideUp(300);
                        } else {
                            //设置自身的右图标为-号
                            $(this).removeClass("icon-close");
                            $(this).addClass("icon-open");
                            //显示自身父节点的UL子菜单
                            $(this).parent().parent().parent().children("ul").slideDown(300);
                        }
                    });
                } else {
                    indexObj.children(".icon").eq(-2).addClass("iconfont icon-csac");
                }
            });
            //显示第一个UL
            if (i == 0) {
                $(this).show();
                //展开第一个菜单
                if ($(this).children("li").first().children("ul").length > 0) {
                    $(this).children("li").first().children(".tbody").children(".index").children(".expandable").removeClass("icon-close");
                    $(this).children("li").first().children(".tbody").children(".index").children(".expandable").addClass("icon-open");
                    $(this).children("li").first().children("ul").show();
                }
            }
        });
    };
    return $(this).each(function () {
        fCategoryTree($(this));
    });
}