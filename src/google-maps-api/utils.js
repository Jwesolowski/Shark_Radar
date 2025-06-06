/** @typedef {import("../models/index.js").SharkMovementModel} SharkMovementModel */

/**
 * Checks if a point is inside a polygon
 * @param {number[]} point
 * @param {number[][]} vs
 */
function inside(point, vs) {
	// ray-casting algorithm based on
	// https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html

	const x = point[0], y = point[1];

	let inside = false;
	for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
		const xi = vs[i][0], yi = vs[i][1];
		const xj = vs[j][0], yj = vs[j][1];

		const intersect = ((yi > y) !== (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		if (intersect) inside = !inside;
	}

	return inside;
}

/**
 * Checks if a point is on water
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<boolean>}
 */
function isCoordinatesOnWater(lat, lon) {
	return new Promise((resolve, reject) => {
		let mapUrl = "http://maps.googleapis.com/maps/api/staticmap?center=" + lat + "," + lon +
			"&zoom=14&size=20x20&maptype=roadmap&markers=color:red%7C$xGps,$yGps&sensor=false";
		mapUrl += "";

		const img = document.createElement("img");
		img.id = "mapImg";	// Bypass the security issue : drawing a canvas from an external URL.
		img.crossOrigin = "anonymous";
		img.src = mapUrl;
		img.onload = function () {
			const canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
			const pixelData = canvas.getContext("2d").getImageData(1, 1, 1, 1).data;
			if (pixelData[0] === 156 &&
				pixelData[1] === 192 &&
				pixelData[2] === 249) {
				resolve(true);
			} else {
				resolve(false);
			}
		};
	});
}

/**
 * Generates a random distance between 0 and 0.5
 * @returns {number}
 */
function getRandomDistance() {
	//random * (range + 1) + min
	const num = Math.random() / 2;
	return num;
}

/**
 * @param {number[][]} coordinates
 * @param {number} days
 * @returns {Promise<number[]>}
 */
async function addRandomizedDistanceToCoordinates(coordinates, days) {
	const lat = coordinates[0][0];
	const lon = coordinates[0][1];
	let newLat, newLon;
	let tries = 0;
	do {
		tries++;
		const randomLatDist = getRandomDistance();
		const randomLonDist = getRandomDistance();
		let latDirection = 1;
		let lonDirection = 1;
		//creates a steady path of travel (less unrelistic backtracking)
		if (coordinates.length > 1) {
			const prevLat = coordinates[1][0];
			const prevLon = coordinates[1][1];
			latDirection = ((lat - prevLat) >= 0) ? 1 : -1;
			lonDirection = ((lon - prevLon) >= 0) ? 1 : -1;
		}
		//25% chance of turning left, 25% chance of turning right
		//if hit land, turn. 50% chance either way
		const turnDirection = Math.random() / (tries > 1 ? 2 : 1);
		if (turnDirection < 0.125) {
			latDirection = latDirection * -1;
		} else if (turnDirection < 0.25) {
			lonDirection = lonDirection * -1;
		}
		//adds generated distance to previus coordinates to create new coord
		newLat = lat + (randomLatDist * days * latDirection);
		newLon = lon + (randomLonDist * days * lonDirection);
		//check if coordinates are on water, if not: restart
	} while (!await isCoordinatesOnWater(newLat, newLon) || !await isCoordinatesOnWater((lat + newLat) / 2, (lon + newLon) / 2));

	return [newLat, newLon];
}

/**
 * Generates a random movement for a shark
 * @param {SharkMovementModel} sharkMovement
 * @returns {Promise<SharkMovementModel>}
 */
async function generateMovement(sharkMovement) {
	const currDate = new Date();
	let exit = false;
	while (!exit) {
		const dateTime = sharkMovement.dateTime;
		const coordinates = sharkMovement.coordinates;

		if (!dateTime || !coordinates) {
			throw new Error("SharkMovementModel is missing dateTime or coordinates");
		}

		const milSecInDay = 86400000;
		const oldDate = new Date(dateTime[0]);
		const changeInDays =  (currDate.getTime() - oldDate.getTime()) / milSecInDay;
		//If less than a day has passed since the previous pin: exit
		if (changeInDays >= 1) {
			// Generate a random number of milliseconds between 1 and 7 days
			//random * (range + 1) + min
			let randomMilliseconds = Math.random() * (7 * milSecInDay) + (Number(milSecInDay));
			//50% chance of ping same day as previous
			const sameDay = Math.random() < 0.5;
			if (sameDay) {
				randomMilliseconds = randomMilliseconds % milSecInDay;
			}
			// Add random datetime to input date
			const newDate = new Date(oldDate.getTime() + randomMilliseconds);
			//if new ping does not occur on current date continue otherwise stop
			if ((newDate.getTime() / milSecInDay) < (currDate.getTime() / milSecInDay)) {
				dateTime.unshift(newDate.toLocaleString());
				//generate coordinates
				const [newLat, newLon] = await addRandomizedDistanceToCoordinates(coordinates, randomMilliseconds / milSecInDay);
				coordinates.unshift([newLat, newLon]);
			} else {
				exit = true;
			}
		} else {
			exit = true;
		}
	}
	return sharkMovement;
}

/**
 * @param {HTMLElement} parent
 * @param {string} type
 * @param {string} className
 * @param {string} [textContent]
 * @returns {HTMLElement}
 */
const createElement = (parent, type, className, textContent) => {
	const element = document.createElement(type);
	parent.appendChild(element);
	element.className = className;

	if (textContent) {
		element.textContent = textContent;
	}

	return element;
};

export {
	inside,
	generateMovement,
	createElement
};
