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

	// TODO: use template engine instead
	toHtml(){
		var panel ='<h3>'+this.name+'</h3>';
		panel+='<div id="idProperties">';
		panel+='<table>';
		panel+='<tbody>';
		this.properties.forEach(function(prop){
			panel+='<tr><td>'+prop.name+':</td> <td><input type="text" value=""></input></td></tr>';
		});
		panel+='</tbody>';
		panel+='</table>';
		panel+='</div>';

		panel+='<div id="idOperations">';
		panel+='<table>';
		panel+='<tbody>';
		this.operations.forEach(function(op){
			panel+='<tr><td>'+op.method+':</td> <td>'+op.description+'</td></tr>';
		});
		panel+='</tbody>';
		panel+='</table>';
		panel+='</div>';
		return panel;	
	}
}

module.exports = HydraClass;
