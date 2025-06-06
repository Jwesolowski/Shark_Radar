import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, styled, Divider, Stack, Box, Container } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import DataHandlerInstance from "../../../utils/DataHandler.ts";
import { Icons } from "../../../utils/enums/index.ts";
import { UserContext } from "../../Contexts/UserContext.tsx";

const maxImageSizeKB = 100;
const allowedImageTypes = ["image/png", "image/jpeg", "image/gif"];

const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1
});

function ProfileImageModal(props: {
	open: boolean;
	handleOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const { open, handleOpen } = props;
	const { user, setUser } = React.useContext(UserContext);
	const [image, setImage] = React.useState("");
	const [url, setUrl] = React.useState("");

	const avatar = React.useMemo(() => {
		if (image !== "") {
			return image;
		}

		if (url !== "") {
			return url;
		}

		return null;
	}, [image, url]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (!file) {
			return;
		}

		if (!allowedImageTypes.includes(file.type)) {
			alert(`File type must be ${allowedImageTypes.slice(0, -1).join(", ")} or ${allowedImageTypes.slice(-1)}`);
			return;
		}

		if (file.size > maxImageSizeKB * 1024) {
			alert(`File size must be less than ${maxImageSizeKB} KB`);
			return;
		}

		const reader = new FileReader();

		reader.addEventListener("load", () => {
			const result = reader.result;

			if (typeof result === "string") {
				setImage(result);
			}
		});

		reader.readAsDataURL(file);
	};

	const handleSave = async () => {
		if (!avatar) {
			return;
		}

		const result = await DataHandlerInstance.updateAvatar(avatar);

		if (result.success) {
			setUser({ ...user, avatar });
			handleOpen(false);
		}
	};

	return (
		<Dialog
			open={open}
			sx={{
				"& .MuiDialog-paper": {
					width: 500
				}
			}}
			onClose={() => handleOpen(false)}
		>
			<DialogTitle>{"Upload Profile Image"}</DialogTitle>
			<DialogContent>
				<Stack
					direction="column"
					spacing={2}
				>
					<TextField
						fullWidth
						variant="outlined"
						size="small"
						placeholder="https://example.com/image.png"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
					/>
					<Divider>{"OR"}</Divider>
					<Button
						fullWidth
						component="label"
						variant="contained"
						startIcon={<Icons.UPLOAD />}
					>
						{"Upload file"}
						<VisuallyHiddenInput type="file" onChange={handleFileChange} />
					</Button>
					<Container sx={{
						display: "flex",
						justifyContent: "center"
					}}>
						<Box sx={{
							width: 256,
							height: 256,
							borderWidth: 1,
							borderStyle: "solid",
							borderColor: "divider",
							backgroundColor: "rgba(0, 0, 0, 0.1)",
							borderRadius: "50%",
							overflow: "hidden",
							backgroundSize: "cover",
							backgroundPosition: "center",
							...(avatar && { backgroundImage: `url(${avatar})` })
						}} />
					</Container>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button
					color="error"
					variant="outlined"
					onClick={() => handleOpen(false)}
				>
					{"Cancel"}
				</Button>
				<Button
					color="success"
					variant="contained"
					onClick={handleSave}
				>
					{"Save"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

ProfileImageModal.propTypes = {
	open: PropTypes.bool.isRequired,
	handleOpen: PropTypes.func.isRequired
};

export default ProfileImageModal;
