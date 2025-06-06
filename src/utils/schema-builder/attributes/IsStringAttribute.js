import SchemaAttribute from "../SchemaAttribute.js";

class IsStringAttribute extends SchemaAttribute {
	/**
	 * @param {boolean} value
	 */
	constructor(value) {
		super(value, false, "Must be a string");
	}
}

export default IsStringAttribute;
