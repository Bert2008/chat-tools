/**
 * Created by p.c.chen on 2/23/2017.
 */
var mongo = require("mongodb");
var mongodb = require("mongodb");
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


// Connection URL
var url = 'mongodb://localhost:27017/chat';
// Use connect method to connect to the Server;
var ensureIndex = false;
    exports.addUser = function (userInfo,callback) {
        MongoClient.connect(url, function (err, db) {
            if (err)throw err;
            var collection = db.collection('user');
            if(!ensureIndex){
                collection.ensureIndex({'_id':1,'telephone':-1});
                ensureIndex=true;
            }
            exports.searchUser({'telephone':userInfo.telephone}, function(result){
                if(result&&result.length>0){
                    !!callback ? callback(result) : '';
                    db.close();
                } else {
                    collection.insert({
                        nickName: userInfo.nickName,
                        telephone: userInfo.telephone,
                        password: userInfo.password
                    }, function (err,result) {
                        !!callback ? callback(result) : '';
                        db.close();
                    })
                }
            })

        });
    }
    exports.updateUser = function (whereStr, updataStr,callback) {
        MongoClient.connect(url, function (err, db) {
            if (err)throw err;
            var collection = db.collection('user');
            collection.update(whereStr, updataStr, function (err,result) {
                console.log("更新用户" + result);
                !!callback ? callback(result) : "";
                db.close();
            })
        });
    };
    exports.findAllUser = function (callback,whereStr) {
        var result;
        MongoClient.connect(url, function (err, db) {
            console.log(err)
            if (err)throw err;
            var collection = db.collection('user');
            if(!!whereStr) {
                result = collection.find(whereStr).toArray(function (err,result) {
                    console.log('find user is ok');
                    !!callback ? callback(result) : "";
                    db.close();
                });
            } else {
                result = collection.find().toArray(function (err,result) {
                    console.log('find user is ok');
                    !!callback ? callback(result) : "";
                    db.close();
                });
            }
        });
    };
    exports.searchUser = function (whereStr,callback) {
        MongoClient.connect(url, function (err, db) {
            if (err)throw err;
            var collection = db.collection('user');
            collection.find(whereStr).toArray(function (err,result) {
                console.log("查询用户用户" + result);
                !!callback ? callback(result) : "";
                db.close();
            })
        });
    };
    exports.deleteUser = function (whereStr,callback) {
        MongoClient.connect(url, function (err, db) {
            if (err)throw err;
            var collection = db.collection("user");
            collection.remove(whereStr, function (err,result) {
                console.log("删除用户" + result);
                !!callback ? callback(result) : "";
                db.close();
            })
        });
    }



