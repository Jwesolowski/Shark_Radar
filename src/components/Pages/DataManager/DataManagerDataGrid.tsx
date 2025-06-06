import { DataGrid, GridActionsCellItem, GridEventListener, GridRowEditStopReasons, GridRowModes, GridRowModesModel } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import React from "react";
import { BaseModel } from "../../../models/index.ts";
import DataHandler from "../../../utils/DataHandler.ts";
import { Icons } from "../../../utils/enums/index.ts";
import { SchemaField } from "../../../utils/schema-builder/index.ts";

function DataManagerDataGrid(props: {
	model: BaseModel;
	rows: any[];
	setRows: (rows: any[]) => void
	onSuccess: (result: any) => void;
	onError: (result: any) => void;
}) {
	const { model, rows, setRows, onSuccess, onError } = props;

	const [rowModesModel, setRowModesModel] = React.useState({});

	const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}
	};

	const handleEditClick = (id: string) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
	};

	const handleSaveClick = (id: string) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
	};

	const handleDeleteClick = (id: string) => async () => {
		const result = await DataHandler.delete(model.collection, id);

		if (!result.errors) {
			onSuccess(result);
			setRows(rows.filter((row) => row.id !== id));
		} else {
			onError(result);
		}
	};

	const handleCancelClick = (id: string) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true }
		});

		const editedRow = rows.find((row) => row.id === id);
		if (editedRow.isNew) {
			setRows(rows.filter((row) => row.id !== id));
		}
	};

	const processRowUpdate = async (newRow: any) => {
		const updatedRow = { ...newRow, isNew: false };

		const result = await DataHandler.update(model.collection, updatedRow);

		if (!result.errors) {
			onSuccess(result);
			setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
		} else {
			onError(result);
		}

		return updatedRow;
	};

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const columns = (Object.values(model.schema.fields) as SchemaField[]).map((field) => field.buildDataGridColumn());

	columns.push({
		field: "actions",
		type: "actions",
		headerName: "Actions",
		width: 100,
		getActions: ({ id }) => {
			const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

			if (isInEditMode) {
				return [
					<GridActionsCellItem
						key="save"
						icon={<Icons.SAVE />}
						label="Save"
						onClick={handleSaveClick(id)}
					/>,
					<GridActionsCellItem
						key="cancel"
						icon={<Icons.CLOSE />}
						label="Cancel"
						onClick={handleCancelClick(id)}
					/>
				];
			}

			return [
				<GridActionsCellItem
					key="edit"
					icon={<Icons.EDIT />}
					label="Edit"
					onClick={handleEditClick(id)}
				/>,
				<GridActionsCellItem
					key="delete"
					icon={<Icons.DELETE />}
					label="Delete"
					onClick={handleDeleteClick(id)}
				/>
			];
		}
	});

	return (
		<DataGrid
			checkboxSelection
			rows={rows}
			columns={columns}
			editMode="row"
			rowModesModel={rowModesModel}
			processRowUpdate={processRowUpdate}
			pageSizeOptions={[25, 50, 100]}
			initialState={{
				pagination: {
					paginationModel: { page: 0, pageSize: 25 }
				}
			}}
			sx={{
				border: "none",
				overflow: "auto"
			}}
			onRowModesModelChange={handleRowModesModelChange}
			onRowEditStop={handleRowEditStop}
		/>
	);
}

DataManagerDataGrid.propTypes = {
	model: PropTypes.object.isRequired,
	rows: PropTypes.arrayOf(PropTypes.object).isRequired,
	setRows: PropTypes.func.isRequired,
	onSuccess: PropTypes.func.isRequired,
	onError: PropTypes.func.isRequired
};

export default DataManagerDataGrid;
