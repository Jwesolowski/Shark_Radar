import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import React from "react";
import { UserInstance } from "../../models/index.ts";
import DataHandler from "../../utils/DataHandler.ts";
import { Assets } from "../../utils/enums/index.ts";
import SecurityManagerInstance from "../../utils/SecurityManager.ts";
import FormField from "../Form/FormField.jsx";
import Image from "../Image.jsx";
import BasePage from "./BasePage.jsx";

function LoginPage() {
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [loginError, setLoginError] = React.useState(""); // New state for login error
	const userDataModelSchema = UserInstance.schema;
	const handleSubmit = async () => {
		try {
			const result = await DataHandler.login(username, password);

			if (result.result !== null) {
				window.location.href = SecurityManagerInstance.Routes.PROFILE;
			} else {
				setLoginError("Incorrect username or password");
			}
		} catch (error) {
			setLoginError("Internal server error");
			// Handle login error (e.g., display an error message)
		}
	};

	const handleGoogleLogin = () => {
		// Replace 'YOUR_GOOGLE_CLIENT_ID' with your actual Google OAuth 2.0 client ID
		const clientID = "1012961145469-hsok321r929jm0lmg7k5u5r2dgno74a8.apps.googleusercontent.com";

		// Replace 'http://localhost:3030/auth/google/callback' with your actual redirect URI
		const redirectURI = "http://localhost:3030/auth/google/callback";

		// Construct the Google OAuth 2.0 authorization URL with the correct redirect URI
		const authURL = `https://accounts.google.com/o/oauth2/auth?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&scope=openid%20email%20profile`;

		// Redirect the user to the Google OAuth login page
		window.location.href = authURL;
	};

	return (
		<BasePage title="Login">
			<Box
				sx={{
					display: "flex",
					justifyContent: "center"
				}}
			>
				<Stack
					direction="column"
					spacing={2}
					sx={{ width: 300 }}
				>
					<Button
						variant="contained"
						style={{ backgroundColor: "#fff", color: "#000000" }}
						startIcon={
							<Image
								src={Assets.GOOGLE_ICON}
								alt="Google Logo"
								width={32}
								height={32}
							/>
						}
						onClick={handleGoogleLogin}
					>
						Login with Google
					</Button>
					<Divider>OR</Divider>
					<FormField
						schemaField={userDataModelSchema.fields.username}
						value={username}
						errors=""
						asteriskOverride={false}
						onChange={value => setUsername(value)}
					/>
					<FormField
						schemaField={userDataModelSchema.fields.password}
						value={password}
						errors=""
						asteriskOverride={false}
						onChange={value => setPassword(value)}
					/>
					{loginError && (<Typography variant="body2" color="error">{loginError}</Typography> )}
					<Stack direction="column" spacing={2} alignItems="center">
						<Button
							variant="contained"
							onClick={handleSubmit}
						>
							{"Login"}
						</Button>
						<Button
							variant="text"
							sx={{ textTransform: "none" }}
							onClick={() => {
								window.location.href = SecurityManagerInstance.Routes.SIGN_UP;
							}}
						>
							{"Don't have an account? Sign up!"}
						</Button>
					</Stack>
				</Stack>
			</Box>
		</BasePage>
	);
}

export default LoginPage;
