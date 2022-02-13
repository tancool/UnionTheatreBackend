const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;
const StrToObj = require('../commonFn/StrToObj');
const crypto = require('crypto');

const userSchema = new Schema({
    userId: objectId,
    userCode: { type: Number, unique: true, index: true }, // 用户编码
    userAccount: { type: String, unique: true, index: true }, // 用户账号
    userPass: String,// 用户密码
    userAticle: [Number], // 用户发表的文章
    userRegiserTime: String,//用户注册时间
    userLoginTimeLast: String,//用户最后登录时间
    userinform: [[{ time: { type: String }, content: { type: String } }]],//用户通知
    userOrder: [Number],//用户订单 => 
    userShoppingCar: { nopay: { type: [Number] }, paid: { type: [Number] }, toCommentOn: { type: [Number] } },//用户购物车.用户订单这个数据库存储暂时没有用.购物车可以替代.===========================
    userWantToWatch: [{ movieid: Number, collectdata: Number }],//用户想看
    userComment: [Number],//用户的评论
    userMemberState: Boolean,//用户的会员
    userAvatar: String,//用户头像
    userNetName: String,
    loginForPhone: { type: Number, default: 1 },// 是否是手机用户
    saveUserToken: String,//存储用户的Token
});

userSchema.pre('save', function (next) { // 数据插入后.保存之前执行的动作
    let that = this;
    // console.log(this); // 这里的this应该是指向与document.
    const Count = mongoose.model("Count");
    Count.findOneAndUpdate({ collectionName: 'usercode' }, { "$inc": { code: 1 }, upsert: true }, function (err, pointtoCount) {
        // console.log("用户自增被执行了");
        if (err) {
            console.log("用户ID自增出现错误");
            next();
        }
        if (that.userPass) { // 如果存在用户密码,那么就加密用户密码.手机用户是没有密码的
            that.userPass = crypto.createHash("sha256").update(that.userPass).digest('hex'); // digest表示调整十六进制.
        }
        // 进行加密保存
        that.userCode = pointtoCount.code; // 设置指向
        next();
    })

});
userSchema.statics.saveDataSingle = function (data, whereSchema) {
    return new Promise((resolve, reject) => {
        new whereSchema(data).save(function (err) {
            if (err) {
                reject(err);
            }
            resolve("1");
        });
    })
};
userSchema.statics.insertData = function (data) {
    return new Promise((resolve, reject) => {

        this.deleteMany({}, function (err) {
            if (err) {
                return false;
            }
            const User = mongoose.model("User");
            console.log(data[0]);
            data[0].data.forEach((item, index) => {
                if (index == 0) {
                    return false;
                }
                const insertData = item;
                const dataTidy = StrToObj.StrTransformObj(insertData);
                const insertDataTidy_draft = { // 暂时叫做draft.不修改名称了
                    userCode: dataTidy[0],
                    userAccount: dataTidy[1],
                    userPass: dataTidy[2],
                    userAticle: StrToObj.StrLikeNumTranformArr(dataTidy[3]),
                    userRegiserTime: Date.now(),
                    userLoginTimeLast: Date.now(),
                    userinform: dataTidy[6],
                    userOrder: StrToObj.StrLikeNumTranformArr(dataTidy[7]),
                    userShoppingCar: {
                        nopay: StrToObj.StrLikeNumTranformArr(dataTidy[8][0].nopay), paid: StrToObj.StrLikeNumTranformArr(dataTidy[8][1].paid)
                        , toCommentOn: StrToObj.StrLikeNumTranformArr(dataTidy[8][2].toCommentOn)
                    },
                    userWantToWatch: StrToObj.twoDimensionTranslateOne(dataTidy[9]), // 一维数组中保存对象 20200820.
                    userComment: StrToObj.StrLikeNumTranformArr(dataTidy[10]),
                    userMemberState: dataTidy[11],
                    userAvatar: dataTidy[12],
                    userNetName: dataTidy[13],
                    loginForPhone: 0, // 0表示不是手机登录
                    saveUserToken: '',// 保存token
                };


                console.log(insertData[9]);
                User.saveDataSingle(insertDataTidy_draft, User).then((resolve_) => {
                    console.log(resolve_);
                    resolve("ok");
                }).catch((reject_) => {
                    console.log(reject_)
                    reject("err");
                })
            })

        })

    })

}

mongoose.model("User", userSchema);