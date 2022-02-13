const Router = require('koa-router');
const route = new Router;
const mongoose = require("mongoose");
const CommonFN = require("./CommonFN");

route.get('/test', async (ctx) => {
    ctx.body = "test";
});

route.get('/getarticle', async (ctx) => {
    /* 
    searchKey
    searchVal  搜索字段
    limit  一页显示多少数据
    pages 从第几页开始显示
    desc 排序方式
    descstr 排序字段
    
    offset  跳过多少数据 => 这个是由后台进行计算的
    */

    const clientQuery = JSON.parse(JSON.stringify(ctx.query));
    const Article = mongoose.model('Article');
    const User = mongoose.model("User");

    // const searchKey = clientQuery.searchKey; // 搜索的主键
    // const searchVal = clientQuery.searchVal; // 搜索的值
    // const descstr = clientQuery.descstr; // 排序的字段
    // const desc = clientQuery.desc; // 排序
    const page = clientQuery.page;
    const limit = 10; // 从第几页开始
    const csign = clientQuery.csign; // 标志

    // 如果传递参数为空.那么就是首次进入页面的请求.
    let RETData = [];
    let RETDataExtend = [];
    let UserData = [];

    if (csign == '') {//如果为空,代表首次请求数据.返回热度最高的数据
        try {
            let temData = await Article.find({}, { _id: false, __v: false }).lean().sort({ articleCreateDate: -1 }).limit(limit * page).exec(); // 查询所有文章
            let articleCount = await Article.countDocuments({}).exec();
            console.log(articleCount);
            if (temData.length == 0) {
                throw "err";
            }
            let temKey = CommonFN.filterObjectInArray(temData, "userId");
            for (let item of temKey) { //根据用户ID查询出用户数据
                let temUserSingle = await User.findOne({ userAccount: item }, ({ userAvatar: true, userNetName: true, _id: false })).exec();// 这个是反选.只返回为true的数据
                // console.log(temUserSingle);
                if (temUserSingle) {
                    UserData.push(temUserSingle);
                } else {
                    console.log("发现空数据");
                    console.log(item);
                }
            }
            temData.forEach((item, index) => {
                item.userinfo = UserData[index]; // 这里是数据的引用.
            });
            // mongoose返回的时候可以修改,但是不会显示.而且不会返回到前台. => 解决办法 => 使用lean
            // lean => 将mongo Document 转换为 Object.如果没有转换.看到的是object,实际上并不是.且无法修改里面的内容.
            // 这是mongoose为了保持document的一致性.
            if (temData.length == articleCount) {
                console.log("请求到全部数据");
                ctx.body = { data: 200, data: temData, finished: true };
            } else {
                ctx.body = { data: 200, data: temData };

            }
        } catch (e) {
            ctx.body = { data: 400, data: "数据查询有误" };

        }
    }
})
module.exports = route;