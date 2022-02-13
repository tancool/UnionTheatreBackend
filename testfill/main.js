var a = require('./a.js');
var b = require('./b.js');
console.log('在 main.js 之中, a.done=%j, b.done=%j', a.done, b.done);

// module系统采用的方法是拷贝.所以回去执行代码.
// 尚未测试import