import { Collection, DataType } from "../utils/enums/index.ts";
import { PrimaryKeyField, SchemaBuilder, SchemaField } from "../utils/schema-builder/index.ts";
import BaseModel from "./BaseModel.ts";

interface IConservationStatus {
	conservationStatusID: number | null;
	code: string | null;
	description: string | null;
	severity: number | null;
}

class ConservationStatusModel extends BaseModel implements IConservationStatus {
	collection = Collection.CONSERVATION_STATUSES;
	displayName = "Conservation Statuses";
	schema = new SchemaBuilder<{ [key in keyof IConservationStatus]: SchemaField }>({
		conservationStatusID: new PrimaryKeyField("ID"),
		code: new SchemaField("Code", DataType.STRING, true),
		description: new SchemaField("Description", DataType.STRING, true).forDisplay(),
		severity: new SchemaField("Severity", DataType.INT, true)
	});

	conservationStatusID;
	code;
	description;
	severity;

	constructor(model: Partial<IConservationStatus>) {
		super();
		this.conservationStatusID = model.conservationStatusID ?? null;
		this.code = model.code ?? null;
		this.description = model.description ?? null;
		this.severity = model.severity ?? null;
	}

	get keywords() {
		const words = [];

		if (this.code) {
			words.push(this.code);
		}

		if (this.description) {
			words.push(this.description);
		}

		return words;
	}
}

const ConservationStatusInstance = Object.freeze(new ConservationStatusModel({}));

export { ConservationStatusModel, ConservationStatusInstance, IConservationStatus };
