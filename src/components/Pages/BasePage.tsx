import { Box, Toolbar, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

function BasePage(props: {
	title: string;
	children: React.ReactNode;
	onClick?: () => void;
}) {
	const { title, children, onClick } = props;

	return (
		<Box
			component="main"
			sx={{ flexGrow: 1 }}
		>
			<Toolbar />
			<Box sx={{
				width: { xs: "100%", sm: 600, md: 800 },
				px: 2,
				mx: "auto",
				mt: 0,
				mb: 8
			}}>
				<Typography
					textAlign="center"
					variant="h2"
					sx={{
						py: 4,
						fontSize: 28
					}}
					onClick={onClick}
				>
					{title}
				</Typography>
				<div>
					{children}
				</div>
			</Box>
		</Box>
	);
}

BasePage.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
	onClick: PropTypes.func
};

export default BasePage;

