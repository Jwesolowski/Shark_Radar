import SchemaAttribute from "../SchemaAttribute.js";

/** @typedef {import("../../enums/DataType.ts").DataTypeType} DataTypeType */

class TypeAttribute extends SchemaAttribute {
	/**
	 * @param {DataTypeType} value
	 */
	constructor(value) {
		super(value, true);
	}
}

export default TypeAttribute;
