import SchemaAttribute from "../SchemaAttribute.js";

class IsKeyAttribute extends SchemaAttribute {
	/**
	 * @param {boolean} value
	 */
	constructor(value) {
		super(value, true, "ID must be unique");
	}
}

export default IsKeyAttribute;
