/**
 * Created by p.c.chen on 2/22/2017.
 */

 var express = require("express");
 var _= require("underscore");
 var bodyParser = require("body-parser");
 var path = require('path');
 var routes = require("./routes/routes");
 var chat = require("./routes/chat");
 var favicon = require('serve-favicon');
 var io = require('socket.io');

 var app = express();
 var server = require('http').createServer(app);
 app.use("/webApp/",express.static(path.join(__dirname+"/webApp")));
app.use(bodyParser.urlencoded({extended:false}))
 app.use(routes);



 io=io.listen(server);
 server.listen("8080","127.0.0.1");
 module.exports = app;
 console.log("listen 127.0.0.1:80");

 var hashName={};
 io.sockets.on('connection', function (socket) {
     console.log("sockets connect")
     socket.on('setName',function(data){
         console.log(data._id)
         hashName[data._id]=socket.id;
     });
     socket.on('toSay',function(data){
         var toName=data.toId,toId;
         console.log(data.toId)
         if(toId=hashName[toName]){
             console.log(data.toId)
             var toSocket = _.findWhere(io.sockets.sockets,{id:toId});
             console.log(toSocket)
             toSocket.emit('message',{msg:data.msg,receiveSayId:data.fromId});
         }
     });
     socket.on('disconnect', function(){
         console.log('connection is disconnect!');
     });
 });