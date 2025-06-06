import SchemaAttribute from "../SchemaAttribute.js";

class IsIntAttribute extends SchemaAttribute {
	/**
	 * @param {boolean} value
	 */
	constructor(value) {
		super(value, false, "Must be an integer");
	}
}

export default IsIntAttribute;
