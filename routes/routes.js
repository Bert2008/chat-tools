/**
 * Created by p.c.chen on 2/23/2017.
 */
var db=require("../db");
var responseType= require("../common/response");
var express = require('express');
var router = express.Router();
var domain = require('domain');
/* GET home page. */
router.post('/service/register', function(req, res) {
   var responseTxt = new responseType,dPost = domain.create();
    console.log(JSON.stringify(req.body));
    dPost.run(function(){
        db.addUser(req.body, function(reslut){
            if(reslut.length>0){
                responseTxt.setStatus('00000');
                responseTxt.setRetInfo('注册成功');
                responseTxt.setData({userList:reslut});
                res.send(responseTxt);
            } else {
                responseTxt.setStatus('00002');
                responseTxt.setRetInfo('用户已经注册');
                responseTxt.setData({userList:null});
                res.send(responseTxt);
            }
        });
    });
    dPost.once('error', function(err){
        responseTxt.setStatus('00001');
        responseTxt.setRetInfo(err.message);
        responseTxt.setData({userList:null});
        res.send(responseTxt);
    });

});
router.post('/service/login', function(req, res, next) {
    var responseTxt=new responseType();
    console.log(JSON.stringify(req.body));
    db.searchUser({telephone:req.body.telephone},function(reslut){
        if(reslut.length<=0){
            responseTxt.setStatus('00002');
            responseTxt.setRetInfo('用户不存在');
            responseTxt.setData({userId:null});
            res.send(responseTxt);
        }else{
            if(req.body.telephone == reslut[0].telephone && req.body.password == reslut[0].password) {
                responseTxt.setStatus('00000');
                responseTxt.setRetInfo('登录成功');
                responseTxt.setData({userInfo:reslut[0]});
                res.send(responseTxt)
            }else {
                responseTxt.setStatus('00001');
                responseTxt.setRetInfo('登录失败');
                responseTxt.setData({userId:null});
                res.send(responseTxt)
            }
        }

    });
});
router.post('/service/findUser', function(req, res, next) {
    var responseTxt=new responseType();
    try{
        db.findAllUser(function(reslut){
            responseTxt.setStatus('00000');
            responseTxt.setRetInfo("用户信息获取成功");
            responseTxt.setData({userList:reslut});
            res.send(responseTxt);
        },req.body);
    } catch(err){
        responseTxt.setStatus('00001');
        responseTxt.setRetInfo(err);
        responseTxt.setData({userList:null});
        res.send(responseTxt);
    }

});
module.exports = router;
