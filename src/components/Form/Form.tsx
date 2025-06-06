import { Button, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { red } from "@mui/material/colors";
import { FieldValidationError } from "express-validator";
import PropTypes from "prop-types";
import React from "react";
import { BaseModel } from "../../models/index.ts";
import DataHandler from "../../utils/DataHandler.ts";
import { Strings } from "../../utils/enums/index.ts";
import { SchemaField } from "../../utils/schema-builder/index.ts";
import FormField from "./FormField.jsx";

function Form(props: {
	title?: string;
	model: BaseModel;
	actionType: string;
	onSuccess: () => void;
	onError: (errors: FieldValidationError[]) => void;
}) {
	const { title, model, onSuccess, onError } = props;

	const { collection } = model;
	const schema = model.schema;

	const [object, setObject] = React.useState({});
	const [errors, setErrors] = React.useState({});

	const resetForm = React.useCallback(() => {
		const emptyObject = Object.fromEntries(Object.keys(model.schema.fields).map(key => [key, ""]));
		const dataObject = Object.fromEntries(Object.keys(model.schema.fields).map(key => [key, model[key] ?? ""]));

		setObject({...dataObject});
		setErrors({...emptyObject});
	}, [model]);

	React.useEffect(() => {
		resetForm();
	}, [resetForm]);

	const handleFieldChange = (key: string, value: string | boolean) => {
		setObject({
			...object,
			[key]: value
		});
	};

	const handleSuccess = () => {
		resetForm();
	};

	const handleErrors = (errors: FieldValidationError[]) => {
		const errorMap = {} as typeof model;

		errors.forEach(error => {
			if (errorMap[error.path]) {
				errorMap[error.path] += `, ${error.msg}`;
			} else {
				errorMap[error.path] = error.msg;
			}
		});

		setErrors(errorMap);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const result = await DataHandler.insert(collection, object as typeof model);

		if (result.acknowledged) {
			handleSuccess();
			onSuccess();
		} else {
			handleErrors(result.errors);
			onError(result.errors);
		}
	};

	const fields = [];

	if (object !== null && errors !== null) {
		(Object.entries(schema.fields) as [string, SchemaField][]).forEach(([key, value]) => {
			const objectField = object[key];
			const errorField = errors[key];

			if (objectField !== undefined && !value.attributes.hidden.value) {
				fields.push(<FormField
					key={key}
					schemaField={value}
					value={objectField.toString()}
					errors={errorField}
					onChange={value => handleFieldChange(key, value)}
				/>);
			}
		});
	}

	const hasRequiredFields = (Object.values(schema.fields) as SchemaField[]).some(field => field.attributes.required.value);

	return (
		<Stack direction="column">
			{
				title &&
				<DialogTitle>{title}</DialogTitle>
			}
			<DialogContent sx={{
				display: "flex",
				flexDirection: "column",
				gap: 2
			}}>
				{fields}
				{
					hasRequiredFields ? <span style={{ color: red[500] }}>{Strings.REQUIRED_FIELDS}</span> : null
				}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleSubmit}>{Strings.SUBMIT}</Button>
			</DialogActions>
		</Stack>
	);
}

Form.propTypes = {
	model: PropTypes.object.isRequired,
	actionType: PropTypes.string.isRequired,
	onSuccess: PropTypes.func.isRequired,
	onError: PropTypes.func.isRequired,
	title: PropTypes.string
};

export default Form;
