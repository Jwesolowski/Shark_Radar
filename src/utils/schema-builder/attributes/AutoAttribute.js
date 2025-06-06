import SchemaAttribute from "../SchemaAttribute.js";

class AutoAttribute extends SchemaAttribute {
	/**
	 * @param {boolean} value
	 */
	constructor(value) {
		super(value, true);
	}
}

export default AutoAttribute;
