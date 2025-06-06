const Collection = Object.freeze({
	ADOPTIONS: "adoptions",
	CONSERVATION_STATUSES: "conservationStatuses",
	FACT_SOURCES: "factSources",
	FACTS: "facts",
	FAVORITES: "favorites",
	MESSAGES: "messages",
	PURCHASES: "purchases",
	SHARKS: "sharks",
	SPECIES: "species",
	USERS: "users",
	USER_TYPES: "userTypes",
	SHARK_MOVEMENT: "sharkMovement",
	VITALS: "vitals",
	WATER_LOCATIONS: "waterLocations"
});

type CollectionType = typeof Collection[keyof typeof Collection];

export { Collection, CollectionType };
