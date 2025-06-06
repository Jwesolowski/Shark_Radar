class SchemaFieldAttribute {
	value: any;
	isCustom: boolean;
	errorMessage: string | null;

	constructor(value: any, isCustom: boolean, errorMessage: string | null = null) {
		this.value = value;
		this.isCustom = isCustom;
		this.errorMessage = errorMessage;
	}
}

export default SchemaFieldAttribute;
