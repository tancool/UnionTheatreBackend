const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;
const StrToObje = require('../commonFn/StrToObj');

const userOrderSchema = new Schema({
    userID: objectId,
    orderCode: { type: Number, unique: true, index: true }, // 订单号
    userCode: { type: Number }, // 用户ID
    orderState: Number, //  订单状态. /1是待支付 / 2是待激活 /3是待评价 / 4是心愿单
    oderTime: Number,//下单时间
    orderValueOnly: String,// 下单唯一生成值
    payTime: Number,// 支付时间
    showPriceOfOneWhenPaying: Number, // 显示单个支付价格
    actualPriceOfOneWhenPaying: Number, // 实际单个支付实际价格
    buyCount: Number, // 购买个数
    ismember: Boolean, // 是否是会员
    actualPayPrice: Number, // 实际支付金额
    productCode: Number, // 商品代码
    userComment: String, // 用户评论
});

// userOrderSchema.pre('save', function (next) { // 实现订单号自增的事件
//     let that = this;
//     const Count = mongoose.model("Count");
//     // 这样做在语法上是有问题的.但是先这样
//     Count.findOneAndUpdate({ collectionName: "userordercode" }, { "$inc": { "code": 1 } }, function (err, pointtoCount) {
//         if (err) {
//             console.log("用户订单自增数据出现错误")
//             next();
//         }
//         // console.log(pointtoCount.code);
//         // console.log(that);
//         that.orderCode = pointtoCount.code;
//         next();
//     })
// })

userOrderSchema.statics.saveDataSingle = function (data, whereSchema) {
    return new Promise((resolve, reject) => {
        new whereSchema(data).save(function (err) {
            if (err) {
                reject(err)
            }
            resolve("1");
        });
    })
};

userOrderSchema.statics.insertData = function (data) {
    return new Promise((resolve, reject) => {
        this.deleteMany({}, function (err) {
            if (err) {
                return false;
            }
            data[0].data.forEach((item, index) => {
                if (index == 0) {
                    return false;
                }
                const insertData = item;
                const UserOrder = mongoose.model("UserOrder");
                const dataTidy = StrToObje.StrTransformObj(insertData);
                const insertDataTidy = {
                    orderCode: dataTidy[0],
                    userCode: dataTidy[1],
                    orderState: dataTidy[2], // 这里为了简单.采用的是String的类型.
                    oderTime: Date.now(),
                    orderValueOnly: dataTidy[4],
                    payTime: Date.now(),
                    showPriceOfOneWhenPaying: dataTidy[6],
                    actualPriceOfOneWhenPaying: dataTidy[7],
                    buyCount: dataTidy[8],
                    ismember: dataTidy[9],
                    actualPayPrice: dataTidy[10],
                    productCode: dataTidy[11],
                    userComment: dataTidy[12],
                };
                // console.log(insertDataTidy);
                UserOrder.saveDataSingle(insertDataTidy, UserOrder).then((resolve_) => {
                    console.log(resolve_);
                    resolve("ok");
                }).catch((reject_) => {
                    console.log(reject_);
                    resolve("err");
                })
            })

        })
    })

};

mongoose.model("UserOrder", userOrderSchema);