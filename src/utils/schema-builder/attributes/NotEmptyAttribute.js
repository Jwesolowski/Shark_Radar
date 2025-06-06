import SchemaAttribute from "../SchemaAttribute.js";

class NotEmptyAttribute extends SchemaAttribute {
	/**
	 * @param {boolean} value
	 */
	constructor(value) {
		super(value, false, "Cannot be empty");
	}
}

export default NotEmptyAttribute;
