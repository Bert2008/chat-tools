/**
 * Created by Bert P Chen on 2017/4/3.
 */
function Response (){
    this.data=null;
    this.retInfo=null;
    this.status=null;

};
Response.prototype={
    setData:function(data){
        this.data=data;
    },
    setStatus:function(status){
        this.status=status;
    },
    setRetInfo:function(retInfo){
        this.retInfo=retInfo;
    }

};
module.exports=Response;