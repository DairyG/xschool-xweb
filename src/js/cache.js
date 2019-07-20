var cacheModel = {
    COMPANY: "COMPANY_CACHE",
    DEPARTMENT: "DEPARTMENT_CACHE",
    USERTOKEN: "USERTOKEN_CACHE",
    EMPLOYEE: "EMPLOYEE_CACHE",
    JOB: "JOB_CACHE",
    B_ARRIVAL: "B_ARRIVAL_CACHE",
    B_EDUCATION: "B_EDUCATION_CACHE",
    B_PROPERTIES: "B_PROPERTIES_CACHE",
    B_RELATIONS: "B_RELATIONS_CACHE",
    B_RECRUITMENT: "B_RECRUITMENT_CACHE"
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

    get: function(key) {
        return window.localStorage.getItem(key);
    },
    set: function(key, value) {
        window.localStorage.setItem(key, value)
    },
    clear: function() {
        window.localStorage.removeItem('Service_Token');
        for (const key in cacheModel) {
            window.localStorage.removeItem(cacheModel[key]);
        }
    }
}