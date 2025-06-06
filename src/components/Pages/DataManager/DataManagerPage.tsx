import { Alert, AlertColor, Box, Divider, Snackbar, Tab, Tabs, Toolbar } from "@mui/material";
import React from "react";
import { Strings } from "../../../utils/enums/index.ts";
import DataHandler from "../../../utils/DataHandler.ts";
import { Method, Collection } from "../../../utils/enums/index.ts";
import { modelMap } from "../../../utils/global.ts";
import Form from "../../Form/Form.jsx";
import DataManagerDataGrid from "./DataManagerDataGrid.jsx";

const tabModels = Object.values(Collection).map(collection => modelMap(collection)) ?? [];

class Popup {
	text;
	severity;
	open;

	constructor(text: string, severity: AlertColor, open: boolean) {
		this.text = text;
		this.severity = severity;
		this.open = open;
	}
}

function getWindowHashInt() {
	const hash = window.location.hash;

	if (hash.length > 0) {
		const hashInt = parseInt(hash.substring(1));

		if (!isNaN(hashInt)) {
			return hashInt;
		}
	}

	return 0;
}

function DataManagerPage() {
	const [snackbar, setSnackbar] = React.useState(new Popup("", "success", false));
	const [tabValue, setTabValue] = React.useState(getWindowHashInt());
	const [data, setData] = React.useState([]);

	React.useEffect(() => {
		const fetchData = async () => {
			const model = tabModels[tabValue];

			if (!model) {
				return;
			}

			const primaryKeyField = model.schema.primaryKeyField;

			if (!primaryKeyField) {
				return;
			}

			const result = await DataHandler.list(model.collection);

			result.forEach((row: { isNew: boolean, id: number }) => {
				row.isNew = false;
				row.id = row[primaryKeyField.fieldName];
			});

			setData(result);
		};

		fetchData();
	}, [tabValue]);

	const handleSnackbarOpen = (text: string, severity: AlertColor) => {
		setSnackbar(new Popup(text, severity, true));
	};

	const handleSnackbarClose = () => {
		setSnackbar(new Popup(snackbar.text, snackbar.severity, false));
	};

	const handleSuccess = () => {
		handleSnackbarOpen(Strings.SUCCESS, "success");
	};

	const handleError = () => {
		handleSnackbarOpen("Error", "error");
	};

	const handleTabChange = (event: unknown, newValue: number) => {
		window.location.hash = `${newValue}`;
		setTabValue(newValue);
	};

	const tabs = [];

	for (const model of tabModels) {
		if (model) {
			tabs.push(
				<Tab
					key={model.collection}
					label={model.displayName}
				/>
			);
		}
	}

	return (
		<>
			<Box sx={{
				display: "flex",
				flexDirection: "column",
				flexGrow: 1,
				height: "100vh",
				overflow: "hidden"
			}}>
				<Toolbar />
				<Box sx={{
					display: "flex",
					flexDirection: "row",
					flexGrow: 1,
					overflow: "hidden"
				}}>
					<Tabs
						value={tabValue}
						orientation="vertical"
						variant="scrollable"
						scrollButtons="auto"
						textColor="primary"
						indicatorColor="primary"
						onChange={handleTabChange}
					>
						{tabs}
					</Tabs>
					<Divider flexItem orientation="vertical" />
					<Box sx={{ width: 400, overflowY: "auto" }}>
						<Form
							model={tabModels[tabValue]}
							actionType={Method.PUT}
							onSuccess={handleSuccess}
							onError={handleError}
						/>
					</Box>
					<Divider flexItem orientation="vertical" />
					<Box sx={{
						flex: 1,
						overflow: "hidden"
					}}>
						<DataManagerDataGrid
							model={tabModels[tabValue]}
							rows={data}
							setRows={setData}
							onSuccess={handleSuccess}
							onError={handleError}
						/>
					</Box>
				</Box>
			</Box>
			<Snackbar
				open={snackbar?.open}
				autoHideDuration={3000}
				onClose={handleSnackbarClose}
			>
				<Alert
					severity={snackbar?.severity}
					onClose={handleSnackbarClose}
				>
					{snackbar?.text}
				</Alert>
			</Snackbar>
		</>
	);
}

export default DataManagerPage;
