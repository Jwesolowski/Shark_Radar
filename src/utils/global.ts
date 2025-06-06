import {
	AdoptionInstance,
	ConservationStatusInstance,
	FactInstance,
	FactSourceInstance,
	FavoritesInstance,
	PurchaseInstance,
	MessageInstance,
	SharkInstance,
	SpeciesInstance,
	UserInstance,
	UserTypeInstance,
	SharkMovementInstance,
	WaterLocationInstance,
	VitalInstance
} from "../models/index.ts";
import { Collection, CollectionType } from "./enums/index.ts";

function modelMap(collection: string | CollectionType) {
	switch (collection) {
	case Collection.ADOPTIONS:
		return AdoptionInstance;
	case Collection.CONSERVATION_STATUSES:
		return ConservationStatusInstance;
	case Collection.FACT_SOURCES:
		return FactSourceInstance;
	case Collection.FACTS:
		return FactInstance;
	case Collection.FAVORITES:
		return FavoritesInstance;
	case Collection.MESSAGES:
		return MessageInstance;
	case Collection.PURCHASES:
		return PurchaseInstance;
	case Collection.SHARKS:
		return SharkInstance;
	case Collection.SPECIES:
		return SpeciesInstance;
	case Collection.USERS:
		return UserInstance;
	case Collection.USER_TYPES:
		return UserTypeInstance;
	case Collection.SHARK_MOVEMENT:
		return SharkMovementInstance;
	case Collection.VITALS:
		return VitalInstance;
	case Collection.WATER_LOCATIONS:
		return WaterLocationInstance;
	default:
		return null;
	}
}

function csvToJson(csv: string) {
	const lines = csv.split("\n");
	const result = [];
	const headers = lines[0].split(",");

	for (let i = 1; i < lines.length; i++) {
		const obj: { [key in typeof headers[number]]: string } = {};
		const currentLine = lines[i].split(",");

		for (let j = 0; j < headers.length; j++) {
			obj[headers[j]] = currentLine[j];
		}

		result.push(obj);
	}

	return result;
}

function generateID() {
	return Math.floor(Math.random() * Math.pow(10, 7));
}

export {
	modelMap,
	csvToJson,
	generateID
};
