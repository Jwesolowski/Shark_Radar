import { Button, Card, CardContent, Divider, Stack, TextField } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { AdoptionModel } from "../../../models/AdoptionModel.ts";
import DataHandlerInstance from "../../../utils/DataHandler.ts";
import { CacheContext } from "../../Contexts/CacheContext.tsx";
import { UserContext } from "../../Contexts/UserContext.tsx";
import ProfileAvatar from "../../ProfileAvatar.tsx";
import Text from "../../Text.tsx";
import BasePage from "../BasePage.jsx";
import ProfileAdoptCard from "./ProfileAdoptCard.jsx";
import ProfileImageModal from "./ProfileImageModal.tsx";

function findAdoptionData(adoptedSharksArray: AdoptionModel[], logUserID: number, adoptedShark2: AdoptionModel[]) {
	let IDfound = 0;
	for (let i = 0; i < adoptedSharksArray.length; i++)
	{
		if (adoptedShark2.length === 1) {
			break;
		}
		if (logUserID === adoptedSharksArray[i].userID) {
			IDfound = i;
			adoptedShark2.push(adoptedSharksArray[IDfound]);
		}
	}
}

function Section(props: {
	title: string;
	children: React.ReactNode;
}) {
	const { title, children } = props;

	return (
		<>
			<Divider />
			<Stack
				direction="column"
				spacing={2}
				alignItems="center"
				sx={{ width: "100%" }}
			>
				<Text
					text={title}
					variant="h3"
					size={24}
				/>
				{children}
			</Stack>
		</>
	);
}

function AccountField(props: {
	label: string;
	value: string;
	disabled?: boolean;
	onChange?: (value: string) => void;
}) {
	const { label, value, disabled, onChange } = props;

	return (
		<Stack
			direction="row"
			spacing={1}
			alignItems="center"
		>
			<Text
				text={label}
				sx={{
					width: 100,
					textAlign: "right"
				}}
			/>
			<TextField
				fullWidth
				disabled={disabled}
				value={value}
				size="small"
				onChange={e => onChange(e.target.value)}
			/>
		</Stack>
	);
}

function ProfilePage() {
	const { user, setUser } = React.useContext(UserContext);
	const { cache } = React.useContext(CacheContext);

	const [password, setPassword] = React.useState("");
	const [name, setName] = React.useState(user.name ?? "");
	const [profileImageModalOpen, setProfileImageModalOpen] = React.useState(false);

	const adoptedShark2: AdoptionModel[] = [];

	// Used to reset password by calling function resetPassword
	const handleResetPassword = async () => {
		const result = await DataHandlerInstance.resetPassword(password);

		if (result.success) {
			alert("Password reset successfully");
			window.location.reload();
		} else {
			alert("Failed to reset password");
		}
	};

	const handleUpdateName = async () => {
		const result = await DataHandlerInstance.updateName(name);

		if (result.success) {
			setUser({
				...user,
				name: name
			});
		} else {
			alert("Failed to update name");
		}
	};

	if (user && user.userID && cache && cache.initialized) {
		const adoptions = [...(cache.adoptions ?? [])];
		findAdoptionData(adoptions, user.userID, adoptedShark2);
	}

	return (
		<>
			<BasePage title="Profile">
				<Stack
					alignItems="center"
					direction="column"
					gap={4}
				>
					<Card sx={{
						width: { xs: "100%", md: 600 },
						borderRadius: 4
					}}>
						<CardContent>
							<Stack
								direction="column"
								spacing={4}
							>
								<Stack
									direction="column"
									spacing={2}
									alignItems="center"
								>
									<ProfileAvatar size={256} />
									<Button
										variant="text"
										sx={{ textTransform: "none" }}
										onClick={() => setProfileImageModalOpen(true)}
									>
										{"Change Profile Image"}
									</Button>
								</Stack>
								<Section title="Account">
									<AccountField
										disabled
										label="Username"
										value={user?.username}
									/>
									<AccountField
										disabled
										label="User ID"
										value={user?.userID.toString()}
									/>
									<AccountField
										label="Name"
										value={name}
										onChange={setName}
									/>
									{
										(name !== "" && (name !== user.name || !user.name)) &&
										<Button onClick={handleUpdateName}>{"Save"}</Button>
									}
								</Section>
								<Section title="Reset Password">
									{/* Input field for the new password */}
									<TextField
										size="small"
										label="New Password"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>

									{/* Button to trigger password reset */}
									<Button variant="contained" onClick={handleResetPassword}>
										{"Reset Password"}
									</Button>
								</Section>
							</Stack>
						</CardContent>
					</Card>

					{adoptedShark2.map((adoptData, index) => (
						<ProfileAdoptCard
							key={index}
							adoptData={adoptData}
						/>
					))}
				</Stack>
			</BasePage>
			<ProfileImageModal
				open={profileImageModalOpen}
				handleOpen={setProfileImageModalOpen}
			/>
		</>
	);
}

AccountField.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	onChange: PropTypes.func
};

Section.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired
};

export default ProfilePage;
