(function(execute){
		if(typeof define==='function'&&define.amd){
			define(['jquery'],execute);
		}else if(typeof exports==='object'){
			execute(require('jquery'));
		}else{
			execute(jQuery);
		}})
(function($){
	'use strict';
	var defaults={"width":"300px","hoverColor":"#7894D4","paddingLeft":"8px","arrowRight":"8px","maxHeight":"220px"};
	var pluginName='pickArea',area=areaJson.data,picknum=0;
	function Plugin(element,options){
		this.ele=$(element);
		this.identity=null;
		this.format=null;
		this.config=$.extend({},defaults,options);
		this.init();
	}
Plugin.prototype = {
    init: function() {
        this.render();
    },
    render: function() {
        var _this = this;
        var htmlStr = '';
        var format = this.config.format;
        var prename = this.ele.attr("name");
        this.identity = this.getRandomStr();
        this.ele.addClass(this.identity);
        var setFormat = null;
        var contentStr = null;
        if (format && format != "") {
            setFormat = format;
        } else if ((prename && prename != "" && !format) || (prename && prename != "" && format && format == "")) {
            setFormat = prename;
        } else {
            contentStr = '<div class="pick-show">' + 
							'<input type="hidden" value="" data-areacode="" class="pick-area" readonly/>' + 
							'<span class="pick-province">请选择省</span><i>/</i>' + 
							'<span class="pick-city">请选择市</span><i>/</i>' + 
							'<span class="pick-county">请选择县</span><i>/</i>' + 
							'<span class="pick-town">请选择镇</span>' + 
							'<em class="pick-arrow"></em>' + 
							'</div>' + 
							'<ul class="pick-list">' + 
							'</ul>';
            this.format = "p/c/c/t";
        }
        if (setFormat) {
            var slash = 0,
            arrFor = setFormat.split(""),
            strSpan = "",
            areaArr = setFormat.split("/");
            for (var format_i = 0; format_i < arrFor.length; format_i++) {
                if (arrFor[format_i] == "/") {
                    slash++;
                }
            }
            slash=3;
            if(areaArr.length==1){
                areaArr.push("请选择市");
            }
            if(areaArr.length==2){
                areaArr.push("请选择县");
            }
            if(areaArr.length==3){
                areaArr.push("请选择镇");
            }
            if (setFormat.match("province")) {
                if (slash == 0) {
                    strSpan = '<span class="pick-province">请选择省</span>';
                    this.format = "p";
                } else if (slash == 1) {
                    strSpan = '<span class="pick-province">请选择省</span>' + '<i>/</i>' + '<span class="pick-city">请选择市</span>';
                    this.format = "p/c";
                } else if (slash == 2) {
                    strSpan = '<span class="pick-province">请选择省</span>' + '<i>/</i>' + '<span class="pick-city">请选择市</span>' + '<i>/</i>' + '<span class="pick-county">请选择县</span>';
                    this.format = "p/c/c";
                } else if (slash == 3) {
                    strSpan = '<span class="pick-province">请选择省</span>' + '<i>/</i>' + '<span class="pick-city">请选择市</span>' + '<i>/</i>' + '<span class="pick-county">请选择县</span>'+ '<i>/</i>'+'<span class="pick-town">请选择镇</span>';
                    this.format = "p/c/c/t";
                }
                contentStr = '<div class="pick-show">' + '<input type="hidden" value="" class="pick-area" data-areacode="" readonly/>' + strSpan + '<em class="pick-arrow"></em>' + '</div>' + '<ul class="pick-list">' + '</ul>';
            } else {
                if (slash == 0) {
                    strSpan = '<span class="pick-province">' + areaArr[0] + '</span>';
                    this.format = "p";
                } else if (slash == 1) {
                    strSpan = '<span class="pick-province">' + areaArr[0] + '</span>' + '<i>/</i>' + '<span class="pick-city">' + areaArr[1] + '</span>';
                    this.format = "p/c";
                } else if (slash == 2) {
                    strSpan = '<span class="pick-province">' + areaArr[0] + '</span>' + '<i>/</i>' + '<span class="pick-city">' + areaArr[1] + '</span>' + '<i>/</i>' + '<span class="pick-county">' + areaArr[2] + '</span>';
                    this.format = "p/c/c";
                } else if (slash == 3) {
                    strSpan = '<span class="pick-province">' + areaArr[0] + '</span>' + '<i>/</i>' + '<span class="pick-city">' + areaArr[1] + '</span>' + '<i>/</i>' + '<span class="pick-county">' + areaArr[2] + '</span>'+ '<i>/</i>' + '<span class="pick-town">' + areaArr[3] + '</span>';
                    this.format = "p/c/c/t";
                }
                contentStr = '<div class="pick-show">' + '<input type="hidden" value="' + setFormat + '" class="pick-area" data-areacode="" readonly/>' + strSpan + '<em class="pick-arrow"></em>' + '</div>' + '<ul class="pick-list">' + '</ul>';
            }
        }
        this.ele.append(contentStr);
        if (setFormat) {
            if (!setFormat.match("province")) {
                this.initAreaCode(slash, areaArr);
            }
        }
        if (picknum == 1) {
            $("body").append('<input type="hidden" class="pick-area-hidden" value="">');
            $("body").append('<input type="hidden" class="pick-area-dom" value="">');
        }
        if (this.config.paddingLeft) {
            this.ele.find(".pick-show").css({
                "padding-left": parseInt(this.config.paddingLeft) + "px",
                "padding-right": parseInt(this.config.arrowRight) + 16 + "px"
            });
        }
        if (this.config.arrowRight) {
            this.ele.find(".pick-arrow").css("right", parseInt(this.config.arrowRight) + "px");
        }
        if (this.config.width) {
            this.ele.css({
                "width": parseInt(this.config.width) + "px"
            });
            this.ele.find(".pick-list").css({
                "width": parseInt(this.config.width) - 2 + "px"
            });
            var checkNum = null;
            if (this.format == "p/c/c/t") {
                checkNum = 4;
            } else if (this.format == "p/c/c") {
                checkNum = 3;
            } else if (this.format == "p/c") {
                checkNum = 2;
            } else if (this.format == "p") {
                checkNum = 1;
            }
            this.ele.find(".pick-show span").css({
                "max-width": (parseInt(this.config.width) - parseInt(this.config.paddingLeft) - parseInt(this.config.arrowRight) - 16 - this.ele.find("i").outerWidth() * (checkNum - 1) - 12 * checkNum - 10) / checkNum
            })
        }
        if (this.config.display) {
            this.ele.css({
                "display": this.config.display
            });
        }
        if (this.config.float) {
            this.ele.css({
                "float": this.config.float
            });
        }
        if (this.config.arrowColor) {
            this.ele.find(".pick-arrow").css({
                "border-color": this.config.arrowColor + " transparent transparent transparent"
            });
        }
        if (this.config.borderColor) {
            this.ele.find(".pick-show").css("border-color", this.config.borderColor);
        }
        if (this.config.listBdColor) {
            this.ele.find(".pick-list").css("border-color", this.config.listBdColor);
        }
        if (this.config.color) {
            this.ele.find(".pick-show span,.pick-show i").css("color", this.config.color);
        }
        if (this.config.height) {
            this.ele.find(".pick-show").css({
                "height": parseInt(this.config.height) + "px",
                "line-height": parseInt(this.config.height) + "px"
            });
            this.ele.find(".pick-list").css({
                "line-height": parseInt(this.config.height) + "px"
            });
            this.ele.find(".pick-arrow").css({
                "top": Math.floor((parseInt(this.config.height) - 8) / 2) + "px"
            });
            this.ele.find(".pick-show span").css({
                "margin-top": Math.floor((parseInt(this.config.height) - 24) / 2) + "px"
            });
        }
        if (this.config.fontSize) {
            this.ele.css({
                "font-size": parseInt(this.config.fontSize) + "px"
            })
        }
        if (this.config.maxHeight) {
            this.ele.find(".pick-list").css({
                "max-height": parseInt(this.config.maxHeight) + "px"
            })
        }
        $("." + this.identity).on("mouseenter", ".pick-list li,.pick-show span",
        function() {
            $(this).css("background", _this.config.hoverColor);
        }).on("mouseleave", ".pick-list li,.pick-show span",
        function() {
            if (!$(this).attr("class").match("pressActive")) {
                if (!$(this).hasClass("pick-selectedLi")) {
                    $(this).css("background", "#fff");
                }
            }
        });
        this.ele.find(".pick-province").click(function(e) {
            var e = e || event;
            e.stopPropagation();
            $(this).parents("body").find(".pick-area span").removeClass("pressActive").css("background", "#fff");
            $(this).parents("body").find(".pick-list").hide();
            $(this).addClass("pressActive").css("background", _this.config.hoverColor).siblings("span").removeClass("pressActive").css("background", "#fff");
            _this.createProvince(e);
        });
        this.ele.find(".pick-city").click(function(e) {
            var e = e || event;
            e.stopPropagation();
            if (_this.ele.find(".pick-province").html() != "请选择省") {
                $(this).parents("body").find(".pick-area span").removeClass("pressActive").css("background", "#fff");
                $(this).parents("body").find(".pick-list").hide();
                $(this).addClass("pressActive").css("background", _this.config.hoverColor).siblings("span").removeClass("pressActive").css("background", "#fff");
                _this.createCity(e);
            } else {
                $("body").find(".pick-area").not("." + _this.identity).find(".pick-list").hide();
                $("body").find(".pick-area").not("." + _this.identity).find("span").removeClass("pressActive").css("background", "#fff");
            }
        });
        this.ele.find(".pick-county").click(function(e) {
            var e = e || event;
            e.stopPropagation();
            if (_this.ele.find(".pick-city").html() != "请选择市") {
                $(this).parents("body").find(".pick-area span").removeClass("pressActive").css("background", "#fff");
                $(this).parents("body").find(".pick-list").hide();
                $(this).addClass("pressActive").css("background", _this.config.hoverColor).siblings("span").removeClass("pressActive").css("background", "#fff");
                _this.createCounty(e);
            } else {
                $("body").find(".pick-area").not("." + _this.identity).find(".pick-list").hide();
                $("body").find(".pick-area").not("." + _this.identity).find("span").removeClass("pressActive").css("background", "#fff");
            }
        });
		this.ele.find(".pick-town").click(function(e) {
		    var e = e || event;
		    e.stopPropagation();
		    if (_this.ele.find(".pick-county").html() != "请选择县") {
		        $(this).parents("body").find(".pick-area span").removeClass("pressActive").css("background", "#fff");
		        $(this).parents("body").find(".pick-list").hide();
		        $(this).addClass("pressActive").css("background", _this.config.hoverColor).siblings("span").removeClass("pressActive").css("background", "#fff");
		        _this.createTown(e);
		    } else {
		        $("body").find(".pick-area").not("." + _this.identity).find(".pick-list").hide();
		        $("body").find(".pick-area").not("." + _this.identity).find("span").removeClass("pressActive").css("background", "#fff");
		    }
		});
        this.ele.find(".pick-show").click(function(e) {
            var e = e || event;
            e.stopPropagation();
            if ($(this).next(".pick-list").css("display") == "block") {
                _this.ele.find(".pressActive").removeClass("pressActive").css("background", "#fff");
                _this.ele.find(".pick-list").html("").hide();
            } else {
                $(".pick-list").scrollTop(0);
                $(this).parents("body").find(".pick-area span").removeClass("pressActive").css("background", "#fff");
                $(this).parents("body").find(".pick-list").hide();
                _this.ele.find(".pick-province").addClass("pressActive").css("background", _this.config.hoverColor);
                _this.createProvince(e);
            }
        })
    },
    initAreaCode: function(slash, areaArr) {
        var _this = this,
        cityArr = null,
        countyArr = null,
		townArr = null;
        if (slash == 0) {
            setProAreaCode()
        } else if (slash == 1) {
            setProCityAreaCode()
        } else if (slash == 2) {
            setProCityCountyAreaCode()
        } else if (slash == 3) {
            setProCityCountyTownAreaCode()
        }
        function setProAreaCode() {
            for (var i = 0; i < area.length; i++) {
                if (area[i].name.indexOf(areaArr[0]) != -1) {
                    _this.ele.find("input:hidden.pick-area").attr("data-areacode", area[i].id);
                    if (slash == 1 || slash == 2 || slash == 3) {
                        cityArr = area[i].cities;
                    }
                }
            }
        }
        function setProCityAreaCode() {
            setProAreaCode();
            for (var i = 0; i < cityArr.length; i++) {
                if (cityArr[i].name.indexOf(areaArr[1]) != -1) {
                    _this.ele.find("input:hidden.pick-area").attr("data-areacode", _this.ele.find("input:hidden.pick-area").attr("data-areacode") + "," + cityArr[i].id);
                    if (slash == 2 || slash == 3) {
                        countyArr = cityArr[i].district;
                    }
                }
            }
        }
        function setProCityCountyAreaCode() {
            setProCityAreaCode();
			for (var i = 0; i < countyArr.length; i++) {
			    if (countyArr[i].name.indexOf(areaArr[2]) != -1) {
			        _this.ele.find("input:hidden.pick-area").attr("data-areacode", _this.ele.find("input:hidden.pick-area").attr("data-areacode") + "," + countyArr[i].id);
			        if (slash == 3) {
			            townArr = countyArr[i].town;
			        }
			    }
			}
        }
		function setProCityCountyTownAreaCode() {
			setProCityCountyAreaCode();
			for (var i = 0; i < townArr.length; i++) {
			    if (townArr[i].name.indexOf(areaArr[3]) != -1) {
			        _this.ele.find("input:hidden.pick-area").attr("data-areacode", _this.ele.find("input:hidden.pick-area").attr("data-areacode") + "," + townArr[i].id);
			    }
			}
		}
    },
    createProvince: function(e) {
        var _this = this;
        var proStr = '';
        var selPro = '';
        if (this.ele.find(".pick-province").html != "") {
            selPro = this.ele.find(".pick-province").html();
        }
        for (var i = 0; i < area.length; i++) {
            if (i == 0) {
                proStr = '<li class="ulli" data-code="">请选择省</li>'
            }
            if (selPro == area[i].name) {
                proStr += '<li class="ulli pick-selectedLi" data-code="' + area[i].id + '" style="background:' + this.config.hoverColor + ';color:#fff;font-weight:bold;">' + area[i].name + '</li>';
            } else {
                proStr += '<li class="ulli" data-code="' + area[i].id + '">' + area[i].name + '</li>';
            }
        }
        this.ele.find(".pick-list").html("").append(proStr).show();
        this.listHide();
        this.ele.find(".pick-list li").css({
            "padding-left": parseInt(this.config.paddingLeft) + "px"
        });
        this.ele.find(".pick-list li").click(function(event) {
            event.stopPropagation();
            _this.setVal(_this, this, "pro")
        })
    },
    createCity: function(e) {
        var _this = this,
        setPro = '',
        cityJson = "",
        cityStr = '',
        selCity = '';
        setPro = this.ele.find(".pick-province").html();
        if (this.ele.find(".pick-city").html != "") {
            selCity = this.ele.find(".pick-city").html();
        }
        for (var i = 0; i < area.length; i++) {
            if (area[i].name.indexOf(setPro) != -1) {
                cityJson = area[i].cities;
            }
        }
        if (cityJson.length != 0) {
            for (var j = 0; j < cityJson.length; j++) {
                if (j == 0) {
                    cityStr = '<li class="ulli" data-code="">请选择市</li>'
                }
                if (selCity == cityJson[j].name) {
                    cityStr += '<li class="ulli pick-selectedLi" data-code="' + cityJson[j].id + '" style="background:' + this.config.hoverColor + ';color:#fff;font-weight:bold;">' + cityJson[j].name + '</li>';
                } else {
                    cityStr += '<li class="ulli" data-code="' + cityJson[j].id + '">' + cityJson[j].name + '</li>';
                }
            }
            this.ele.find(".pick-list").html("").append(cityStr).show();
            this.listHide();
            this.ele.find(".pick-list li").css({
                "padding-left": parseInt(this.config.paddingLeft) + "px"
            });
            this.ele.find(".pick-list li").click(function(event) {
                event.stopPropagation();
                _this.setVal(_this, this, "city")
            })
        } else {
            this.ele.find(".pick-list").html("").hide();
            this.ele.find(".pick-show span").removeClass("pressActive");
        }
    },
    createCounty: function(e) {
        var _this = this,
        setPro = "",
        setCity = '',
        cityJson = "",
        countyJson = "",
        countyStr = '',
        selCounty = '';
        setPro = this.ele.find(".pick-province").html();
        setCity = this.ele.find(".pick-city").html();
        if (setCity == "请选择市") {
            this.ele.find(".pick-show span").removeClass("pressActive");
            return;
        } else {
            if (this.ele.find(".pick-county").html != "") {
                selCounty = this.ele.find(".pick-county").html();
            }
            for (var i = 0; i < area.length; i++) {
                if (area[i].name.indexOf(setPro) != -1) {
                    cityJson = area[i].cities;
                }
            }
            for (var j = 0; j < cityJson.length; j++) {
                if (cityJson[j].name.indexOf(setCity) != -1) {
                    countyJson = cityJson[j].district;
                }
            }
            for (var t = 0; t < countyJson.length; t++) {
                if (t == 0) {
                    countyStr = '<li class="ulli" data-code="">请选择县</li>'
                }
                if (selCounty == countyJson[t].name) {
                    countyStr += '<li class="ulli pick-selectedLi" data-code="' + countyJson[t].id + '" style="background:' + this.config.hoverColor + ';color:#fff;font-weight:bold;">' + countyJson[t].name + '</li>';
                } else {
                    countyStr += '<li class="ulli" data-code="' + countyJson[t].id + '">' + countyJson[t].name + '</li>';
                }
            }
            this.ele.find(".pick-list").html("").append(countyStr).show();
            this.listHide();
            this.ele.find(".pick-list li").css({
                "padding-left": parseInt(this.config.paddingLeft) + "px"
            });
            this.ele.find(".pick-list li").click(function(event) {
                event.stopPropagation();
                _this.setVal(_this, this, "county")
            })
        }
    },
	createTown: function(e) {
	    var _this = this,
	    setPro = "",
	    setCity = '',
		setCounty = '',
	    cityJson = "",
	    countyJson = "",
		townJson = "",
	    townStr = '',
	    selTown = '';
	    setPro = this.ele.find(".pick-province").html();
	    setCity = this.ele.find(".pick-city").html();
		setCounty = this.ele.find(".pick-county").html();
		
	    if (setCounty == "请选择县") {
	        this.ele.find(".pick-show span").removeClass("pressActive");
	        return;
	    } else {
	        if (this.ele.find(".pick-town").html != "") {
	            selTown = this.ele.find(".pick-town").html();
	        }
	        for (var i = 0; i < area.length; i++) {
	            if (area[i].name.indexOf(setPro) != -1) {
	                cityJson = area[i].cities;
	            }
	        }
	        for (var j = 0; j < cityJson.length; j++) {
	            if (cityJson[j].name.indexOf(setCity) != -1) {
	                countyJson = cityJson[j].district;
	            }
	        }
			for (var j = 0; j < countyJson.length; j++) {
			    if (countyJson[j].name.indexOf(setCounty) != -1) {
			        townJson = countyJson[j].town;
			    }
			}
	        for (var t = 0; t < townJson.length; t++) {
	            if (t == 0) {
	                townStr = '<li class="ulli" data-code="">请选择镇</li>'
	            }
	            if (selTown == townJson[t].name) {
	                townStr += '<li class="ulli pick-selectedLi" data-code="' + townJson[t].id + '" style="background:' + this.config.hoverColor + ';color:#fff;font-weight:bold;">' + townJson[t].name + '</li>';
	            } else {
	                townStr += '<li class="ulli" data-code="' + townJson[t].id + '">' + townJson[t].name + '</li>';
	            }
	        }
	        this.ele.find(".pick-list").html("").append(townStr).show();
	        this.listHide();
	        this.ele.find(".pick-list li").css({
	            "padding-left": parseInt(this.config.paddingLeft) + "px"
	        });
	        this.ele.find(".pick-list li").click(function(event) {
	            event.stopPropagation();
	            _this.setVal(_this, this, "town")
	        })
	    }
	},
    setVal: function(_thisP, aim, s) {
        var _this = this;
        if (s == "pro") {
            this.ele.find(".pressActive").html($(aim).html());
            if ($(aim).html() == "请选择省") {
                this.ele.find(".pick-list").hide();
                this.ele.find(".pick-city").html("请选择市");
                this.ele.find(".pick-county").html("请选择县");
				this.ele.find(".pick-town").html("请选择镇");
                this.ele.find(".pick-province").removeClass("pressActive").css("background", "#fff");
                this.ele.find("input:hidden.pick-area").val("").attr("data-areacode", "");
            } else {
                $(aim).parent().prev().find("input:hidden.pick-area").attr("data-areacode", $(aim).attr("data-code"));
                if (($(aim).html() == "台湾省" || $(aim).html() == "香港特别行政区" || $(aim).html() == "澳门特别行政区") && this.format != "p") {
                    this.ele.find(".pick-list,.pick-city,.pick-county,i").hide();
                    this.ele.find(".pick-province").removeClass("pressActive").css("background", "#fff");
                    this.ele.find("input[type=hidden].pick-area").val(this.ele.find(".pick-province").html());
                    $(".pick-area-hidden").val(this.ele.find(".pick-province").html());
                    return;
                } else {
                    this.ele.find(".pick-list,.pick-city,.pick-county,i").show();
                }
                this.ele.find(".pick-city").html("请选择市");
                this.ele.find(".pick-county").html("请选择县");
				this.ele.find(".pick-town").html("请选择镇");
                this.ele.find(".pick-province").removeClass("pressActive").css("background", "#fff");
                this.ele.find(".pick-city").addClass("pressActive").css("background", this.config.hoverColor);
                this.ele.find("input[type=hidden].pick-area").val(this.ele.find(".pick-province").html());
                if (this.format == "p") {
                    this.ele.find(".pick-list").hide();
                } else {
                    this.createCity();
                }
                $(".pick-list").scrollTop(0);
                $(".pick-area-hidden").val(this.ele.find(".pick-province").html());
            }
        } else if (s == "city") {
            this.ele.find(".pressActive").html($(aim).html());
            if ($(aim).html() == "请选择市") {
                this.ele.find(".pick-list").hide();
                this.ele.find(".pick-county").html("请选择县");
				this.ele.find(".pick-town").html("请选择镇");
                this.ele.find(".pick-city").removeClass("pressActive").css("background", "#fff");
                var proVal = this.ele.find("input:hidden.pick-area").val().substring(0, this.ele.find("input:hidden.pick-area").val().indexOf("/"));
                var proCode = this.ele.find("input:hidden.pick-area").attr("data-areacode").substring(0, this.ele.find("input:hidden.pick-area").attr("data-areacode").indexOf(","));
                this.ele.find("input:hidden.pick-area").val(proVal).attr("data-areacode", proCode);
            } else {
                var pro_areaCode = $(aim).parent().prev().find("input:hidden.pick-area").attr("data-areacode").substring(0, 6) + ",";
                $(aim).parent().prev().find("input:hidden.pick-area").attr("data-areacode", pro_areaCode + $(aim).attr("data-code"));
                this.ele.find(".pick-county").html("请选择县");
				this.ele.find(".pick-town").html("请选择镇");
                this.ele.find(".pick-city").removeClass("pressActive").css("background", "#fff");
                this.ele.find(".pick-county").addClass("pressActive").css("background", this.config.hoverColor);
                this.ele.find("input[type=hidden].pick-area").val(this.ele.find(".pick-province").html() + "/" + this.ele.find(".pick-city").html());
                if (this.format == "p/c") {
                    this.ele.find(".pick-list").hide();
                } else {
                    this.createCounty();
                }
                $(".pick-list").scrollTop(0);
                $(".pick-area-hidden").val(this.ele.find(".pick-province").html() + " " + this.ele.find(".pick-city").html());
            }
        } else if (s == "county") {
            this.ele.find(".pressActive").html($(aim).html());
            if ($(aim).html() == "请选择县") {
                this.ele.find(".pick-list").hide();
				this.ele.find(".pick-town").html("请选择镇");
                this.ele.find(".pick-county").removeClass("pressActive").css("background", "#fff");
				var proAndCityVal = this.ele.find("input:hidden.pick-area").val().substring(0, this.ele.find("input:hidden.pick-area").val().lastIndexOf("/"));
				var proAndCityCode = this.ele.find("input:hidden.pick-area").attr("data-areacode").substring(0, this.ele.find("input:hidden.pick-area").attr("data-areacode").lastIndexOf(","));
                this.ele.find("input:hidden.pick-area").val(proAndCityVal).attr("data-areacode", proAndCityCode);
            } else {
				var pro_areaCode = $(aim).parent().prev().find("input:hidden.pick-area").attr("data-areacode").substring(0, 12) + ",";
                $(aim).parent().prev().find("input:hidden.pick-area").attr("data-areacode", pro_areaCode + $(aim).attr("data-code"));
				this.ele.find(".pick-town").html("请选择镇");
                this.ele.find(".pick-county").removeClass("pressActive").css("background", "#fff");
                this.ele.find(".pick-town").addClass("pressActive").css("background", this.config.hoverColor);
                this.ele.find("input[type=hidden].pick-area").val(this.ele.find(".pick-province").html() + "/" + this.ele.find(".pick-city").html()+ "/" + this.ele.find(".pick-county").html());
                if (this.format == "p/c/c") {
                    this.ele.find(".pick-list").hide();
                } else {
                    this.createTown();
                }
                $(".pick-list").scrollTop(0);
                $(".pick-area-hidden").val(this.ele.find(".pick-province").html() + " " + this.ele.find(".pick-city").html()+ " " + this.ele.find(".pick-county").html());
            }
        } else if (s == "town") {
            if ($(aim).html() == "请选择镇") {
				if (this.ele.find(".pick-town").html() == "请选择镇") {} else {
                    this.ele.find(".pressActive").html($(aim).html());
                    var proAndCountyVal = this.ele.find("input:hidden.pick-area").val().substring(0, this.ele.find("input:hidden.pick-area").val().lastIndexOf("/"));
                    var proAndCountyCode = this.ele.find("input:hidden.pick-area").attr("data-areacode").substring(0, this.ele.find("input:hidden.pick-area").attr("data-areacode").lastIndexOf(","));
                    this.ele.find("input:hidden.pick-area").val(proAndCountyVal).attr("data-areacode", proAndCountyCode);
                    $("input:hidden.pick-area-hidden").val(proAndCountyVal);
                }
                this.ele.find(".pick-list").hide();
                this.ele.find(".pick-town").html("请选择镇");
                this.ele.find(".pick-town").removeClass("pressActive").css("background", "#fff");
            } else {
                this.ele.find(".pressActive").html($(aim).html());
                var pro_country_areaCode = $(aim).parent().prev().find("input:hidden.pick-area").attr("data-areacode").substring(0, 19) + ",";
                $(aim).parent().prev().find("input:hidden.pick-area").attr("data-areacode", pro_country_areaCode + $(aim).attr("data-code"));
                this.ele.find(".pick-list").hide();
                this.ele.find(".pick-town").removeClass("pressActive").css("background", "#fff");
                this.ele.find("input[type=hidden].pick-area").val(this.ele.find(".pick-province").html() + "/" + this.ele.find(".pick-city").html() + "/" + this.ele.find(".pick-county").html()+ "/" + this.ele.find(".pick-town").html());
                $(".pick-list").scrollTop(0);
                $(".pick-area-hidden").val(this.ele.find(".pick-province").html() + " " + this.ele.find(".pick-city").html() + " " + this.ele.find(".pick-county").html()+ " " + this.ele.find(".pick-town").html());
            }
        }
		this.setBack(this);
    },
    listHide: function() {
        $(document).one("click",
        function() {
            $(".pick-list").html("").hide();
            $(".pick-show span").removeClass("pressActive").css("background", "#fff");
        });
    },
    setBack: function(_this) {
        $(".pick-area-dom").val(_this.identity);
        if (typeof _this.config.getVal === "function") {
            _this.config.getVal();
        }
    },
    getRandomStr: function() {
        var str = "",
        alphabet = ['A', 'B', "C", "D", "E", "F", "G", "H", "I", "G", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        for (var i = 0; i < 26; i++) {
            str += alphabet[parseInt(Math.random() * 26)];
        }
        str += Date.parse(new Date());
        return str;
    }
};
$.fn[pluginName] = function(options) {
    picknum++;
    return this.each(function(index) {
        new Plugin(this, options);
    })
};
});