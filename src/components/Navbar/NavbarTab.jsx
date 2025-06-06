import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

/**
 * @param {Object} props
 * @param {string} props.text
 * @param {string} props.target
 */
function NavbarTab(props) {
	const { text, target } = props;
	const theme = useTheme();

	return (
		<Link
			to={target}
			style={{ textDecoration: "none" }}
		>
			<Box sx={{
				px: 2,
				color: theme.palette.primary.contrastText,
				backgroundColor: "transparent",
				"&:hover": {
					backgroundColor: "rgba(0, 0, 0, 0.2)"
				},
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: 64
			}}>
				{text}
			</Box>
		</Link>
	);
}

NavbarTab.propTypes = {
	text: PropTypes.string.isRequired,
	target: PropTypes.string.isRequired
};

export default NavbarTab;
