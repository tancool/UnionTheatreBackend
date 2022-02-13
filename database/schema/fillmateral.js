const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const StoToObj = require("../commonFn/StrToObj");

const fillMateralSchema = new mongoose.Schema({
    index: {// 首页
        icon: { type: String },
        bannerImg: {
            // 这个应该可以随便写.做一个记录
            bannerImgOne: {
                url: String,
                text: String,
            },
            bannerImgTwo: {
                url: String,
                text: String,
            },
            bannerImgThree: {
                url: String,
                text: String,
            },
        },
    },
    attentionPage: { // 都在看
        attentionImg: String,
    },
    MyLoginPage: {
        bellLocal: { // 小铃铛的图片
            type: String,
        },
        loginBG: {
            type: String
        }
    },
    myOrder: { // 我的订单图片
        noOrderImg: {
            type: String,
        }
    },
    Mymemeber: { // 我的会员图片
        ShowImg: {
            type: String,
        }
    },
    ArticleTag: [String],
    data: { type: String }, // 时间用String来进行表示.毫秒为单位.
});

fillMateralSchema.statics.saveDataSingle = function (data, whereSchema) {
    return new Promise((resolve, reject) => {
        new whereSchema(data).save(function (err) {
            if (err) {
                reject("-1")
            }
            resolve("1");
        });
    })
};

fillMateralSchema.statics.insertData = function (data) {
    return new Promise((resolve, reject) => {
        this.deleteMany({}, function (err) {
            if (err) {
                return false;
            }
            const insertData = data[0].data[1];
            const FillMateral = mongoose.model("FillMateral");
            const dataTidy = StoToObj.StrTransformObj(insertData);
            // console.log(dataTidy);
            const inserDateTidy = {
                index: {// 首页
                    icon: dataTidy[0],
                    bannerImg: {
                        bannerImgOne: { url: dataTidy[1][0][0].url, text: dataTidy[1][0][1].text },
                        bannerImgTwo: { url: dataTidy[2][0][0].url, text: dataTidy[2][0][1].text },
                        bannerImgThree: { url: dataTidy[3][0][0].url, text: dataTidy[3][0][1].text },
                    },
                },
                attentionPage: { // 都在看
                    attentionImg: dataTidy[4],
                },
                MyLoginPage: {
                    bellLocal: dataTidy[5],
                    loginBG: dataTidy[8],

                },
                myOrder: { // 我的订单图片
                    noOrderImg: dataTidy[6],
                },
                Mymemeber: { // 我的会员图片
                    ShowImg: dataTidy[7],
                },
                ArticleTag: dataTidy[9].split(','),
                data: Date.now(),
            };
            console.log(dataTidy[9].split(','));
            FillMateral.saveDataSingle(inserDateTidy, FillMateral).then((resolve_) => {
                console.log(resolve_);
                resolve('ok');
            }).catch((reject_) => {
                confirms.log(reject_);
                reject("err");
            })

        })
    })
}
mongoose.model('FillMateral', fillMateralSchema); // 注册mongoose
//Model的首字母是大写的
