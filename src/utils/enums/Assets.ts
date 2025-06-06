const Assets = Object.freeze({
	LOGO_16: "/images/logo/logo-16.png",
	LOGO_32: "/images/logo/logo-32.png",
	LOGO_64: "/images/logo/logo-64.png",
	LOGO_128: "/images/logo/logo-128.png",
	LOGO_256: "/images/logo/logo-256.png",
	LOGO: "/images/logo/logo.png",
	MOVEMENT_MARKER: "/images/pins/shark-movement-marker.png",
	SHARK_FIN: "/images/pins/sharkFin.png",
	PIN_PROTECTED: "/images/pins/pin-shield.png",
	PIN_SANCTUARY: "/images/pins/pin-warning.png",
	ADOPTED_SHARK: "/images/pins/pin-shark-adopt.png",
	FAVORITE_SHARK: "/images/pins/pin-shark-favorite.png",
	USER_LOCATION: "/images/pins/pin-user-location.png",
	LEFT_SHARK: "/images/misc/dance.gif",
	SHARDING: "/images/misc/sharding.gif",
	GOOGLE_ICON: "/images/misc/google.png",
	SHARK_PIN: "/images/pins/shark-pin.png"
});

type AssetType = typeof Assets[keyof typeof Assets];

export { Assets, AssetType };
