'use strict';

var HydraOperation = require('./hydra_operation.js');
var HydraProperty = require('./hydra_property.js');

class HydraClass {
	constructor(cl){
		console.log(cl);

		this.iri = cl.iri;
		this.name = cl.label;
		this.operations = [];
		this.properties = [];

		var context = this;
		// get operations
		cl.operations.forEach(function(op){
			var op_entity = new HydraOperation(op);
			context.operations.push(op_entity);
		});

		// get properties
		cl.properties.forEach(function(prop){
			var prop_entity = new HydraProperty(prop);
			context.properties.push(prop_entity);
		});

	}
}

module.exports = HydraClass;
