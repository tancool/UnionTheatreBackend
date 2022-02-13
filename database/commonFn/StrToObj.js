function scliceForC(str) { // 只会传递一个给他
    let temAarr = str.split("//c//")
    return { [temAarr[0]]: temAarr[1] };
}

function scliceForN(str) {
    let tempArr = str.split("//n//");
    return tempArr.map((item) => {
        if (item.includes("//r//")) { // 如果字符串中含有 //r
            return SliceForR(item);
        } else { // 如果字符串中不含有 //r
            return scliceForC(item);
        }
    })
}
function SliceForR(str) {
    let tempArr = str.split("//r//");
    return tempArr.map((item) => {
        return scliceForC(item)
    })
}

exports.StrTransformObj = function (arr) {
    let arrTidy = arr.map((item) => {
        if (typeof (item) == "number") {
            return item.toString();
        }
        return item;
    });
    return arrTidy.map((item, index, arr) => {
        if (typeof (item) == 'boolean') {
            return item.toString();
        }
        if (item.includes("//") && (!item.includes("http"))) { // 如果字符串中含有 //n.传递整个字符串
            return scliceForN(item);
        } else { // 如果字符串中不含有 //n 直接返回
            return item;
        }
    })
}
exports.StrLikeNumTranformArr = function (str) {
    console.log(str)
    return str.split(',');
}
/*
转换示例:
//c// == :
//r// == 分离子数组
//n// == 分离对象
    '姓名//c//李小二//r//评论日期//c//这真是太好看了//r//评论时间//c//20202020//n//321321://c//Incredible ! Great !S Beauiful!!Incredible!!'
    [{{姓名:李小二},{评论日期:这真是太好看了},{评论时间:2020020}},{321321:Incredible ! Great !S Beauiful!!Incredible!!}]
*/


exports.twoDimensionTranslateOne = function (twoDimension) { // 专用于用户收藏的二维数组转换为一维数组.并保存其中的数组
    twoDimension.forEach((item, index) => {
        item.collectdata = Date.now();
    });
    return twoDimension;
}
