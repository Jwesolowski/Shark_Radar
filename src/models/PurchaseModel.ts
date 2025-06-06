import { Collection, DataType } from "../utils/enums/index.ts";
import { ForeignKeyField, PrimaryKeyField, SchemaBuilder, SchemaField } from "../utils/schema-builder/index.ts";
import { AdoptionModel } from "./AdoptionModel.ts";
import BaseModel from "./BaseModel.ts";

interface IPurchase {
	purchaseID: number | null;
	adoptionID: number | null;
	cardNum: string | null;
	purchaseDate: string | null;
}

class PurchaseModel extends BaseModel implements IPurchase {
	collection = Collection.PURCHASES;
	displayName = "Purchases";
	schema = new SchemaBuilder<{ [key in keyof IPurchase]: SchemaField }>({
		purchaseID: new PrimaryKeyField("ID"),
		adoptionID: new ForeignKeyField("Adoption ID", Collection.ADOPTIONS, true),
		cardNum: new SchemaField("Card Number", DataType.STRING, true).forDisplay(),
		purchaseDate: new SchemaField("Purchase Date", DataType.STRING, true)
	});

	purchaseID;
	adoptionID;
	cardNum;
	purchaseDate;
	relatedAdoption: AdoptionModel | null = null;

	constructor(model: Partial<IPurchase>) {
		super();
		this.purchaseID = model.purchaseID ?? null;
		this.adoptionID = model.adoptionID ?? null;
		this.cardNum = model.cardNum ?? null;
		this.purchaseDate = model.purchaseDate ?? null;
	}
}

const PurchaseInstance = Object.freeze(new PurchaseModel({}));

export { PurchaseModel, PurchaseInstance, IPurchase };
