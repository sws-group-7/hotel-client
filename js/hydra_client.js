'use strict';

global.Promise = require('es6-promise').Promise;
var hydra = require('hydra-core');

module.exports = function LoadApi(url) {
	return hydra.loadDocument(url);
}
