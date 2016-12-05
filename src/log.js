module.exports = function log(...items) {
	items.unshift(new Date().toISOString());
	console.log.apply(console, items);
};