const http = require('http-status-codes');
const log = require('./log');
const router = require('koa-router')();
let sequenceCounter = 0;
let previousSequence = '';

function* sequenceResponse(next) {
	// Check for F(ail) and/or S(uccess) statuses
	const regex = new RegExp('^[FS]+$');
	const sequence = this.params.statuses.toUpperCase();
	const statuses = {
		F: http.BAD_REQUEST,
		S: http.OK
	};
	const isSequenceOk = regex.test(sequence);

	if (isSequenceOk === true) {
		if (previousSequence != sequence) {
			sequenceCounter = 0;
		}

		log('SEQUENCE:', sequenceCounter);

		this.status = statuses[sequence[sequenceCounter]];

		if (sequenceCounter < sequence.length - 1) {
			sequenceCounter++;
		} else {
			sequenceCounter = 0;
		}

		previousSequence = sequence;
	} else {
		this.status = http.BAD_REQUEST;
		log('ERROR: not valid statuses for sequence');
	}

	log('RESPONSE:', this.status);

	yield next;
}

function* statusResponse(next) {
	const statusCode = parseInt(this.params.code, 10);

	if (!isNaN(statusCode)) {
		try {
			this.status = statusCode;
		} catch (err) {
			this.status = http.BAD_REQUEST;
			log(`ERROR: ${statusCode} is not a valid status code`);
		}
	} else {
		this.status = http.BAD_REQUEST;
		log('ERROR: input status is not a number');
	}

	log('RESPONSE:', this.status);

	yield next;
}

router
	.get('/sequence/:statuses', sequenceResponse)
	.get('/status/:code', statusResponse)
	.post('/sequence/:statuses', sequenceResponse)
	.post('/status/:code', statusResponse);

module.exports = router;