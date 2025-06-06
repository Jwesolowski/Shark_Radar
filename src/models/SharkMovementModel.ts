import { Collection, DataType } from "../utils/enums/index.ts";
import { ForeignKeyField, PrimaryKeyField, SchemaBuilder, SchemaField } from "../utils/schema-builder/index.ts";
import BaseModel from "./BaseModel.ts";
import { SharkModel } from "./index.ts";

interface ISharkMovement {
	movementID: number | null;
	sharkID: number | null;
	coordinates: number[][] | null;
	dateTime: string[] | null;
}

class SharkMovementModel extends BaseModel implements ISharkMovement {
	collection = Collection.SHARK_MOVEMENT;
	displayName = "Shark Movement";
	schema = new SchemaBuilder<{ [key in keyof ISharkMovement]: SchemaField }>({
		movementID: new PrimaryKeyField("ID"),
		sharkID: new ForeignKeyField("Shark ID", Collection.SHARKS, true),
		coordinates: new SchemaField("Coordinates", DataType.ANY, true),
		dateTime: new SchemaField("DateTime", DataType.ANY, true)
	});

	movementID;
	sharkID;
	coordinates;
	dateTime;
	relatedShark: SharkModel | null = null;

	constructor(model: Partial<ISharkMovement>) {
		super();
		this.movementID = model.movementID ?? null;
		this.sharkID = model.sharkID ?? null;
		this.coordinates = model.coordinates ?? null;
		this.dateTime = model.dateTime ?? null;
	}
}

const SharkMovementInstance = Object.freeze(new SharkMovementModel({}));

export { SharkMovementModel, SharkMovementInstance, ISharkMovement };
