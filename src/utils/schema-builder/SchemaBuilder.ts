import SchemaField from "./fields/SchemaField.ts";

class SchemaBuilder<T extends { [i: symbol]: SchemaField }> {
	fields: T;
	primaryKeyField: SchemaField | null = null;
	displayField: SchemaField | null = null;

	constructor(schema: T) {
		const schemaCopy = { ...schema };

		for (const [fieldName, field] of (Object.entries(schemaCopy) as [string, SchemaField][])) {
			field.fieldName = fieldName;

			if (field.attributes.isKey.value) {
				this.primaryKeyField = field;
			}

			if (field.attributes.forDisplay.value) {
				this.displayField = field;
			}
		}

		this.fields = schemaCopy;
	}
}

export default SchemaBuilder;
