import SchemaAttribute from "../SchemaAttribute.js";

class RequiredAttribute extends SchemaAttribute {
	/**
	 * @param {boolean} value
	 */
	constructor(value) {
		super(value, true, "Required");
	}
}

export default RequiredAttribute;
