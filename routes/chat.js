/**
 * Created by p.c.chen on 2/23/2017.
 */
/**
 * Created by p.c.chen on 2/23/2017.
 */
var db=require("../db");
var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
    db.addUser(req.body,function(reslut){
        res.send("add user is ok")
    });
});

module.exports = router;
