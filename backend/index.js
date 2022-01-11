//initialize
const Port = 3000;//设置端口号，一般是3000
const express = require('express');
const {fstat} = require('fs');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const {resolve} = require('path');
const {rejects} = require('assert');
process.env.PORT = Port;

app.use('/', express.static(__dirname + '/public'));//allow browser access resources
app.use(cors());//允许跨域访问
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())

//err catch
process.on('uncaughtException', function (err) {
}) //监听未捕获的异常
process.on('unhandledRejection', function (err, promise) {
}) //监听Promise没有被捕获的失败函数

// const MongoUrl = "";

//测试
app.get('/api', (req, res) => {
    res.send('API Test OK!')
});

app.post('/log', ((req, res) => {
    console.log(req.body);
    const mongoUrl = req.body.mongoUrl;
    const collection = req.body.collection;
    const log = req.body.log;
    MongoClient.connect(mongoUrl, (err, db) => {
        if (err) throw err;
        const dbo = db.db('CloudLog');
        dbo.collection(collection).insertOne(log, (err, result) => {
            if (err) {
                throw err;
            }
            if (!err) {
                console.log("文档插入成功");
                res.send('OK');
            }
            db.close().then(r => {
            });
        });
    })
}))

app.post('/getLog', (req, res) => {
    // console.log('post')
    let getParm = req.body;
    const mongoUrl = getParm.mongoUrl;
    const collection = getParm.collection;
    const Num = parseInt(getParm.num);
    // console.log(mongoUrl, collection, Num)
    MongoClient.connect(mongoUrl, (err, db) => {
        if (err) throw err;
        const dbo = db.db('CloudLog');
        dbo.collection(collection).find().sort({$natural: -1}).limit(Num).toArray((err, result) => {
            if (err) throw err;
            // console.log(result);
            res.send(result);
        })
    })
});

app.listen(Port, () => console.log('服务器已就绪，运行在端口' + Port))//输出服务器启动信息

module.exports = app;