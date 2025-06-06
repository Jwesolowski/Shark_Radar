import SchemaAttribute from "../SchemaAttribute.js";

class ForDisplayAttribute extends SchemaAttribute {
	/**
	 * @param {boolean} value
	 */
	constructor(value) {
		super(value, true);
	}
}

export default ForDisplayAttribute;
