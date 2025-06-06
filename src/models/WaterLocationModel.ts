import { Collection, DataType } from "../utils/enums/index.ts";
import { PrimaryKeyField, SchemaBuilder, SchemaField } from "../utils/schema-builder/index.ts";
import BaseModel from "./BaseModel.ts";

interface IWaterLocation {
	waterLocationID: number | null;
	coordinates: [number, number][] | null;
	locationType: string | null;
}

class WaterLocationModel extends BaseModel implements IWaterLocation {
	collection = Collection.WATER_LOCATIONS;
	displayName = "Water Locations";
	schema = new SchemaBuilder<{ [key in keyof IWaterLocation]: SchemaField }>({
		waterLocationID: new PrimaryKeyField("ID"),
		coordinates: new SchemaField("Coordinates", DataType.ANY, true),
		locationType: new SchemaField("Location Type", DataType.STRING, true)
	});

	waterLocationID;
	coordinates;
	locationType;

	constructor(model: Partial<IWaterLocation>) {
		super();
		this.waterLocationID = model.waterLocationID ?? null;
		this.coordinates = model.coordinates ?? null;
		this.locationType = model.locationType ?? null;
	}

	static LocationType = Object.freeze({
		PROTECTED: "protected",
		SANCTUARY: "sanctuary"
	});
}

const WaterLocationInstance = Object.freeze(new WaterLocationModel({}));

export { WaterLocationModel, WaterLocationInstance, IWaterLocation };
