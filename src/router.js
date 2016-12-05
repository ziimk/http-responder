const http = require('http-status-codes');
const log = require('./log');
const router = require('koa-router')();

function* response(next) {
	const statusCode = parseInt(this.params.code, 10);

	this.status = http.OK;

	if (!isNaN(statusCode)) {
		try {
			this.status = statusCode;
		} catch (err) {
			this.status = http.BAD_REQUEST;
			log(`ERROR: ${statusCode} is not a valid status code`);
		}
	} else {
		this.status = http.BAD_REQUEST;
		log(`ERROR: input status is not a number`);
	}

	log('RESPONSE:', this.status);

	yield next;
}

router
	.post('/status/:code', response);

module.exports = router;