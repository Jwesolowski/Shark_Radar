import { Checkbox } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { DataType } from "../../utils/enums/index.ts";
import { SchemaField } from "../../utils/schema-builder/index.ts";

function FormCheckbox(props: {
	schemaField: SchemaField;
	value: string;
	idOverride?: string;
	onChange: (value: boolean) => void;
}) {
	const { schemaField, value, idOverride, onChange } = props;

	const schemaType = schemaField.attributes.type.value;

	if (schemaType !== DataType.BOOL) {
		throw new Error("FormCheckbox should only be used for boolean fields.");
	}

	return (
		<Checkbox
			value={value}
			size="small"
			id={idOverride ?? schemaField.fieldName}
			disabled={schemaField.attributes.isEditable.value === false}
			onChange={e => onChange(e.target.checked)}
		/>
	);
}

FormCheckbox.propTypes = {
	schemaField: PropTypes.object.isRequired,
	value: PropTypes.any.isRequired,
	onChange: PropTypes.func.isRequired,
	idOverride: PropTypes.string
};

export default FormCheckbox;
