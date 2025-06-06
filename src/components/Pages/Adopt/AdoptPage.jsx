import { Alert, Button, Snackbar, Stack, Typography } from "@mui/material";
import React from "react";
import { AdoptionInstance, AdoptionModel } from "../../../models/index.js";
import DataHandler from "../../../utils/DataHandler.ts";
import { Strings } from "../../../utils/enums/index.js";
import SecurityManagerInstance from "../../../utils/SecurityManager.ts";
import { CacheContext } from "../../Contexts/CacheContext.jsx";
import { UserContext } from "../../Contexts/UserContext.tsx";
import FormField from "../../Form/FormField.jsx";
import SharkCard from "../../Pages/Adopt/AdoptCard.jsx";
import BasePage from "../BasePage.jsx";

/** @typedef {import("../../../models/index.js").SharkModel} SharkModel */

/**
 * @param {SharkModel[]} sharks
 * @param {AdoptionModel[]} adoptions
 */

let showAdoptionPage = true;

function AdoptAvailChecker(sharks, adoptions) {
	let currSharkID = 0;
	let currAdoptID = 0;

	for (let i = 0; i < adoptions.length; i++) {
		currAdoptID = adoptions[i].sharkID ?? -1;
		//console.log("currAdoptID at cycle i: " + i + " is " + currAdoptID);

		for (let j = 0; j < sharks.length; j++) {
			currSharkID = sharks[j].sharkID ?? -1;
			//console.log("currSharkID at cycle i: " + i + " and j: " + j + " is " + currSharkID);

			if (currAdoptID === currSharkID)
			{
				sharks.splice(j,1);
				//sharks.shift();
				break;
			}
		}
	}
}

function ValidAdoptChecker(adoptions, requestSharkID) {
	let currAdoptID = 0;

	for (let i = 0; i < adoptions.length; i++) {
		currAdoptID = adoptions[i].sharkID ?? -1;

		if (currAdoptID == requestSharkID) {
			console.log("This shark is taken with shark ID: " + requestSharkID);
			return false;
		}
		else if (requestSharkID == null) {
			console.log("This shark is taken with shark ID: " + requestSharkID);
			return false;
		}

	}

	return true;
}

function userAccessChecker(adoptions, user) {
	for (let i = 0; i < adoptions.length; i++ ) {
		if (adoptions[i].userID == user.userID) {
			//console.log("User has a shark");
			showAdoptionPage = false;
		}
		else if (user.userID == null) {
			//console.log("This user is not logged in");
			showAdoptionPage = false;
		}
	}
}

function AdoptPage() {
	const { cache } = React.useContext(CacheContext);

	const sharks = [...(cache.sharks ?? [])];
	const adoptions = cache.adoptions ?? [];

	const { user } = React.useContext(UserContext);
	if (user && user.userID && cache && cache.initialized) {
		const adoptions = [...(cache.adoptions ?? [])];
	}

	//Checks to see if the user is logged in and has a shark adopted already
	userAccessChecker(adoptions, user);

	//Checks to make the array only display available sharks
	AdoptAvailChecker(sharks, adoptions);


	//Form Data
	const [snackbarOpen, setSnackbarOpen] = React.useState(false);

	const handleSnackbarOpen = () => {
		setSnackbarOpen(true);
	};

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};

	const handleSuccess = () => {
		handleSnackbarOpen();
	};

	const handleError = () => {
		console.log("error");
	};

	const [adoptname, setAdoptName] = React.useState("");
	const userID = user.userID;
	const adoptionID = Math.floor(100000 + Math.random() * 900000);
	const [sharkID, setSharkID] = React.useState("");
	const [loginError, setLoginError] = React.useState(""); // New state for login error
	const AdoptModelSchema = AdoptionInstance.schema;

	const intSharkID = parseInt(sharkID, 10);

	const handleSubmit = async () => {
		try {

			const myAdoptModel = new AdoptionModel({name:adoptname, userID:userID, adoptionID:adoptionID, sharkID:intSharkID});
			let result;

			const validShark = ValidAdoptChecker(adoptions, sharkID);
			console.log("After our checker valid shark is: " + validShark);
			if (validShark == false) {
				console.log("This shark was found invalid");
				setLoginError("This shark is taken");
				return;
			}
			if (validShark == true) {
				setLoginError("");
				result = await DataHandler.insertAdoption(myAdoptModel);
			}


			if (result.result !== null) {
				//console.log(result);
				window.location.href = SecurityManagerInstance.Routes.PROFILE;

			} else {
				setLoginError("Incorrect fields");
			}
		} catch (error) {
			setLoginError("Internal server error");
			// Handle login error (e.g., display an error message)
		}
	};

	if (showAdoptionPage == true) {
		return (

			<BasePage title="Adopt a shark!">
				<Stack
					alignItems="center"
					direction="column"
					spacing={4}
					sx={{ p: 5 }}
				>
					<Typography
						sx={{ fontSize: "1.3rem" }}
						variant="body1"
					>
					Below is a list of all available sharks to adopt
					</Typography>

					{sharks.map((shark, index) => (
						<SharkCard
							key={index}
							shark={shark}
						/>
					))}
				</Stack>

				<Stack>
					<FormField
						schemaField={AdoptModelSchema.fields.name}
						value={adoptname}
						errors=""
						asteriskOverride={false}
						onChange={value => setAdoptName(value)}
					/>
					<FormField
						schemaField={AdoptModelSchema.fields.sharkID}
						value={sharkID}
						errors=""
						asteriskOverride={false}
						onChange={value => setSharkID(value)}
					/>
					{loginError && (<Typography variant="body2" color="error">{loginError}</Typography> )}
					<Stack
						direction="column"
						spacing={2}
						alignItems="center"
					>
						<Button
							variant="contained"
							onClick={handleSubmit}
						>
							{"Adopt"}
						</Button>
					</Stack>
				</Stack>



				<Snackbar
					open={snackbarOpen}
					autoHideDuration={3000}
					onClose={handleSnackbarClose}
				>
					<Alert
						severity="success"
						onClose={handleSnackbarClose}
					>{Strings.SUCCESS}</Alert>
				</Snackbar>

			</BasePage>
		);
	}

	if (showAdoptionPage == false) {
		return (
			<BasePage title="Adopt a shark!">
				<Stack
					alignItems="center"
					direction="column"
					spacing={4}
					sx={{ p: 5 }}
				>
					<Typography
						sx={{ fontSize: "1.3rem" }}
						variant="body1"
					>
					Sorry you currently do not have access to adopting a shark at this moment.
					Users are not allowed to adopt multiple sharks, or adopt without an account.
					</Typography>
				</Stack>
			</BasePage>
		);
	}

}

export default AdoptPage;
