const mongoose = require('mongoose');
const Router = require("koa-router")
const CommonFn = require("./CommonFN");
const route = new Router();

route.get('/gettheaters', async (ctx) => { // 获得电影值的信息
    // 排序.个数.搜索字段.页码
    /* 
    - 前端发来的数据
        sort  => 依据什么进行排序
        pages => 发来的页数

    - 默认是倒序 / 一页显示多少个由后台进行决定.
    */

    /** 
     * 排序方式分别有 : 
     *  - 正在热映 => movieAttention / 前端发来的1代表此页
     *  - 最受喜欢 => movieLikeAndDislick.like / 前端发来的2代表此页
     *  - 最受期待 => movieHaveSeeAndWantTosee.wantToSee / 前端发来的3代表此页
     *  - 得分最高 => movieScore / 前端发来的4代表此页
     * 
     * */
    const Movie = mongoose.model("Movie");
    const MovieExtend = mongoose.model("Movieextend");

    const clientQuery = JSON.parse(JSON.stringify(ctx.query));
    const csign = parseInt(clientQuery.csign); // 依据什么进行排序
    let descStr = ''; // 进行搜索的key值
    const pages = parseInt(clientQuery.pages); // 从第几页开始
    const limit = 10; // 由后台决定

    if (!(csign && pages)) {
        ctx.body = { code: 300, data: "参数错误" };
        return false;
    }
    switch (csign) {
        case 1:
            descStr = 'movieAttention'; // 正在热映
            break;
        case 2:
            descStr = 'movieLikeAndDislick.like'; // 最受喜欢
            break;
        case 3:
            descStr = 'movieHaveSeeAndWantTosee.wantToSee'; // 最受期待
            break;
        case 4:
            descStr = 'movieScore'; // 得分最高
            break;
        default:
            descStr = 'movieAttention'; // 如果出现意外情况,默认是正在热映.
            console.log("出现意外的设置.现已经设置为1");
    }
    let RETData = [];
    let saveKey = [];// 多级查询中用于保存的key
    try { // 根据参数返回指定的数据
        // 得到排序的key值
        saveKey = await MovieExtend.find({}, { movieCode: 1, _id: 0, movieScore: 1 }).sort({ [descStr]: -1 }).limit(pages * limit).exec();

        let docoumentLength = await MovieExtend.countDocuments({}).exec(); // 返回数据的个数

        // 根据key值进行查找数据
        for (let item of saveKey) {
            let temDtaSingle = await Movie.findOne({ movieCode: item.movieCode }, { _id: 0, __v: 0 }).lean().exec();// 可编辑
            temDtaSingle.score = item.movieScore; // 添加分数
            RETData.push(temDtaSingle);
        }
        if (saveKey.length == docoumentLength) {
            ctx.body = { code: 200, data: RETData, finished: true };
        } else {
            ctx.body = { code: 200, data: RETData };
        }
    } catch (err) {
        ctx.body = { code: 400, data: "尝试查询数据库发生错误" };
        console.log(err);
    }

});

route.post("/addtoshoppingcart", async (ctx) => { // 添加到购物车的接口
    /*
    前台会传来两个数据
        - 用户ID
        - 电影ID

    - 操作逻辑是
        - 查询该用户是否存在.
        - 先查询电影的实际价钱.
        - 查询之后创建订单表.
        - 订单表的ID是1
    */
    /*
    重新梳理用户加入购物车的逻辑.
     - 首先查询该用户是否存在
     - 再次查询该用户购买的商品是否存在
         - 如果存在,那么就新添加商品
         - 如果不存在,那么就创建商品订单.
    */
    const clientParams = ctx.request.body;
    const userAccount = clientParams.userid;
    const movieid = clientParams.movieid;
    const User = mongoose.model("User");
    const Movie = mongoose.model("Movie");
    const UserOrder = mongoose.model("UserOrder");
    if (!(userAccount && movieid)) {
        ctx.body = { code: 300, data: "参数传输错误" };
        return false;
    }
    try {
        // 逻辑实现

        // 查询该用户是否存在
        const searchUser = await User.findOne({ userAccount: userAccount }).exec();
        if (!searchUser) {
            console.log("该用户不存在.")
            ctx.body = { code: 301, data: "该用户不存在" };
            return false;
        }


        // console.log(searchUser);
        // 查询该用户未支付的订单中是否包含此商品.
        const whetherUserOrderIncludesTheProduct = await UserOrder.findOne({ userCode: userAccount, orderState: 1, productCode: movieid }).exec();

        // 如果用户未支付订单中存在该商品.就把该商品的个数加一
        if (whetherUserOrderIncludesTheProduct) {
            let productQuantityIncreasedByOne = await UserOrder.updateOne({ userCode: userAccount, orderState: 1, productCode: movieid }, { "$inc": { buyCount: 1 } }).exec();
            // 如果数据更新成功
            if (productQuantityIncreasedByOne.nModified == 1) {
                ctx.body = { code: 202, data: "已有数据更新个数成功" };
                console.log("已有数据更新个数成功");
            } else {
                ctx.body = { code: 302, data: "已有数据更新个数失败" };
                console.log("已有数据更新个数失败");
            }
            return false;
        }

        // 如果用户订单中不包含该商品. 首先查询到该商品的实际价格.
        const theProductPrice = await Movie.findOne({ movieCode: movieid }, { _id: 0, moviePriceoNow: 1, moviePriceOrgin: 1 }).exec();

        // 如果没有查询到该商品
        if (!theProductPrice) {
            console.log("没有在数据库查询到该商品")
            return false;
        }

        // 模拟生成唯一识别码
        let randomStr = 'abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ~!@#$%^&*()_+<>?":{}|"';
        let createStr = '';
        for (let i = 0; i < 10; i++) {
            createStr += randomStr[parseInt(Math.random() * 10000) % 50]
        }
        // 得到用户订单数据
        const Count = mongoose.model("Count");
        const addResult = await Count.findOneAndUpdate({ collectionName: "userordercode" }, { "$inc": { "code": 1 } }).exec();
        const orderCodeNow = addResult.code;
        // console.log(orderCodeNow);
        // console.log(addResult);
        // console.log("打印");
        // 准备插入订单数据

        const createNewOrder = {
            userCode: userAccount,
            orderCode:orderCodeNow,
            orderState: 1,
            oderTime: Date.now(),
            orderValueOnly: createStr,// 下单唯一生成值
            payTime: Date.now(),// 支付时间
            showPriceOfOneWhenPaying: theProductPrice.moviePriceOrgin, // 显示单个支付价格
            actualPriceOfOneWhenPaying: theProductPrice.moviePriceoNow, // 实际单个支付实际价格
            buyCount: 1, // 购买个数
            ismember: false, // 是否是会员
            actualPayPrice: theProductPrice.moviePriceoNow, // 实际支付金额
            productCode: movieid, // 商品代码
            userComment: 'null', // 用户评论
        };

        // 得知插入结果
        let insertResult = await new UserOrder(createNewOrder).save();
        // 用户订单加入该该用户的ID中
        let insertOrderCodeInUser = await User.findOneAndUpdate({ userAccount: userAccount }, { "$push": { userOrder: orderCodeNow } }).exec();
        // console.log("插入结果");
        // console.log(insertOrderCodeInUser);
        if (insertResult) {
            ctx.body = { code: 200, data: "创建订单成功" };
            console.log("添加到数据库成功");
        } else {
            ctx.body = { code: 303, data: "插入订单失败" }
        }
    } catch (err) {
        console.log(err);
        ctx.body = { code: 400, data: "查询出现意外错误" };

    }
})
module.exports = route;