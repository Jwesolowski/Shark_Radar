import {
	Box,
	Card, CardContent, CardHeader, Chip, Collapse, IconButton,
	ListItemIcon, ListItemText, Menu, MenuItem, Tooltip, useTheme
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { FavoritesModel } from "../../../models/FavoritesModel.ts";
import DataHandler from "../../../utils/DataHandler.ts";
import { Icons, Strings } from "../../../utils/enums/index.ts";
import SecurityManagerInstance from "../../../utils/SecurityManager.ts";
import { CacheContext } from "../../Contexts/CacheContext.jsx";
import { UserContext } from "../../Contexts/UserContext.jsx";
/** @typedef {import("../../../models/index.js").SharkModel} SharkModel */
/** @typedef {import("../../../models/index.js").AdoptionModel} AdoptSharkModel */

const background = {
	pointerEvents: "none",
	borderRadius: 2.2,
	zIndex: -1,
	position: "absolute",
	backgroundSize: "cover",
	backgroundPosition: "center",
	backgroundRepeat: "no-repeat"
};

const statusColors = [
	"default",
	"success",
	"warning",
	"error"
];

/**
 * @param {Object} props
 * @param {SharkModel} props.shark
 * @param {boolean} props.selected
 * @param {() => void} props.onClick
 */
function SharkCard(props) {
	const { shark, selected, onClick } = props;

	const { cache } = React.useContext(CacheContext);
	const { role, user } = React.useContext(UserContext);

	const theme = useTheme();

	let favoriteExists = false;
	cache.favorites?.forEach((record) => {
		if(record.userID === user.userID) {
			if (shark.sharkID === record.sharkID) {
				favoriteExists = true;
			}
		}
	});

	const [isFavorite, setIsFavorite] = React.useState(favoriteExists);
	const [sharkName, setSharkName] = React.useState("");
	const [sharkAge, setSharkAge] = React.useState("");

	const [anchorEl, setAnchorEl] = React.useState(/** @type {EventTarget & HTMLButtonElement | null} */(null));
	const open = Boolean(anchorEl);
	const adoptionsData = cache?.adoptions ?? [];

	React.useEffect(() => {
		(() => {
			let sharkFound = false;
			for (const adoption of adoptionsData) {
				if (shark.sharkID === adoption.sharkID && adoption.name !== null) {
					setSharkName(adoption.name);
					sharkFound = true;
					break;
				}
			}
			if (!sharkFound) {
				setSharkName("No Name Shark");
			}
		})();

		const age = new Date().getFullYear() - new Date(shark.dateOfBirth).getFullYear();
		setSharkAge(age < 1 ? "< 1" : String(age));
	}, []);

	/**
	 * @param {React.MouseEvent<HTMLButtonElement>} event
	 */
	const handleFavoriteClick = async (event) => {
		event.stopPropagation();
		setIsFavorite(!isFavorite);

		if (user && user.userID) {
			if(!isFavorite) {
				const newFavorite = new FavoritesModel({
					sharkID: shark.sharkID,
					userID: user.userID
				});
				await DataHandler.insertFavorite(newFavorite);
				cache.loadCollections();
			} else {

				cache.favorites?.forEach((record) => {
					if(record.userID === user.userID) {
						if (shark.sharkID === record.sharkID && record.favoriteID !== null) {

							DataHandler.deleteFavorite(record.favoriteID);

						}
					}
				});

			}
		}
	};

	/**
	 * @param {React.MouseEvent<HTMLButtonElement>} event
	 */
	const handleMoreClick = (event) => {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	/**
	 * @param {React.MouseEvent<HTMLLIElement>} event
	 */
	const handleEdit = (event) => {
		event.stopPropagation();
		handleClose();
	};

	/**
	 * @param {React.MouseEvent<HTMLLIElement>} event
	 */
	const handleDelete = (event) => {
		event.stopPropagation();
		handleClose();
	};

	const species = shark.relatedSpecies;
	const status = species?.relatedConservationStatus;
	const statusLabel = status?.description;

	const style = {
		borderRadius: 2,
		position: "relative",
		overflow: "unset",
		cursor: "pointer",
		boxShadow: "none",
		p: 1,
		...(species?.image && {
			...(theme.palette.mode === "dark" ? {
				background: "linear-gradient(rgba(32, 32, 32, 1), rgba(32, 32, 32, 0.65) 128px)"
			} : {
				background: "linear-gradient(rgba(192, 192, 192, 1), rgba(192, 192, 192, 0.5) 128px)"
			}),
			"&::before": {
				...background,
				content: "''",
				top: "50%",
				left: "50%",
				backgroundImage: `url(/images/sharks/${species?.image})`,
				transform: "translate(-50%, -50%)",
				transition: theme.transitions.create("filter", {
					easing: theme.transitions.easing.easeInOut,
					duration: theme.transitions.duration.standard
				}),
				...(theme.palette.mode === "dark" ? {
					width: `calc(100% - ${theme.spacing(4)})`,
					height: `calc(100% - ${theme.spacing(4)})`,
					...(selected && {
						filter: `blur(${theme.spacing(2)})`
					})
				} : {
					width: `calc(100% - ${theme.spacing(1)})`,
					height: `calc(100% - ${theme.spacing(1)})`,
					...(selected && {
						filter: `blur(${theme.spacing(1)})`
					})
				})
			}
		})
	};

	const canEdit = SecurityManagerInstance.hasPermission("shark_edit", role);
	const canDelete = SecurityManagerInstance.hasPermission("shark_delete", role);

	return (
		<>
			<Card
				sx={style}
				onClick={onClick}
			>
				<Box
					sx={{
						...background,
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundImage: `url(/images/sharks/${species?.image})`
					}}
				/>
				<CardHeader
					title={sharkName}
					subheader={species?.speciesName}
					action={
						<>
							<Tooltip title={isFavorite ? "Unfavorite" : "Favorite"}>
								<IconButton onClick={handleFavoriteClick}>
									{isFavorite ? <Icons.STAR color="warning" /> : <Icons.STAR_BORDER color="disabled" />}
								</IconButton>
							</Tooltip>
							{
								(canEdit || canDelete) &&
								<IconButton onClick={handleMoreClick}>
									<Icons.MORE />
								</IconButton>
							}
						</>
					}
					sx={{
						p: 1,
						"& .MuiCardHeader-title": {
							fontSize: "1.25rem"
						}
					}}
				/>
				<Collapse unmountOnExit in={selected} timeout="auto">
					<CardContent sx={{ p: 1 }}>
						<p>Gender: {shark.gender}</p>
						<p>Length: {Math.floor(shark.size / 12)} ft  {shark.size % 12} in</p>
						<p>Weight: {shark.weight} lbs</p>
						<p>Average Speed: {shark.speed} mph</p>
						<p>Age: {sharkAge}</p>
						<br/>
						{
							status &&
							<Chip
								label={statusLabel}
								color={statusColors[status.severity]}
								variant="outlined"
								size="small"
							/>
						}
					</CardContent>
				</Collapse>
			</Card>
			{
				(canEdit || canDelete) &&
				<Menu
					open={open}
					anchorEl={anchorEl}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "right"
					}}
					transformOrigin={{
						vertical: "top",
						horizontal: "right"
					}}
					onClose={handleClose}
					onClick={handleClose}
				>
					{
						canEdit &&
						<MenuItem onClick={handleEdit}>
							<ListItemIcon>
								<Icons.EDIT fontSize="small" />
							</ListItemIcon>
							<ListItemText primary={Strings.EDIT} />
						</MenuItem>
					}
					{
						canDelete &&
						<MenuItem onClick={handleDelete}>
							<ListItemIcon>
								<Icons.DELETE fontSize="small" />
							</ListItemIcon>
							<ListItemText primary={Strings.DELETE} />
						</MenuItem>
					}
				</Menu>
			}
		</>
	);
}

SharkCard.propTypes = {
	shark: PropTypes.object.isRequired,
	selected: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired
};

export default SharkCard;
