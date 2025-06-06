import {
	AdoptionModel,
	ConservationStatusModel,
	FavoritesModel,
	MessageModel,
	SharkModel,
	SpeciesModel,
	SharkMovementModel,
	UserModel,
	UserTypeModel,
	WaterLocationModel,
	FactModel
} from "../models/index.js";
import DataHandlerInstance from "./DataHandler.ts";

//const EventEmitter = require('events');	//Dr.Thomas

class Cache { //extends EventEmitter //Dr.Thomas
	initialized: boolean;
	adoptions: AdoptionModel[] = [];
	conservationStatuses: ConservationStatusModel[] = [];
	facts: FactModel[] = [];
	favorites: FavoritesModel[] = [];
	messages: MessageModel[] = [];
	sharks: SharkModel[] = [];
	species: SpeciesModel[] = [];
	users: UserModel[] = [];
	userTypes: UserTypeModel[] = [];
	sharkMovement: SharkMovementModel[] = [];
	waterLocations: WaterLocationModel[] = [];
	selectedSharkID = null;

	constructor() {
		//super();	//Dr.Thomas
		this.initialized = false;
	}

	//emit the event when selectedSharkID changes //Dr.Thomas
	/* updateSelectedSharkID(newSharkID) {
		this.selectedSharkID = newSharkID;
		this.emit('selectedSharkIDChanged', newSharkID);
	} */

	async loadCollections() {
		this.adoptions = await DataHandlerInstance.listAdoptions();
		this.conservationStatuses = await DataHandlerInstance.listConservationStatuses();
		this.facts = await DataHandlerInstance.listFacts();
		this.favorites = await DataHandlerInstance.listFavorites();
		this.messages = await DataHandlerInstance.listMessages();
		this.sharks = await DataHandlerInstance.listSharks();
		this.species = await DataHandlerInstance.listSpecies();
		this.users = await DataHandlerInstance.listUsers();
		this.userTypes = await DataHandlerInstance.listUserTypes();
		this.sharkMovement = await DataHandlerInstance.listSharkMovement();
		this.waterLocations = await DataHandlerInstance.listWaterLocations();

		this.connectReferences();

		this.initialized = true;
	}

	connectReferences() {
		this.favorites?.forEach((favorite) => {
			favorite.relatedShark = this.sharks?.find((shark) => shark.sharkID === favorite.sharkID) ?? null;
			favorite.relatedUser = this.users?.find((user) => user.userID === favorite.userID) ?? null;
		});

		this.sharks?.forEach((shark) => {
			shark.relatedSpecies = this.species?.find((species) => species.speciesID === shark.speciesID) ?? null;
		});

		this.species?.forEach((species) => {
			species.relatedConservationStatus = this.conservationStatuses?.find(
				(conservationStatus) => conservationStatus.conservationStatusID === species.conservationStatusID
			) ?? null;
		});

		this.adoptions?.forEach((adoption) => {
			adoption.relatedShark = this.sharks?.find((shark) => shark.sharkID === adoption.sharkID) ?? null;
			adoption.relatedUser = this.users?.find((user) => user.userID === adoption.userID) ?? null;
		});

		this.sharkMovement?.forEach((sharkMovement) => {
			sharkMovement.relatedShark = this.sharks?.find((shark) => shark.sharkID === sharkMovement.sharkID) ?? null;
		});

		this.messages?.forEach((message) => {
			message.relatedUser = this.users?.find((user) => user.userID === message.userID) ?? null;
		});
	}
}

const CacheInstance = new Cache();

export default CacheInstance;
