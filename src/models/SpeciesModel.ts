import { Collection, DataType } from "../utils/enums/index.ts";
import { ForeignKeyField, PrimaryKeyField, SchemaBuilder, SchemaField } from "../utils/schema-builder/index.ts";
import BaseModel from "./BaseModel.ts";
import { ConservationStatusModel } from "./index.ts";

interface ISpecies {
	speciesID: number | null;
	speciesName: string | null;
	bloodType: string | null;
	binomialName: string | null;
	speciesBio: string | null;
	conservationStatusID: number | null;
	image: string | null;
	lengthMin: number | null;
	lengthMax: number | null;
	weightMin: number | null;
	weightMax: number | null;
}

class SpeciesModel extends BaseModel implements ISpecies {
	collection = Collection.SPECIES;
	displayName = "Species";
	schema = new SchemaBuilder<{ [key in keyof ISpecies]: SchemaField }>({
		speciesID: new PrimaryKeyField("ID"),
		speciesName: new SchemaField("Species Name", DataType.STRING, true).forDisplay(),
		bloodType: new SchemaField("Blood Type", DataType.STRING, true),
		binomialName: new SchemaField("Binomial Name", DataType.STRING, true),
		speciesBio: new SchemaField("Species Bio", DataType.STRING, true),
		conservationStatusID: new ForeignKeyField("Status", Collection.CONSERVATION_STATUSES),
		image: new SchemaField("Image", DataType.STRING, true),
		lengthMin: new SchemaField("Min Length (m)", DataType.FLOAT),
		lengthMax: new SchemaField("Max Length (m)", DataType.FLOAT),
		weightMin: new SchemaField("Min Weight (kg)", DataType.FLOAT),
		weightMax: new SchemaField("Max Weight (kg)", DataType.FLOAT)
	});

	speciesID;
	speciesName;
	bloodType;
	binomialName;
	speciesBio;
	conservationStatusID;
	image;
	lengthMin;
	lengthMax;
	weightMin;
	weightMax;
	relatedConservationStatus: ConservationStatusModel | null = null;

	constructor(model: Partial<ISpecies>) {
		super();
		this.speciesID = model.speciesID ?? null;
		this.speciesName = model.speciesName ?? null;
		this.bloodType = model.bloodType ?? null;
		this.binomialName = model.binomialName ?? null;
		this.speciesBio = model.speciesBio ?? null;
		this.conservationStatusID = model.conservationStatusID ?? null;
		this.image = model.image ?? null;
		this.lengthMin = model.lengthMin ?? null;
		this.lengthMax = model.lengthMax ?? null;
		this.weightMin = model.weightMin ?? null;
		this.weightMax = model.weightMax ?? null;
	}

	get keywords() {
		const words = [];

		if (this.speciesName) {
			words.push(this.speciesName);
		}

		if (this.bloodType) {
			words.push(this.bloodType);
		}

		if (this.binomialName) {
			words.push(this.binomialName);
		}

		if (this.speciesBio) {
			words.push(this.speciesBio);
		}

		if (this.relatedConservationStatus) {
			words.push(...this.relatedConservationStatus.keywords);
		}

		return words;
	}

	static BloodTypes = {
		WARM: "Warm",
		COLD: "Cold"
	};
}

const SpeciesInstance = Object.freeze(new SpeciesModel({}));

export { SpeciesModel, SpeciesInstance, ISpecies };
