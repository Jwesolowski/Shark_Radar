import { Collection, DataType } from "../utils/enums/index.ts";
import { PrimaryKeyField, SchemaBuilder, SchemaField } from "../utils/schema-builder/index.ts";
import BaseModel from "./BaseModel.ts";

interface IFactSource {
	factSourceID: number | null;
	name: string | null;
	link: string | null;
}

class FactSourceModel extends BaseModel implements IFactSource {
	collection = Collection.FACT_SOURCES;
	displayName = "Fact Sources";
	schema = new SchemaBuilder<{ [key in keyof IFactSource]: SchemaField }>({
		factSourceID: new PrimaryKeyField("ID"),
		name: new SchemaField("Name", DataType.STRING, true).forDisplay(),
		link: new SchemaField("Link", DataType.STRING, true).isURL()
	});

	factSourceID;
	name;
	link;

	constructor(model: Partial<IFactSource>) {
		super();
		this.factSourceID = model.factSourceID ?? null;
		this.name = model.name ?? null;
		this.link = model.link ?? null;
	}
}

const FactSourceInstance = Object.freeze(new FactSourceModel({}));

export { FactSourceModel, FactSourceInstance, IFactSource };
