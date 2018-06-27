'use strict';

class HydraProperty {
	constructor(class_name, prop){
		this.name = prop.title;
		this.class_name = class_name;
		this.id = this.class_name+'-'+this.name;
	}
}

module.exports = HydraProperty;
