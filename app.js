const fs = require('fs');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();

const app = new Koa();

const service = require('./service');

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}`);
    if (ctx.request.headers.referer) {
        let domain = new URL(ctx.request.headers.referer).host.replace(/:/g, '_');
        ctx.request.headers.domain = domain
    }
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', '*');
    ctx.set('Access-Control-Allow-Headers', '*');
    if (['OPTIONS', 'HEAD'].includes(ctx.method)) {
        ctx.body = 200;
    } else {
        await next();
    }
    if (!ctx.request.url.startsWith('/v/')) {
        console.log(`Response: ${ctx.response.body}`);
    }
    console.log()
});

app.use(bodyParser());

// add url-route:

router.get('/v/editor', async (ctx, next) => {
    ctx.type = "html";
    ctx.body = fs.readFileSync('editor.html');
});

router.get('/homedir', async (ctx, next) => {
    ctx.response.body = service.getDataDir();
    ctx.response.status = 200;
});

router.get('/list', async (ctx, next) => {
    let domain = ctx.request.headers.domain;
    ctx.response.body = service.getList({domain});
    ctx.response.status = 200;
});

router.get('/data', async (ctx, next) => {
    let domain = ctx.request.headers.domain;
    let {key, date} = ctx.request.query;
    ctx.response.body = service.getData(key, date, {domain});
    ctx.response.status = 200;
});

router.post('/data', async (ctx, next) => {
    let domain = ctx.request.headers.domain;
    let {key, value} = ctx.request.body;
    try {
        ctx.response.body = service.saveData(key, value, {domain});
    } catch (e) {
        ctx.response.body = e.message;
        ctx.response.status = 500;
    }
});


// add router middleware:
app.use(router.routes());

app.on('error', (err, ctx) => {
    console.error(err)
});

app.listen(13080);
console.log('listen: http://localhost:13080');