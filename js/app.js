// show dev tools (sdk only)
var win = nw.Window.get();
win.showDevTools();

// config
var ns = require('./config.json');
var vocab = ns.base + '/vocab';
var entry_point = vocab + ns.entry;

// hydra
var client = require('./js/hydra_client.js');

// circular
var CircularJSON = require('circular-json');

function setUrl(text) {
	var url = $('#idUrlInput');
	url.val(text);
}
function getUrl() {
	var url = $('#idUrlInput');
	return url.val();
}

function loadApi(url, operation){
	Promise.resolve()
		.then(function(){
			return client(url);
		})
		.then(function(api){
			//console.log(api);
			operation(api);
		})
		.catch(function(error){
			console.error(error);
		})

};

var current_json = null;

function load(url, on_success){
	$.ajax({
		type: "GET",
		url: url,
		success: function(resp){
			setUrl(url);
			on_success(resp);
			current_json = resp;
		}
	}); 
}

$(document).ready(function(){
	//var $classes = $('#idHydraClassesList');
	var $documentation = $('#idDocumentation');
	var $response = $('#idResponseCode');

	// this is just to quick check if our api is generic enough
	//loadApi('http://www.markus-lanthaler.com/hydra/api-demo/vocab', function(doc){
	// initial api load
	loadApi(vocab, function(doc){
		console.log(doc);
		
		// get a class structure that's simpler to handle
		var classes_array = [];
		doc.api.classes.forEach(function(cl){
			var class_entity = {
				iri: cl.iri,
				name: cl.label,
				operations: [],
				properties: []
			}
			// get operations
			cl.operations.forEach(function(op){
				var op_entity = {
					iri: op.iri,
					method: op.method,
					description: op.label
				}
				class_entity.operations.push(op_entity);
			});

			// get properties
			cl.properties.forEach(function(prop){
				var prop_entity = {
					name: prop.title
				}
				class_entity.properties.push(prop_entity);
			});

			classes_array.push(class_entity);
		});
		
		classes_array.forEach(function(cl){
			console.log(cl.name);
		});

		// ugh ugly and lazy use a template engine instead
		var panel = '<div>';
		classes_array.forEach(function(cl){
			panel+='<h3>'+cl.name+'</h3>';
			panel+='<div id="idProperties">';
			panel+='<table>';
			panel+='<tbody>';
			cl.properties.forEach(function(prop){
				panel+='<tr><td>'+prop.name+':</td> <td><input type="text" value=""></input></td></tr>';
			});
			panel+='</tbody>';
			panel+='</table>';
			panel+='</div>';

			panel+='<div id="idOperations">';
			panel+='<table>';
			panel+='<tbody>';
			cl.operations.forEach(function(op){
				panel+='<tr><td>'+op.method+':</td> <td>'+op.description+'</td></tr>';
			});
			panel+='</tbody>';
			panel+='</table>';
			panel+='</div>';
		});
		panel+='</div>';
		$documentation.append(panel);
	});

	$('#idUrlLoad').click(function(e){
		e.preventDefault();
		console.log(getUrl());
		load(getUrl(), function(resp){
			$response.empty();
			$response.append(CircularJSON.stringify(resp, null, 4));
		});
	});

	load(ns.base, function(resp){
		console.log(getUrl());
		$response.empty();
		$response.append(CircularJSON.stringify(resp, null, 4));
	});
});
