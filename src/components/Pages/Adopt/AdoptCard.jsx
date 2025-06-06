import { Card, CardContent, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

/** @typedef {import("../../../models/index.js").SharkModel} SharkModel */

/**
 * @param {Object} props
 * @param {SharkModel} props.shark
 */
function SharkCard(props) {
	const { shark } = props;

	return (
		<Card>
			<CardContent>
				<Typography
					gutterBottom
					variant="body1"
				>
					SharkID: {shark.sharkID}

				</Typography>

				{
					shark.dateOfBirth &&
					<Typography
						gutterBottom
						variant="body1"
					>
						Shark birth date: {new Date(shark.dateOfBirth).toLocaleDateString()}
					</Typography>
				}

				{
					shark.relatedSpecies?.speciesName &&
					<Typography
						gutterBottom
						variant="body1"
					>
						Shark species: {shark.relatedSpecies?.speciesName}
					</Typography>
				}
			</CardContent>
		</Card>
	);
}

SharkCard.propTypes = {
	shark: PropTypes.object.isRequired
};

export default SharkCard;
