const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;
const StrToObj = require('../commonFn/StrToObj');
const articleSchema = new Schema({
    articleId: objectId,
    articeCode: { type: Number, unique: true, index: true }, // 文章唯一编码
    movieId: Number, // 电影ID
    userId: Number, // 用户ID
    articleCreateDate: String, // 文章创建日期
    articleChangeData: String, // 文章修改日期
    articleTitle: String,  // 文章标题
    articleContent: String, // 文章内容
    articleComment: [[{ commentUser: Number, commentDate: String, commentSupport: Number, commentScore: Number, commentContent: String }]], // 文章评论
    articleIMG:String, // 文章图片
    actileViews:Number,
});

articleSchema.statics.saveDataSingle = function (data, whereSchmea) {
    console.log(data);
    return new Promise((resolve, reject) => {
        new whereSchmea(data).save(function (err) {
            if (err) {
                reject("-1")
            } else {
                resolve("1");
            }
        })
    })
}

articleSchema.statics.insertData = function (data) {
    return new Promise((resolve, reject) => {
        this.deleteMany({}, function (err) {
            if (err) {
                return false;
            }
            console.log(data[0].data[1])
            const Article = mongoose.model("Article");
            data[0].data.forEach((item, index) => {
                if(index == 0){
                    return false;
                }
                const insertData =item;
                const dataTidy = StrToObj.StrTransformObj(insertData);
                // console.log(dataTidy);
                let insertDateTidy = {
                    articeCode: dataTidy[0],
                    movieId: dataTidy[1],
                    userId: dataTidy[2],
                    articleCreateDate: Date.now(),
                    articleChangeData: Date.now(),
                    articleTitle: dataTidy[5],
                    articleContent: dataTidy[6],
                    articleComment: dataTidy[7],
                    articleIMG:dataTidy[8],
                    actileViews:dataTidy[9],
                }
                Article.saveDataSingle(insertDateTidy, Article).then((resolve_) => {
                    resolve("ok")
                    console.log(resolve_);
                }).catch((reject_) => {
                    reject("err");
                    console.log(reject_);
                });
            })

        })
    })

}

mongoose.model("Article", articleSchema);