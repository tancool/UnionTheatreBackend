const Router = require("koa-router");
const mongoose = require("mongoose");
const CommonFN = require("./CommonFN")
const route = new Router();
function filterObjectInArray(arrinobj, saveEleminObj) {
    let returnVal = [];
    arrinobj.forEach((item, index, arr) => {
        if (item[saveEleminObj]) {
            returnVal.push(item[saveEleminObj]);
        } else {
            console.log("可能发生意外的错误");
        }
    });
    return returnVal;
}

route.get("/test", async ctx => {
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.body = "电影首页";
});
route.get('/getmovie', async (ctx) => {
    // 排序.个数.搜索字段.页码
    /* 
    searchKey
    searchVal  搜索字段
    limit  一页显示多少数据
    pages 从第几页开始显示
    desc 排序方式
    descstr 排序字段

    offset  跳过多少数据 => 这个是由后台进行计算的
    */
    const Movie = mongoose.model("Movie");
    const Movieextend = mongoose.model("Movieextend");

    const clientQuery = JSON.parse(JSON.stringify(ctx.query)); // 因为历史遗弃问题导致的.
    const searchKey = clientQuery.searchKey; // 搜索的主键 => 这个必须存在
    const searchVal = clientQuery.searchVal; // 搜索的值
    const descstr = clientQuery.descstr; // 排序的字段
    const desc = parseInt(clientQuery.desc); // 排序
    const limit = parseInt(clientQuery.limit); // 一夜显示多少个
    const pages = clientQuery.pages; // 从第几页开始
    const csign = clientQuery.csign; // 标志
    // -----------------参数获取结束--------------------------
    // console.log(csign);
    let saveKey = []; // 多级查询保存key
    let RETData = []; // 返回的数据
    let RETDataExtend = [];
    if (searchKey == '') { // 如果没有搜索值.(首页热度接口)
        if (csign == 'attention') { // 获取最热的片.
            try {

                // 查询电影的扩展数据.得到热度最高的电影
                let temSaveKey = await Movieextend.find({}).sort({ movieAttention: desc }).limit(limit).exec(); // 倒序进行排列.
                // 筛选出key
                saveKey = CommonFN.filterObjectInArray(temSaveKey, "movieCode");
                // 保存用户的喜欢和不喜欢
                RETDataExtend = CommonFN.filterObjectInArray(temSaveKey, "movieLikeAndDislick");
                if (saveKey.includes(undefined)) {
                    throw "存在空数组";
                }
                for (let item of saveKey) { // forEach不可以进行await
                    let DataSingle = await Movie.findOne({ movieCode: item }, { _id: false, __v: false }).exec();
                    // console.log(DataSing);
                    RETData.push(DataSingle);
                };
                if (RETData.includes(undefined)) {
                    throw "存在空对象";
                }
                // console.log(RETDataExtend);
                ctx.body = { code: 200, data: RETData, dataExtend: RETDataExtend };
            } catch (e) {
                ctx.body = { code: 400, data: "查询错误" };
                console.log(e);
            }
        } else if (csign == 'willcoming') {// 获得即将上映的数据
            try {
                RETData = await Movie.find({}, { _id: false, __v: false }).sort({ movieReleaseDate: -1 }).limit(limit).exec();//查询出即将上映的电影
                let filterKey = CommonFN.filterObjectInArray(RETData, "movieCode");

                for (let item of filterKey) {
                    let temporaryVar = await Movieextend.findOne({ movieCode: item }, { _id: 0, movieLikeAndDislick: 1 }).exec();
                    RETDataExtend.push(temporaryVar);
                }
                RETDataExtend = CommonFN.filterObjectInArray(RETDataExtend, "movieLikeAndDislick");
                ctx.body = { code: 200, data: RETData, dataExtend: RETDataExtend };
            }
            catch (e) {
                ctx.body = { code: 400, data: "查询即将上映的数据出现错误" };
                console.log("查询即将上映的数据出现错误");
            }

        } else if (csign == 'favor') {
            try {
                let temSaveKey = await Movieextend.find({}).sort({ 'movieLikeAndDislick.like': -1 }).limit(limit).exec();
                saveKey = CommonFN.filterObjectInArray(temSaveKey, "movieCode");
                RETDataExtend = CommonFN.filterObjectInArray(temSaveKey, "movieLikeAndDislick");
                // console.log(saveKey);
                if (saveKey.includes(undefined)) {
                    throw "存在空数组"
                }
                for (let item of saveKey) {
                    let DataSingle = await Movie.findOne({ movieCode: item }, { _id: false, __v: false }).exec();
                    RETData.push(DataSingle);
                }
                if (RETData.includes(undefined)) {
                    throw "存在空对象";
                }
                ctx.body = { code: 200, data: RETData, dataExtend: RETDataExtend };
            } catch (e) {
                ctx.body = { code: 400, data: "查询错误" };
                console.log(e);
            }
        }
    } else {

    }
})
route.get("/getmateral", async (ctx) => { // 这个接口先不写
    const FillMateral = mongoose.model('FillMateral');
    const data = await FillMateral.find({}).exec();
    const clientQuery = JSON.parse(JSON.stringify(ctx.query));
    const csign = clientQuery.csign;
    // console.log(data[0].index);
    // console.log(csign);
    if (csign == 'banner') {
        ctx.body = {
            code: 200,
            data: {
                bannerImg: {
                    bannerImgOne: { url: 'http://cdn.tanplay.com/banner1.jpg', text: '大剧院线下酒馆活动中' },
                    bannerImgTwo: { url: 'http://cdn.tanplay.com/banner2.jpg', text: '畅销电影折上折' },
                    bannerImgThree: { url: 'http://cdn.tanplay.com/banner3.jpg', text: '专访热门作者:欧阳小九' },
                },
                icon: 'www.index-icon.com'
            }
        }
        // ctx.body = {
        //     code: 200, data: {
        //         "bannerImg": {
        //             "bannerImgOne": {
        //                 "url": "wwww.big1.com",
        //                 "text": "英雄极品大会1"
        //             },
        //             "bannerImgTwo": {
        //                 "url": "wwww.big1.com",
        //                 "text": "英雄极品大会2"
        //             },
        //             "bannerImgThree": {
        //                 "url": "wwww.big1.com",
        //                 "text": "英雄极品大会3"
        //             }
        //         },
        //     }
        // }
    }
});

route.post("/getmoviedateil", async (ctx) => { // 或的电影详细信息
    /*
    请求参数
        - 请求key
        - 请求value
        - 一次返回一条已经整理好的数据
    */
    console.log("执行");
    const searchVal = ctx.request.body.sendmajor;
    const Movie = mongoose.model('Movie');
    const Star = mongoose.model('Star');
    const User = mongoose.model("User");
    const Movieextend = mongoose.model('Movieextend');
    let RETData = []; // 返回数据
    let saveKeyForStar = []; // 用于多级查询
    let saveKeyForUser = [];

    let movieData = [];
    let movieExtendData = [];
    let starData = [];
    let userData = [];
    try {
        movieData = await Movie.findOne({ movieCode: searchVal }, { _id: false, __v: false }).lean().exec(); // 获得电影信息
        movieExtendData = await Movieextend.findOne({ movieCode: searchVal }, { __v: false, _id: false }).exec(); // 获得电影扩展信息
        saveKeyForStar = movieData.movieStars;// 获得查询明星的主键
        // saveKeyForUser
        // console.log(saveKeyForStar)

        for (let item of saveKeyForStar) { // 查询与该电影有关的明星
            let temporaryForStar = await Star.findOne({ starCode: item }, { chinaNameOfStar: 1, starImg: 1, englishNameOfStar: 1, _id: 0 }).exec();
            starData.push(temporaryForStar);
        }// 查询明星完毕

        movieExtendData.movieCommentFromUser.forEach((item, index) => { // 查询评论该电影的用户ID
            saveKeyForUser.push(item[0].commentUser); // 获得评论用户的ID
        });
        for (let userAccount of saveKeyForUser) { // 根据ID找出用户.
            let temporarySaveUser = await User.findOne({ userAccount: userAccount }, { _id: 0, userAccount: 1, userNetName: 1, userAvatar: 1, userMemberState: 1 }).exec();
            // console.log(temporarySaveUser);
            userData.push(temporarySaveUser);
        };

        movieData.starData = starData;
        movieData.userData = userData;
        movieData.extend = movieExtendData;
        console.log(movieData);
        ctx.body = { code: 200, data: movieData };
        // console.log(movieData);
        return;

        /*
        明星ID
        明星名字
        明星头像
        */
        /*
        扩展喜欢与不喜欢
        扩展评分
        扩展评论
        扩展看过与想看
        评论支持个数
        */
        /*
        用户头像
        用户ID
        用户评论
        用户评分
        */
        // 下面是数据的处理
        // console.log(starData);
    } catch (err) {
        console.log(err);
    }
});

route.post("/getmoviesimplemess", async (ctx) => { // 根据电影的ID获取电影的简略信息.用于购物车获取图片
    const ClientParams = ctx.request.body;
    const majorKey = ClientParams.keys;
    const Movie = mongoose.model("Movie");
    let RETDate = [];
    try {
        for (let item of majorKey) {
            let temporarySave = await Movie.findOne({ movieCode: item }, { _id: 0, __v: 0 }).exec();
            RETDate.push(temporarySave);
        }
        // console.log(RETDate);
        ctx.body = { code: 200, data: RETDate };
        return;
    } catch (err) {
        console.log(err);
        ctx.body = { dat: 400, data: "error" };
    }
});

route.post('/getmycollection', async (ctx) => { // 获得到用户想看的信息的接口.
    //请求到这里.
    /*
    主要的参数包括 :
        - pages : 返回查询页数
        - limit默认是10.后台已经提供
        - 查询的用户ID
        - 查询筛选参数. (查看全部 / 按照日期进行排序.)
        - 排序方式
    */
    const ClientKey = ctx.request.body;
    const pages = ClientKey.pages; // 用户请求的页数
    console.log(ClientKey);
    if (!parseInt(pages)) {
        pages = 1;
    }
    const userId = ClientKey.userId; // 用户ID
    const dataSort = ClientKey.sort; // 数据排序
    const findKey = ClientKey.findKey; // 查询内容
    const limit = 10; // 一次显示十个
    let RETData = [];
    let RETDataTidy = [];
    let REturnDataFilterAfter = [];
    // console.log(dataSort);
    try {
        const User = mongoose.model("User");
        const Movie = mongoose.model("Movie");
        const UserWatchArr = await User.findOne({ userAccount: userId }, { userWantToWatch: 1, _id: 0 }).lean().exec(); // 得到用户的数据
        // 根据ID再次进行处理
        // console.log(UserWatchArr);
        for (let item of UserWatchArr.userWantToWatch) { // 进行循环
            item._id = undefined; // 设置掉undefind
            // 根据收藏的ID查找出用户的所有的电影信息
            let temporaryVal = {};
            temporaryVal.movie = await Movie.findOne({ movieCode: item.movieid }, { _id: 0, __v: 0, movieStars: 0 }).exec();
            temporaryVal.collectdata = item.collectdata;
            RETData.push(temporaryVal);
        }
        // console.log(RETData); // 拿到用户所有的显示信息.

        // 模仿分页效果
        if (findKey == 1) { // ==1是查看所有.[默认就是倒序.不支持排序]
            RETData.reverse(); // 颠倒的原因是因为 : 用户最锌新添加的数据是在最下面的.所以以这种方式返回.
        } else if (findKey == 2) { // == 2 是根据搜索日期查找.
            // 使用排序.
            // 首先进行排序识别.
            if (dataSort == 'desc') { // 表示倒序.(默认是这个)
                RETData.sort(function (a, b) { // b-a是倒序
                    return b['collectdata'] - a['collectdata'];
                });
            } else if (dataSort == 'asc') { // 表示正序.
                console.log("zhixingdaozheli");
                RETData.sort(function (a, b) { // a-b是正序
                    return a['collectdata'] - b['collectdata'];
                });
            } else {
                ctx.body = { code: 304, data: "传入未知参数" };
                return false;
            }
            // 排序完毕之后,进行取数据的操作

        } else if (findKey == 3) { // == 3 是根据上映日期进行排序
            if (dataSort == 'desc') { // 默认是倒序
                RETData.sort(function (a, b) {
                    return b['movie']['movieReleaseDate'] - a['movie']['movieReleaseDate'];
                })
            } else if (dataSort == 'asc') {
                RETData.sort(function (a, b) {
                    return a['movie']['movieReleaseDate'] - b['movie']['movieReleaseDate'];
                })
            } else {
                ctx.body = { code: 304, data: "传入未知参数" };
                return false;
            }
        }
        RETDataTidy = RETData.slice(0, pages * limit);
        if (RETDataTidy.length == RETData.length) {
            ctx.body = { code: 200, data: RETDataTidy, finished: true };
            console.log("请求全部");
        } else {
            ctx.body = { code: 200, data: RETDataTidy };

        }
    } catch (e) {
        console.log("数据查询发现错误");
        console.log(e);
        ctx.body = { code: 300, data: "查询数据发生意外错误" };
    }
});


// 电影详情中我的看过
route.post('/watchedthemovie', async (ctx) => {

    const clientParams = ctx.request.body;
    const userId = clientParams.userid; // 事实上这里不需要用户ID.但是需要用户进行登录,才可以操作公共数据库
    const movieid = clientParams.movieid;
    console.log(userId);
    if (!(userId && movieid)) {
        ctx.body = { code: 302, data: "用户账号有误" };
    }
    try {
        const Movieextend = mongoose.model("Movieextend");
        const updateResult = await Movieextend.updateOne({ movieCode: movieid }, { "$inc": { "movieHaveSeeAndWantTosee.haveSee": 1 } }).exec();
        if (updateResult.nModified == 1) {
            ctx.body = { code: 200, data: "增加成功" }
        } else {
            ctx.body = { code: 301, data: "增加失败" }
        }

    } catch (e) {
        console.log(e);
        ctx.body = { code: 300, data: "异常错误" }
    }

});

// 电影详情页面中增加到我的想看
route.post('/wanttowatchthemovie', async (ctx) => {
    const clientParams = ctx.request.body;
    const userId = clientParams.userid; // 事实上这里不需要用户ID.但是需要用户进行登录,才可以操作公共数据库
    const movieid = clientParams.movieid;
    if (!(userId && movieid)) {
        ctx.body = { code: 301, data: "用户账号有误" };
    }
    try {
        const User = mongoose.model("User");
        const Movieextend = mongoose.model("Movieextend");
        // 首先是增加到User里我的想看.
        // 我的想看中是否有此想看
        const searchResult = await User.findOne({ userAccount: userId }, { _id: 0, userWantToWatch: 1 }).exec();
        let whetherExist = searchResult.userWantToWatch.find((item) => { // 如果不存在就返回undefind.如果存在据返回其对象.
            return item.movieid == movieid;
        });
        // 用户已经收藏.
        if (whetherExist) {
            ctx.body = { code: 201, data: "您已经收藏啦" };
            return false;
        }
        // 如果用户没有收藏
        // 用户表中添加收藏
        let insertResult = await User.updateOne({ userAccount: userId }, { "$push": { userWantToWatch: { "movieid": movieid, "collectdata": Date.now() } } }).exec();
        // 插入到用户表中成功
        if (insertResult.nModified == 1) {
            // 想想看中加一
            const updateWantToWatch = await Movieextend.updateOne({ movieCode: movieid }, { "$inc": { "movieHaveSeeAndWantTosee.wantToSee": 1 } }).exec();
            // 全部成功
            if (updateWantToWatch.nModified == 1) {
                ctx.body = { code: 200, data: "增加成功" }
            } else {// 用户表中成功.但是插入我的想看的数字增加失败
                ctx.body = { code: 303, data: "增加失败" }
            }
        } else {// 插入
            ctx.body = { code: 302, data: "添加失败" };
        }
    } catch (e) {
        console.log(e);
        ctx.body = { code: 300, data: "异常错误" }
    }

})

// 用户取消收藏的接口 => 此接口被替代.替代的位置在userOrder里.
route.post('/canceloneofthecollection', async (ctx) => {
    const clientParams = ctx.request.body;
    console.log(clientParams);
    ctx.body = clientParams;
});


module.exports = route;