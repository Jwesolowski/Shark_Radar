import { Box, Fab, Toolbar, useTheme } from "@mui/material";
import React from "react";
import { Icons } from "../../../utils/enums/index.ts";
import { CacheContext } from "../../Contexts/CacheContext.jsx";
import GoogleMap from "./GoogleMap.jsx";
import HomeDrawer from "./HomeDrawer.jsx";
import { emitter } from "../../EventEmitter/eventEmitter.js";

function HomePage() {
	const drawerWidth = 350;

	const [filter, setFilter] = React.useState({
		search: "",
		conservationStatuses: []
	});
	const [drawerOpen, setDrawerOpen] = React.useState(false);

	const { cache } = React.useContext(CacheContext);

	const [selectedShark, setSelectedShark] = React.useState(/** @type {number | null} */(null));

	const sharks = (cache.sharks ?? [])
	/* .sort((a, b) => {
		// Move the specific shark (with sharkID === selectedShark) to the front
		if (a.sharkID === selectedShark) return -1;
		if (b.sharkID === selectedShark) return 1;
	
		// For other sharks, maintain their order
		return 0;
	}) */
	.filter((shark) => {
		const search = filter.search.toLowerCase();
		const keywordsString = shark.keywords.join(" ").toLowerCase();

		if (
			filter.conservationStatuses.length > 0 &&
			shark.relatedSpecies &&
			shark.relatedSpecies.relatedConservationStatus &&
			!filter.conservationStatuses.includes(shark.relatedSpecies.relatedConservationStatus.code)
		) {
			return false;
		}

		if (search !== "" && keywordsString.indexOf(search) === -1) {
			return false;
		}

		//filter sharkCards to only show chosen
		/* if (cache.selectedSharkID !== null) {
			return cache.selectedSharkID == shark.sharkID;
		} */

		return true;
	}, [selectedShark]);

	React.useEffect(() => {
		//const localDrawerOpen = (localStorage.getItem("drawerOpen") ?? "true") === "true";
		setDrawerOpen(true);

		const handleSharkPinClick = (sharkID, show) => {
			setSelectedShark(show ? sharkID : null);
			if (show) {
				setDrawerOpen(true);
			}
		};
		emitter.on("sharkPinClick", handleSharkPinClick);
	}, []);

	const toggleDrawer = () => {
		localStorage.setItem("drawerOpen", !drawerOpen ? "true" : "false");
		setDrawerOpen(!drawerOpen);
	};

	const updateFilter = (newFilter) => {
		setFilter({...filter, ...newFilter});
	};

	const theme = useTheme();

	return (
		<Box sx={{
			display: "flex",
			flexGrow: 1,
			height: "100vh"
		}}>
			<HomeDrawer
				open={drawerOpen}
				width={drawerWidth}
				sharks={sharks}
				filter={filter}
				updateFilter={updateFilter}
			/>
			<Box
				component="main"
				sx={{
					display: "flex",
					flexDirection: "column",
					flexGrow: 1,
					position: "relative",
					marginLeft: `-${drawerWidth}px`,
					transition: theme.transitions.create("margin", {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.leavingScreen
					}),
					...(drawerOpen && {
						marginLeft: 0,
						transition: theme.transitions.create("margin", {
							easing: theme.transitions.easing.easeOut,
							duration: theme.transitions.duration.enteringScreen
						})
					})
				}}
			>
				<Toolbar />
				<GoogleMap />
			</Box>
			<Fab
				size="small"
				color="primary"
				sx={{
					position: "absolute",
					left: 0,
					bottom: 8,
					boxShadow: "none",
					borderRadius: "0 50% 50% 0",
					transition: theme.transitions.create("all", {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.leavingScreen
					}),
					...(drawerOpen && {
						left: drawerWidth,
						transition: theme.transitions.create("all", {
							easing: theme.transitions.easing.easeOut,
							duration: theme.transitions.duration.enteringScreen
						})
					})
				}}
				onClick={toggleDrawer}
			>
				{drawerOpen ? <Icons.ARROW_LEFT fontSize="small" /> : <Icons.MENU fontSize="small" />}
			</Fab>
		</Box>
	);
}

export default HomePage;
