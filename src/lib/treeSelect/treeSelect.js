layui.define(['form', 'jquery'], function(exports) { //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    var jQuery = layui.jquery,
        $ = jQuery,
        form = layui.form,
        _MOD = 'treeSelect',
        trss = {},
        TreeSelect = function() {
            this.v = '1.0.4';
        };

    TreeSelect.prototype.render = function(options) {
        var elem = options.elem,
            // 请求地址
            url = options.url,
            // 请求方式
            type = options.type === undefined ? 'GET' : options.type,
            args = options.args || {},
            // 节点点击回调
            click = options.click,
            // 渲染成功后的回调函数
            success = options.success,
            // 占位符（提示信息）
            placeholder = options.placeholder === undefined ? '请选择' : options.placeholder,
            //input高度
            height = options.height ? options.height : '',
            // 唯一id
            tmp = new Date().getTime(),
            DATA = {},
            selected = 'layui-form-selected',
            TREE_OBJ = undefined,
            TREE_INPUT_ID = 'treeSelect-input-' + tmp,
            TREE_INPUT_CLASS = 'layui-treeselect',
            TREE_SELECT_ID = 'layui-treeSelect-' + tmp,
            TREE_SELECT_CLASS = 'layui-treeSelect',
            TREE_SELECT_TITLE_ID = 'layui-select-title-' + tmp,
            TREE_SELECT_TITLE_CLASS = 'layui-select-title',
            TREE_SELECT_BODY_ID = 'layui-treeSelect-body-' + tmp,
            TREE_SELECT_BODY_CLASS = 'layui-treeSelect-body',
            TREE_SELECT_SEARCHED_CLASS = 'layui-treeSelect-search-ed';

        var a = {
            init: function() {
                $.ajax({
                    url: Serv.ServiceUrl + url,
                    type: type,
                    dataType: 'json',
                    data: args,
                    headers: Serv.GetHeaders(),
                    success: function(d) {
                        DATA = d;
                        a.hideElem().input().toggleSelect().preventEvent();
                        $.fn.zTree.init($('#' + TREE_SELECT_BODY_ID), a.setting(), d);
                        TREE_OBJ = $.fn.zTree.getZTreeObj(TREE_SELECT_BODY_ID);
                        if (success) {
                            var obj = {
                                treeId: TREE_SELECT_ID,
                                data: d
                            };
                            success(obj);

                            var nodes = TREE_OBJ.getNodes();
                            if (nodes.length > 0) {
                                TREE_OBJ.expandNode(nodes[0], true);
                            }
                        }
                    }
                });
                return a;
            },
            // 检查input是否有默认值
            checkDefaultValue: function() {

            },
            setting: function() {
                var setting = {
                    data: {
                        key: {
                            name: 'name',
                            title: 'name'
                        },
                        simpleData: {
                            enable: true,
                            idKey: 'id',
                            pIdKey: 'pid',
                            rootPId: '0'
                        }
                    },
                    callback: {
                        onClick: a.onClick,
                        onExpand: a.onExpand,
                        onCollapse: a.onCollapse
                    }
                };
                return setting;
            },
            ztreeCallBack: {

            },
            onCollapse: function() {
                a.focusInput();
            },
            onExpand: function() {
                a.focusInput();
            },
            focusInput: function() {
                $('#' + TREE_INPUT_ID).focus();
            },
            onClick: function(event, treeId, treeNode) {
                var name = treeNode.name,
                    id = treeNode.id,
                    $input = $('#' + TREE_SELECT_TITLE_ID + ' input');
                $input.val(name);
                $(elem).attr('value', id).val(id);
                $('#' + TREE_SELECT_ID).removeClass(selected);

                if (click) {
                    var obj = {
                        data: DATA,
                        current: treeNode,
                        treeId: TREE_SELECT_ID
                    };
                    click(obj);
                }
                return a;
            },
            hideElem: function() {
                $(elem).hide();
                return a;
            },
            input: function() {
                var readonly = 'readonly';
                var selectHtml = '<div class="' + TREE_SELECT_CLASS + ' layui-unselect layui-form-select" id="' + TREE_SELECT_ID + '">' +
                    '<div class="' + TREE_SELECT_TITLE_CLASS + '" id="' + TREE_SELECT_TITLE_ID + '">' +
                    ' <input type="text" id="' + TREE_INPUT_ID + '" placeholder="' + placeholder + '" value="" ' + readonly + ' class="layui-input layui-unselect" ' + (height ? 'style="height: ' + height + 'px"' : '') + ' >' +
                    '<i class="layui-edge"></i>' +
                    '</div>' +
                    '<div class="layui-anim layui-anim-upbit" style="">' +
                    '<div class="' + TREE_SELECT_BODY_CLASS + ' ztree" id="' + TREE_SELECT_BODY_ID + '"></div>' +
                    '</div>' +
                    '</div>';
                $(elem).parent().append(selectHtml);
                return a;
            },
            /**
             * 展开/折叠下拉框
             */
            toggleSelect: function() {
                var item = '#' + TREE_SELECT_TITLE_ID;
                a.event('click', item, function(e) {
                    var $select = $('#' + TREE_SELECT_ID);
                    if ($select.hasClass(selected)) {
                        $select.removeClass(selected);
                        $('#' + TREE_INPUT_ID).blur();
                    } else {
                        // 隐藏其他picker
                        $('.layui-form-select').removeClass(selected);
                        // 显示当前picker
                        $select.addClass(selected);
                    }
                    e.stopPropagation();
                });
                $(document).click(function() {
                    var $select = $('#' + TREE_SELECT_ID);
                    if ($select.hasClass(selected)) {
                        $select.removeClass(selected);
                        $('#' + TREE_INPUT_ID).blur();
                    }
                });
                return a;
            },
            checkNodes: function(nodes) {
                for (var i = 0; i < nodes.length; i++) {
                    var o = nodes[i],
                        pid = o.parentTId,
                        tid = o.tId;
                    if (pid !== null) {
                        // 获取父节点
                        $('#' + pid).addClass(TREE_SELECT_SEARCHED_CLASS);
                        var pNode = TREE_OBJ.getNodesByParam("tId", pid, null);
                        TREE_OBJ.expandNode(pNode[0], true, false, true);
                    }
                    $('#' + tid).addClass(TREE_SELECT_SEARCHED_CLASS);
                }
            },
            // 阻止Layui的一些默认事件
            preventEvent: function() {
                var item = '#' + TREE_SELECT_ID + ' .layui-anim';
                a.event('click', item, function(e) {
                    e.stopPropagation();
                });
                return a;
            },
            event: function(evt, el, fn) {
                $('body').on(evt, el, fn);
            }
        };
        a.init();
        return new TreeSelect();
    };

    /**
     * 重新加载trerSelect
     * @param filter
     */
    TreeSelect.prototype.refresh = function(filter) {
        var treeObj = obj.treeObj(filter);
        treeObj.reAsyncChildNodes(null, "refresh");
    };

    /**
     * 选中节点，因为tree是异步加载，所以必须在success回调中调用checkNode函数，否则无法获取生成的DOM元素
     * @param filter lay-filter属性
     * @param id 选中的id
     */
    TreeSelect.prototype.checkNode = function(filter, id) {
        var o = obj.filter(filter),
            treeInput = o.find('.layui-select-title input'),
            treeObj = obj.treeObj(filter),
            node = treeObj.getNodeByParam("id", id, null),
            name = node.name;
        treeInput.val(name);
        o.find('a[treenode_a]').removeClass('curSelectedNode');
        obj.get(filter).val(id).attr('value', id);
        treeObj.selectNode(node);
    };

    /**
     * 销毁组件
     */
    TreeSelect.prototype.destroy = function(filter) {
        var o = obj.filter(filter);
        o.remove();
        obj.get(filter).show();
    }

    /**
     * 获取zTree对象，可调用所有zTree函数
     * @param filter
     */
    TreeSelect.prototype.zTree = function(filter) {
        return obj.treeObj(filter);
    };

    var obj = {
        get: function(filter) {
            if (!filter) {
                layui.hint().error('filter 不能为空');
            }
            return $('*[lay-filter=' + filter + ']');
        },
        filter: function(filter) {
            var tf = obj.get(filter),
                o = tf.next();
            return o;
        },
        treeObj: function(filter) {
            var o = obj.filter(filter),
                treeId = o.find('.layui-treeSelect-body').attr('id'),
                tree = $.fn.zTree.getZTreeObj(treeId);
            return tree;
        }
    };

    //输出接口
    var mod = new TreeSelect();
    exports(_MOD, mod);
});