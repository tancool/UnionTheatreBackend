const Koa = require("koa"); // 引入Koa
const Router = require("koa-router"); // 引入路由
const { connect, initSchmeas } = require("./database/init"); // 数据库初始化
const insertData = require("./appApi/insertData"); // movies的相关链接.
const mongoose = require('mongoose');
const serve = require('koa-static');
const mount = require('koa-mount');
const cors = require('koa2-cors');
const bodyParser = require("koa-bodyparser");
const session = require('koa-session'); // 引入session

const movives = require("./appApi/movies"); // movies的相关链接.
const article = require("./appApi/article"); // article相关的链接
const materal = require("./appApi/materal"); // 
const theaters = require("./appApi/theaters");
const userlogin = require("./appApi/Userlogin"); // 用户登录的接口
const userOrder = require("./appApi/userOrder"); // 用户登录的接口
const userShoppingCart = require("./appApi/userShoppingCart"); // 用户购物车的接口

const app = new Koa();//实例化koa
app.use(cors({
    credentials: true,
})); // 解决跨域问题

const router = new Router(); //实例路由
// session设置
app.keys = ['some secret hurr']; // 设置cookie
const CONFIG = {
    key: 'koa.sess', /** (string) cookie key (default is koa.sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 60000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    secure: false, /** (boolean) secure cookie*/
    sameSite: null, /** (string) session cookie sameSite options (default null, don't set it) */
};
//

router.use("/movie", movives.routes()); // 装载子路由
router.use("/article", article.routes()); // 装article相关的子路由
router.use("/materal", materal.routes()); // 装载子路由 => 导入数据接口
router.use("/insertdata", insertData.routes()); // 装载子路由 => 导入数据接口
router.use("/theaters", theaters.routes()); // 装载子路由 => 导入数据接口
router.use("/user", userlogin.routes());
router.use("/userorder", userOrder.routes());
router.use("/usercart", userShoppingCart.routes());
app.listen(3000, () => {
    console.log("服务已经启动");
});

(async () => {
    await connect();
    initSchmeas();
    // const Movie = mongoose.model("Movie");
    return "初始化数据库已经完成";
})().then(resolve => {
    console.log(resolve);
}).catch(err => {
    console.log(err);
});
app.use(session(CONFIG, app)); // 设置session>
app.use(bodyParser());//接收post请求. => 这个会触发一个警告
const staticPath = serve(__dirname + "/public"); // 使用静态资源
app.use(mount('/static', staticPath)); // 给静态资源指定路径
app.use(router.routes()).use(router.allowedMethods());// 加载路由中间件// 这个要写在最下面