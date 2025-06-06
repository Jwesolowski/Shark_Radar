import { Collection, DataType } from "../utils/enums/index.ts";
import { PrimaryKeyField, SchemaBuilder, SchemaField } from "../utils/schema-builder/index.ts";
import BaseModel from "./BaseModel.ts";

interface IUserType {
	userTypeID: number | null;
	name: string | null;
	color: string | null;
}

class UserTypeModel extends BaseModel implements IUserType {
	collection = Collection.USER_TYPES;
	displayName = "User Types";
	schema = new SchemaBuilder<{ [key in keyof IUserType]: SchemaField }>({
		userTypeID: new PrimaryKeyField("ID"),
		name: new SchemaField("Name", DataType.STRING, true).forDisplay(),
		color: new SchemaField("Color", DataType.STRING, true)
	});

	userTypeID;
	name;
	color;

	constructor(model: Partial<IUserType>) {
		super();
		this.userTypeID = model.userTypeID ?? null;
		this.name = model.name ?? null;
		this.color = model.color ?? null;
	}
}

const UserTypeInstance = Object.freeze(new UserTypeModel({}));

export { UserTypeModel, UserTypeInstance, IUserType };
