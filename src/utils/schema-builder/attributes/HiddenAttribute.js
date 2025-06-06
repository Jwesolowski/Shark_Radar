import SchemaAttribute from "../SchemaAttribute.js";

class HiddenAttribute extends SchemaAttribute {
	/**
	 * @param {boolean} value
	 */
	constructor(value) {
		super(value, true);
	}
}

export default HiddenAttribute;
