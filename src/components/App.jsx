import {Box, CssBaseline, ThemeProvider, createTheme, useMediaQuery} from "@mui/material";
import PropTypes from "prop-types";
import React, { StrictMode } from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import theme from "../styles/theme.js";
import PageRoute from "../utils/PageRoute.js";
import SecurityManager from "../utils/SecurityManager.ts";
import { UserContext } from "./Contexts/UserContext.jsx";
import Navbar from "./Navbar/Navbar.jsx";

const ColorModeContext = React.createContext({toggleColorMode: () => {}});

/**
 * @param {string} trackColor
 * @param {string} thumbColor
 * @param {string} thumbColorHover
 */
function scrollbarStyles(trackColor, thumbColor, thumbColorHover) {
	return {
		scrollbarColor: `${thumbColor} ${trackColor}`,
		"&::-webkit-scrollbar, & *::-webkit-scrollbar": {
			backgroundColor: trackColor,
			width: 12,
			height: 12
		},
		"&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
			borderRadius: 6,
			backgroundColor: thumbColor,
			border: `2px solid ${trackColor}`
		},
		"&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
			backgroundColor: thumbColorHover
		},
		"&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
			backgroundColor: thumbColorHover
		},
		"&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
			backgroundColor: thumbColorHover
		},
		"&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
			backgroundColor: trackColor
		}
	};
}

/**
 * @param {Object} props
 * @param {string} props.route
 * @param {number} props.role
 * @param {React.ReactNode} props.children
 */
function ProtectRoute(props) {
	const { route, role, children } = props;

	const hasPermission = SecurityManager.hasPermission(route, role);

	if (!hasPermission) {
		return (
			<Navigate to="/" />
		);
	}

	return (
		<>
			{children}
		</>
	);
}

/**
 * @param {Object} props
 * @param {string[][]} props.tabs
 * @param {PageRoute[]} props.routes
 */
function App(props) {
	const { tabs, routes } = props;

	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
	const modeTheme = prefersDarkMode ? "dark" : "light";
	const [mode, setMode] = React.useState(modeTheme);

	const { role, loaded: userLoaded } = React.useContext(UserContext);

	React.useEffect(() => {
		const localMode = localStorage.getItem("mode") ?? modeTheme;
		setMode(localMode);
	}, [modeTheme]);

	const colorMode = React.useMemo(() => ({
		toggleColorMode: () => {
			const newMode = mode === "light" ? "dark" : "light";
			localStorage.setItem("mode", newMode);
			setMode(newMode);
		}
	}), [mode]);

	const userTheme = React.useMemo(() => {
		const siteThemeJSON = {
			...theme
		};

		if (siteThemeJSON.palette) {
			siteThemeJSON.palette.mode = (mode === "light" || mode === "dark") ? mode : "light";
		}

		const siteTheme = createTheme(siteThemeJSON);

		const trackColor = siteTheme.palette.mode === "dark" ? siteTheme.palette.grey[900] : siteTheme.palette.grey[200];
		const thumbColor = siteTheme.palette.grey[500];
		const thumbColorHover = siteTheme.palette.mode === "dark" ? siteTheme.palette.grey[400] : siteTheme.palette.grey[600];

		if (siteTheme.components) {
			siteTheme.components.MuiCssBaseline = {
				styleOverrides: scrollbarStyles(trackColor, thumbColor, thumbColorHover)
			};
		}

		return siteTheme;
	}, [mode]);

	const handleToggleColorMode = () => {
		colorMode.toggleColorMode();
	};

	const allowedTabs = tabs.filter((tab) => SecurityManager.hasPermission(tab[1], role));

	return (
		userLoaded &&
		<StrictMode>
			<ColorModeContext.Provider value={colorMode}>
				<ThemeProvider theme={userTheme}>
					<BrowserRouter>
						<Box sx={{ display: "flex" }}>
							<CssBaseline />
							<Navbar
								tabs={allowedTabs}
								onToggleColorMode={handleToggleColorMode}
							/>
							<Routes>
								{routes.map((route) => (
									<Route
										key={route.path}
										index={route.index}
										path={route.path}
										element={(
											<ProtectRoute route={route.path} role={role}>
												<route.element />
											</ProtectRoute>
										)}
									/>
								))}
							</Routes>
						</Box>
					</BrowserRouter>
				</ThemeProvider>
			</ColorModeContext.Provider>
		</StrictMode>
	);
}

ProtectRoute.propTypes = {
	route: PropTypes.string.isRequired,
	role: PropTypes.number.isRequired,
	children: PropTypes.node.isRequired
};

App.propTypes = {
	tabs: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
	routes: PropTypes.arrayOf(PropTypes.instanceOf(PageRoute)).isRequired
};

export default App;
