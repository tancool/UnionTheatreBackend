const Router = require("koa-router");
const xlsx = require("node-xlsx");
const formidable = require('formidable');
const fs = require('fs');
const path = require("path");
const mongoose = require('mongoose');

const router = new Router();



router.all('/movies', async (ctx, next) => {
    const inputUrl = "/insertdata/movies";
    if (ctx.url === '/insertdata/movies' && ctx.method.toLowerCase() === 'post') {
        const form = formidable({ multiples: true });
        form.uploadDir = './uploads'; // 这个上传路径是以app.js文件为基准的
        form.keepExtensions = true;
        const exnameOfFile = ['.xls', '.xlsx']; // 文件后缀名. => 自己上传接口,这个不用.

        await new Promise((resolve, reject) => {
            form.parse(ctx.req, (err, fields, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                // 这里由于是自己写的数据接口,并不做那么多意外处理.只限定文件名称
                if (!files.koaFiles.name.includes('movies')) {
                    console.log("文件名称错误");
                    reject("err");
                    return;
                }
                const SheetContent = xlsx.parse(`./${files.koaFiles.path}`);
                const Movie = mongoose.model("Movie");
                Movie.insertData(SheetContent).then((resolve) => {
                    console.log(resolve);
                    ctx.body = "写入成功!";
                }).catch((reject) => {
                    console.log(reject);
                })
                resolve();
            });
        });
        await next();
        return;
    }
    // show a file upload form
    ctx.set('Content-Type', 'text/html');
    ctx.status = 200;
    ctx.body = `
        <h2>With <code>"koa"</code> npm package</h2>
        <form action="${inputUrl}" enctype="multipart/form-data" method="post">
        <div>Text field title: <input type="text" name="title" /></div>
        <div>File: <input type="file" name="koaFiles" multiple="multiple" /></div>
        <input type="submit" value="Upload" />
        </form>
      `;
});
router.all("/moviesextend", async (ctx, next) => {
    const inputUrl = "/insertdata/moviesextend";
    if (ctx.url === '/insertdata/moviesextend' && ctx.method.toLowerCase() === 'post') {
        const form = formidable({ multiples: true });
        form.uploadDir = './uploads'; // 这个上传路径是以app.js文件为基准的
        form.keepExtensions = true;
        const exnameOfFile = ['.xls', '.xlsx']; // 文件后缀名. => 自己上传接口,这个不用.
        await new Promise((resolve, reject) => {
            form.parse(ctx.req, (err, fields, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                // 这里由于是自己写的数据接口,并不做那么多意外处理.只限定文件名称
                if (!files.koaFiles.name.includes('moviesextend')) {
                    console.log("文件名称错误");
                    reject("err");
                    return;
                }
                const SheetContent = xlsx.parse(`./${files.koaFiles.path}`);
                const Movieextend = mongoose.model("Movieextend");
                Movieextend.insertData(SheetContent).then((resolve) => {
                    console.log(resolve);
                }).catch((reject) => {
                    console.log(reject);
                })
                resolve();
            });
        });
        await next();
        return;
    }
    // show a file upload form
    ctx.set('Content-Type', 'text/html');
    ctx.status = 200;
    ctx.body = `
        <h2>With <code>"koa"</code> npm package</h2>
        <form action="${inputUrl}" enctype="multipart/form-data" method="post">
        <div>Text field title: <input type="text" name="title" /></div>
        <div>File: <input type="file" name="koaFiles" multiple="multiple" /></div>
        <input type="submit" value="Upload" />
        </form>
      `;
})

router.all("/moviearticle", async (ctx, next) => {
    const inputUrl = "/insertdata/moviearticle";
    if (ctx.url === '/insertdata/moviearticle' && ctx.method.toLowerCase() === 'post') {
        const form = formidable({ multiples: true });
        form.uploadDir = './uploads'; // 这个上传路径是以app.js文件为基准的
        form.keepExtensions = true;
        const exnameOfFile = ['.xls', '.xlsx']; // 文件后缀名. => 自己上传接口,这个不用.
        await new Promise((resolve, reject) => {
            form.parse(ctx.req, (err, fields, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!files.koaFiles.name.includes('moviearticle')) {
                    console.log("文件名称错误");
                    reject("err");
                    return;
                }// 这里由于是自己写的数据接口,并不做那么多意外处理.

                const SheetContent = xlsx.parse(`./${files.koaFiles.path}`);
                const Article = mongoose.model("Article");
                Article.insertData(SheetContent).then((resolve) => {

                }).catch((reject) => {
                    console.log(reject)
                });
                resolve();
            });
        });
        await next();
        return;
    }
    // show a file upload form
    ctx.set('Content-Type', 'text/html');
    ctx.status = 200;
    ctx.body = `
        <h2>With <code>"koa"</code> npm package</h2>
        <form action="${inputUrl}" enctype="multipart/form-data" method="post">
        <div>Text field title: <input type="text" name="title" /></div>
        <div>File: <input type="file" name="koaFiles" multiple="multiple" /></div>
        <input type="submit" value="Upload" />
        </form>
      `;
});
router.all("/moviecomment", async (ctx, next) => {
    const inputUrl = "/insertdata/moviecomment";
    if (ctx.url === '/insertdata/moviecomment' && ctx.method.toLowerCase() === 'post') {
        const form = formidable({ multiples: true });
        form.uploadDir = './uploads'; // 这个上传路径是以app.js文件为基准的
        form.keepExtensions = true;
        const exnameOfFile = ['.xls', '.xlsx']; // 文件后缀名. => 自己上传接口,这个不用.
        await new Promise((resolve, reject) => {
            form.parse(ctx.req, (err, fields, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!files.koaFiles.name.includes('moviecomment')) {
                    console.log("文件名称错误");
                    reject("err");
                    return;
                }// 这里由于是自己写的数据接口,并不做那么多意外处理.

                const SheetContent = xlsx.parse(`./${files.koaFiles.path}`);
                const MovieComment = mongoose.model("MovieComment");
                MovieComment.insertData(SheetContent).then((resolve) => {
                    console.log(resolve);
                }).catch((reject) => {
                    console.log(reject)
                });
                resolve();
            });

        });

        await next();
        return;
    }
    // show a file upload form
    ctx.set('Content-Type', 'text/html');
    ctx.status = 200;
    ctx.body = `
        <h2>With <code>"koa"</code> npm package</h2>
        <form action="${inputUrl}" enctype="multipart/form-data" method="post">
        <div>Text field title: <input type="text" name="title" /></div>
        <div>File: <input type="file" name="koaFiles" multiple="multiple" /></div>
        <input type="submit" value="Upload" />
        </form>
      `;
});
router.all("/star", async (ctx, next) => {
    const inputUrl = "/insertdata/star";
    if (ctx.url === '/insertdata/star' && ctx.method.toLowerCase() === 'post') {
        const form = formidable({ multiples: true });
        form.uploadDir = './uploads'; // 这个上传路径是以app.js文件为基准的
        form.keepExtensions = true;
        const exnameOfFile = ['.xls', '.xlsx']; // 文件后缀名. => 自己上传接口,这个不用.
        await new Promise((resolve, reject) => {
            form.parse(ctx.req, (err, fields, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!files.koaFiles.name.includes('star')) {
                    console.log("文件名称错误");
                    reject("err");
                    return;
                }// 这里由于是自己写的数据接口,并不做那么多意外处理.

                const SheetContent = xlsx.parse(`./${files.koaFiles.path}`);
                const Star = mongoose.model("Star");
                Star.insertData(SheetContent).then((resolve) => {
                    console.log(resolve);
                }).catch((reject) => {
                    console.log(reject);
                });
                resolve();
            });

        });
        await next();
        return;
    }
    // show a file upload form
    ctx.set('Content-Type', 'text/html');
    ctx.status = 200;
    ctx.body = `
        <h2>With <code>"koa"</code> npm package</h2>
        <form action="${inputUrl}" enctype="multipart/form-data" method="post">
        <div>Text field title: <input type="text" name="title" /></div>
        <div>File: <input type="file" name="koaFiles" multiple="multiple" /></div>
        <input type="submit" value="Upload" />
        </form>
      `;
});
router.all("/user", async (ctx, next) => {
    const inputUrl = "/insertdata/user";
    if (ctx.url === '/insertdata/user' && ctx.method.toLowerCase() === 'post') {
        const form = formidable({ multiples: true });
        form.uploadDir = './uploads'; // 这个上传路径是以app.js文件为基准的
        form.keepExtensions = true;
        const exnameOfFile = ['.xls', '.xlsx']; // 文件后缀名. => 自己上传接口,这个不用.
        await new Promise((resolve, reject) => {
            form.parse(ctx.req, (err, fields, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!files.koaFiles.name.includes('user')) {
                    console.log("文件名称错误");
                    reject("err");
                    return;
                }// 这里由于是自己写的数据接口,并不做那么多意外处理.

                const SheetContent = xlsx.parse(`./${files.koaFiles.path}`);
                const User = mongoose.model("User");
                User.insertData(SheetContent).then((resolve) => {
                    console.log(resolve);
                }).catch((reject) => {
                    console.log(reject);
                });
                resolve();
            });

        });
        await next();
        return;
    }
    // show a file upload form
    ctx.set('Content-Type', 'text/html');
    ctx.status = 200;
    ctx.body = `
        <h2>With <code>"koa"</code> npm package</h2>
        <form action="${inputUrl}" enctype="multipart/form-data" method="post">
        <div>Text field title: <input type="text" name="title" /></div>
        <div>File: <input type="file" name="koaFiles" multiple="multiple" /></div>
        <input type="submit" value="Upload" />
        </form>
      `;
});
router.all("/userorders", async (ctx, next) => {
    const inputUrl = "/insertdata/userorders";
    if (ctx.url === '/insertdata/userorders' && ctx.method.toLowerCase() === 'post') {
        const form = formidable({ multiples: true });
        form.uploadDir = './uploads'; // 这个上传路径是以app.js文件为基准的
        form.keepExtensions = true;
        const exnameOfFile = ['.xls', '.xlsx']; // 文件后缀名. => 自己上传接口,这个不用.
        await new Promise((resolve, reject) => {
            form.parse(ctx.req, (err, fields, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!files.koaFiles.name.includes('userorders')) {
                    console.log("文件名称错误");
                    reject("err");
                    return;
                }// 这里由于是自己写的数据接口,并不做那么多意外处理.

                const SheetContent = xlsx.parse(`./${files.koaFiles.path}`);
                const UserOrder = mongoose.model("UserOrder");
                UserOrder.insertData(SheetContent).then((resolve) => {
                    console.log(resolve);
                }).catch((reject) => {
                    console.log(reject);
                });
                resolve();
            });

        });
        await next();
        return;
    }
    // show a file upload form
    ctx.set('Content-Type', 'text/html');
    ctx.status = 200;
    ctx.body = `
        <h2>With <code>"koa"</code> npm package</h2>
        <form action="${inputUrl}" enctype="multipart/form-data" method="post">
        <div>Text field title: <input type="text" name="title" /></div>
        <div>File: <input type="file" name="koaFiles" multiple="multiple" /></div>
        <input type="submit" value="Upload" />
        </form>
      `;
});
router.all("/fillmateral", async (ctx, next) => {
    const inputUrl = "/insertdata/fillmateral";
    if (ctx.url === '/insertdata/fillmateral' && ctx.method.toLowerCase() === 'post') {
        const form = formidable({ multiples: true });
        form.uploadDir = './uploads'; // 这个上传路径是以app.js文件为基准的
        form.keepExtensions = true;
        const exnameOfFile = ['.xls', '.xlsx']; // 文件后缀名. => 自己上传接口,这个不用.
        await new Promise((resolve, reject) => {
            form.parse(ctx.req, (err, fields, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!files.koaFiles.name.includes('fillmateral')) {
                    console.log("文件名称错误");
                    reject("err");
                    return;
                }// 这里由于是自己写的数据接口,并不做那么多意外处理.

                const SheetContent = xlsx.parse(`./${files.koaFiles.path}`);
                const FillMateral = mongoose.model("FillMateral");
                FillMateral.insertData(SheetContent).then((resolve) => {
                    console.log(resolve);
                }).catch((reject) => {
                    console.log(reject);
                });
                resolve();
            });

        });
        await next();
        return;
    }
    // show a file upload form
    ctx.set('Content-Type', 'text/html');
    ctx.status = 200;
    ctx.body = `
        <h2>With <code>"koa"</code> npm package</h2>
        <form action="${inputUrl}" enctype="multipart/form-data" method="post">
        <div>Text field title: <input type="text" name="title" /></div>
        <div>File: <input type="file" name="koaFiles" multiple="multiple" /></div>
        <input type="submit" value="Upload" />
        </form>
      `;
});
module.exports = router;
