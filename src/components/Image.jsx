import { Box } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

/**
 * @param {Object} props
 * @param {string} props.src
 * @param {string} props.alt
 * @param {number} props.width
 * @param {number} props.height
 * @param {Object} [props.sx]
 */
function Image(props) {
	const { src, alt, width, height, sx = {} } = props;

	return (
		<Box
			alt={alt}
			component="img"
			src={src}
			sx={{
				width: width,
				height: height,
				display: "block",
				...sx
			}}
		/>
	);
}

Image.propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	sx: PropTypes.object
};

export default Image;
