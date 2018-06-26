'use strict';

class Form {
	constructor($) {
		this.$ = $;	
	}

	setUrl(text) {
		var url = this.$('#idUrlInput');
		url.val(text);
	}

	getUrl() {
		var url = this.$('#idUrlInput');
		return url.val();
	}
}

module.exports = Form;
