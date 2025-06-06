import { CollectionType, DataType } from "../../enums/index.ts";
import SchemaField from "./SchemaField.ts";

class ForeignKeyField extends SchemaField {
	constructor(displayName: string, collection: CollectionType, required = false) {
		super(displayName, DataType.INT, required);

		this.isReference(collection);
	}
}

export default ForeignKeyField;
