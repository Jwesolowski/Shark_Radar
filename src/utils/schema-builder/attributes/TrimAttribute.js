import SchemaAttribute from "../SchemaAttribute.js";

class TrimAttribute extends SchemaAttribute {
	/**
	 * @param {boolean} value
	 */
	constructor(value) {
		super(value, true);
	}
}

export default TrimAttribute;
