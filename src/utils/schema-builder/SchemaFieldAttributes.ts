import { DataType } from "../enums/index.ts";
import AutoAttribute from "./attributes/AutoAttribute.js";
import ForDisplayAttribute from "./attributes/ForDisplayAttribute.js";
import HiddenAttribute from "./attributes/HiddenAttribute.js";
import IsBooleanAttribute from "./attributes/IsBooleanAttribute.js";
import IsEditableAttribute from "./attributes/IsEditableAttribute.js";
import IsFloatAttribute from "./attributes/IsFloatAttribute.js";
import IsIntAttribute from "./attributes/IsIntAttribute.js";
import IsKeyAttribute from "./attributes/IsKeyAttribute.js";
import IsLengthAttribute from "./attributes/IsLengthAttribute.js";
import IsReferenceAttribute from "./attributes/IsReferenceAttribute.js";
import IsSensitiveAttribute from "./attributes/isSensitiveAttribute.js";
import IsStringAttribute from "./attributes/IsStringAttribute.js";
import IsURLAttribute from "./attributes/IsURLAttribute.js";
import NotEmptyAttribute from "./attributes/NotEmptyAttribute.js";
import OptionalAttribute from "./attributes/OptionalAttribute.js";
import RequiredAttribute from "./attributes/RequiredAttribute.js";
import TrimAttribute from "./attributes/TrimAttribute.js";
import TypeAttribute from "./attributes/TypeAttribute.js";
import WidthAttribute from "./attributes/WidthAttribute.js";

// ORDER MATTERS
class SchemaFieldAttributes {
	// pre-processing attributes
	optional = new OptionalAttribute(false);
	trim = new TrimAttribute(false);
	notEmpty = new NotEmptyAttribute(false);
	isEditable = new IsEditableAttribute(true);
	isLength = new IsLengthAttribute(false);

	// type checking attributes
	isFloat = new IsFloatAttribute(false);
	isInt = new IsIntAttribute(false);
	isString = new IsStringAttribute(false);
	isBoolean = new IsBooleanAttribute(false);
	isURL = new IsURLAttribute(false);

	isKey = new IsKeyAttribute(false);
	isReference = new IsReferenceAttribute(false, null);

	forDisplay = new ForDisplayAttribute(false);
	type = new TypeAttribute(DataType.ANY);
	width = new WidthAttribute(WidthAttribute.Size.DEFAULT);
	isSensitive = new IsSensitiveAttribute(false);
	auto = new AutoAttribute(false);
	required = new RequiredAttribute(false);
	hidden = new HiddenAttribute(false);
}

export default SchemaFieldAttributes;
