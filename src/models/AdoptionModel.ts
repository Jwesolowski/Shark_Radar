import { Collection, DataType } from "../utils/enums/index.ts";
import { ForeignKeyField, PrimaryKeyField, SchemaBuilder, SchemaField } from "../utils/schema-builder/index.ts";
import BaseModel from "./BaseModel.ts";
import { SharkModel, UserModel } from "./index.ts";

interface IAdoption {
	adoptionID: number | null;
	sharkID: number | null;
	name: string | null;
	userID: number | null;
}

class AdoptionModel extends BaseModel implements IAdoption {
	collection = Collection.ADOPTIONS;
	displayName = "Adoptions";
	schema = new SchemaBuilder<{ [key in keyof IAdoption]: SchemaField }>({
		adoptionID:new PrimaryKeyField("ID"),
		sharkID: new ForeignKeyField("Shark", Collection.SHARKS, true),
		name: new SchemaField("Name", DataType.STRING, true).forDisplay(),
		userID: new ForeignKeyField("User", Collection.USERS, true)
	});

	adoptionID;
	sharkID;
	name;
	userID;
	relatedShark: SharkModel | null = null;
	relatedUser: UserModel | null = null;

	constructor(model: Partial<IAdoption>) {
		super();
		this.adoptionID = model.adoptionID ?? null;
		this.sharkID = model.sharkID ?? null;
		this.name = model.name ?? null;
		this.userID = model.userID ?? null;
	}
}

const AdoptionInstance = Object.freeze(new AdoptionModel({}));

export { AdoptionModel, AdoptionInstance };
