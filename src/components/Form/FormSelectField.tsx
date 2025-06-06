import { FormControl, MenuItem, Select } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import DataHandler from "../../utils/DataHandler.ts";
import { modelMap } from "../../utils/global.ts";
import { SchemaField } from "../../utils/schema-builder/index.ts";

function FormSelectField(props: {
	schemaField: SchemaField;
	value: string;
	errors: string;
	idOverride?: string;
	fullWidth?: boolean;
	onChange: (value: string) => void;
}) {
	const { schemaField, value, errors, idOverride, fullWidth, onChange } = props;

	const [options, setOptions] = React.useState(/** @type {any[]} */([]));

	const collection = schemaField.attributes.isReference.collection;

	if (!collection) {
		throw new Error(`Collection name not found for field: ${schemaField.fieldName}`);
	}

	const model = modelMap(collection);

	if (!model) {
		throw new Error(`Schema not found for collection: ${collection}`);
	}

	const schema = model.schema;

	const primaryField = schema.primaryKeyField;

	if (!primaryField) {
		throw new Error(`Primary key field not found for collection: ${collection}`);
	}

	const displayField = schema.displayField?.fieldName ?? primaryField.fieldName;

	React.useEffect(() => {
		(async () => {
			if (schemaField.attributes.isReference) {
				const result = await DataHandler.list(collection);
				setOptions(result);
			}
		})();
	}, [collection, schemaField]);

	return (
		<FormControl fullWidth>
			<Select
				value={value}
				error={errors?.length > 0}
				size="small"
				id={idOverride ?? schemaField.fieldName}
				fullWidth={fullWidth}
				onChange={e => onChange(e.target.value)}
			>
				<MenuItem value="">
					<em>None</em>
				</MenuItem>
				{options.map((option, index) => (
					<MenuItem
						key={index}
						value={option[primaryField.fieldName].toString()}
					>
						{option[displayField]}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}

FormSelectField.propTypes = {
	schemaField: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.string,
	errors: PropTypes.string,
	idOverride: PropTypes.string,
	fullWidth: PropTypes.bool
};

export default FormSelectField;
