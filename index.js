const app = require('koa')();
const bodyParser = require('koa-bodyparser');
const http = require('http-status-codes');
const log = require('./src/log');
const port = 3003;
const router = require('./src/router');

function* pageNotFound(next) {
	yield next;

	if (this.status != http.NOT_FOUND) {
		return;
	}

	log('RESPONSE: 404 (╯°□°）╯︵ ┻━┻');
	// Need to explicitly set 404 or koa will assign 200 when calling this.body = ...
	this.status = http.NOT_FOUND;
	this.body = 'Why are you here?';
}

function* logger(next) {
	log('REQUEST: ', this.method, this.url, this.request.body);

	yield next;
}

app
	.use(pageNotFound)
	.use(bodyParser())
	.use(logger)
	.use(router.routes())
	.use(router.allowedMethods())
	.listen(port);

log(`Listening on port ${port}`);