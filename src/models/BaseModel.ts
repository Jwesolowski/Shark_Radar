import { CollectionType } from "../utils/enums/Collection.ts";
import { SchemaField } from "../utils/schema-builder/index.ts";
import SchemaBuilder from "../utils/schema-builder/SchemaBuilder.ts";

abstract class BaseModel {
	abstract collection: CollectionType;
	abstract displayName: string;
	abstract schema: SchemaBuilder<{ [i: symbol]: SchemaField }>;
	_id = "";

	get keywords(): string[] { return []; }
}

export default BaseModel;
