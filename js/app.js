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

//function load(url, on_success){
function getResponse(url, on_success){

	$.ajax({
		type: "GET",
		url: url,
		success: function(resp){
			$form.setUrl(url);
			on_success(resp);
		}
	}); 
}

function loadDoc(doc){
	
	// get a class structure that's simpler to handle
	var classes_array = [];
	doc.api.classes.forEach(function(cl){
		var class_entity = new HydraClass(cl);
		classes_array.push(class_entity);
	});
	
	// ugh ugly and lazy use a template engine instead
	var panel = '<div>';
	classes_array.forEach(function(cl){
		panel += cl.toHtml();
	});
	panel+='</div>';

	$documentation.empty();
	$documentation.append(panel);

	getResponse($form.getUrl(), function(resp){
		$response.empty();
		$response.append(CircularJSON.stringify(resp, null, 4));
	});
}

$(document).ready(function(){

	/* always available actions */
	Form = require('./js/forms.js');
	$form = new Form($);

	$('#idUrlLoad').click(function(e){
		e.preventDefault();
		loadApi(vocab, loadDoc);
	});

	/* get html elements */
	$documentation = $('#idDocumentation');
	$response = $('#idResponseCode');

	/* initial state */
	$form.setUrl(ns.base);
	//$form.setUrl('http://www.markus-lanthaler.com/hydra/api-demo/vocab');

	// this is just to quick check if our api is generic enough
	loadApi(ns.base, loadDoc);
	//loadApi('http://www.markus-lanthaler.com/hydra/api-demo/vocab', loadDoc);
});
