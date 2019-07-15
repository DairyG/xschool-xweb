var COMPANY = "COMPANY_CACHE";
var DEPARTMENT = "DEPARTMENT_CACHE";
var USERTOKEN = "USERTOKEN_CACHE";
var EMPLOYEE = "EMPLOYEE_CACHE";
var JOB = "JOB_CACHE";
var B_ARRIVAL = "B_ARRIVAL_CACHE";
var B_EDUCATION = "B_EDUCATION_CACHE";
var B_PROPERTIES = "B_PROPERTIES_CACHE";
var B_RELATIONS = "B_RELATIONS_CACHE";
var B_RECRUITMENT = "B_RECRUITMENT_CACHE";

window.globCache = {
    getCompany: function () {
        var value = window.globCache.get(COMPANY);
        return JSON.parse(value);
    },
    setCompany: function (value) {
        window.globCache.set(COMPANY, JSON.stringify(value));
    },
    getDepartment: function () {
        var value = window.globCache.get(DEPARTMENT);
        return JSON.parse(value);
    },
    setDepartment: function (value) {
        window.globCache.set(DEPARTMENT, JSON.stringify(value));
    },
    setJobs: function (value) {
        window.globCache.set(JOB, JSON.stringify(value))
    },
    getJobs: function () {
        var value = window.globCache.get(JOB);
        return JSON.parse(value);
    },
    getJobsByCompanyId: function (companyid) {
        var jos = window.globCache.getJobs(JOB);
        var array = [];
        for (let index = 0; index < jos.length; index++) {
            const job = jos[index];
            if (job.companyId == companyid) {
                array.push(job);
            }
        }
        return array;
    },
    setUserToken: function (value) {
        window.globCache.set(USERTOKEN, JSON.stringify(value));
    },
    getUserToken: function () {
        var value = window.globCache.get(USERTOKEN);
        return JSON.parse(value);
    },
    setEmployee: function (value) {
        window.globCache.set(EMPLOYEE, JSON.stringify(value));
    },
    getEmployee: function () {
        var value = window.globCache.get(EMPLOYEE);
        return JSON.parse(value);
    },
    //到岗时间
    getArrival: function () {
        var value = window.globCache.get(B_ARRIVAL);
        return JSON.parse(value);
    },
    setArrival: function (value) {
        window.globCache.set(B_ARRIVAL, JSON.stringify(value));
    },
    //学历
    getEducation: function () {
        var value = window.globCache.get(B_EDUCATION);
        return JSON.parse(value);
    },
    setEducation: function (value) {
        window.globCache.set(B_EDUCATION, JSON.stringify(value));
    },
    //教育性质
    getProperties: function () {
        var value = window.globCache.get(B_PROPERTIES);
        return JSON.parse(value);
    },
    setProperties: function (value) {
        window.globCache.set(B_PROPERTIES, JSON.stringify(value));
    },
    //社会关系
    getRelations: function () {
        var value = window.globCache.get(B_RELATIONS);
        return JSON.parse(value);
    },
    setRelations: function (value) {
        window.globCache.set(B_RELATIONS, JSON.stringify(value));
    },
    //招聘来源
    getRecruitment: function () {
        var value = window.globCache.get(B_RECRUITMENT);
        return JSON.parse(value);
    },
    setRecruitment: function (value) {
        window.globCache.set(B_RECRUITMENT, JSON.stringify(value));
    },

    get: function (key) {
        return window.localStorage.getItem(key);
    },
    set: function (key, value) {
        window.localStorage.setItem(key, value)
    }
}