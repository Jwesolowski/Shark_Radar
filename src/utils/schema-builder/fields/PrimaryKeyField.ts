import { DataType } from "../../enums/index.ts";
import SchemaField from "./SchemaField.ts";

class PrimaryKeyField extends SchemaField {
	constructor(displayName: string) {
		super(displayName, DataType.INT, true);

		this.isKey();
		this.width(50);
		this.auto();
		this.hidden();
	}
}

export default PrimaryKeyField;
