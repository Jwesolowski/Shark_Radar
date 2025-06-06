import { SxProps, Theme, Typography } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography.js";
import PropTypes from "prop-types";
import React from "react";


function Text(props: {
	text: string;
	family?: "cursive" | "sans-serif";
	size?: number;
	variant?: "inherit" | Variant,
	sx?: SxProps<Theme>;
}) {
	const { text, family, size, variant = "body1", sx = {} } = props;

	return (
		<Typography
			variant={variant}
			sx={{
				...sx,
				...(family && { fontFamily: `var(--font-${family})` }),
				...(size && { fontSize: size })
			}}
		>{text}</Typography>
	);
}

Text.propTypes = {
	text: PropTypes.string.isRequired,
	family: PropTypes.string,
	size: PropTypes.number,
	variant: PropTypes.string,
	sx: PropTypes.object
};

export default Text;
