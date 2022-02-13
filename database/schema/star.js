const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;
const StrToObj = require("../commonFn/StrToObj");

const starSchema = new Schema({
    starId: objectId,
    starCode: { type: Number, unique: true, index: true },//明星编码
    chinaNameOfStar: String, // 明星中文名
    englishNameOfStar: String,//明星英文名
    starImg: String,//明星图片
    synopsis: String,// 明星简介
    starCommentsFormOthers: [[{ who: { type: String }, comment: { type: String } }]], //其他人对明星的评论
});

starSchema.statics.saveDataSingle = function (data, whereSchema) {
    return new Promise((resolve, reject) => {
        new whereSchema(data).save(function (err) {
            if (err) {
                reject("-1")
            }
            resolve("1");
        });
    })
};


starSchema.statics.insertData = function (data,) {
    return new Promise((resolve, reject) => {
        this.deleteMany({}, function (err) {
            if (err) {
                return false;
            }
            const Star = mongoose.model("Star");
            data[0].data.forEach((item, index) => {
                if(index == 0){
                    return false;
                }
                const insertData = item;
                console.log(item);
                const dataTidy = StrToObj.StrTransformObj(insertData);
                const insertDataTidy = {
                    starCode: dataTidy[0],
                    chinaNameOfStar: dataTidy[1],
                    englishNameOfStar: dataTidy[2],
                    starImg: dataTidy[3],
                    synopsis: dataTidy[4],
                    starCommentsFormOthers: dataTidy[5],
                }
                Star.saveDataSingle(insertDataTidy, Star).then((resolve_) => {
                    console.log(resolve_);
                    resolve("ok");
                }).catch((reject_) => {
                    console.log(reject_);
                    reject("err");
                });
            })

        })
    })

}

mongoose.model("Star", starSchema);