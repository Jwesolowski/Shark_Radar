import { Request, Response } from "express";
import { Schema, checkSchema, matchedData, validationResult } from "express-validator";
import { WithId, Document } from "mongodb";
import { BaseModel, IUser } from "../../src/models/index.ts";
import { DataType, Collection, StatusCode, Method, CollectionType } from "../../src/utils/enums/index.ts";
import { generateID, modelMap } from "../../src/utils/global.ts";
import IsKeyAttribute from "../../src/utils/schema-builder/attributes/IsKeyAttribute.js";
import IsReferenceAttribute from "../../src/utils/schema-builder/attributes/IsReferenceAttribute.js";
import { SchemaAttribute, SchemaField } from "../../src/utils/schema-builder/index.ts";
import db from "./connect-db.js";
import { resetPassword, startResetPassword, createNewUser } from "./hashLogin.js";
import { ISessionData, sessionDefault } from "./session-default.ts";

class ApiHandler {
	buildValidationSchema(req: Request, res: Response, model: BaseModel) {
		const fields = Object.values(model.schema.fields) as SchemaField[];

		const validatorSchema: Schema = {};

		for (const field of fields) {
			const fieldKey = field.fieldName;
			const attributes = field.attributes;

			validatorSchema[fieldKey] = {};

			(Object.entries(attributes) as [string, SchemaAttribute][]).forEach(([attributeKey, attribute]) => {
				if (attribute.value) {
					if (!attribute.isCustom) {
						validatorSchema[fieldKey][attributeKey as keyof typeof validatorSchema[typeof fieldKey]] = {...attribute};

						delete validatorSchema[fieldKey][attributeKey].value;
						delete validatorSchema[fieldKey][attributeKey].isCustom;

						if (attribute.errorMessage === null) {
							delete validatorSchema[fieldKey][attributeKey].errorMessage;
						}
					} else {
						if (attribute.constructor.name === IsKeyAttribute.name) {
							validatorSchema[fieldKey].custom = {
								options: async (value, meta) => {
									const typedId = parseInt(value);

									const exists = await this.exists(model.collection, { [fieldKey]: typedId });
									const action = meta.req.body.action;

									if (exists && action === Method.PUT) {
										throw new Error("ID already exists");
									} else if (!exists && action === Method.POST) {
										throw new Error("ID does not exist");
									}
								}
							};
						} else if (attribute.constructor.name === IsReferenceAttribute.name) {
							validatorSchema[fieldKey].custom = {
								options: async (input) => {
									const referenceCollection = (attribute as IsReferenceAttribute).collection!;

									const referenceModel = modelMap(referenceCollection);

									if (referenceModel === null) {
										throw new Error("Invalid reference collection name");
									}

									const primaryKeyField = referenceModel.schema.primaryKeyField;

									if (primaryKeyField === null) {
										throw new Error("Invalid reference collection schema");
									}

									const typedId = parseInt(input);

									const exists = await this.exists(referenceCollection, { [primaryKeyField.fieldName]: typedId });

									if (!exists) {
										throw new Error(attribute.errorMessage ?? "Invalid reference");
									}
								}
							};
						}
					}
				}
			});
		}

		return checkSchema(validatorSchema);
	}

	formatData(data: object, model: BaseModel) {
		const dataCopy = {...data};

		for (const [key, value] of Object.entries(dataCopy) as [keyof typeof dataCopy, string][]) {
			const field = model.schema.fields[key];
			const fieldType = field?.attributes.type.value;

			switch (fieldType) {
			case DataType.INT: dataCopy[key] = parseInt(value); break;
			case DataType.FLOAT: dataCopy[key] = parseFloat(value); break;
			case DataType.BOOL: dataCopy[key] = value === "true"; break;
			case DataType.STRING: dataCopy[key] = value.toString(); break;
			default: dataCopy[key] = value; break;
			}
		}

		return dataCopy;
	}

	async validateAndList(req: Request, res: Response, model: BaseModel) {
		const collection = model.collection;
		const result = await this.list(collection, {...req.body});
		let filteredResult: WithId<Document>[] = [];

		if (result) {
			filteredResult = result.filter((item) => (item.deleted === undefined || item.deleted === false));
		}

		res.status(StatusCode.OK).json(filteredResult);
	}

	async validateAndGet(req: Request, res: Response, model: BaseModel, id: string) {
		const primaryKeyField = model.schema.primaryKeyField;

		if (primaryKeyField === null) {
			res.status(StatusCode.BAD_REQUEST).json({ error: "Invalid schema" });
			return;
		}

		const typedId = parseInt(id);
		const filter = { [primaryKeyField.fieldName]: typedId };

		const result = await this.get(model.collection, filter);
		res.status(StatusCode.OK).json(result);
	}

	async validateAndInsert(req: Request, res: Response, model: BaseModel) {
		const schema = this.buildValidationSchema(req, res, model);
		const collection = model.collection;

		const primaryKeyField = model.schema.primaryKeyField;

		if (primaryKeyField === null) {
			res.status(StatusCode.BAD_REQUEST).json({ error: "Invalid schema" });
			return;
		}

		if (primaryKeyField.attributes.auto.value) {
			const fieldName = primaryKeyField.fieldName;

			req.body[fieldName] = generateID();
		}

		await schema.run(req);

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(StatusCode.BAD_REQUEST).json(errors);
		} else {
			const data = matchedData(req);
			const formattedData = this.formatData(data, model);

			const result = await this.insert(collection, formattedData);
			res.status(StatusCode.OK).json(result);
		}
	}

	async validateAndDelete(req: Request, res: Response, model: BaseModel, id: string) {
		const primaryKeyField = model.schema.primaryKeyField;

		if (!primaryKeyField) {
			res.status(StatusCode.BAD_REQUEST).json({ error: "Invalid schema" });
			return;
		}

		const typedId = parseInt(id);
		const filter = { [primaryKeyField.fieldName]: typedId };

		const result = await this.delete(model.collection, filter);
		res.status(StatusCode.OK).json(result);
	}

	async validateAndUpdate(req: Request, res: Response, model: BaseModel) {
		const schema = this.buildValidationSchema(req, res, model);

		await schema.run(req);

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(StatusCode.BAD_REQUEST).json(errors);
		} else {
			const data = matchedData(req);
			const primaryKeyField = model.schema.primaryKeyField;

			if (!primaryKeyField) {
				res.status(StatusCode.BAD_REQUEST).json({ error: "Invalid schema" });
				return;
			}

			const formattedData = this.formatData(data, model);

			const filter = { [primaryKeyField.fieldName]: data[primaryKeyField.fieldName] };

			const result = await this.update(model.collection, filter, formattedData);
			res.status(StatusCode.OK).json(result);
		}
	}

	async list(collection: CollectionType, filter = {}, sort = {}) {
		try {
			return await db?.collection(collection).find(filter).sort(sort).toArray();
		} catch (error) {
			return null;
		}
	}

	async get(collection: CollectionType, filter = {}) {
		try {
			return await db?.collection(collection).findOne(filter);
		} catch (error) {
			return null;
		}
	}

	async exists(collection: CollectionType, filter = {}) {
		try {
			return await db?.collection(collection).findOne(filter) !== null;
		} catch (error) {
			return null;
		}
	}

	async insert(collection: CollectionType, data: object) {
		try {
			return await db?.collection(collection).insertOne(data);
		} catch (error) {
			return null;
		}
	}

	async delete(collection: CollectionType, filter: object) {
		try {
			return await db?.collection(collection).deleteOne(filter);
		} catch (error) {
			return null;
		}
	}

	async update(collection: CollectionType, filter: object, update: object) {
		try {
			return await db?.collection(collection).updateOne(filter, { $set: update });
		} catch (error) {
			return null;
		}
	}

	async login(username: string, password: string) {
		try {
			return await db?.collection(Collection.USERS).findOne({
				username: username,
				password: password
			} as Partial<IUser>);
		} catch (error) {
			return null;
		}
	}

	async messageUpdateRead(messageID: number, read: boolean) {
		try {
			return await db?.collection(Collection.MESSAGES).updateOne({
				messageID: messageID
			}, {
				$set: {
					read: read
				}
			});
		} catch (error) {
			return null;
		}
	}

	async messageUpdateDeleted(messageID: number, deleted: boolean) {
		try {
			return await db?.collection(Collection.MESSAGES).updateOne({
				messageID: messageID
			}, {
				$set: {
					deleted: deleted
				}
			});
		} catch (error) {
			return null;
		}
	}

	getCurrentUser(req: Request) {
		sessionDefault(req);
		return (req.session as ISessionData).user;
	}

	async postMessage(req: Request) {
		const user = this.getCurrentUser(req);

		if (!db) {
			return null;
		}

		try {
			return await db?.collection(Collection.MESSAGES).insertOne({
				messageID: generateID(),
				userID: user?.userID,
				message: req.body.message,
				date: new Date().toISOString(),
				read: false,
				deleted: false
			});
		} catch (error) {
			return null;
		}
	}

	async resetPassword(req: Request){
		const user = this.getCurrentUser(req);
		const username = user?.username;
		const password = req.body.password;

		const userExists = await startResetPassword(username);

		if (userExists) {
			const result = await resetPassword(username, password);

			if (result) {
				return this.update(Collection.USERS, { userID: result.userID }, {
					password: result.hashedPassword,
					salt: result.salt
				});
			} else {
				return null;
			}
		}

		return null;
	}

	async createUser(req: Request) {
		try {
			return await createNewUser(req.body.username, req.body.password);
		} catch (error) {
			return null;
		}
	}

	async updateAvatar(req: Request) {
		const user = this.getCurrentUser(req);

		if (!db) {
			return null;
		}

		try {
			return await db?.collection(Collection.USERS).updateOne({
				userID: user?.userID
			}, {
				$set: {
					avatar: req.body.avatar
				}
			});
		} catch (error) {
			return null;
		}
	}

	async updateName(req: Request) {
		const user = this.getCurrentUser(req);

		if (!db) {
			return null;
		}

		try {
			return await db?.collection(Collection.USERS).updateOne({
				userID: user?.userID
			}, {
				$set: {
					name: req.body.name
				}
			});
		} catch (error) {
			return null;
		}
	}

	async createAdoption(req: Request) {
		try {
			return await db?.collection(Collection.ADOPTIONS).updateOne({
			}, {
					name: req.body.name,
					userID: req.body.userID,
					adoptionID: req.body.adoptionID,
					sharkID: req.body.sharkID
				}
			);
		} catch (error) {
			return null;
		}
	}
}

const apiHandler = new ApiHandler();

export default apiHandler;
