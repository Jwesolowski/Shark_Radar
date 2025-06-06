const DataType = Object.freeze({
	INT: "int",
	STRING: "string",
	DATE: "date",
	DATETIME: "datetime",
	BOOL: "bool",
	FLOAT: "float",
	ANY: "any"
});

type DataTypeType = typeof DataType[keyof typeof DataType];

export { DataType, DataTypeType };
