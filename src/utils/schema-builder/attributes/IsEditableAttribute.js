import SchemaAttribute from "../SchemaAttribute.js";

class IsEditableAttribute extends SchemaAttribute {
	/**
	 * @param {boolean} value
	 */
	constructor(value) {
		super(value, true, "Cannot be changed");
	}
}

export default IsEditableAttribute;
