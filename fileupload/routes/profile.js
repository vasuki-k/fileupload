var path=require('path');
var mime=require('mime');
var express = require('express');
var router=express.Router();
var multer= require('multer');
var csv= require('csv-parse');
var fs=require('fs');



var async = require('async');
var dbConfig = require('../dbconfig');

function getItems(selectStatement, req, res) {

    var doConnect = function (cb) {
        dbConfig.doConnect(function (err, conn) {
            cb(null,conn);
        });
    };

    var doSelect = function (conn, cb) {
        dbConfig.doSelect(conn, selectStatement, function (err, result) {
            if (err) {
                console.log('Error in execution of select statement' + err.message);
                return cb(err, conn);
            } else {
                res.status(200).json(result.rows);
                return cb(null, conn);
            }
        });

    };

    async.waterfall(
            [
                doConnect,
                doSelect
            ],
            function (err, conn) {
                if (err) {
                    console.error("In waterfall error cb: ==>", err, "<==");
                    res.status(500).json({message: err});
                }
                if (conn)
                    dbConfig.dorelease(conn);
            });

}


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+'.csv');
  }
});

var upload = multer({ storage: storage }).single('avatar');

//var upload = multer().

router.post('/', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      return;
    }
    var file=req.file;
    fs.createReadStream(file.path).pipe(csv()).on('data',function(data){
        
        Array.from(data).forEach(function(names){
            console.log("crawling...",names);
          var selectStatement = "INSERT INTO DATA VALUES('"+names+"')";
          getItems(selectStatement, req, res);
            
        });
    }); 
    //res.send("ok");
    // Everything went fine
  });
});



router.get('/download', function (req, res) {
   ;
    var file='upload/avatar-1497855119398.xlsx';
    var filename=path.basename(file);
    var mimetype=mime.lookup(file);
    res.setHeader('Content-disposition','attachment;filename='+filename);
    res.setHeader('Content-type',mimetype);
    var filestream1=fs.createReadStream(file);
    filestream1.pipe(res);
});


module.exports=router;
