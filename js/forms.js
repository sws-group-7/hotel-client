'use strict';

class Form {
	constructor($) {
		this.$ = $;	
	}

	setUrl(text) {
		var $url = this.$('#idUrlInput');
		$url.val(text);
	}

	getUrl() {
		var $url = this.$('#idUrlInput');
		return $url.val();
	}

	setResponse(resp) {
		var $resp = this.$('#idResponseCode');	
		$resp.empty();	
		$resp.append(resp);
	}

	delResponse() {
		var $resp = this.$('#idResponseCode');	
		$resp.empty();	
	}

	setDocumentation(doc) {
		var $doc = this.$('#idDocumentation');	
		$doc.empty();	
		$doc.append(doc);
	}
}

module.exports = Form;
