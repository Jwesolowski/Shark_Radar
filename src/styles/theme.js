import "./fonts.css";

/** @type {import("@mui/material").ThemeOptions} */
const theme = {
	palette: {
		primary: {
			main: "#006cdb"
		},
		secondary: {
			main: "#ff7500"
		}
	},
	typography: {
		fontFamily: "var(--font-sans-serif)"
	},
	components: {
		MuiButtonBase: {
			defaultProps: {
				disableRipple: true
			}
		},
		MuiLink: {
			defaultProps: {
				color: "primary",
				underline: "none",
				rel: "noopener"
			}
		},
		MuiInputBase: {
			defaultProps: {
				color: "primary",
				sx: {
					borderRadius: 2
				}
			}
		},
		MuiInputLabel: {
			defaultProps: {
				color: "primary"
			}
		},
		MuiTextField: {
			defaultProps: {
				variant: "outlined",
				InputLabelProps: {
					color: "primary"
				}
			}
		},
		MuiButton: {
			defaultProps: {
				variant: "contained",
				color: "primary",
				sx: {
					borderRadius: 2
				}
			}
		},
		MuiMenu: {
			defaultProps: {
				PaperProps: {
					sx: {
						borderRadius: 2
					}
				}
			}
		},
		MuiDialog: {
			defaultProps: {
				PaperProps: {
					sx: {
						borderRadius: 2
					}
				}
			}
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: "#123764",
					backgroundImage: "none"
				}
			}
		},
		MuiTooltip: {
			defaultProps: {
				enterDelay: 500,
				leaveDelay: 200
			}
		},
		MuiAlert: {
			defaultProps: {
				variant: "filled",
				sx: {
					borderRadius: 2
				}
			}
		},
		MuiToolbar: {
			defaultProps: {
				sx: {
					"&.MuiToolbar-root": {
						"&.MuiToolbar-regular": {
							minHeight: 64
						}
					}
				}
			}
		},
		MuiCard: {
			defaultProps: {
				sx: {
					width: { xs: "100%", sm: 400 },
					borderRadius: 4
				}
			}
		}
	}
};

export default theme;
