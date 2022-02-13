const Router = require("koa-router");
const mongoose = require("mongoose");
const CommonFN = require("./CommonFN");
const route = new Router;


route.get('/get', async (ctx) => {
    const clientQuery = JSON.parse(JSON.stringify(ctx.query)); // 拿到get的查询参数
    // console.log(clientQuery);
    const csign = clientQuery.csign;
    // console.log(clientQuery);
    let RETData = [];
    let RETDataExtend = [];
    if (csign== 'articletag') {
        const FillMateral = mongoose.model("FillMateral");
        let tempData =  await FillMateral.find({},{_id:false,__v:false}).exec();
        RETData = tempData[0].ArticleTag;
        ctx.body = {code:200,data:RETData};
    }
})
module.exports = route;
