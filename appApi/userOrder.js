const mongoose = require('mongoose');
const Router = require('koa-router');
const route = new Router;

// 得到所有商品的信息
route.post('/allproduct', async (ctx) => {
    const User = mongoose.model('User');
    const UserOrder = mongoose.model("UserOrder");
    let clientParams = ctx.request.body; // 接收到的参数
    const userKey = clientParams.userKey; // 查询的主键=>用户账号

    // 如果是0是查询所有 / 1是待支付 / 2是待激活 /3是待评价 / 4是心愿单
    let findKey = clientParams.findKey; // 查询的筛选按键 =>见上方
    let pages = clientParams.pages;// 对用户输入的数据进行下检测 => 多少页

    if (!parseInt(pages)) {
        pages = 1;
    }
    console.log(clientParams);
    const limit = 10;
    let RETData = [];
    let REturnDataFilterAfter = [];
    try {
        let getUserOrder = await User.findOne({ userAccount: userKey }, { userOrder: 1, _id: 0 }).exec(); // 返回用户订单数组.
        if (findKey == 0) {// 等于0是查询全部
            for (let item of getUserOrder.userOrder) {
                // 这里返回的数据默认是所有数据.需要在这里进行调节
                let temVal = await UserOrder.findOne({ orderCode: item }, { _id: 0, __v: 0 }).exec();  // 不能是findOne.数据订单号是唯一的.
                // 如果返回的数据不为空
                if (temVal) {
                    RETData.push(temVal);
                }
            };
        } else {
            for (let item of getUserOrder.userOrder) {
                let temVal = await UserOrder.findOne({ orderCode: item, orderState: findKey }, { _id: 0, __v: 0 }).exec();  // 不能是findOne.数据订单号是唯一的.
                // 如果返回的数据不为空
                if (temVal) {
                    RETData.push(temVal);
                }
            };
        }
        console.log("返回数据开始");
        // 这里要模拟一下分页数据的效果.一页是返回十个.
        /*
        具体的算法是 : 
            返回数据 = RETData.slice(0,pages*limit); => 由于VUE要渲染整个DOM.
        */


        REturnDataFilterAfter = RETData.slice(0, limit * pages);
        if (REturnDataFilterAfter.length == RETData.length) {
            ctx.body = { code: 200, data: REturnDataFilterAfter, finished: true };
            console.log("请求全部");
        } else {
            ctx.body = { code: 200, data: REturnDataFilterAfter };

        }

    } catch (err) {// 查询数据出错
        console.log(err);
        ctx.body = { code: 400, data: "err" };
    }
});
// 等待支付 => 此接口暂未使用
route.post('/notpayment', async (ctx) => {
    const User = mongoose.model('User');
    const UserOrder = mongoose.model("UserOrder");

});
// 已经购买,等待激活  => 此接口暂未使用
route.post('/waitactivate', async (ctx) => {
    const User = mongoose.model('User');
    const UserOrder = mongoose.model("UserOrder");

});
// 等待评论 => 此接口暂未使用
route.post('/waitcomment', async (ctx) => {
    const User = mongoose.model('User');
    const UserOrder = mongoose.model("UserOrder");

});

// 用户取消收藏的接口
route.post("/cancelcollect", async (ctx) => {
    console.log("这是用户取消收藏的接口");
    const clientParams = ctx.request.body;
    const userid = clientParams.userid;
    const movieid = clientParams.movieid;
    console.log(userid);
    console.log(!(movieid && userid));

    const User = mongoose.model("User");
    if (!(userid && movieid)) {
        ctx.body = { code: 400, data: "参数错误" };
        return false;
    }
    try {
        // 查找数据中是否包含此条数据
        const userWantToWatchArr = await User.findOne({ userAccount: userid }, { _id: 0, userWantToWatch: 1 }).lean().exec();
        let MovieIdisExistInTheUserTable = false;
        const searchMovieResult = userWantToWatchArr.userWantToWatch.filter((item) => {
            if (item.movieid == movieid) {
                MovieIdisExistInTheUserTable = true;
            }
            return item.movieid != movieid; // 返回符合结果的值.
        });
        // 如果查询到不存在.
        if (!MovieIdisExistInTheUserTable) {
            ctx.body = { code: 301, data: "未查询到该收藏信息" }
            return false;
        }

        const deleteOneOfTheCollectInTheUser = await User.updateOne({ userAccount: userid }, { userWantToWatch: searchMovieResult }).exec();
        if (deleteOneOfTheCollectInTheUser.nModified == 1) {
            ctx.body = { code: 200, data: "全部成功" }
        } else {
            ctx.body = { code: 303, data: "删除数据失败" };
        }
    } catch (e) {
        console.log(e);
        ctx.body = { code: 300, data: "意外查询错误" }
    }
});

// 用户购买票的接口
route.post('/buyticket', async (ctx) => {
    /*
    需要传递的参数:
        - 购买电影的ID
        - 用户ID
    - 传到此接口, 直接使用这两个数据就可以成功.而不用那么多验证.
    - 前端街道成功之后就开始做购买动画
    */
    // 功能: 将收藏的删除掉.增加到待激活的订单当中.
    // 并且订单自动加一.记录上响应的数据
    const clientParams = ctx.request.body;
    const userid = clientParams.userid; // 用户ID
    const movieid = clientParams.movieid; // 电影ID
    const buycount = parseInt(clientParams.counts) || 1; // 购买个数
    const User = mongoose.model("User");
    const UserOrder = mongoose.model("UserOrder");
    const Movie = mongoose.model("Movie");
    const Count  = mongoose.model("Count");

    if (!(movieid && userid)) { // 如果这两个参数不存在的话
        ctx.body = { code: 400, data: "参数错误" };
        return;
    }
    try {
        // 查找该用户
        const userWantToWatchArr = await User.findOne({ userAccount: userid }, { _id: 0, userWantToWatch: 1 }).lean().exec();
        let MovieIdisExistInTheUserTable = false;
        // 查找用户收藏夹中是否包含此信息
        // 重新保存进数据库的值.
        const searchMovieResult = userWantToWatchArr.userWantToWatch.filter((item, index) => {
            if (item.movieid == movieid) {
                MovieIdisExistInTheUserTable = true;
            }
            return item.movieid != movieid; // 返回符合结果的值.
        });

        // 如果没有包含直接结束
        if (!MovieIdisExistInTheUserTable) {
            ctx.body = { code: 300, data: "未在用户收藏夹中寻找到此信息" };
            console.log("未在用户收藏夹中寻找到此信息");
            return false;
        }
        const searchMovieInfo = await Movie.findOne({ movieCode: movieid }, { _id: 0, moviePriceoNow: 1 }).exec();
        // console.log(searchMovieInfo);

        // 如果没有寻找到此电影信息
        if (!searchMovieInfo) {
            ctx.body = { code: 301, data: "未寻找到此电影信息" };
        }

        // 电影票现在的价格
        let priceNow = searchMovieInfo.moviePriceoNow;
        // 生成唯一值.这里假设唯一的十位乱码
        let randomStr = 'abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ~!@#$%^&*()_+<>?":{}|"';
        let createStr = '';
        for (let i = 0; i < 10; i++) {
            createStr += randomStr[parseInt(Math.random() * 10000) % 50]
        }


        let addResult =  await Count.findOneAndUpdate({ collectionName: "userordercode" }, { "$inc": { "code": 1 } }).exec();
        const orderCodeNow = addResult.code;
        console.log(orderCodeNow);

        // 插入用户订单到用户订单collection中
        const InsertUserOrderData = {
            userCode: userid,
            orderCode:orderCodeNow,
            orderState: 1,
            oderTime: Date.now(),
            orderValueOnly: 'adasdsadas',
            orderValueOnly: createStr,
            payTime: Date.now(),
            showPriceOfOneWhenPaying: priceNow,
            actualPriceOfOneWhenPaying: buycount * priceNow,
            buyCount: buycount,
            ismember: false,
            productCode: movieid,
            userComment: 'null',
        };

        // console.log(InsertUserOrderData)
        let insertResult = await new UserOrder(InsertUserOrderData).save();
        // console.log(insertResult);

        let saveOrderCodeToUserOrderArr = insertResult.orderCode; // 拿到插入的ID
        let inserUserOrderArrResult = await User.update({ userAccount: userid }, { "$push": { "userOrder": saveOrderCodeToUserOrderArr } }); // 插入到用户信息当中去

        console.log("inserUserOrderArrResult");
        console.log(inserUserOrderArrResult);
        // 在用户订单中插入订单ID.

        // 如果插入失败
        if (!insertResult) {
            ctx.body = { code: 302, data: "插入数据库信息失败" };
        }

        // 插入数据成功之后.删除我的收藏里删除该订单.
        // 需要把该数组中的一项给删除掉.
        const deleteOneOfTheCollectInTheUser = await User.updateOne({ userAccount: userid }, { userWantToWatch: searchMovieResult }).exec();
        console.log(deleteOneOfTheCollectInTheUser);
        if (deleteOneOfTheCollectInTheUser.nModified == 1) {
            ctx.body = { code: 200, data: "全部成功" }
            console.log("请求成功");
        } else {
            ctx.body = { code: 303, data: "删除数据失败" };
        }

    } catch (err) {
        console.log(err);
        ctx.body = { code: 304, data: "查询错误" };
    }

})

module.exports = route;