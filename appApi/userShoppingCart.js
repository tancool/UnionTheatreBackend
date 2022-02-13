const mongoose = require("mongoose");
const Router = require('koa-router');
const route = new Router;

route.post('/getusernotparmentinfo', async (ctx) => { // 查询用户订单的接口
    // 得到用户的请求.并返回其未支付的订单.
    // 未支付的订单状态码是1
    /*
    需求
    */
    const clientParams = ctx.request.body; // 用户参数集合;
    const userId = clientParams.userid; // 用户请求ID的参数
    const page = clientParams.page;
    const limit = 6;
    if (!userId) {
        ctx.body = { code: 400, data: "未输入合法参数" };
        return false;
    }
    if (!page) {
        page = 1;
    }
    const User = mongoose.model("User");
    const UserOrder = mongoose.model("UserOrder");
    const Movie = mongoose.model("Movie");
    let RETVal = [];
    let RETValTidy = [];
    console.log(userId);
    console.log(clientParams);
    try {

        // 查询到素有的用户订单
        const getUserOrder = await User.findOne({ userAccount: userId, }, { _id: 0, userOrder: 1 }).exec();

        if (!getUserOrder) {
            ctx.body = { code: 301, data: "未查询到该用户" };
            return false;
        }
        // 循环用户订单号.得到用户订单数据
        for (let item of getUserOrder.userOrder) {
            let temporarySaveData = await UserOrder.findOne({ orderCode: item, orderState: 1 }, { _id: 0, }).lean().exec(); // 返回未支付的订单
            if (temporarySaveData) {
                RETVal.push(temporarySaveData);
            } else {
                console.log("[WARN] : 发现不存在的订单.")
            }
        }

        // 根据用户订单.返回商品数据
        for (let item of RETVal) {
            let temporaryVarForMovieInfo = await Movie.findOne({ movieCode: item.productCode }, { _id: 0 }).exec();
            if (temporaryVarForMovieInfo) {
                item.moviesInfo = temporaryVarForMovieInfo;
            } else {
                console.log("[WARN] : 发现不存在的电影数据");
            }
        }
        RETValTidy = RETVal.slice(0, limit * page);
        if (RETVal.length == RETValTidy.length) {
            ctx.body = { code: 200, data: RETValTidy, finished: true };
        } else {
            ctx.body = { code: 200, data: RETValTidy };
        }
    } catch (e) {
        ctx.body = { code: 300, data: "查询出现意外的错误" };
        console.log(e);
    }

});
route.post('/settleaccounts', async (ctx) => {

    /*
    到这里需要做的逻辑是:查询用户是否包含此订单.
    以及用户发来的订购数量.
    查询此订单的价格.
    */
    const clientParamas = ctx.request.body;
    const orderContents = clientParamas.ordercontent;
    const userid = clientParamas.userid;
    const User = mongoose.model("User");
    const UserOrder = mongoose.model('UserOrder');
    const Movie = mongoose.model("Movie");
    console.log(clientParamas)
    try {

        let userOrders = await User.findOne({ userAccount: userid }, { _id: 0, userOrder: 1 }).exec();
        let clientOrdersContrastResult = true; // 默认所有结果都是对的

        for (let item of orderContents) { // 进行比对
            let contrastResult = userOrders.userOrder.find((item_) => {
                return item.productid == item_;
            });
            if (!contrastResult) { // 如果查询到不是的,就返回false.表示查到不是该用户的订单信息
                clientOrdersContrastResult = false;
                console.log("查询到异常订单");
                break;
            }
        }
        // 如果在用户订单中没有查询到该订单.结束
        if (!clientOrdersContrastResult) {
            ctx.body = { code: 301, data: "查询到异常订单" };
            return false;
        }

        let updateOrderResult = true;
        // 更新订单数据.并更新为待激活状态.
        for (let item of orderContents) {
            // , orderState: 2
            let updateResult = await UserOrder.updateOne({ orderCode: item.productid }, { buyCount: item.numberofpurchase }).exec();
            if (updateResult.Modified != 1) {
                updateResult = false;
            }
        }

        // 数据库更新失败.这里有BUG.更新失败应该把数据退回.而这里没有
        if (!updateOrderResult) {
            ctx.body = { code: 302, data: "更新订单失败" };
            return false;
        }

        let allPrice = 0;
        // 从数据库中拿到价格与个数.进行计算.
        for (let item of orderContents) {
            let getMovieInfoAndNumberOfPerchase = await UserOrder.findOne({ orderCode: item.productid }, { _id: 0, productCode: 1, buyCount: 1 }).exec();
            console.log(getMovieInfoAndNumberOfPerchase);
            let getPriceNow = await Movie.findOne({ movieCode: getMovieInfoAndNumberOfPerchase.productCode }, { _id: 0, moviePriceoNow: 1 }).exec(); //得到价格
            allPrice += getMovieInfoAndNumberOfPerchase.buyCount * getPriceNow.moviePriceoNow;
        }
        console.log(allPrice);
        ctx.body = { code: 200, data: allPrice };

    } catch (e) {
        console.log(e);
        ctx.body = { code: 300, data: "数据库查询发生意外错误" };
    }
})
module.exports = route;