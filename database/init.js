const mongoose = require('mongoose');

const golb = require("glob");
const { resolve } = require("path");
const db = 'mongodb://localhost:27017/films';

exports.initSchmeas = () => {
    golb.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require);
}

exports.connect = () => {
    let maxConnectCounts = 0;
    mongoose.set('useCreateIndex', true) //加上这个
    mongoose.set('useFindAndModify', false) // 解决findOneAndUpdate / findoneAndDelete报错问题
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
    return new Promise((resolve, reject) => {
        mongoose.connection.on('disconnected', (err) => {
            console.log("数据库断开");
            if (maxConnectCounts <= 3) {
                maxConnectCounts++;
                mongoose.connect(db);
            } else {
                reject(err);
                throw new Error("数据库出现问题,程序无法绑定");
            }
        });
        mongoose.connection.on("error", (err) => {
            if (maxConnectCounts <= 3) {
                maxConnectCounts++;
                mongoose.connect(db);
            } else {
                reject(err);
                throw new Error("数据库出现问题,程序无法绑定");
            }
        });
        mongoose.connection.once('open', () => {
            console.log("数据库连接成功");
            resolve("ok");
        });
    })
}