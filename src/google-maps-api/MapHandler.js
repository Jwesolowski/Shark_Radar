import { Loader } from "@googlemaps/js-api-loader";
import { emitter } from "../components/EventEmitter/eventEmitter.js";
import { SharkMovementModel, WaterLocationModel } from "../models/index.js";
import CacheInstance from "../utils/Cache.js";
import DataHandler from "../utils/DataHandler.js";
import { Assets } from "../utils/enums/index.ts";
import { generateMovement, inside } from "./utils.js";
import "./style.css";

/** @typedef {import("../models/index.js").SharkModel} SharkModel */
/** @typedef {import("../models/index.js").SpeciesModel} SpeciesModel */
/** @typedef {import("../models/index.js").AdoptionModel} AdoptionModel */
/** @typedef {import("../models/index.js").FavoritesModel} FavoritesModel */
/** @typedef {import("../models/index.js").IUser} IUser */

class MapHandler {
	constructor() {
		this.loader = new Loader({
			apiKey: "AIzaSyBCIzc_FMd0ua09-XVij2oaH8LMRiZuE9o",
			version: "weekly",
			libraries: ["maps", "marker"],
			mapIds: ["b19c6d1524be6f5c"]
		});

		this.mapOptions = {
			center: { lat: 35, lng: -100 },
			zoom: 4,
			streetViewControl: false,
			mapId: "b19c6d1524be6f5c"
		};

		this.cache = CacheInstance;

		/** @type {any} */
		this.map = null;

		/** @type {any} */
		this.google = {};

		this.initialized = false;
		this.mapCreated = false;

		/** @type {IUser | null} */
		this.user = null;

		/*
		 * @type {Map<number, this.google.marker>}
		 * Map<sharkID, sharkMarker>
		*/
		this.sharkMarkers = new Map;

		/*
		 * @type {Map<number, Array<this.google.marker>>}
		 * Map<sharkID, List<sharkPathMarkers>>
		*/
		this.pathMarkers = new Map;

		emitter.on("sharkCardClick", this.handleSharkCardClick);
	}

	/**
	 * @param {number} selectedSharkID
	 * @param {boolean} showPath
	 */
	handleSharkCardClick = (selectedSharkID, showPath) => {
		if (selectedSharkID !== null) {
			const sharkMarker = this.sharkMarkers.get(selectedSharkID);
			//hide all shark-path markers
			this.pathMarkers.forEach(markerArray => {
				markerArray.forEach(marker => {
					marker.setMap(null);
				});
			});

			//show all markers for clicked shark
			if (showPath) {
				//change perspective
				this.map.setCenter(sharkMarker.position);
				this.map.setZoom(6);
				this.pathMarkers.get(selectedSharkID).forEach(marker => {
					marker.setMap(this.map); // show markers
				});
			}
		}
	};

	/**
	 * @param {boolean} browserHasGeolocation
	 * @param {any} locationWindow
	 * @param {any} pos
	 */
	#handleLocationError(browserHasGeolocation, locationWindow, pos) {
		locationWindow.setPosition(pos);
		locationWindow.setContent(
			browserHasGeolocation
				? "Error: The Geolocation service failed."
				: "Error: Your browser doesn't support geolocation."
		);
		locationWindow.open(this.map);
	}

	/**
	 * when a water location pin is clicked, toggle the shape under it
	 * @param {any} waterLocationArray
	 * @param {any} markerView
	 */
	#toggleWaterShape(waterLocationArray, markerView) {
		if (markerView.waterLocationVisible === true) {
			waterLocationArray[markerView.location_id].setMap(null);
			markerView.waterLocationVisible = false;
		} else if (markerView.waterLocationVisible === false){
			waterLocationArray[markerView.location_id].setMap(this.map);
			markerView.waterLocationVisible = true;
			//console.log(waterLocationArray[markerView.location_id])
		}
	}

	/**
	 * Renders the current location on the map
	 */
	#renderCurrentLocation() {
		const locationWindow = new this.google.InfoWindow();

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const pos = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					};
					new this.google.Marker({
						position: pos,
						map: this.map,
						title: "Current Location",
						icon: Assets.USER_LOCATION
					});
				},
				() => {
					this.#handleLocationError(true, locationWindow, this.map.getCenter());
				}
			);
		} else {
			// Browser doesn't support Geolocation
			this.#handleLocationError(false, locationWindow, this.map.getCenter());
		}
	}

	/**
	 * Renders the water locations on the map
	 */
	#renderWaterLocations() {
		/** @type {any[]} */
		const waterLocationArray = [];
		const user = this.user;
		this.cache.waterLocations?.forEach((waterLocation, index) => {
			const tempCoords = [];
			/** @type {number[][]} */
			const checkCoords = [];
			let midpointLat = 0;
			let midpointLon = 0;
			const coordinates = waterLocation.coordinates;
			let color = "";
			let locationString = "";
			let icon = "";

			if (!coordinates) {
				return;
			}

			const numCoordinates = coordinates.length;

			// loops through all the coordinates for the current water location
			for (let j = 0; j < numCoordinates; j++) {
				tempCoords[j] = { lat: coordinates[j][0], lng: coordinates[j][1] };
				checkCoords[j] = [coordinates[j][0], coordinates[j][1]];
				midpointLat += coordinates[j][0];
				midpointLon += coordinates[j][1];
			}

			if(waterLocation.locationType === WaterLocationModel.LocationType.PROTECTED) {
				color = "#00FF00";
				locationString = "Protected Area";
				icon = Assets.PIN_PROTECTED;
			} else {
				color = "#FFDB58";
				locationString = "Sanctuary";
				icon = Assets.PIN_SANCTUARY;
			}

			// Construct the protected area
			const newLocation = new this.google.Polygon({
				id: index,
				paths: tempCoords,
				strokeColor: color,
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: color,
				fillOpacity: 0.35
			});

			// checks every shark to see if it is in the current water location
			this.cache.sharkMovement?.forEach((sharkMoves) => {

				if (!sharkMoves.coordinates || !sharkMoves.coordinates[0][0] || !sharkMoves.coordinates[0][1] ) {
					return;
				}

				const sharkPoint = [sharkMoves.coordinates[0][0] , sharkMoves.coordinates[0][1] ];

				if (user && user.userID) {
					if(user.userID === 789789789) {
						if (inside(sharkPoint, checkCoords)) {
							//alert("There is a shark in a protected area!");
							DataHandler.postMessage("There is a shark in a protected area!");
						}
					}
				}
			});

			newLocation.setMap(null);

			// add the protected area to the water location array
			waterLocationArray.push(newLocation);

			const midpointLatLon = new this.google.LatLng(midpointLat / numCoordinates, midpointLon / numCoordinates);

			// make the midpoint markers
			const marker = new this.google.Marker({
				map: this.map,
				location_id: index,
				waterLocationVisible: false,
				position: midpointLatLon,
				title: locationString,
				optimized: true,
				icon: icon
			});

			// when a water location pin is clicked, toggle the shape under it
			marker.addListener("click", () => {
				this.#toggleWaterShape(waterLocationArray, marker);
			});
		});
	}

	/**
	 * Renders the shark locations on the map
	 */
	#renderSharkLocations() {
		const sharkMovementMarkerImage = {
			url: Assets.MOVEMENT_MARKER,
			scaledSize: new this.google.Size(8, 8),
			scale: new this.google.Size(16, 16),
			origin: new this.google.Point(0, 0),
			anchor: new this.google.Point(4, 4)
		};

		const user = this.user;
		let recordExists = false;
		let sharkExists = false;
		let image;
		this.cache.sharks?.forEach(async (shark) => {
			const sharkID = shark.sharkID;

			if (!sharkID) {
				return;
			}

			/** @type {Map<number, SharkMovementModel>} */
			const movement = new Map();

			if (this.cache.sharkMovement) {
				this.cache.sharkMovement.forEach((sharkMovement) => {
					if (sharkMovement.sharkID) {
						movement.set(sharkMovement.sharkID, sharkMovement);
					}
				});
			}

			let sharkMovement = movement.get(sharkID);  // if sharkMovement data does not exists then create new

			if (!sharkMovement && shark.originLat && shark.originLon) {
				const coor = [[shark.originLat, shark.originLon]];
				sharkMovement = new SharkMovementModel({
					sharkID: sharkID,
					coordinates: coor,
					dateTime: [new Date().toISOString()]
				});
				await DataHandler.insertSharkMovement(sharkMovement);
			}

			if (!sharkMovement) {
				return;
			}

			//generate shark movement
			sharkMovement = await generateMovement(sharkMovement);
			//update shark movement in the database
			await DataHandler.updateSharkMovement(sharkMovement); 	//<---- requires action!

			// create marker for most recent location
			if (!sharkMovement.coordinates || !sharkMovement.dateTime) {
				return;
			}

			let adoptedShark = false;
			let adoptedSharkName = null;
			//for each adoption record, check if it has the correct user id,
			//then check if it has the correct shark id
			if (user && user.userID) {
				this.cache.adoptions?.forEach((record) => {
					if(record.userID === user.userID) {
						recordExists = true;
						if (sharkID === record.sharkID) {
							adoptedShark = true;
							sharkExists = true;
							adoptedSharkName = record.name;
						}
					}
				});
			}
			let favoritedShark = false;
			//checking for favorited sharks
			this.cache.favorites?.forEach((record) => {
				if(record.userID === user.userID) {
					if(record.sharkID === shark.sharkID) {
						//favorite pin
						favoritedShark = true;
					}
				}
			});

			const markerPosition = new this.google.LatLng(sharkMovement.coordinates[0][0], sharkMovement.coordinates[0][1]);
			if(adoptedShark) {
				this.map.setCenter(markerPosition);
				//adopted pin
				image = Assets.ADOPTED_SHARK;
			} else if(favoritedShark) {
				image = Assets.FAVORITE_SHARK;
			} else {
				image = Assets.SHARK_PIN;
			}

			const sharkMarker = new this.google.Marker({
				map: this.map,
				position: markerPosition,
				id: shark.sharkID,
				title: new Date(sharkMovement.dateTime[0]).toLocaleString(),
				icon: image,
				zIndex: 3,
				optimized: true
			});

			this.sharkMarkers.set(sharkID, sharkMarker);

			/** @type {any} */
			const sharkPathMarkers = [];

			// display past movements
			for (let m = 1; m < sharkMovement.coordinates.length; m++) {
				// create Marker
				const sharkPathMarker = new this.google.Marker({
					position: new this.google.LatLng(sharkMovement.coordinates[m][0], sharkMovement.coordinates[m][1]),
					icon: sharkMovementMarkerImage,
					title: new Date(sharkMovement.dateTime[m]).toLocaleString(),
					map: null,
					zIndex: 2,
					optimized: true,
					id: shark.sharkID,
					object: shark
				});

				const sharkPathCoordinates = [
					{ lat: sharkMovement.coordinates[m][0], lng: sharkMovement.coordinates[m][1] },
					{ lat: sharkMovement.coordinates[m - 1][0], lng: sharkMovement.coordinates[m - 1][1] }
				];
				const sharkPath = new this.google.Polyline({
					path: sharkPathCoordinates,
					geodesic: true,
					strokeColor: "#035ae6",
					strokeOpacity: 1.0,
					strokeWeight: 2,
					optimized: true
				});
				sharkPath.setMap(null);

				sharkPathMarkers.push(sharkPathMarker, sharkPath);
			}
			this.pathMarkers.set(sharkID, sharkPathMarkers);

			// Toggle visibility of markers
			sharkMarker.addListener("click", () => {
				const show = (sharkPathMarkers[0].getMap() === null);

				//hide all shark-path markers
				this.pathMarkers.forEach(markerArray => {
					markerArray.forEach(marker => {
						marker.setMap(null);
					});
				});

				if (show) {
					//change perspective
					this.map.setCenter(markerPosition);
					this.map.setZoom(6);
					//show all markers for clicked shark
					sharkPathMarkers.forEach(marker => {
						marker.setMap(this.map); // show markers
					});
				}
				this.cache.selectedSharkID = show ? sharkID : null;
				emitter.emit("sharkPinClick", sharkID, show);
			});
		});

		if(recordExists && !sharkExists) {
			//this will be replaced with an inbox notification
			//alert("Your adopted shark unfortunately passed away");
			DataHandler.postMessage("Your adopted shark unfortunately passed away");
		}
	}

	/**
	 * Loads the libraries needed for the map
	 */
	async #loadLibraries() {
		const [mapsLibrary, markerLibrary, coreLibrary] = await Promise.all([
			this.loader.importLibrary("maps"),
			this.loader.importLibrary("marker"),
			this.loader.importLibrary("core")
		]);

		this.google = {
			...mapsLibrary,
			...markerLibrary,
			...coreLibrary
		};
	}

	/**
	 * Adds the map to the page and renders its components
	 * @param {HTMLElement} root
	 */
	createMap(root) {
		if (this.initialized && !this.mapCreated) {
			this.map = new this.google.Map(root, this.mapOptions);

			this.#renderCurrentLocation();
			this.#renderSharkLocations();
			this.#renderWaterLocations();

			this.mapCreated = true;
		}
	}

	async loadComponents() {
		await this.#loadLibraries();

		this,this.initialized = true;
	}
}

export default MapHandler;
