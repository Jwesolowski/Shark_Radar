import SchemaAttribute from "../SchemaAttribute.js";

class OptionalAttribute extends SchemaAttribute {
	/**
	 * @param {boolean} value
	 */
	constructor(value) {
		super(value, false);

		this.options = { nullable: true, checkFalsy: true };
	}
}

export default OptionalAttribute;
