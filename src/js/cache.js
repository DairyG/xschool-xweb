var COMPANY="COMPANY_CACHE";
var DEPARTMENT="DEPARTMENT_CACHE";
var USERTOKEN="USERTOKEN_CACHE";
var EMPLOYEE="EMPLOYEE_CACHE"
window.globCache={
    getCompany:function(){
        var value = window.globCache.get(COMPANY);
        return JSON.parse(value);
    },
    setCompany:function(value){
        window.globCache.set(COMPANY,JSON.stringify(value));
    },
    getDepartment:function(){
        var value = window.globCache.get(DEPARTMENT);
        return JSON.parse(value);
    },
    setDepartment:function(value){
        window.globCache.set(DEPARTMENT,JSON.stringify(value));
    },
    setUserToken:function(value){
        window.globCache.set(USERTOKEN,JSON.stringify(value));
    },
    getUserToken:function(){
        var value = window.globCache.get(USERTOKEN);
        return JSON.parse(value);
    },
    setEmployee:function(value){
        window.globCache.set(EMPLOYEE,JSON.stringify(value));
    },
    getEmployee:function(){
        var value = window.globCache.get(EMPLOYEE);
        return JSON.parse(value);
    },
    get:function(key){
        return window.localStorage.getItem(key);
    },
    set:function(key,value){
        window.localStorage.setItem(key,value)
    }
}