import { Collection, DataType } from "../utils/enums/index.ts";
import { ForeignKeyField, PrimaryKeyField, SchemaBuilder, SchemaField } from "../utils/schema-builder/index.ts";
import BaseModel from "./BaseModel.ts";
import { UserTypeModel } from "./index.ts";

interface IUser {
	userID: number | null;
	username: string | null;
	password: string | null;
	userTypeID: number | null;
	salt: string | null;
	avatar: string | null;
	name: string | null;
}

class UserModel extends BaseModel implements IUser {
	collection = Collection.USERS;
	displayName = "Users";
	schema = new SchemaBuilder<{ [key in keyof IUser]: SchemaField }>({
		userID: new PrimaryKeyField("ID"),
		username: new SchemaField("Username", DataType.STRING, true).forDisplay(),
		password: new SchemaField("Password", DataType.STRING, true).isSensitive(),
		userTypeID: new ForeignKeyField("User Type", Collection.USER_TYPES),
		salt: new SchemaField("Salt", DataType.STRING, true).hidden(),
		avatar: new SchemaField("Avatar", DataType.STRING, false),
		name: new SchemaField("Name", DataType.STRING, false)
	});

	userID;
	username;
	password;
	userTypeID;
	salt;
	avatar;
	name;
	relatedUserType: UserTypeModel | null = null;

	constructor(model: Partial<IUser>) {
		super();
		this.userID = model.userID ?? null;
		this.username = model.username ?? null;
		this.password = model.password ?? null;
		this.userTypeID = model.userTypeID ?? null;
		this.salt = model.salt ?? null;
		this.avatar = model.avatar ?? null;
		this.name = model.name ?? null;
	}
}

const UserInstance = Object.freeze(new UserModel({}));

export { UserModel, UserInstance, IUser };
