const app = require('koa')();
const http = require('http-status-codes');
const log = require('./src/log');
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
	log('REQUEST: ', this.method, this.url);

	yield next;
}

app
	.use(pageNotFound)
	.use(logger)
	.use(router.routes())
	.use(router.allowedMethods())
	.listen(3003);