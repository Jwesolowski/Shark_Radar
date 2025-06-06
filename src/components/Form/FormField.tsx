import { Box, InputLabel, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import PropTypes from "prop-types";
import React from "react";
import { SchemaField } from "../../utils/schema-builder/index.ts";
import FormCheckbox from "./FormCheckbox.jsx";
import FormSelectField from "./FormSelectField.jsx";
import FormTextField from "./FormTextField.jsx";

function FormField(props: {
	schemaField: SchemaField;
	value: string;
	errors: string;
	titleOverride?: string;
	idOverride?: string;
	asteriskOverride?: boolean;
	fullWidth?: boolean;
	onChange: (value: string | boolean) => void;
}) {
	const { schemaField, value, errors, titleOverride, idOverride, asteriskOverride, fullWidth, onChange } = props;

	const label = schemaField.displayName;

	let inputField = null;

	if (schemaField.attributes.isReference.value) {
		inputField = (
			<FormSelectField
				schemaField={schemaField}
				value={value}
				errors={errors}
				idOverride={idOverride}
				fullWidth={fullWidth}
				onChange={onChange}
			/>
		);
	} else if (schemaField.attributes.isBoolean.value) {
		inputField = (
			<FormCheckbox
				schemaField={schemaField}
				value={value}
				idOverride={idOverride}
				onChange={onChange}
			/>
		);
	} else {
		inputField = (
			<FormTextField
				schemaField={schemaField}
				value={value}
				errors={errors}
				idOverride={idOverride}
				fullWidth={fullWidth}
				onChange={onChange}
			/>
		);
	}

	const hasAsterisk = asteriskOverride ?? schemaField.attributes.required.value;

	return (
		<Box sx={{
			display: "flex",
			flexDirection: "column",
			gap: 1,
			width: "100%"
		}}>
			<InputLabel>
				{
					hasAsterisk &&
					<span style={{
						color: red[500]
					}}>* </span>
				}
				{titleOverride ?? label}
			</InputLabel>
			{inputField}
			<Typography
				variant="caption"
				color="error"
			>
				{errors}
			</Typography>
		</Box>
	);
}

FormField.propTypes = {
	schemaField: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.string,
	errors: PropTypes.string,
	titleOverride: PropTypes.string,
	idOverride: PropTypes.string,
	asteriskOverride: PropTypes.bool
};

export default FormField;
