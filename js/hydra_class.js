'use strict';

var HydraOperation = require('./hydra_operation.js');
var HydraProperty = require('./hydra_property.js');

class HydraClass {
	constructor(base, jquery, form, cl){

		this.base = base;
		this.$ = jquery;
		this.$form = form;
		this.iri = cl.iri;
		this.name = cl.label;
		this.operations = [];
		this.properties = [];
		this.form_id = this.name+'-form';

		var context = this;
		// get operations
		cl.operations.forEach(function(op){
			if (op != undefined) {
				var op_entity = new HydraOperation(op);
				context.operations.push(op_entity);
			}
		});
		// artifical post because hydra core won't work
		this.operations.push({iri: "bla", method: "POST", description: "create"});

		// get properties
		cl.properties.forEach(function(prop){
			var prop_entity = new HydraProperty(context.name, prop);
			context.properties.push(prop_entity);
		});
	}

	// TODO: use template engine instead
	toHtml(){
		var context = this;
		var panel ='<h3>'+this.name+'</h3>';
		panel+='<div id="idProperties">';
		panel+='<form id="'+this.form_id+'">';
		panel+='<table>';
		panel+='<tbody>';
		this.properties.forEach(function(prop){
			panel+='<tr><td>'+prop.name+':</td> <td><input type="text" value="" id="'+prop.id+'"></input></td></tr>';
		});
		panel+='</tbody>';
		panel+='</table>';
		panel+='</div>';

		panel+='<div id="idOperations">';
		panel+='<table>';
		panel+='<tbody>';
		this.operations.forEach(function(op){
			op.button_id = context.name+"-"+op.method;
			if (op.method != "POST")
				panel += '<tr class="uk-width-1-5"><td><button class="uk-button" id="'+op.button_id+'">'+op.method+'</button>' + 
				'<input class="uk-width-1-6" type="text" id="'+op.button_id+'-id'+'"></input></td> <td>'+op.description+'</td></tr>';
			else
				panel += '<tr class="uk-width-1-5"><td><button class="uk-button" id="'+op.button_id+'">'+op.method+'</button>' + 
				'</td> <td>'+op.description+'</td></tr>';

		});
		panel+='</tbody>';
		panel+='</table>';
		panel+='</form>';
		panel+='</div>';
		return panel;	
	}

	bindButtons(){

		var context = this;
		this.operations.forEach(function(op){
			context.$('#'+op.button_id).click(function(e){
				e.preventDefault();

				// get request data
				var req_data = {};
				context.properties.forEach(function(prop){
					req_data[prop.name] = context.$('#'+prop.id).val();
				});

				// evaluate url
				var is_collection_req = true;
				var url_id = context.$('#'+op.button_id+'-id').val();
				var url = null;
				if (url_id != undefined) {
					url = context.base+'/'+context.plural+'/'+url_id;
					is_collection_req = false;
				} else {
					url = context.base+'/'+context.plural;
					is_collection_req = true;
				}

				// send request
				context.$.ajax({
					type: op.method,
					url: url,
					dataType: "json",
					data: (op.method=='PUT' || op.method=='POST') ? req_data : null,
					success: function(resp){
						context.$form.setResponse(JSON.stringify(resp,null,4));
						context.properties.forEach(function(prop){
							context.$('#'+prop.id).val(resp[prop.name]);
						});
					},
					error: function(xhr, ajaxOptions, thrownError){
						context.$form.setResponse('[ERROR]: ' + thrownError +'\n[DATA:]'+ JSON.stringify(req_data));
					}
				}); 
			});
		});
	}
}

module.exports = HydraClass;
