import SchemaAttribute from "../SchemaAttribute.js";

class IsFloatAttribute extends SchemaAttribute {
	/**
	 * @param {boolean} value
	 */
	constructor(value) {
		super(value, false, "Must be a number");
	}
}

export default IsFloatAttribute;
