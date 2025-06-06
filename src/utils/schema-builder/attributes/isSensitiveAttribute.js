import SchemaAttribute from "../SchemaAttribute.js";

class IsSensitiveAttribute extends SchemaAttribute {
	/**
	 * @param {boolean} value
	 */
	constructor(value) {
		super(value, true);
	}
}

export default IsSensitiveAttribute;
