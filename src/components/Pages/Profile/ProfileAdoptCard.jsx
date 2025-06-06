import { Card, CardContent, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

/** @typedef {import("../../../models/index.js").AdoptionModel} AdoptionModel */

/**
 * @param {Object} props
 * @param {AdoptionModel} props.adoptData
 */
function ProfileAdoptCard(props) {
	const { adoptData } = props;

	return (
		<Card sx={{
			width: { xs: "100%", sm: 400 },
			borderRadius: 4
		}}>
			<CardContent>
				<Typography
					gutterBottom
					variant="body1"
				>
					Your shark name: {adoptData.name}

				</Typography>

				<Typography
					gutterBottom
					variant="body1"
				>
					Your shark ID: {adoptData.sharkID}

				</Typography>

				<Typography
					gutterBottom
					variant="body1"
				>
					Your shark is feeling great!

				</Typography>
			</CardContent>
		</Card>
	);
}

ProfileAdoptCard.propTypes = {
	adoptData: PropTypes.object.isRequired
};

export default ProfileAdoptCard;
