import SchemaAttribute from "../SchemaAttribute.ts";

/** @typedef {import("../../enums/Collection.ts").CollectionType} CollectionType */

class IsReferenceAttribute extends SchemaAttribute {
	/**
	 * @param {boolean} value
	 * @param {CollectionType | null} collection
	 */
	constructor(value, collection) {
		super(value, true, "Must be a reference");

		this.collection = collection;
	}
}

export default IsReferenceAttribute;
