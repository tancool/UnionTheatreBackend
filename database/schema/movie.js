const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

/*
修改日期.
以及 抽象出函数.
*/

const movieSchema = new mongoose.Schema({
    movieId: ObjectId,
    movieCode: { type: Number, unique: true, index: true },//电影编码  // 建立索引是使用index
    englishNameOfMovie: String,//电影英文名称
    chinaNameOfMovie: String,//电影中文名称
    imgLinkOfMovie: String,//电影图片链接
    movieReleaseDate: String, //eg : "20200202" // 电影发布日期
    movieGenre: String, // 电影类型
    movieDirector: String, // 电影导演
    movieStars: [String], // 电影参演明星
    movieCreator: String,  // 电影文学创造者
    movieTagOfLoL: String, // 电影LOL标签
    movieSynopsis: String, // 电影简介
    moviePriceOrgin: Number, // 电影原价
    moviePriceoNow: Number, // 电影现价
    movieOccurrenceTime:String, // 时间线
});

movieSchema.statics.saveDataSingle = function (data, whereSchema) {
    return new Promise((resolve, reject) => {
        new whereSchema(data).save(function (err) {
            if (err) {
                reject("-1")
            }
            resolve("1");
        });
    })
};

movieSchema.statics.insertData = function (data) { // 静态方法
    return new Promise((resolve, reject) => {
        this.deleteMany({}, function (err) { // 里面的this不在指向collection.
            // this指向collection
            if (err) {
                return false;
            }
            const Movie = mongoose.model("Movie");
            data[0].data.forEach((item, index) => {
                if(index == 0){
                    return false;
                }
                const insertData = item;
                // console.log(insertData[7]);  不用转换数组,mongoose可以实现自动识别
                console.log(insertData);
                const inserDataTidy = {
                    movieCode: insertData[0],
                    englishNameOfMovie: insertData[1],
                    chinaNameOfMovie: insertData[2],
                    imgLinkOfMovie: insertData[3],
                    movieReleaseDate: Date.now(),
                    movieGenre: insertData[5],
                    movieDirector: insertData[6],
                    movieStars: insertData[7].split('/'),
                    movieCreator: insertData[8],
                    movieTagOfLoL: insertData[9],
                    movieSynopsis: insertData[10],
                    moviePriceOrgin: insertData[11],
                    moviePriceoNow: insertData[12],
                    movieOccurrenceTime:insertData[13],
                };
                Movie.saveDataSingle(inserDataTidy, Movie).then((resolve_) => {
                    console.log(resolve_);
                    resolve("ok");
                }).catch((reject_) => {
                    console.log(reject_);
                    reject("err");
                })
            })

        });
    })

}

mongoose.model('Movie', movieSchema); // 注册mongoose 
//Model的首字母是大写的
