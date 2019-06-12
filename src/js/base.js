
//chklogin
//Serv.ChkLogin();

var LOCAL_USER_DATA="LOCAL_USER_DATA";
var CurrentShopId=0;
function GetLoginUser(){
    var data=localStorage.getItem(LOCAL_USER_DATA); 
    if(data){
        data=JSON.parse(data).UserInfo;
        var user={
            id:data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
            displayName:data["DisplayName"],
            shops:JSON.parse(data["Shops"]),            
            isAllShops:data["AllShops"],
            com:data["_code_"],
            roleType:data["RoleType"],
            isAdmin:data["SysRole"]=="Sys",
            userName:data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]};   
        
        if(user.shops.length==1 && user.roleType=="Shop"){
            CurrentShopId=user.shops[0];
        }
        return user;
    }else{
        window.location.href="../default.html";
    }
}

var CurrentUser=GetLoginUser();