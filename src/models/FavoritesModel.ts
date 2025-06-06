import { Collection } from "../utils/enums/index.ts";
import { ForeignKeyField, PrimaryKeyField, SchemaBuilder, SchemaField } from "../utils/schema-builder/index.ts";
import BaseModel from "./BaseModel.ts";
import { SharkModel, UserModel } from "./index.ts";

interface IFavorite {
	favoriteID: number | null;
	sharkID: number | null;
	userID: number | null;
}

class FavoritesModel extends BaseModel implements IFavorite {
	collection = Collection.FAVORITES;
	displayName = "Favorites";
	schema = new SchemaBuilder<{ [key in keyof IFavorite]: SchemaField }>({
		favoriteID: new PrimaryKeyField("ID"),
		sharkID: new ForeignKeyField("Shark", Collection.SHARKS, true),
		userID: new ForeignKeyField("User", Collection.USERS, true)
	});

	favoriteID;
	sharkID;
	userID;
	relatedShark: SharkModel | null = null;
	relatedUser: UserModel | null = null;

	constructor(model: Partial<IFavorite>) {
		super();
		this.favoriteID = model.favoriteID ?? null;
		this.sharkID = model.sharkID ?? null;
		this.userID = model.userID ?? null;
	}
}

const FavoritesInstance = Object.freeze(new FavoritesModel({}));

export { FavoritesModel, FavoritesInstance, IFavorite };
