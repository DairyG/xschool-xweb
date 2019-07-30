var cacheModel = {
    COMPANY: "COMPANY_CACHE",
    DEPARTMENT: "DEPARTMENT_CACHE",
    USERTOKEN: "USERTOKEN_CACHE",
    EMPLOYEE: "EMPLOYEE_CACHE",
    JOB: "JOB_CACHE",
    BUDGET: "BUDGET_CACHE",
    B_ARRIVAL: "B_ARRIVAL_CACHE",
    B_EDUCATION: "B_EDUCATION_CACHE",
    B_PROPERTIES: "B_PROPERTIES_CACHE",
    B_RELATIONS: "B_RELATIONS_CACHE",
    B_RECRUITMENT: "B_RECRUITMENT_CACHE",
    MODULES: "AS_MODULES_CACHE",
    ELEMENTS: "AS_ELEMENTS_CACHE",
    LOGINTYPE: "LOGINTYPE_CACHE",
};

window.globCache = {
    getCompany: function() {
        var value = window.globCache.get(cacheModel.COMPANY);
        return JSON.parse(value);
    },
    setCompany: function(value) {
        window.globCache.set(cacheModel.COMPANY, JSON.stringify(value));
    },
    getDepartment: function() {
        var value = window.globCache.get(cacheModel.DEPARTMENT);
        return JSON.parse(value);
    },
    setDepartment: function(value) {
        window.globCache.set(cacheModel.DEPARTMENT, JSON.stringify(value));
    },
    getDptName: function(dptId) {
        var dpt = window.globCache.get(cacheModel.DEPARTMENT);
        dpt = JSON.parse(dpt);
        for (var i = 0; i < dpt.length; i++) {
            if (dpt[i].id == dptId) {
                return dpt[i].dptName;
            }
        }
        return '';
    },
    setJobs: function(value) {
        window.globCache.set(cacheModel.JOB, JSON.stringify(value))
    },
    getJobs: function() {
        var value = window.globCache.get(cacheModel.JOB);
        return JSON.parse(value);
    },
    getJobsByCompanyId: function(companyid) {
        var jos = window.globCache.getJobs(cacheModel.JOB);
        var array = [];
        for (let index = 0; index < jos.length; index++) {
            const job = jos[index];
            if (job.companyId == companyid) {
                array.push(job);
            }
        }
        return array;
    },
    setBudgets: function(value) {
        var groups = {
            1: [],
            2: [],
            3: []
        };
        for (var i = 0; i < value.length; i++) {
            var type = value[i].type;
            var pid = value[i].pid;
            if (groups[type][pid]) {
                groups[type][pid].push(value[i]);
            } else {
                groups[type][pid] = [];
                groups[type][pid].push(value[i]);
            }

        }
        var d = [{
                id: -1,
                pid: -1,
                name: '建设成本',
                type: 1
            },
            {
                id: -2,
                pid: -2,
                name: '费用预算',
                type: 2
            },
            {
                id: -3,
                pid: -3,
                name: '固定成本',
                type: 3
            }
        ];
        for (var i = 0; i < value.length; i++) {
            var item = value[i];
            var type = value[i].type;
            if (groups[type][item.id] != undefined && groups[type][item.id].length > 0) {
                item.is_last = false;
            } else {
                item.is_last = true;
            }
        }
        value = d.concat(value);
        window.globCache.set(cacheModel.BUDGET, JSON.stringify(value))
    },
    getBudgets: function() {
        var value = window.globCache.get(cacheModel.BUDGET);
        return JSON.parse(value);
    },
    setUserToken: function(value) {
        window.globCache.set(cacheModel.USERTOKEN, JSON.stringify(value));
    },
    getUserToken: function() {
        var value = window.globCache.get(cacheModel.USERTOKEN);
        return JSON.parse(value);
    },
    setEmployee: function(value) {
        window.globCache.set(cacheModel.EMPLOYEE, JSON.stringify(value));
    },
    getEmployee: function() {
        var value = window.globCache.get(cacheModel.EMPLOYEE);
        return JSON.parse(value);
    },
    //到岗时间
    getArrival: function() {
        var value = window.globCache.get(cacheModel.B_ARRIVAL);
        return JSON.parse(value);
    },
    setArrival: function(value) {
        window.globCache.set(cacheModel.B_ARRIVAL, JSON.stringify(value));
    },
    //学历
    getEducation: function() {
        var value = window.globCache.get(cacheModel.B_EDUCATION);
        return JSON.parse(value);
    },
    setEducation: function(value) {
        window.globCache.set(cacheModel.B_EDUCATION, JSON.stringify(value));
    },
    //教育性质
    getProperties: function() {
        var value = window.globCache.get(cacheModel.B_PROPERTIES);
        return JSON.parse(value);
    },
    setProperties: function(value) {
        window.globCache.set(cacheModel.B_PROPERTIES, JSON.stringify(value));
    },
    //社会关系
    getRelations: function() {
        var value = window.globCache.get(cacheModel.B_RELATIONS);
        return JSON.parse(value);
    },
    setRelations: function(value) {
        window.globCache.set(cacheModel.B_RELATIONS, JSON.stringify(value));
    },
    //招聘来源
    getRecruitment: function() {
        var value = window.globCache.get(cacheModel.B_RECRUITMENT);
        return JSON.parse(value);
    },
    setRecruitment: function(value) {
        window.globCache.set(cacheModel.B_RECRUITMENT, JSON.stringify(value));
    },

    //可访问的模块
    getModules: function() {
        var value = window.globCache.get(cacheModel.MODULES);
        return JSON.parse(value);
    },
    setModules: function(value) {
        window.globCache.set(cacheModel.MODULES, JSON.stringify(value));
    },
    getElements: function() {
        var value = window.globCache.get(cacheModel.ELEMENTS);
        return JSON.parse(value);
    },
    setElements: function(value) {
        window.globCache.set(cacheModel.ELEMENTS, JSON.stringify(value));
    },


    get: function(key) {
        return window.localStorage.getItem(key);
    },
    set: function(key, value) {
        if (value == null) {
            window.localStorage.removeItem(key)
        } else {
            window.localStorage.setItem(key, value)
        }
    },
    clear: function() {
        localStorage.clear();
        // window.localStorage.removeItem('Service_Token');
        // for (const key in cacheModel) {
        //     window.localStorage.removeItem(cacheModel[key]);
        // }
    },


    /**
     * 获取元素
     * @param {*} code 页面code
     * @param {*} mode 数据返回模式
     * mode参数说明：
        allData=全部数据
        upData=上方数据
        rightData=右边数据
        customHtml=自定义样式Html
        allHtml=上方和右边Html
        upHtml=上方Html
        rightHtml=右边Html
     */
    getElementData: function(code, mode) {
        var data = this.getElements(cacheModel.ELEMENTS);
        var elementData = [];
        $.each(data, function(i, item) {
            if (item.code == code) {
                elementData = [];
                elementData = item.elements;
                return false;
            }
        });

        switch (mode) {
            case 'allData': //全部数据
                return elementData;
            case 'upData': //上方数据
                $.each(elementData, function(i, item) {
                    if (item.position == 1) {
                        result.push(item);
                    }
                });
                return result;
            case 'rightData': //右边数据
                var result = [];
                $.each(elementData, function(i, item) {
                    if (item.position == 2) {
                        result.push(item);
                    }
                });
                return result;
            case 'customHtml': //自定义样式Html
                var result = '';
                $.each(elementData, function(i, item) {
                    result += '<a href="javascript:;" class="margin-r-10 ' + (item.class || '') + '" lay-filter="' + item.domId + '"><i class="layui-icon ' + (item.iconName || '') + '"></i>' + item.name + '</a>';
                });
                return result;
            case 'allHtml':
                var result = {
                    upHtml: '',
                    rightHtml: ''
                };
                $.each(elementData, function(i, item) {
                    if (item.position == 1) { //上面
                        result.upHtml += '<a class="layui-btn layui-btn-sm ' + (item.class || '') + '" lay-event="' + item.domId + '"><i class="layui-icon ' + (item.iconName || '') + '"></i>' + item.name + '</a>';
                    } else { //右边
                        result.rightHtml += '<a class="layui-btn layui-btn-xs ' + (item.class || '') + '" lay-event="' + item.domId + '"><i class="layui-icon ' + (item.iconName || '') + '"></i>' + item.name + '</a>';
                    }
                });
                return result;
            case 'upHtml':
                var result = '';
                $.each(elementData, function(i, item) {
                    if (item.position == 1) { //上面
                        result += '<a class="layui-btn layui-btn-sm ' + (item.class || '') + '" lay-event="' + item.domId + '"><i class="layui-icon ' + (item.iconName || '') + '"></i>' + item.name + '</a>';
                    }
                });
                return result;
            case 'rightHtml':
                var result = '';
                $.each(elementData, function(i, item) {
                    if (item.position == 2) { //上面
                        result += '<a class="layui-btn layui-btn-xs ' + (item.class || '') + '" lay-event="' + item.domId + '"><i class="layui-icon ' + (item.iconName || '') + '"></i>' + item.name + '</a>';
                    }
                });
                return result;
            default:
                return '';
        }
    },

    /**
     * 验证是否有元素
     * @param {*} data 
     * @param {*} domId 
     */
    checkElement: function(data, domId) {
        if (data.length == 0) {
            return false;
        }
        var result = false;
        $.each(data, function(i, item) {
            if (item.domId == domId) {
                result = true;
                return false;
            }
        });
        return result;
    }
}