import {
	Box, Chip, Collapse, Divider, Drawer, FormControl,
	IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Stack, TextField, Toolbar, Tooltip, Typography
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { Icons } from "../../../utils/enums/index.ts";
import { CacheContext } from "../../Contexts/CacheContext.jsx";
import SharkCard from "./SharkCard.jsx";

//event emitter imports
import { emitter } from "../../EventEmitter/eventEmitter.js";

/** @typedef {import("../../../models/index.js").SharkModel} SharkModel */
/** @typedef {import("../../../models/index.js").ConservationStatusModel} ConservationStatusModel */

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
		}
	}
};

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {number} props.width
 * @param {SharkModel[]} props.sharks
 * @param {Object} props.filter
 * @param {string} props.filter.search
 * @param {string[]} props.filter.conservationStatus
 * @param {(filter: Object) => void} props.updateFilter
 */
function HomeDrawer(props) {
	const { open, width, sharks, filter, updateFilter } = props;

	const [filterExpanded, setFilterExpanded] = React.useState(false);
	const [conservationStatusValue, setConservationStatusValue] = React.useState(/** @type {string[]} */([]));
	const [selectedShark, setSelectedShark] = React.useState(/** @type {number | null} */(null));

	const { cache } = React.useContext(CacheContext);
	const conservationStatuses = cache?.conservationStatuses ?? [];

	const sharkCardRefs = React.useRef({});

	const toggleFilterExpanded = () => {
		setFilterExpanded(!filterExpanded);
	};

	React.useEffect(() => {
		const handleSharkPinClick = (sharkID, show) => {	
			//scroll to sharkCard
			if (sharkCardRefs.current && show) {
				const sharkCardRef = sharkCardRefs.current[sharkID];
				if (sharkCardRef) {
				  sharkCardRef.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				  });
				}
			}
			setSelectedShark(show ? sharkID : null);
		};
		emitter.on("sharkPinClick", handleSharkPinClick);
	}, []);

	/**
	 * @param {number} sharkID
	 */
	const handleSharkCardClick = (sharkID) => {
		const show = (selectedShark !== sharkID);
		setSelectedShark(show ? sharkID : null);
		cache.selectedSharkID = (show ? sharkID : null);
		emitter.emit('sharkCardClick', sharkID, show);
	};

	/**
	 * @param {any} event
	 */
	const handleChange = (event) => {
		const value = event.target.value;

		setConservationStatusValue(
			typeof value === "string" ? value.split(",") : value
		);
		updateFilter({
			conservationStatuses: value
		});
	};

	const sharkCards = sharks.map(shark => (
			<div 
				key={shark.sharkID+"0"}
				ref={(cardRef) => {
					sharkCardRefs.current[shark.sharkID] = cardRef;
				}}
			>
				<SharkCard
					key={shark.sharkID}
					shark={shark}
					selected={shark.sharkID === selectedShark}
					onClick={() => handleSharkCardClick(shark.sharkID ?? -1)}
				/>
			</div>
		));
	
	
	const conservationStatusOptions = conservationStatuses.map((/** @type {ConservationStatusModel} */ conservationStatus) => (
		<MenuItem
			key={conservationStatus.conservationStatusID ?? ""}
			value={conservationStatus.code ?? ""}
		>
			{`${conservationStatus.code} - ${conservationStatus.description}`}
		</MenuItem>
	));

	return (
		<Drawer
			variant="persistent"
			open={open}
			anchor="left"
			sx={{
				width: width,
				flexShrink: 0,
				overflow: "hidden",
				"& .MuiDrawer-paper": {
					width: width,
					boxSizing: "border-box"
				}
			}}
		>
				<Toolbar />
				<Box sx={{
					flexGrow: 1,
					overflow: "auto",
					position: "relative"
				}}>
					<Toolbar
						disableGutters
						sx={{
							px: 1,
							pt: 1,
							position: "sticky",
							top: 0,
							bgcolor: "background.default",
							flexDirection: "column",
							zIndex: (theme) => theme.zIndex.drawer + 1
						}}
					>
						<TextField
							fullWidth
							value={filter.search}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Icons.SEARCH />
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position="end">
										<Tooltip title={filterExpanded ? "Hide Filters" : "Show Filters"}>
											<IconButton onClick={toggleFilterExpanded}>
												<Icons.FILTER />
											</IconButton>
										</Tooltip>
									</InputAdornment>
								)
							}}
							onChange={e => updateFilter({search: e.target.value})}
						/>
						<Collapse unmountOnExit in={filterExpanded} timeout="auto" sx={{ width: "100%" }}>
							<Box sx={{ py: 1 }}>
								<Typography variant="subtitle1" sx={{ width: "100%" }}>Filters</Typography>
								<FormControl sx={{ width: "100%" }}>
									<InputLabel id="status-select-label">Conservation Status</InputLabel>
									<Select
										multiple
										labelId="status-select-label"
										id="status-select"
										value={conservationStatusValue}
										input={<OutlinedInput id="status-select" label="Conservation Status" />}
										MenuProps={MenuProps}
										renderValue={(selected) => (
											<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
												{selected.map((value) => (
													<Chip key={value} label={value} size="small" />
												))}
											</Box>
										)}
										onChange={handleChange}
									>
										{conservationStatusOptions}
									</Select>
								</FormControl>
							</Box>
							<Divider />
						</Collapse>
					</Toolbar>
					<Stack
						direction="column"
						spacing={1}
						sx={{
							p: 1
						}}
					>
						{sharkCards}
					</Stack>
				</Box>
		</Drawer>
	);
}

HomeDrawer.propTypes = {
	open: PropTypes.bool.isRequired,
	width: PropTypes.number.isRequired,
	sharks: PropTypes.arrayOf(PropTypes.object).isRequired,
	filter: PropTypes.object.isRequired,
	updateFilter: PropTypes.func.isRequired
};

export default HomeDrawer;
