import { Box, Button, Stack } from "@mui/material";
import React, { useState, useRef } from "react";
import { UserInstance } from "../../models/index.ts";
import DataHandler from "../../utils/DataHandler.ts";
import { Assets } from "../../utils/enums/index.ts";
import SecurityManagerInstance from "../../utils/SecurityManager.ts";
import FormField from "../Form/FormField.jsx";
import BasePage from "./BasePage.jsx";

function SignUpPage() {
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [passwordConfirm, setPasswordConfirm] = React.useState("");
	const [errors, setErrors] = React.useState({
		username: "",
		password: "",
		passwordConfirm: ""
	});

	const userModelSchema = UserInstance.schema;

	const [clickCount, setClickCount] = useState(0);
	const [showSharks, setShowSharks] = useState(false);
	const timeoutRef = useRef(null);

	const handleTitleClick = () => {
		clearTimeout(timeoutRef.current);

		setClickCount((prevClickCount) => prevClickCount + 1);

		timeoutRef.current = setTimeout(() => {
			setClickCount(0);
		}, 1000); // Reset click count after 1 second

		if (clickCount === 2) {
			// User clicked three times in quick succession
			setShowSharks(true);
		}
	};

	const handleSubmit = async () => {
		// Reset errors
		setErrors({
			username: "",
			password: "",
			passwordConfirm: ""
		});

		// Validate username
		if (!username) {
			setErrors((prevErrors) => ({ ...prevErrors, username: "Username is required" }));
			return;
		}

		// Validate password
		if (!password) {
			setErrors((prevErrors) => ({ ...prevErrors, password: "Password is required" }));
			return;
		}

		// Check password length and requirements
		if (password.length < 10 || !/[A-Z]/.test(password) || !/[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password)) {
			setErrors((prevErrors) => ({
				...prevErrors,
				password:
					"Password must be at least 10 characters long and include at least one uppercase letter and one special character"
			}));
			return;
		}

		// Validate password confirmation
		if (!passwordConfirm) {
			setErrors((prevErrors) => ({ ...prevErrors, passwordConfirm: "Password confirmation is required" }));
			return;
		}

		// Check if passwords match
		if (password !== passwordConfirm) {
			setErrors((prevErrors) => ({ ...prevErrors, passwordConfirm: "Passwords do not match" }));
			return;
		}

		// If all validations pass, you can proceed with the signup logic
		const createResult = await DataHandler.createUser(username, password);

		if (createResult.result !== null) {
			const loginResult = await DataHandler.login(username, password);

			if (loginResult.result !== null) {
				window.location.href = SecurityManagerInstance.Routes.PROFILE;
			}
		}

		setShowSharks(false); // Reset showSharks state after submitting the form
	};

	return (
		<BasePage title="Sign Up" onClick={handleTitleClick}>
			<Box sx={{
				display: "flex",
				justifyContent: "center",
				position: "relative"
			}}>
				{showSharks && (
					<>
						{/* Left shark */}
						<img
							src={Assets.LEFT_SHARK}
							alt="Left Shark"
							style={{
								position: "absolute",
								left: 0,
								top: "50%",
								transform: "translateY(-50%)",
								width: "300px",
								height: "auto"
							}}
						/>
						{/* Right shark */}
						<img
							src={Assets.LEFT_SHARK}
							alt="Right Shark"
							style={{
								position: "absolute",
								right: 0,
								top: "50%",
								transform: "translateY(-50%) scaleX(-1)",
								width: "300px",
								height: "auto"
							}}
						/>
					</>
				)}

				<Stack
					direction="column"
					spacing={2}
					alignItems="center"
					sx={{ width: 300 }}
				>
					<FormField
						fullWidth
						schemaField={userModelSchema.fields.username}
						value={username}
						errors={errors.username}
						onChange={(value) => setUsername(value)}
					/>
					<FormField
						fullWidth
						schemaField={userModelSchema.fields.password}
						value={password}
						errors={errors.password}
						onChange={(value) => setPassword(value)}
					/>
					<FormField
						fullWidth
						schemaField={userModelSchema.fields.password}
						titleOverride="Confirm Password"
						idOverride="passwordConfirm"
						value={passwordConfirm}
						errors={errors.passwordConfirm}
						onChange={(value) => setPasswordConfirm(value)}
					/>
					{/* Change the color of the Sign Up button */}
					<Button
						color="success"
						variant="contained"
						onClick={handleSubmit}
					>
						{"Sign Up"}
					</Button>
				</Stack>
			</Box>
		</BasePage>
	);
}

export default SignUpPage;
