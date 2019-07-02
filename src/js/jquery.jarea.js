(function ($) {
    var methods = {
        init: function (options) {
            var defaults = {
                "width": "auto",
                "borderColor": "#e6e6e6", //文本边框的色值
                "arrowColor": "#c2c2c2", //箭头颜色
                "listBdColor": "#c2c2c2", //下拉框父元素ul的border色值
                "hoverColor": "#5FB878",
                "fontSize": "14px", //字体大小
            };
            var settings = $.extend(defaults, options);
            return this.each(function () {
                var $this = this;
                $('<div class="pick-area"></div>').insertBefore($this);
                var $area = $($this).prev();
                settings.getVal = function () {
                    var hidden = $($area).find('input[type="hidden"][class="pick-area"]');
                    $($this).attr('data-areacode', hidden.attr('data-areacode')).val(hidden.val());
                }
                $($area).pickArea(settings);
            });
        },
        destroy: function (options) {
            return $(this).each(function () {
                var $this = $(this);
                $this.removeData('area');
            });
        },
        val: function () {
            return this.each(function () {
                var $this = $(this);
                var $area = $($this).prev();
                var $hidden = $($area).find('input[type="hidden"][class="pick-area"]');
                var value = $this.val(),
                    areacode = $this.attr('data-areacode');
                $hidden.attr('data-areacode', !areacode ? '' : areacode).val(value);
                if (value != null && value != '') {
                    var array = value.split('/');
                    if (array.length > 0) {
                        var spans = $hidden.parent().find('span');
                        spans.css('display', 'none').next().css('display', 'none');
                        $(array).each(function (i, item) {
                            $(spans[i]).html(item).css('display', 'inline-block');
                            if (array.length > 1) {
                                $(spans[i]).next().css('display', 'inline-block');
                            }
                        });
                    }
                }

            });
        }
    };

    $.fn.jarea = function () {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof (method) == 'object' || !method) {
            method = methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.jarea');
            return this;
        }
        return method.apply(this, arguments);
    };

})(jQuery);