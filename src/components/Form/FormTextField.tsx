import { InputAdornment, TextField } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { Icons, DataType } from "../../utils/enums/index.ts";
import { SchemaField } from "../../utils/schema-builder/index.ts";

function FormTextField(props: {
	schemaField: SchemaField;
	value: string;
	errors: string;
	idOverride?: string;
	fullWidth?: boolean;
	onChange: (value: string) => void;
}) {
	const { schemaField, value, errors, idOverride, fullWidth, onChange } = props;

	const schemaType = schemaField.attributes.type.value;

	let icon = null;

	switch (schemaType) {
	case DataType.INT:
	case DataType.FLOAT:
		icon = <Icons.TAG fontSize="small" />;
		break;
	}

	if (schemaField.attributes.isURL.value) {
		icon = <Icons.LINK fontSize="small" />;
	}

	const adornment = icon ? {
		startAdornment: <InputAdornment position="start">{icon}</InputAdornment>
	} : {};

	let type = "text";

	if (schemaField.attributes.isSensitive.value) {
		type = "password";
	} else {
		switch (schemaType) {
		case DataType.INT:
		case DataType.FLOAT:
			type = "number";
			break;
		case DataType.BOOL:
			type = "checkbox";
			throw new Error("FormCheckbox should be used instead.");
		case DataType.DATE:
			type = "date";
			break;
		case DataType.DATETIME:
			type = "datetime-local";
			break;
		default:
			type = "text";
			break;
		}
	}

	return (
		<TextField
			value={value}
			error={errors?.length > 0}
			type={type}
			InputProps={adornment}
			id={idOverride ?? schemaField.fieldName}
			size="small"
			disabled={schemaField.attributes.isEditable.value === false}
			fullWidth={fullWidth}
			onChange={e => onChange(e.target.value)}
		/>
	);
}

FormTextField.propTypes = {
	schemaField: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.string,
	errors: PropTypes.string,
	idOverride: PropTypes.string,
	fullWidth: PropTypes.bool
};

export default FormTextField;
