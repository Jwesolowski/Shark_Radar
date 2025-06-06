import { Avatar } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { UserContext } from "./Contexts/UserContext.tsx";

function stringToColor(string: string) {
	let hash = 0;

	for (let i = 0; i < string.length; i++) {
		hash = string.charCodeAt(i) + ((hash << 6) - hash);
	}

	let color = "#";

	for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.slice(-2);
	}

	return color;
}

function ProfileAvatar(props: {
	size: number;
}) {
	const { size } = props;
	const { user } = React.useContext(UserContext);

	const sx = {
		width: size,
		height: size,
		fontSize: size / 2
	};

	return (
		user.avatar ?
			<Avatar sx={sx} src={user.avatar} />
			:
			<Avatar sx={{
				backgroundColor: stringToColor(user.username ?? ""),
				...sx
			}}>
				{user.username?.charAt(0).toUpperCase()}
			</Avatar>
	);
}

ProfileAvatar.propTypes = {
	size: PropTypes.number.isRequired
};

export default ProfileAvatar;
