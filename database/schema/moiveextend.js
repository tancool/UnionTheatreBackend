const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;
const StrToObj = require('../commonFn/StrToObj');

const movieextendSchema = new Schema({
    movieId: objectId,
    movieCode: { type: Number, unique: true, index: true },//电影编码
    movieLikeAndDislick: { // 电影喜欢与不喜欢
        like: Number,
        disLike: Number,
    },
    movieScore: Number, // 电影得分
    movieAttention: Number,//电影热度
    movieClickCount: Number,//电影点击次数
    movieCommentFromUser: [[{ commentUser: { type: Number }, comment: String, supportTheCommnent: Number, addCommentData: String, score: Number }]],//电影评论 
    // 解疑 : 数组套数组.里面是自定义数据
    movieHaveSeeAndWantTosee: { // 电影看过与想看的人.
        haveSee: Number,
        wantToSee: Number,
    },
    // test: [{}],// 混合数据类型 => 如果不指定可以添加任何.但是如果指定了.就只能添加指定的数据
    // test1: [{ aa: Number }], // 混合数据类型.里面可以随便添加内容.不受限制.就如同电影评论一样.
    movieScoreList: {
        one: Number,
        two: Number,
        three: Number,
        four: Number,
        five: Number,
    },
    scoreLength: Number, // 评分人数
});
movieextendSchema.statics.saveDataSingle = function (data, whereSchmea) {
    // console.log(data);
    return new Promise((resolve, reject) => {
        new whereSchmea(data).save(function (err) {
            if (err) {
                console.log(err);
                reject("-1")
            } else {
                resolve("1");
            }
        })
    })
}
movieextendSchema.statics.insertData = function (data) {
    return new Promise((resolve, reject) => {
        this.deleteMany({}, function (err) {
            if (err) {
                return false;
            }
            const Movieextend = mongoose.model("Movieextend");
            data[0].data.forEach((item, index) => {
                if (index == 0) {
                    return false;
                }
                const insertData = item;
                let dataTidy = StrToObj.StrTransformObj(insertData);
                dataTidy[5].forEach((item, index) => { // 为评论手动进行添加时间.
                    item.push({ addCommentData: Date.now() });
                });
                console.log(dataTidy[5]);
                let inserDataTidy = {
                    movieCode: dataTidy[0],
                    movieLikeAndDislick: { // 电影喜欢与不喜欢
                        like: dataTidy[1][0].like,
                        disLike: dataTidy[1][1].disLike
                    },
                    movieScore: dataTidy[2], // 电影得分
                    movieAttention: dataTidy[3],//电影热度
                    movieClickCount: dataTidy[4],//电影点击次数
                    movieCommentFromUser: dataTidy[5],
                    movieHaveSeeAndWantTosee: { // 电影看过与想看的人.
                        haveSee: dataTidy[6][0].haveSee,
                        wantToSee: dataTidy[6][1].wantToSee,
                    },
                    movieScoreList: {
                        one: dataTidy[7][0][0].one,
                        two: dataTidy[7][0][1].two,
                        three: dataTidy[7][0][2].three,
                        four: dataTidy[7][0][3].four,
                        five: dataTidy[7][0][4].five,
                        six: 666,
                    },
                    // test: {
                    //     "123": "321",
                    //     c: { a: 555 },
                    // },
                    // test1: { aa: 777,bb:543543 },
                    scoreLength: dataTidy[8],
                    // test:"123",
                }
                Movieextend.saveDataSingle(inserDataTidy, Movieextend).then((resolve_) => {
                    resolve('ok');
                    console.log(resolve_);
                }).catch((reject_) => {
                    reject("err");
                    console.log(reject_);
                })
            })

        })
    })

}

mongoose.model("Movieextend", movieextendSchema);
