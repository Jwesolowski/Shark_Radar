import { Button, Menu, Tooltip, ListItem, Badge } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import React from "react";
import { Icons } from "../../utils/enums/index.ts";
import SecurityManagerInstance from "../../utils/SecurityManager.ts";
import { UserContext } from "../Contexts/UserContext.tsx";
import ProfileMenuTab from "./ProfileMenuTab.jsx";

const Route = SecurityManagerInstance.Routes;

/**
 * @param {Object} props
 * @param {HTMLElement} props.anchorEl
 * @param {number} props.unreadMessages
 * @param {() => void} props.onClose
 * @param {() => void} props.onToggleColorMode
 */
function ProfileMenu(props) {
	const { anchorEl, unreadMessages, onClose, onToggleColorMode } = props;

	const { role } = React.useContext(UserContext);

	const theme = useTheme();

	const signedIn = role !== SecurityManagerInstance.UserTypes.NONE;

	return (
		<Menu
			keepMounted
			anchorEl={anchorEl}
			open={Boolean(anchorEl)}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "right"
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "right"
			}}
			onClose={onClose}
		>
			{
				!signedIn &&
				<ProfileMenuTab icon={<Icons.LOGIN />} label="Log In" link={Route.LOGIN} onClose={onClose} />
			}
			{
				!signedIn &&
				<ProfileMenuTab icon={<Icons.SIGN_UP />} label="Sign-up" link={Route.SIGN_UP} onClose={onClose} />
			}
			{
				signedIn &&
				<ProfileMenuTab icon={<Icons.ACCOUNT fontSize="small" />} label="Profile" link={Route.PROFILE} onClose={onClose} />
			}
			{
				signedIn &&
				<ProfileMenuTab
					label="Messages"
					link={Route.MESSAGES}
					icon={
						<Badge
							badgeContent={unreadMessages}
							color="error"
							invisible={unreadMessages === 0}
						>
							<Icons.MAIL fontSize="small" />
						</Badge>
					}
					onClose={onClose}
				/>
			}
			{
				signedIn &&
				<ProfileMenuTab icon={<Icons.LOGOUT fontSize="small" />} label="Logout" link={Route.LOGOUT} onClose={onClose} />
			}
			<ListItem>
				<Tooltip title="Change theme">
					<Button
						startIcon={ theme.palette.mode === "dark" ? <Icons.DARK /> : <Icons.LIGHT /> }
						variant="outlined"
						sx={{
							textTransform: "capitalize",
							borderRadius: 8,
							margin: "0 auto"
						}}
						onClick={onToggleColorMode}
					>
						{ theme.palette.mode === "dark" ? "Dark" : "Light" }
					</Button>
				</Tooltip>
			</ListItem>
		</Menu>
	);
}

ProfileMenu.propTypes = {
	unreadMessages: PropTypes.number.isRequired,
	onClose: PropTypes.func.isRequired,
	onToggleColorMode: PropTypes.func.isRequired,
	anchorEl: PropTypes.any
};

export default ProfileMenu;
