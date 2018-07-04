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
		this.header_id = this.name+'-header';
		this.properties_id = this.name+'-properties';
		this.operations_id = this.name+'-operations';
		this.icon_plus_id = this.name+'-plus';
		this.icon_minus_id = this.name+'-minus';

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

	toHtml(){

		var context = this;
		var panel ='<a href="#" style="font-size:20px;" id="'+this.header_id+'">'+this.name+
				' <i id="'+this.icon_plus_id+'" class="uk-icon-plus-square-o"></i>'+
				'<i id="'+this.icon_minus_id+'" class="uk-icon-minus-square-o"></i></a>';

		panel+='<div style="background-color:#f5f5f5;" id="'+this.properties_id+'">';
		panel+='<h3>Properties</h3>';
		panel+='<form id="'+this.form_id+'">';
		panel+='<table>';
		panel+='<tbody>';
		this.properties.forEach(function(prop){
			panel+='<tr><td>'+prop.name+':</td> <td><input class="uk-input" type="text" value="" id="'+prop.id+'"></input></td></tr>';
		});
		panel+='</tbody>';
		panel+='</table>';
		panel+='</div>';

		panel+='<div style="background-color:#f5f5f5;" id="'+this.operations_id+'">';

		panel+='<div class="uk-panel-divider"></div>';
		panel+='<h3>Operations</h3>';
		panel+='<table class="uk-table">';
		panel+='<tbody>';
		this.operations.forEach(function(op){
			op.button_id = context.name+"-"+op.method;
			if (op.method != "POST") {
				panel += '<tr>'+
					'<td><button class="uk-button uk-button-primary" id="'+op.button_id+'">'+op.method+'</button></td>' + 
					'<td><input class="uk-input" type="text" id="'+op.button_id+'-id'+'"></input></td>'+
					'<td>'+op.description+'</td></tr>';
			} else {
				panel += '<tr>'+
					'<td><button class="uk-button uk-button-primary" id="'+op.button_id+'">'+op.method+'</button></td>'+
					'<td></td>';
					'<td>'+op.description+'</td></tr>';
			}
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
						context.$form.setResponse('[ERROR]: ' + thrownError);
					}
				}); 
			});
		});

		context.$('#'+context.icon_minus_id).toggle();
		context.$('#'+context.properties_id).children().toggle();	
		context.$('#'+context.operations_id).children().toggle();	

		context.$('#'+context.header_id).click(function(e){
			e.preventDefault();
			context.$('#'+context.icon_plus_id).toggle();
			context.$('#'+context.icon_minus_id).toggle();
			context.$('#'+context.properties_id).children().toggle();
			context.$('#'+context.operations_id).children().toggle();
		});
	}
}

module.exports = HydraClass;
