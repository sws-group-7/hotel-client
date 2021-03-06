// show dev tools (sdk only)
var win = nw.Window.get();
win.showDevTools();
// warning this will actually enable kiosk mode
//win.enterFullscreen();

// haacky
var StringSimilarity = require('string-similarity');
// config
var ns = require('./config.json');
var vocab = ns.base + '/vocab';
var entry_point = vocab + ns.entry;

// hydra
var HydraClient = require('./js/hydra_client.js');
var HydraClass = require('./js/hydra_class.js');

// circular
var CircularJSON = require('circular-json');

// for actions that are always available
// can just be initialized when document already loaded
var $form = null;

function loadApi(url, operation){

	Promise.resolve()
		.then(function(){
			return HydraClient(url);
		})
		.then(function(api){
			console.log(api);
			operation(api);
		})
		.catch(function(error){
			console.error(error);
		})
};

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
	var hydra_classes = [];
	var plural_classes = [];

	var EntryPoint = null;
	doc.api.classes.forEach(function(cl){
		if(cl.label=="EntryPoint") {
			cl.properties.forEach(function(prop){
				plural_classes.push(prop.title);
			});
		}
	});
	
	doc.api.classes.forEach(function(cl){
		var class_entity = new HydraClass($form.getUrl(), $, $form, cl);
		hydra_classes.push(class_entity);
	});

	// this is super hacky :/
	hydra_classes.forEach(function(cl){
		if (cl.name != undefined) {
			var match = StringSimilarity.findBestMatch(cl.name, plural_classes);
			cl.plural = match.bestMatch.target;
		}
	});
	
	var panel = '<div>';
	hydra_classes.forEach(function(cl){
		if (cl.name != undefined && cl.name != "EntryPoint")
			panel += cl.toHtml();
	});
	panel+='</div>';

	$form.setDocumentation(panel);

	getResponse($form.getUrl(), function(resp){
		$form.setResponse(CircularJSON.stringify(resp, null, 4));
	});

	hydra_classes.forEach(function(cl){
		cl.bindButtons();
	});
}

$(document).ready(function(){

	/* always available actions */
	Form = require('./js/forms.js');
	$form = new Form($);

	$('#idUrlLoad').click(function(e){
		e.preventDefault();
		loadApi($form.getUrl(), loadDoc);
	});

	/* initial state */
	$form.setUrl(ns.base);
	//$form.setUrl('http://www.markus-lanthaler.com/hydra/api-demo');

	// this is just to quick check if our api is generic enough
	loadApi(ns.base, loadDoc);
	//loadApi('http://www.markus-lanthaler.com/hydra/api-demo', loadDoc);
});
