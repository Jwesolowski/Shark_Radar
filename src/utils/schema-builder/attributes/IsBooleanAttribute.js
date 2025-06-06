import SchemaAttribute from "../SchemaAttribute.js";

class IsBooleanAttribute extends SchemaAttribute {
	/**
	 * @param {boolean} value
	 */
	constructor(value) {
		super(value, false, "Must be true/false");

		this.strict = true;
	}
}

export default IsBooleanAttribute;
