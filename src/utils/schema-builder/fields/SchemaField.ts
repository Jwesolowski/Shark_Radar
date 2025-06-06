import { CollectionType, DataType, DataTypeType } from "../../enums/index.ts";
import WidthAttribute from "../attributes/WidthAttribute.js";
import SchemaFieldAttributes from "../SchemaFieldAttributes.ts";

class SchemaField {
	fieldName: string = "";
	displayName: string;
	attributes: SchemaFieldAttributes;

	constructor(displayName: string, dataType: DataTypeType, required = false) {
		this.displayName = displayName;
		this.attributes = new SchemaFieldAttributes();

		this.type(dataType);

		if (required) {
			this.required();
		} else {
			this.optional();
		}
	}

	buildDataGridColumn() {
		return {
			field: this.fieldName,
			headerName: this.displayName,
			width: this.attributes.width.value,
			editable: this.attributes.isEditable.value,
			hide: this.attributes.hidden.value,
			tooltipField: this.fieldName,
			tooltipValueGetter: (params: { data: never }) => {
				return params.data[this.fieldName];
			}
		};
	}

	auto() {
		this.attributes.auto.value = true;
		return this;
	}

	isKey() {
		this.attributes.isKey.value = true;
		return this;
	}

	isReference(collection: CollectionType) {
		this.attributes.isReference.value = true;
		this.attributes.isReference.collection = collection;
		return this;
	}

	trim() {
		this.attributes.trim.value = true;
		return this;
	}

	private optional() {
		this.attributes.optional.value = true;
		this.attributes.required.value = false;
		return this;
	}

	notEmpty() {
		this.attributes.notEmpty.value = true;
		this.attributes.trim.value = true;
		return this;
	}

	forDisplay() {
		this.attributes.forDisplay.value = true;
		return this;
	}

	private type(value: DataTypeType) {
		this.attributes.type.value = value;
		this.attributes.isInt.value = false;
		this.attributes.isFloat.value = false;
		this.attributes.isString.value = false;
		this.attributes.isBoolean.value = false;

		switch (value) {
		case DataType.INT: this.attributes.isInt.value = true; break;
		case DataType.FLOAT: this.attributes.isFloat.value = true; break;
		case DataType.STRING: this.attributes.isString.value = true; break;
		case DataType.BOOL: this.attributes.isBoolean.value = true; break;
		default: break;
		}

		return this;
	}

	width(value: number) {
		this.attributes.width.value = value;
		return this;
	}

	isSensitive() {
		this.attributes.isSensitive.value = true;
		return this;
	}

	private required() {
		this.attributes.required.value = true;
		this.attributes.optional.value = false;
		this.attributes.notEmpty.value = true;
		this.attributes.trim.value = true;
		return this;
	}

	isURL() {
		this.attributes.isURL.value = true;
		this.type(DataType.STRING);
		this.width(WidthAttribute.Size.XL);
		return this;
	}

	isEditable() {
		this.attributes.isEditable.value = true;
		return this;
	}

	isReadOnly() {
		this.attributes.isEditable.value = false;
		return this;
	}

	hidden() {
		this.attributes.hidden.value = true;

		this.isReadOnly();

		return this;
	}
}

export default SchemaField;
