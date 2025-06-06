import { Box } from "@mui/material";
import React from "react";
import MapHandler from "../../../google-maps-api/MapHandler.js";
import { CacheContext } from "../../Contexts/CacheContext.jsx";
import { UserContext } from "../../Contexts/UserContext.jsx";
import Sharding from "../../Sharding.tsx";

function GoogleMap() {
	const mapRef = React.useRef(null);

	const { cache } = React.useContext(CacheContext);
	const { user } = React.useContext(UserContext);
	const [mapCreated, setMapCreated] = React.useState(false);

	if (cache && cache.initialized && !mapCreated) {
		const handler = new MapHandler();

		handler.loadComponents().then(() => {
			if (mapRef.current) {
				handler.user = user;
				handler.createMap(mapRef.current);
			}
		});

		setMapCreated(true);
	}

	return (
		<Box
			ref={mapRef}
			sx={{
				flexGrow: 1,
				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			}}
		>
			<Sharding />
		</Box>
	);
}

export default GoogleMap;
