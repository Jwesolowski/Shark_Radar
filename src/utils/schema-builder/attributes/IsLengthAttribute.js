import SchemaAttribute from "../SchemaAttribute.js";

class IsLengthAttribute extends SchemaAttribute {
	/**
	 * @param {boolean} value
	 * @param {number?} min
	 * @param {number?} max
	 */
	constructor(value, min = null, max = null) {
		super(value, false, "Must be a string");

		this.options = {};

		if (min !== null && max !== null) {
			this.options.min = min;
			this.options.max = max;
			this.errorMessage = `Must be between ${min} and ${max} characters long`;
		} else if (min !== null) {
			this.options.min = min;
			this.errorMessage = `Must be at least ${min} characters long`;
		} else if (max !== null) {
			this.options.max = max;
			this.errorMessage += `Must be less than ${max} characters long`;
		}
	}
}

export default IsLengthAttribute;
