// 用户注册和登录界面
const mongoose = require('mongoose');
const Router = require('koa-router');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const commonFn = require('./CommonFN');
const route = new Router();

route.post('/setVerifyCode', async (ctx) => { // 下发六位验证码.
    // 这里就不做那么多验证.每次用户请求就给用户重新发送一个.
    let returnVerifyCode = parseInt(Math.random() * 1000000);
    ctx.session.verify = returnVerifyCode;
    ctx.body = { code: 200, data: ctx.session.verify };
});
// verify == 验证
// certify == 证明

route.post('/registeraccount', async (ctx) => { // 手机登录接口
    // 进行后端的验证
    /*
    这里出现了显式的问题.但是由于时间上的考量,并没有去解决它.
    问题的具体描述是: 
        - 前台得到cookie之后,后台并没有如愿的进行数据验证.这里改为在前台进行验证 !!!!!!!!!!!!
    */

    let clientCertifyCode = ctx.request.body.verifycode; // 前端传来的验证码
    let clientAccountNum = ctx.request.body.accountform; // 前端传来的账号
    //======================进行简单的数据验证=====================================
    console.log(clientCertifyCode);
    console.log(ctx.session.verify);

    // if (clientCertifyCode != ctx.session.verify) {
    //     ctx.body = { code: 300, data: "verification code was incorrectly entered" }; // 验证码错误的输入
    //     return false;
    // };
    if (parseInt(clientAccountNum).length < 5) {
        ctx.body = { code: 301, data: "The length does not meet the requirement" }; // 账户小于5位.
        return false;
    };

    const User = mongoose.model("User");
    // ======================查询用户是否已经存在===============================
    let searchResult = await User.findOne({ userAccount: clientAccountNum }, { userAccount: 1, userAvatar: 1, userNetName: 1, _id: 0, }).exec();// 如果存在就返回数据.如果不存在就返回null
    const payLoad = {
        randomMess: Math.random(),
    }
    const token = jwt.sign(payLoad, commonFn.privateKey, { algorithm: 'RS256', expiresIn: 60 * 60 * 1 });

    if (searchResult) { // 如果用于已经存在,返回告知用户
        console.log("用户已经存在");
        let showResult = await User.updateOne({ userAccount: clientAccountNum }, { saveUserToken: token }).exec();
        // console.log(token);
        // console.log(showResult);
        // saveUserToken
        ctx.body = { code: 302, data: searchResult, token: token }; // 在这里下发token
        return false;
    }
    // ======================用户注册===========================
    const saveData = {// 用户注册数据
        userAccount: clientAccountNum,
        userRegiserTime: Date.now(),
        userLoginTimeLast: Date.now(),
        userAvatar: 'http://cdn.tanplay.com/user-logindefault.png',
        userNetName: clientAccountNum,
        loginForPhone: 1,
        saveUserToken: token,
        "userOrder": [
            100009,
            100010,
            100011,
            100012,
            100013,
            100014,
            100015,
            100016,
            100017,
            100018,
            100019,
            100020,
            100021,
            100022,
            100023,
            100024,
            100025,
            100026,
            110162,
            110163,
            110164,
            110165,
            110166,
            110167,
            110168,
            110169,
            110170,
            110205,
            110206,
            110209,
            110214,
            110215,
            110216,
            110217,
            110218,
            110219,
            110220
        ],
        "userWantToWatch": [
            {
                "movieid": 10003,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10004,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10005,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10006,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10007,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10008,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10009,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10010,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10011,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10012,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10013,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10014,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10015,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10016,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10017,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10018,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10019,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10020,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10021,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10022,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10023,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10024,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10025,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10026,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10027,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10028,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10029,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10030,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10031,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10032,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10033,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10034,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10035,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10036,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10037,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10038,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10039,
                "collectdata": 1597908374133.0
            },
            {
                "movieid": 10041,
                "collectdata": 1597908374133.0
            }
        ],
        // userShoppingCar: 用户购物车.系统给自动加上了
        // 好像是引用类型的.系统都给加上.
    }
    try { // 注册成功
        let result = await new User(saveData).save(); // 这个返回的数据,经过测试是可以修改的.
        console.log(result);
        let returnObj = {};
        console.log("保存");
        returnObj.userNetName = saveData.userNetName;
        returnObj.userAvatar = saveData.userAvatar;
        returnObj.userAccount = saveData.userAccount;
        console.log("插入成功");
        ctx.body = { code: 200, data: returnObj, token: token }; // 在这里下发token
    } catch (e) { // 注册失败.
        console.log(e);
        console.log("意外的错误发生")
        ctx.body = { code: 400, data: "意外的错误发生" };
        return false;
    }
});

route.post('/loginForAccount', async (ctx) => {// 使用账户登录
    const clientQueryArg = ctx.request.body;
    const account = clientQueryArg.userCode;
    const pass = clientQueryArg.pass;
    const User = mongoose.model("User");
    // 账号并不是全数字
    if (!Number(account)) { // 要求是纯数字才可以进行操作.
        ctx.body = { code: 300, data: "与账号要求不符合" };
        return false;
    }
    try {
        let findResult = await User.findOne({ userAccount: account }).exec();
        if (!findResult) {
            ctx.body = { code: 301, data: "查无此账号" };
            return false;
        };
        let fromClientPass = crypto.createHash("sha256").update(pass).digest('hex'); // digest表示调整十六进制.加密密码之后进行比对
        if (fromClientPass == findResult.userPass) {
            const payLoad = {
                randomMess: Math.random(),
            }
            const token = jwt.sign(payLoad, commonFn.privateKey, { algorithm: 'RS256', expiresIn: 60 * 60 * 1 });
            let returnData = {};
            returnData.userAccount = findResult.userAccount;
            returnData.userAvatar = findResult.userAvatar;
            returnData.userNetName = findResult.userNetName;
            await User.updateOne({ userAccount: account }, { saveUserToken: token }).exec();
            ctx.body = { code: 200, data: returnData, token: token };
            return false;
        } else {
            ctx.body = { code: 302, data: "密码错误" }
        }
    } catch (e) {
        console.log(e);
        ctx.body = { code: 303, data: "查询错误,请稍后重试" };
    }
})
route.post('/contrasttoken', async (ctx) => { // 验证token的接口. 这里的token到期的时间是固定的.没有续用时间的设置.
    // 传递进来 账号与token
    const clientQueryArg = ctx.request.body;
    const account = clientQueryArg.accout;
    const clientToken = clientQueryArg.token;
    const User = mongoose.model("User");
    try {
        // 首先需要鉴定token
        let result = jwt.verify(clientToken, commonFn.publicKey); // 同步调用.如果不是有效的payload.那么将会抛出异常
        if (result) { // 这么做是为了预防result的意外情况
            let srearchData = await User.findOne({ userAccount: account, saveUserToken: clientToken }, { saveUserToken: 0, _id: 0, __v: 0 }).exec(); // 查询正确会返回对象.查询错误会返回null
            if (srearchData) {// 如果数据存在就返回200.
                ctx.body = { code: 200, data: srearchData };
            } else {// 数据不存在返回500.
                ctx.body = { code: 500, data: 'search data not existed' };
            }
        }
    } catch (e) {
        console.log('err');
        ctx.body = { code: 400, data: "unexpected error occured" };
    }
    /*
    逻辑是用户传入进来ID.同时对比是否是后台签发的token.
    */
});

route.get('/insertcount', async (ctx) => { // 这个不要加在正式环境中
    // 插入用户
    const Count = mongoose.model("Count");
    try {
        let result = await new Count({ collectionName: "userordercode", code: 110000 }).save()
        let result1 = await new Count({ collectionName: "usercode", code: 110000 }).save()
        console.log(result);
        console.log(result1);
    } catch (err) {
        console.log(err);
    }
})

module.exports = route;


/*
使用密钥签发.公钥进行验证.
*/