import {
	IconButton, Stack, AppBar, Toolbar, Tooltip, Select, MenuItem,
	SelectChangeEvent, Badge, Menu
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Assets, Icons } from "../../utils/enums/index.ts";
import SecurityManagerInstance from "../../utils/SecurityManager.ts";
import { CacheContext } from "../Contexts/CacheContext.tsx";
import { UserContext } from "../Contexts/UserContext.tsx";
import Image from "../Image.jsx";
import ProfileAvatar from "../ProfileAvatar.tsx";
import NavbarTab from "./NavbarTab.jsx";
import ProfileMenu from "./ProfileMenu.jsx";

function Navbar(props: {
	tabs: string[][];
	onToggleColorMode: () => void;
}) {
	const { tabs, onToggleColorMode } = props;

	const { user, role, setRole } = React.useContext(UserContext);
	const { cache } = React.useContext(CacheContext);

	const [profileMenuAnchor, setProfileMenuAnchor] = React.useState(null as HTMLElement | null);
	const [navMenuAnchor, setNavMenuAnchor] = React.useState(null as HTMLElement | null);

	const handleChange = (event: SelectChangeEvent<number>) => {
		setRole(Number(event.target.value));
	};

	const userTypes = (cache.userTypes ?? []).sort((a, b) => (a.userTypeID ?? -1) - (b.userTypeID ?? -1));
	const unreadMessages = (cache.messages ?? []).filter((message) => (!message.read && !message.deleted )).length;
	const signedIn = role !== SecurityManagerInstance.UserTypes.NONE && user.username && user.userID;

	return (
		<>
			<AppBar
				position="fixed"
				sx={{
					zIndex: (theme) => theme.zIndex.drawer + 1
				}}
			>
				<Toolbar
					disableGutters
					sx={{
						px: 2,
						gap: 2
					}}
				>
					<Link to={SecurityManagerInstance.Routes.INDEX}>
						<Image
							src={Assets.LOGO_128}
							alt="Shark Radar Logo"
							width={64}
							height={64}
						/>
					</Link>
					<IconButton
						sx={{ display: { sm: "none" } }}
						onClick={(e) => setNavMenuAnchor(e.currentTarget)}
					>
						<Icons.MENU />
					</IconButton>
					<Stack direction="row" sx={{ display: { xs: "none", sm: "flex" } }}>
						{tabs.map(([tabText, tabTarget]) => (
							<NavbarTab
								key={tabText}
								target={tabTarget}
								text={tabText}
							/>
						))}
					</Stack>
					<div style={{ flex: 1 }} />
					{
						SecurityManagerInstance.hasPermission("change_role", user.userTypeID) &&
						<Select
							value={userTypes.length > 0 ? role : ""}
							size="small"
							onChange={handleChange}
						>
							{userTypes.map((userType, index) => (
								<MenuItem
									key={index}
									value={userType.userTypeID ?? -1}
								>
									{userType.name}
								</MenuItem>
							))}
						</Select>
					}
					<Link
						to={signedIn ? SecurityManagerInstance.Routes.PROFILE : SecurityManagerInstance.Routes.LOGIN}
						style={{
							color: "inherit",
							textDecoration: "none",
							whiteSpace: "nowrap"
						}}
					>
						{signedIn ? user.username : "Log In"}
					</Link>
					<Tooltip title="Profile">
						<IconButton onClick={(e) => setProfileMenuAnchor(e.currentTarget)}>
							<Badge
								variant="dot"
								color="error"
								invisible={unreadMessages === 0}
							>
								{
									signedIn
										? <ProfileAvatar size={48} />
										: <Icons.ACCOUNT sx={{ color: "#f0f0f0" }} />
								}
							</Badge>
						</IconButton>
					</Tooltip>
				</Toolbar>
			</AppBar>
			{
				profileMenuAnchor &&
				<ProfileMenu
					anchorEl={profileMenuAnchor}
					unreadMessages={unreadMessages}
					onClose={() => setProfileMenuAnchor(null)}
					onToggleColorMode={onToggleColorMode}
				/>
			}
			{
				navMenuAnchor &&
				<Menu
					anchorEl={navMenuAnchor}
					open={Boolean(navMenuAnchor)}
					onClose={() => setNavMenuAnchor(null)}
				>
					{
						tabs.map(([tabText, tabTarget], index) => (
							<Link
								key={index}
								to={tabTarget}
								style={{
									color: "inherit",
									textDecoration: "none"
								}}
							>
								<MenuItem onClick={() => setNavMenuAnchor(null)}>
									{tabText}
								</MenuItem>
							</Link>
						))
					}
				</Menu>
			}
		</>
	);
}

Navbar.propTypes = {
	tabs: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
	onToggleColorMode: PropTypes.func.isRequired
};

export default Navbar;
