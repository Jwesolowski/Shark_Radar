import { Collection, DataType } from "../utils/enums/index.ts";
import { ForeignKeyField, PrimaryKeyField, SchemaBuilder, SchemaField } from "../utils/schema-builder/index.ts";
import BaseModel from "./BaseModel.ts";
import { SharkModel } from "./index.ts";

interface IVital {
	vitalID: number | null;
	sharkID: number | null;
	dateTime: string | null;
	heartBPM: number | null;
	temperature: number | null;
}

class VitalModel extends BaseModel implements IVital {
	collection = Collection.VITALS;
	displayName = "Vitals";
	schema = new SchemaBuilder<{ [key in keyof IVital]: SchemaField }>({
		vitalID: new PrimaryKeyField("ID"),
		sharkID: new ForeignKeyField("Shark", Collection.SHARKS, true).forDisplay(),
		dateTime: new SchemaField("Date Time", DataType.DATETIME, true).forDisplay(),
		heartBPM: new SchemaField("Heart BPM", DataType.INT, true),
		temperature: new SchemaField("Temperature", DataType.FLOAT, true)
	});

	vitalID;
	sharkID;
	dateTime;
	heartBPM;
	temperature;
	relatedShark: SharkModel | null = null;

	constructor(model: Partial<IVital>) {
		super();
		this.vitalID = model.vitalID ?? null;
		this.sharkID = model.sharkID ?? null;
		this.dateTime = model.dateTime ?? null;
		this.heartBPM = model.heartBPM ?? null;
		this.temperature = model.temperature ?? null;
	}
}

const VitalInstance = Object.freeze(new VitalModel({}));

export { VitalModel, VitalInstance, IVital };
