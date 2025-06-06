// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import express from "express";
import db from "../../server/utils/connect-db.js";
import { Collection } from "./enums/index.js";
//import { filterListBySpeciesAPI } from "../../src/components/Pages/Home/HomeDrawer.jsx";
// Import necessary modules and functions

class Node {
	constructor(sharkID, speed, active, size, weight, gender, dateOfBirth, speciesID) {
		this.sharkID = sharkID;
		this.speed = speed;
		this.active = active;
		this.size = size;
		this.weight = weight;
		this.gender = gender;
		this.dateOfBirth = dateOfBirth;
		this.speciesID = speciesID;
		this.head = null;
		this.next = null; // Next pointer
		this.prev = null; // Previous pointer
	}
}
class nodeSpecies {
	constructor(speciesID, cID) {
		this.speciesID = speciesID;
		this.conservationStatusID = cID;
		this.head = null;
		this.next = null; // Next pointer
		this.prev = null; // Previous pointer
	}
}
class nodeStatus {
	constructor(code, numID) {
		this.code = code;
		this.conservationStatusID = numID;
		this.head = null;
		this.next = null; // Next pointer
		this.prev = null; // Previous pointer
	}
}

class dLLStatus {
	constructor() {
		this.head = null;
	}
	insert(root, code, numID) {
		this.head = this.insertNode(code, numID);
	}
	insertNode(code, numID) {
		const newNode = new nodeStatus(code, numID);

		if (!this.head) {
			this.head = newNode;
			return this.head;
		}

		let current = this.head;
		let prev = null;

		while (current !== null) {
			prev = current;
			current = current.next;
		}

		newNode.next = current;
		newNode.prev = prev;

		if (prev !== null) {
			prev.next = newNode;
		} else {
			this.head = newNode; // Update the head if the new node is inserted at the beginning
		}

		if (current !== null) {
			current.prev = newNode;
		}

		return this.head;
	}
	length() {
		let i = 0;
		let current = this.head;
		while (current !== null) {
			++i;
			current = current.next;
		}
		return i;
	}
}

class dLLSpecies {
	constructor() {
		this.head = null;
	}
	insert(root, speciesID, cID) {
		this.head = this.insertNode(speciesID, cID);
	}
	insertNode(speciesID, cID) {
		const newNode = new nodeSpecies(speciesID, cID);

		if (!this.head) {
			this.head = newNode;
			return this.head;
		}

		let current = this.head;
		let prev = null;

		while (current !== null) {
			prev = current;
			current = current.next;
		}

		newNode.next = current;
		newNode.prev = prev;

		if (prev !== null) {
			prev.next = newNode;
		} else {
			this.head = newNode; // Update the head if the new node is inserted at the beginning
		}

		if (current !== null) {
			current.prev = newNode;
		}

		return this.head;
	}
	length() {
		let i = 0;
		let current = this.head;
		while (current !== null) {
			++i;
			current = current.next;
		}
		return i;

	}

}

class dLinkedList {
	constructor() {
		this.head = null;
	}
	insert(root, sharkID, speed, active, size, weight, gender, dateOfBirth, speciesID) {
		this.head = this.insertNode(sharkID, speed, active, size, weight, gender, dateOfBirth, speciesID);
	}
	insertNode(sharkID, speed, active, size, weight, gender, dateOfBirth, speciesID) {
		const newNode = new Node(sharkID, speed, active, size, weight, gender, dateOfBirth, speciesID);

		if (!this.head) {
			this.head = newNode;
			return this.head;
		}

		let current = this.head;
		let prev = null;

		while (current !== null) {
			prev = current;
			current = current.next;
		}

		newNode.next = current;
		newNode.prev = prev;

		if (prev !== null) {
			prev.next = newNode;
		} else {
			this.head = newNode; // Update the head if the new node is inserted at the beginning
		}

		if (current !== null) {
			current.prev = newNode;
		}

		return this.head;
	}
	length() {
		let i = 0;
		let current = this.head;
		while (current !== null) {
			++i;
			current = current.next;
		}
		return i;
	}
}

let linkedList = new dLinkedList();
const linkedSpecies = new dLLSpecies();
const linkedStatus = new dLLStatus();
const linkedCombine = new dLinkedList();
const filteredSpecies = new dLLSpecies();
/**
 * Splits the linked list into two halves.
 * @param {Node} head - The head of the linked list.
 * @returns {Node} - The head of the second half of the linked list.
 */
function split(head) {
	let fast = head,
		slow = head;
	while (fast.next !== null && fast.next.next !== null) {
		fast = fast.next.next;
		slow = slow.next;
	}
	const temp = slow.next;
	slow.next = null;
	temp.prev = null; // Set the previous pointer to null for the new sub list
	return temp;
}

/**
 * Merges two sorted linked lists.
 * @param {Node} first - The head of the first linked list.
 * @param {Node} second - The head of the second linked list.
 * @param {Function} compareFn - The comparison function.
 * @returns {Node} - The head of the merged linked list.
 */
function merge(first, second, compareFn) {
	if (first === null) {
		return second;
	}

	if (second === null) {
		return first;
	}

	if (compareFn(first, second) <= 0) {
		first.next = merge(first.next, second, compareFn);
		first.next.prev = first;
		first.prev = null; // Set the previous pointer to null
		return first;
	} else {
		second.next = merge(first, second.next, compareFn);
		second.next.prev = second;
		second.prev = null; // Set the previous pointer to null
		return second;
	}
}
/**
 * Performs merge sort on a linked list.
 * @param {Node} node - The head of the linked list.
 * @param {Function} compareFn - The comparison function.
 * @returns {Node} - The head of the sorted linked list.
 */
function mergeSort(node, compareFn) {
	if (node === null || node.next === null) {
		return node;
	}
	let first = node;
	let second = split(node);

	first = mergeSort(node, compareFn);
	second = mergeSort(second, compareFn);

	return merge(first, second, compareFn);
}
/**
 * Compares two objects based on a specified property.
 * @param {Object} a - The first object.
 * @param {Object} b - The second object.
 * @param {string} property - The property to compare.
 * @returns {number} - The result of the comparison.
 */
function compareByProperty(a, b, property) {
	if (property === "dateOfBirth" || typeof a[property] === "string") {
		// If the property is "dateOfBirth" or a string property, handle the comparison accordingly
		const valueA = typeof a[property] === "string" ? a[property].toLowerCase() : new Date(a[property]).getTime();
		const valueB = typeof b[property] === "string" ? b[property].toLowerCase() : new Date(b[property]).getTime();
		return valueA.localeCompare(valueB);
	} else {
		// For numeric properties, use the standard numeric comparison
		return a[property] - b[property];
	}
}

/**
 * Loads shark data from MongoDB into the linked list.
 */
async function loadDataFromMongoDB() {
	const sharkCollection = db.collection(Collection.SHARKS);
	try {
		const sharks = await sharkCollection.find({}).toArray();
		for (const shark of sharks) {
			const newNode = new Node(shark.sharkID, shark.speed, shark.active, shark.size, shark.weight, shark.gender, shark.dateOfBirth, shark.speciesID);
			linkedList.insert(newNode);
		}
		console.log("Data loaded from MongoDB into nodes array.");
	} catch (error) {
		console.error("Error loading data from MongoDB:", error);
	}
}

/**
 * Sorts the linked list based on the specified property.
 * @param {string} choice - The property to use for sorting.
 */
async function sortListByChoice(choice) {
	try {
		await loadDataFromMongoDB();

		if (choice) {
			const compareFn = (a, b) => compareByProperty(a, b, choice);
			linkedList = mergeSort(linkedList, compareFn);
			console.log(`Linked list after sorting by ${choice}:`);
		} else {
			console.log("Invalid choice!");
		}
	} catch(error) {
		console.log(error);
	}
}
/**
 * Loads species data from MongoDB into the linked list.
 */
async function loadSpecies() {
	const speciesC = db.collection(Collection.SPECIES);
	try {
		const species = await speciesC.find({}).toArray();
		for (const speci of species) {
			const newNode = new nodeSpecies(speci.name, speci.sID);
			linkedSpecies.insert(newNode);
		}
		console.log("Data loaded from MongoDB into nodes array.");
	} catch (error) {
		console.error("Error loading data from MongoDB:", error);
	}
}

/**
 * Loads conservation status data from MongoDB into the linked list.
 */
async function loadStatus() {
	const statusC = db.collection(Collection.SPECIES);
	try {
		const status = await statusC.find({}).toArray();
		let prevNode = null;
		for (const stati of status) {
			const newNode = new nodeSpecies(stati.code, stati.conservationStatusID);

			// Set the next and previous pointers
			newNode.prev = prevNode;
			if (prevNode !== null) {
				prevNode.next = newNode;
			}

			// Update the previous node
			prevNode = newNode;

			linkedStatus.insert(newNode);
		}
		console.log("Data loaded from MongoDB into nodes array.");
	} catch (error) {
		console.error("Error loading data from MongoDB:", error);
	}
}
/**
 * Fetches species data based on the provided conservation status ID.
 * @param {string} statusID - The conservation status ID.
 */
async function fetchStatus(statusID) {
	try {
		await loadSpecies();
		let currentSpecies = linkedSpecies.head;
		while (currentSpecies !== null) {
			for (let i = 0; i < currentSpecies.length; ++i)
				if (currentSpecies.cID === statusID) {
					const newNode = new nodeSpecies(currentSpecies.speciesID, currentSpecies.cID);
					// Set the next and previous pointers
					filteredSpecies.insert(newNode);
				}
			currentSpecies = currentSpecies.next;

		}
	} catch (err) {
		console.log ("Error loading status", err);
	}

}
/**
 * Filters the linked list by species using the provided status species.
 * @param {Object} statusSpecies - The status species object.
 * @returns {dLinkedList} - The filtered linked list.
 */
async function filterListBySpeciesAPI(statusSpecies) {
	try {
		await loadDataFromMongoDB();
		await fetchStatus(statusSpecies);
		let currentShark = linkedList.head;
		let currentSpecies = filteredSpecies.head;
		let prevNode = null;
		let i = 0;
		let confirm = false;
		while (confirm === false) {
			if (currentShark.speciesID === statusSpecies.speciesID) {
				const newNode = new Node(
					currentShark.sharkID,
					currentShark.speed,
					currentShark.active,
					currentShark.size,
					currentShark.weight,
					currentShark.gender,
					currentShark.dateOfBirth,
					currentShark.speciesID);
				// Set the next and previous pointers
				newNode.prev = prevNode;
				if (prevNode !== null) {
					prevNode.next = newNode;
				}

				// Update the previous node
				prevNode = newNode;

				linkedCombine.insert(newNode);
				currentShark = currentShark.next;
				++i;
			} else if (currentSpecies !== null) {
				currentSpecies = currentSpecies.next;
			} else {
				currentSpecies = filteredSpecies.head;
				currentShark = currentShark.next;
				++i;
			}
		}
		if (i === currentShark.length()) {
			confirm = true;
		}
	} catch (error) {
		console.log("Error loading data from MongoDB:", error);
		return null;
	}
	return linkedCombine;
}

const ans = await sortListByChoice("EX");
console.log(ans);



const app = express();
const port = 3001;

// Define API endpoint for filtering
app.get("/api/filterBySpecies/:speciesChoice", async (req, res) => {
	const speciesChoice = req.params.speciesChoice;
	const filteredList = await filterListBySpeciesAPI(speciesChoice);
	res.json(filteredList);
});

// Start the server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});



export { sortListByChoice, filterListBySpeciesAPI };

