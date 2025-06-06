import { MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

/** @typedef {import("@mui/material").SvgIconTypeMap<{}, "svg">} SvgIconTypeMap */
/** @typedef {import("@mui/material/OverridableComponent.js").OverridableComponent<SvgIconTypeMap>} OverridableComponent */

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.icon]
 * @param {string} props.label
 * @param {string} props.link
 * @param {() => void} props.onClose
 */
function ProfileMenuTab(props) {
	const { label, link, onClose} = props;

	return (
		<Link
			to={link}
			style={{
				color: "inherit",
				textDecoration: "none"
			}}
		>
			<MenuItem onClick={onClose}>
				<ListItemIcon>
					{
						props.icon &&
						( props.icon )
					}
				</ListItemIcon>
				<ListItemText primary={label} />
			</MenuItem>
		</Link>
	);
}

ProfileMenuTab.propTypes = {
	label: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	icon: PropTypes.any
};

export default ProfileMenuTab;
