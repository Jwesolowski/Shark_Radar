import { Divider, Stack } from "@mui/material";
import React from "react";
import Text from "../Text.jsx";
import BasePage from "./BasePage.jsx";

function AboutPage() {
	return (
		<BasePage title="About Shark Radar">
			<Stack
				direction="column"
				spacing={4}
				textAlign="center"
			>
				<Text
					sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
					variant="body1"
					text={"Many shark species are becoming extinct due to overfishing and the illegal collection of sharks for their fins, this is exacerbated by the lack of monitoring of shark populations worldwide, allowing large fisheries to do as they please while shark populations quickly deplete."}
				/>
				<Text
					sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
					variant="body1"
					text={"This program strives to stop the endangerment of our favorite cold-blooded animals by notifying authorities of poaching locations and instances as well as being a resource to those interested in the protection of sharks."}
				/>
				<Text
					sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
					variant="body1"
					text={"This may provide entertainment to many but can also serve a more serious purpose for local authorities like the Coast Guard who the program will notify of poaching efforts as well as when a shark enters a protected area."}
				/>
				<Divider />
				<Text
					sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
					variant="body2"
					text={"Made for CS 458 - Software Engineering Practicum by Fiona L, Blake D, Ethan H, Luke M, Grey T, and Jacob W."}
				/>
			</Stack>
		</BasePage>
	);
}

export default AboutPage;
