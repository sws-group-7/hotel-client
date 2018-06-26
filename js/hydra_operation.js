'use strict';

class HydraOperation {
	constructor(op){
		this.iri = op.iri;
		this.method = op.method;
		this.description = op.label;
	}
}

module.exports = HydraOperation;
