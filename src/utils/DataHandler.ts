import {
	AdoptionModel,
	FactModel,
	FactSourceModel,
	FavoritesModel,
	PurchaseModel,
	SharkModel,
	SpeciesModel,
	UserModel,
	UserTypeModel,
	ConservationStatusModel,
	SharkMovementModel,
	WaterLocationModel,
	VitalModel,
	IUser,
	BaseModel,
	MessageModel
} from "../models/index.js";
import { Collection, CollectionType, Method, MethodType } from "./enums/index.ts";

/**
 * @class DataHandler
 * @description Handles all API calls to the server.
 */
class DataHandler {
	async #fetch(path: string, method: MethodType, init: RequestInit = {}) {
		let res;

		try {
			res = await fetch(`/api${path}`, {
				method: method,
				headers: {
					"Content-Type": "application/json"
				},
				...init
			});

			if (res.status >= 400) {
				throw new Error(`Status ${res.status}: Failed ${init.method} "${path}"`);
			}
		} catch (err) {
			console.error(err);
		}

		return await res?.json();
	}

	async list(collection: CollectionType) {
		return await this.#fetch(`/list/${collection}`, Method.GET);
	}

	async get(collection: CollectionType, id: number) {
		return await this.#fetch(`/${collection}/${id}`, Method.GET);
	}

	async insert<T extends BaseModel>(collection: CollectionType, document: T) {
		return await this.#fetch(`/insert/${collection}`, Method.PUT, {
			body: JSON.stringify(document)
		});
	}

	async delete(collection: CollectionType, id: string | number) {
		return await this.#fetch(`/delete/${collection}/${id}`, Method.DELETE);
	}

	async update<T extends BaseModel>(collection: CollectionType, document: T) {
		return await this.#fetch(`/update/${collection}`, Method.POST, {
			body: JSON.stringify(document)
		});
	}

	// #region Get Documents
	async getAdoption(id: number) {
		return await this.get(Collection.ADOPTIONS, id);
	}

	async getFactSource(id: number) {
		return await this.get(Collection.FACT_SOURCES, id);
	}

	async getFact(id: number) {
		return await this.get(Collection.FACTS, id);
	}

	async getFavorites(id: number) {
		return await this.get(Collection.FAVORITES, id);
	}

	async getPurchase(id: number) {
		return await this.get(Collection.PURCHASES, id);
	}

	async getShark(id: number) {
		return await this.get(Collection.SHARKS, id);
	}

	async getSpecies(id: number) {
		return await this.get(Collection.SPECIES, id);
	}

	async getUser(id: number) {
		return await this.get(Collection.USERS, id);
	}

	async getUserType(id: number) {
		return await this.get(Collection.USER_TYPES, id);
	}

	async getConservationStatus(id: number) {
		return await this.get(Collection.CONSERVATION_STATUSES, id);
	}

	async getSharkMovement(id: number) {
		return await this.get(Collection.SHARK_MOVEMENT, id);
	}
	// #endregion

	// #region Insert Documents
	async insertAdoption(adoption: AdoptionModel) {
		return await this.insert(Collection.ADOPTIONS, adoption);
	}

	async insertFactSource(factSource: FactSourceModel) {
		return await this.insert(Collection.FACT_SOURCES, factSource);
	}

	async insertFact(fact: FactModel) {
		return await this.insert(Collection.FACTS, fact);
	}

	async insertFavorite(favorite: FavoritesModel) {
		return await this.insert(Collection.FAVORITES, favorite);
	}

	async insertPurchase(purchase: PurchaseModel) {
		return await this.insert(Collection.PURCHASES, purchase);
	}

	async insertShark(shark: SharkModel) {
		return await this.insert(Collection.SHARKS, shark);
	}

	async insertSpecies(species: SpeciesModel) {
		return await this.insert(Collection.SPECIES, species);
	}

	async insertUser(user: UserModel) {
		return await this.insert(Collection.USERS, user);
	}

	async insertUserType(userType: UserModel) {
		return await this.insert(Collection.USER_TYPES, userType);
	}

	async insertConservationStatus(conservationStatus: ConservationStatusModel) {
		return await this.insert(Collection.CONSERVATION_STATUSES, conservationStatus);
	}

	async insertSharkMovement(sharkMovement: SharkMovementModel) {
		return await this.insert(Collection.SHARK_MOVEMENT, sharkMovement);
	}
	// #endregion

	// #region Delete Documents
	async deleteAdoption(id: number) {
		return await this.delete(Collection.ADOPTIONS, id);
	}

	async deleteFactSource(id: number) {
		return await this.delete(Collection.FACT_SOURCES, id);
	}

	async deleteFact(id: number) {
		return await this.delete(Collection.FACTS, id);
	}

	async deleteFavorite(id: number) {
		return await this.delete(Collection.FAVORITES, id);
	}

	async deletePurchase(id: number) {
		return await this.delete(Collection.PURCHASES, id);
	}

	async deleteShark(id: number) {
		return await this.delete(Collection.SHARKS, id);
	}

	async deleteSpecies(id: number) {
		return await this.delete(Collection.SPECIES, id);
	}

	async deleteUser(id: number) {
		return await this.delete(Collection.USERS, id);
	}

	async deleteUserType(id: number) {
		return await this.delete(Collection.USER_TYPES, id);
	}

	async deleteConservationStatus(id: number) {
		return await this.delete(Collection.CONSERVATION_STATUSES, id);
	}

	// #endregion

	// #region Update Documents
	async updateAdoption(adoption: AdoptionModel) {
		return await this.update(Collection.ADOPTIONS, adoption);
	}

	async updateFactSource(factSource: FactSourceModel) {
		return await this.update(Collection.FACT_SOURCES, factSource);
	}

	async updateFact(fact: FactModel) {
		return await this.update(Collection.FACTS, fact);
	}

	async updateFavorites(favorite: FavoritesModel) {
		return await this.update(Collection.FACTS, favorite);
	}

	async updatePurchase(purchase: PurchaseModel) {
		return await this.update(Collection.PURCHASES, purchase);
	}

	async updateShark(shark: SharkModel) {
		return await this.update(Collection.SHARKS, shark);
	}

	async updateSpecies(species: SpeciesModel) {
		return await this.update(Collection.SPECIES, species);
	}

	async updateUser(user: UserModel) {
		return await this.update(Collection.USERS, user);
	}

	async updateUserType(userType: UserTypeModel) {
		return await this.update(Collection.USER_TYPES, userType);
	}

	async updateConservationStatus(conservationStatus: ConservationStatusModel) {
		return await this.update(Collection.CONSERVATION_STATUSES, conservationStatus);
	}

	async updateSharkMovement(sharkMovement: SharkMovementModel) {
		return await this.update(Collection.SHARK_MOVEMENT, sharkMovement);
	}
	// #endregion

	// #region List Documents
	async listAdoptions() {
		const adoptions: AdoptionModel[] = await this.list(Collection.ADOPTIONS);
		return adoptions.map(adoption => new AdoptionModel(adoption));
	}

	async listFactSources() {
		const factSources: FactSourceModel[] = await this.list(Collection.FACT_SOURCES);
		return factSources.map(factSource => new FactSourceModel(factSource));
	}

	async listFacts() {
		const facts: FactModel[] = await this.list(Collection.FACTS);
		return facts.map(fact => new FactModel(fact));
	}

	async listFavorites() {
		const favorites: FavoritesModel[] = await this.list(Collection.FAVORITES);
		return favorites.map(favorite => new FavoritesModel(favorite));
	}

	async listMessages() {
		const messages: MessageModel[] = await this.list(Collection.MESSAGES);
		return messages.map(message => new MessageModel(message));
	}

	async listPurchases() {
		const purchases: PurchaseModel[] = await this.list(Collection.PURCHASES);
		return purchases.map(purchase => new PurchaseModel(purchase));
	}

	async listSharks() {
		const sharks: SharkModel[] = await this.list(Collection.SHARKS);
		return sharks.map(shark => new SharkModel(shark));
	}

	async listSpecies() {
		const species: SpeciesModel[] = await this.list(Collection.SPECIES);
		return species.map(sharkSpecies => new SpeciesModel(sharkSpecies));
	}

	async listUsers() {
		const users: UserModel[] = await this.list(Collection.USERS);
		return users.map(user => new UserModel({
			...user,
			password: "",
			salt: ""
		}));
	}

	async listWaterLocations() {
		const waterLocations: WaterLocationModel[] = await this.list(Collection.WATER_LOCATIONS);
		return waterLocations.map(waterLocation => new WaterLocationModel(waterLocation));
	}

	async listUserTypes() {
		const userTypes: UserTypeModel[] = await this.list(Collection.USER_TYPES);
		return userTypes.map(userType => new UserTypeModel(userType));
	}

	async listConservationStatuses() {
		const conservationStatuses: ConservationStatusModel[] = await this.list(Collection.CONSERVATION_STATUSES);
		return conservationStatuses.map(conservationStatus => new ConservationStatusModel(conservationStatus));
	}

	async listSharkMovement() {
		const sharkMovement: SharkMovementModel[] = await this.list(Collection.SHARK_MOVEMENT);
		return sharkMovement.map(sharkMovement => new SharkMovementModel(sharkMovement));
	}

	async listVitals() {
		const vitals: VitalModel[] = await this.list(Collection.VITALS);
		return vitals.map(vital => new VitalModel(vital));
	}
	// #endregion

	// #region API Calls
	async login(username: string, password: string) {
		return await this.#fetch("/login", Method.POST, {
			body: JSON.stringify({
				username,
				password
			})
		});
	}

	async logout() {
		return await this.#fetch("/logout", Method.POST);
	}

	async currentUser(): Promise<IUser | null> {
		return await this.#fetch("/currentUser", Method.POST);
	}

	async messageUpdateRead(messageID: number, read: boolean) {
		return await this.#fetch("/messageUpdateRead", Method.POST, {
			body: JSON.stringify({
				messageID: messageID,
				read: read
			})
		});
	}

	async messageUpdateDeleted(messageID: number, deleted: boolean) {
		return await this.#fetch("/messageUpdateDeleted", Method.POST, {
			body: JSON.stringify({
				messageID: messageID,
				deleted: deleted
			})
		});
	}

	async resetPassword(password: string) {
		return await this.#fetch("/resetPassword", Method.POST, {
			body: JSON.stringify({password})
		});
	}

	async postMessage(message: string) {
		return await this.#fetch("/postMessage", Method.POST, {
			body: JSON.stringify({
				message: message
			})
		});
	}

	async createUser(username: string, password: string) {
		return await this.#fetch("/createUser", Method.POST, {
			body: JSON.stringify({
				username: username,
				password: password
			})
		});
	}

	async updateAvatar(avatar: string) {
		return await this.#fetch("/updateAvatar", Method.POST, {
			body: JSON.stringify({
				avatar: avatar
			})
		});
	}

	async updateName(name: string) {
		return await this.#fetch("/updateName", Method.POST, {
			body: JSON.stringify({
				name: name
			})
		});
	}

	async createAdoption(name: string, userID: number, adoptionID: number, sharkID: number) {
		return await this.#fetch("/createAdoption", Method.POST, {
			body: JSON.stringify({
				name: name,
				userID: userID,
				adoptionID: adoptionID,
				sharkID: sharkID
			})
		});
	}

	// #endregion
}

const DataHandlerInstance = Object.freeze(new DataHandler());

export default DataHandlerInstance;
