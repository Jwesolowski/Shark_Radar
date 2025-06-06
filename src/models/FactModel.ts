import { Collection, DataType } from "../utils/enums/index.ts";
import { ForeignKeyField, PrimaryKeyField, SchemaBuilder, SchemaField } from "../utils/schema-builder/index.ts";
import BaseModel from "./BaseModel.ts";
import { FactSourceModel } from "./FactSourceModel.js";

interface IFact {
	factID: number | null;
	fact: string | null;
	description: string | null;
	factSourceID: number | null;
}

class FactModel extends BaseModel implements IFact {
	collection = Collection.FACTS;
	displayName = "Facts";
	schema = new SchemaBuilder<{ [key in keyof IFact]: SchemaField }>({
		factID: new PrimaryKeyField("ID"),
		fact: new SchemaField("Fact", DataType.STRING, true).forDisplay(),
		description: new SchemaField("Description", DataType.STRING),
		factSourceID: new ForeignKeyField("Source", Collection.FACT_SOURCES)
	});

	factID;
	fact;
	description;
	factSourceID;
	relatedFactSource: FactSourceModel | null = null;

	constructor(model: Partial<IFact>) {
		super();
		this.factID = model.factID ?? null;
		this.fact = model.fact ?? null;
		this.description = model.description ?? null;
		this.factSourceID = model.factSourceID ?? null;
	}
}

const FactInstance = Object.freeze(new FactModel({}));

export { IFact, FactModel, FactInstance, FactSourceModel };
