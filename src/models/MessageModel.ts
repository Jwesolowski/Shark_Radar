import { Collection, DataType } from "../utils/enums/index.ts";
import { ForeignKeyField, PrimaryKeyField, SchemaField } from "../utils/schema-builder/index.ts";
import SchemaBuilder from "../utils/schema-builder/SchemaBuilder.ts";
import { BaseModel, UserModel } from "./index.ts";

interface IMessage {
	messageID: number | null;
	userID: number | null;
	message: string | null;
	date: string | null;
	read: boolean | null;
	deleted: boolean | null;
}

class MessageModel extends BaseModel implements IMessage {
	collection = Collection.MESSAGES;
	displayName = "Messages";
	schema = new SchemaBuilder<{ [key in keyof IMessage]: SchemaField }>({
		messageID: new PrimaryKeyField("ID"),
		userID: new ForeignKeyField("User", Collection.USERS, true),
		message: new SchemaField("Message", DataType.STRING, true),
		date: new SchemaField("Date", DataType.DATETIME, true),
		read: new SchemaField("Read", DataType.BOOL, true),
		deleted: new SchemaField("Deleted", DataType.BOOL, true)
	});

	messageID;
	userID;
	message;
	date;
	read;
	deleted;
	relatedUser: UserModel | null = null;

	constructor(model: Partial<IMessage>) {
		super();
		this.messageID = model.messageID ?? null;
		this.userID = model.userID ?? null;
		this.message = model.message ?? null;
		this.date = model.date ?? null;
		this.read = model.read ?? null;
		this.deleted = model.deleted ?? null;
	}
}

const MessageInstance = new MessageModel({});

export { IMessage, MessageModel, MessageInstance };
