const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;
const strToObj = require("../commonFn/StrToObj");
const movieCommentSchema = new Schema({
    movieCommentID: objectId,// 用户评论ID
    movieCommentCode: { type: Number, unique: true, index: true }, // 此条评论ID
    userCodeAboutTheComment: Number, // 用户ID
    movieCodeAboutTheComment: Number,//电影ID
    commentAddTime: String,//评论添加时间
    commentSuppotNumber: Number,//支持此评论的人数
    commentScore: Number,// 此评论给电影评分
    commentChangeTime: String,//评论修改时间
    comnent: String,
});

movieCommentSchema.statics.saveDataSingle = function (data, whereSchema) {
    return new Promise((resolve, reject) => {
        new whereSchema(data).save(function (err) {
            if (err) {
                reject("-1")
            }
            resolve("1");
        });
    })
};

movieCommentSchema.statics.insertData = function (data) {
    return new Promise((resolve, reject) => {
        this.deleteMany({}, function (err) {
            if (err) {
                return false;
            }
            data[0].data.forEach((item, index) => {
                if(index == 0){
                    return false;
                }
                const insertData = item;
                const MovieComment = mongoose.model("MovieComment");
                const dataTidy = strToObj.StrTransformObj(insertData);
                const insertDataTidy = {
                    movieCommentCode: dataTidy[0],
                    userCodeAboutTheComment: dataTidy[1],
                    movieCodeAboutTheComment: dataTidy[2],
                    commentAddTime: Date.now(),
                    commentSuppotNumber: dataTidy[4],
                    commentScore: dataTidy[5],
                    commentChangeTime: Date.now(),
                    comnent: dataTidy[7],
                };
                MovieComment.saveDataSingle(insertDataTidy, MovieComment).then((resolve_) => {
                    console.log(resolve_);
                    resolve("1");
                }).catch((reject_) => {
                    console.log(reject_);
                    reject("-1");
                });
            })

        })
    })

}


mongoose.model("MovieComment", movieCommentSchema);