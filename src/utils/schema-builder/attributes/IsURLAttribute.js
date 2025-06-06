import SchemaAttribute from "../SchemaAttribute.js";

class IsURLAttribute extends SchemaAttribute {
	/**
	 * @param {boolean} value
	 */
	constructor(value) {
		super(value, false, "Must be a URL");
	}
}

export default IsURLAttribute;
