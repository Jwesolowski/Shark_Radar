import { Collection, DataType } from "../utils/enums/index.ts";
import { ForeignKeyField, PrimaryKeyField, SchemaBuilder, SchemaField } from "../utils/schema-builder/index.ts";
import BaseModel from "./BaseModel.ts";
import { SpeciesModel } from "./index.ts";

interface IShark {
	sharkID: number | null;
	speciesID: number | null;
	dateOfBirth: string | null;
	originLat: number | null;
	originLon: number | null;
	speed: number | null;
	gender: string | null;
	active: boolean | null;
	size: number | null;
	weight: number | null;
}

class SharkModel extends BaseModel implements IShark {
	collection = Collection.SHARKS;
	displayName = "Sharks";
	schema = new SchemaBuilder<{ [key in keyof IShark]: SchemaField }>({
		sharkID: new PrimaryKeyField("ID"),
		speciesID: new ForeignKeyField("Species", Collection.SPECIES),
		dateOfBirth: new SchemaField("Birthdate", DataType.DATE),
		originLat: new SchemaField("Origin Latitude", DataType.FLOAT, true),
		originLon: new SchemaField("Origin Longitude", DataType.FLOAT, true),
		speed: new SchemaField("Speed (mph)", DataType.FLOAT),
		gender: new SchemaField("Gender", DataType.STRING),
		active: new SchemaField("Active", DataType.BOOL, true),
		size: new SchemaField("Length (m)", DataType.FLOAT),
		weight: new SchemaField("Weight (kg)", DataType.FLOAT)
	});

	sharkID;
	speciesID;
	dateOfBirth;
	originLat;
	originLon;
	speed;
	gender;
	active;
	size;
	weight;
	relatedSpecies: SpeciesModel | null = null;

	constructor(model: Partial<IShark>) {
		super();
		this.sharkID = model.sharkID ?? null;
		this.speciesID = model.speciesID ?? null;
		this.dateOfBirth = model.dateOfBirth ?? null;
		this.originLat = model.originLat ?? null;
		this.originLon = model.originLon ?? null;
		this.speed = model.speed ?? null;
		this.gender = model.gender ?? null;
		this.active = model.active ?? null;
		this.size = model.size ?? null;
		this.weight = model.weight ?? null;
	}

	get keywords() {
		const words = [];

		if (this.dateOfBirth) {
			words.push(this.dateOfBirth.toString());
		}

		if (this.originLat) {
			words.push(this.originLat.toString());
		}

		if (this.originLon) {
			words.push(this.originLon.toString());
		}

		if (this.speed) {
			words.push(this.speed.toString());
		}

		if (this.relatedSpecies) {
			words.push(...this.relatedSpecies.keywords);
		}

		return words;
	}

	get age() {
		if (!this.dateOfBirth) {
			return null;
		}

		const today = new Date();
		const dateOfBirth = new Date(this.dateOfBirth);

		let age = today.getFullYear() - dateOfBirth.getFullYear();
		const month = today.getMonth() - dateOfBirth.getMonth();

		if (month < 0 || (month === 0 && today.getDate() < dateOfBirth.getDate())) {
			age--;
		}

		return age;
	}

	static Sex = Object.freeze({
		MALE: "Male",
		FEMALE: "Female"
	});
}

const SharkInstance = Object.freeze(new SharkModel({}));

export { SharkModel, SharkInstance, IShark };
