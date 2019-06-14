
var Serv={
     ServiceUrl:"http://localhost:54546/api/v1/",   
    //ServiceUrl:"http://192.168.0.253/api/v1/",
    // ServiceUrl:"http://114.116.54.157/ecenter/api/v1/", //api访问地址
    // ServiceUrl:"http://localhost/api/v1/",
    // ServiceUrl:"http://ecenter.logistics.com/api/v1/",
	// ServiceUrl:"http://www.lui.com/json/", //数据地址
    UCenterUrl:"",
    Code:"JDWL",//站点名称
    Token:"",//用户的Token
    GetToken:function(){
        if (this.Token==""|| this.Token==null){      
            this.Token=localStorage.getItem("Service_Token");
        }
        return this.Token;
    },
    SetToken:function(val){
        if(val==""){
            return false;
        } 
        Token=val; 
        localStorage.setItem("Service_Token", val);
        return true;
    },
    RemoveToken:function(){
        Token="";
        localStorage.removeItem("Service_Token");
    },
    GetHeaders:function(){
        return {
            "_CODE_":Serv.Code,
            "content-type":"application/x-www-form-urlencoded;charset=UTF-8",
            "Authorization":Serv.GetToken()
        }
    },
    GetUrl:function(url){
        return Serv.ServiceUrl+url;
    },
    Get:function(url,args,callback){
        this.Send(url,"GET",args,callback);
    },
    Post:function(url,args,callback){      
        this.Send(url,"POST",args,callback);
    },
    Send:function(url,type,args,callback){
        jQuery.support.cors = true;      
        $.ajax({
            dataType: "json",
            url: Serv.ServiceUrl+url,
            headers:{
                "_CODE_":Serv.Code,
                "content-type":"application/x-www-form-urlencoded;charset=UTF-8",
                "Authorization":Serv.GetToken()
            },
            type:type,
            data:args,
            success: function(data){                                
                callback(data);               
            },                    
            error:function(data){
                layer.closeAll();
                if(data.status==400){
                   var json = JSON.parse(data.responseText);
                   if(json.error=='invalid_client'){
                    layer.alert('用户未授权',{icon:2,title:'登陆提示'});
                   }else{
                     layer.alert(json.error_description,{icon:2,title:'登陆提示'});
                   }                  
                }
                console.log("err:",data);
            }
        });
    },
    ChkLogin:function(){ 
        if(this.GetToken()==null || this.GetToken()==""){    
            //location.href="/";
        }
    },
    getUserInit:function(){
        
    }
};

 