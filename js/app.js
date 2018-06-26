// show dev tools (sdk only)
var win = nw.Window.get();
win.showDevTools();

// config
var ns = require('./config.json');
var vocab = ns.base + '/vocab';
var entry_point = vocab + ns.entry;

// hydra
var HydraClient = require('./js/hydra_client.js');
var HydraClass = require('./js/hydra_class.js');

// circular
var CircularJSON = require('circular-json');

/* html elements */
var $documentation = null;
var $response = null;

// for actions that are always available
// can just be initialized when document already loaded
var $form = null;

function loadApi(url, operation){
	Promise.resolve()
		.then(function(){
			return HydraClient(url);
		})
		.then(function(api){
			operation(api);
		})
		.catch(function(error){
			console.error(error);
		})

};

function load(url, on_success){
	$.ajax({
		type: "GET",
		url: url,
		success: function(resp){
			$form.setUrl(url);
			on_success(resp);
		}
	}); 
}

function load_cb(doc){
	console.log(doc);
	
	// get a class structure that's simpler to handle
	var classes_array = [];
	doc.api.classes.forEach(function(cl){
		var class_entity = new HydraClass(cl);
		classes_array.push(class_entity);
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
	$documentation.empty();
	$documentation.append(panel);

	load($form.getUrl(), function(resp){
		$response.empty();
		$response.append(CircularJSON.stringify(resp, null, 4));
	});
	console.log($form.getUrl());
}

$(document).ready(function(){

	/* always available actions */
	Form = require('./js/forms.js');
	$form = new Form($);

	$('#idUrlLoad').click(function(e){
		e.preventDefault();
		loadApi(vocab, load_cb);
	});

	/* get html elements */
	$documentation = $('#idDocumentation');
	$response = $('#idResponseCode');

	// this is just to quick check if our api is generic enough
	//loadApi('http://www.markus-lanthaler.com/hydra/api-demo/vocab', function(doc){
	
	// initial api load
	loadApi(vocab, load_cb);

	/* init response */
	load(ns.base, function(resp){
		console.log($form.getUrl());
		$response.empty();
		$response.append(CircularJSON.stringify(resp, null, 4));
	});
});
