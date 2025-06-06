import { MongoClient } from "mongodb";

const mongoURI = "mongodb+srv://TestUser:TestUserPassword@sharkradar.sndkscc.mongodb.net/?retryWrites=true&w=majority";
const dbName = "sharkRadar";

// Define a promise to establish a connection to MongoDB
// eslint-disable-next-line no-async-promise-executor
const dbPromise = new Promise(async (resolve, reject) => {
	try {
		const client = new MongoClient(mongoURI, {});
		await client.connect();
		console.log("Connected to MongoDB");
		const db = client.db(dbName);
		resolve(db);
	} catch (error) {
		reject(error);
	}
});

class Node {
	constructor(sharkID, species, age, originLat, originLon, sharkGender) {
		this.sharkID = sharkID;
		this.species = species;
		this.age = age;
		this.originLat = originLat;
		this.originLon = originLon;
		this.sharkGender = sharkGender;
		this.next = null; // Next pointer
		this.prev = null; // Previous pointer
	}
}

const nodes = [];
let head;

function print(head) {
	console.log("Forward Traversal using next pointer");
	let node = head;
	while (node !== null) {
		console.log(`SharkID: ${node.sharkID}, Species: ${node.species}, Age: ${node.age}`);
		node = node.next;
	}
	console.log("\n");
	/*
	console.log("Backward Traversal using prev pointer");
	node = nodes[nodes.length - 2]; // Start from the last node
	while (node !== null) {
		console.log(`SharkID: ${node.sharkID}, Species: ${node.species}, Age: ${node.age}`);
		node = node.prev;
	}
	*/
}

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
function mergeSort(node, compareFn) {
	if (node === null || node.next === null) {
		return node;
	}
	let second = split(node);

	node = mergeSort(node, compareFn);
	second = mergeSort(second, compareFn);

	return merge(node, second, compareFn);
}

function compareByProperty(a, b, property) {
	if (property === "age") {
		const dateA = new Date(a.age).getTime();
		const dateB = new Date(b.age).getTime();
		return dateA - dateB;
	} else {
		return a[property] - b[property];
	}
}


function sortListByChoice(choice) {
	let property;
	if (choice === 1) {
		property = "age";
	} else if (choice === 2) {
		property = "species";
	}

	if (property) {
		const compareFn = (a, b) => compareByProperty(a, b, property);
		head = mergeSort(head, compareFn);
		console.log(`Linked list after sorting by ${property}:`);
		print(head); // Print the entire sorted list
	} else {
		console.log("Invalid choice!");
	}
}



async function loadDataFromMongoDB() {
	const db = await dbPromise;
	const sharkCollection = db.collection("shark");
	try {
		const sharks = await sharkCollection.find({}).toArray();
		let prevNode = null;
		for (const shark of sharks) {
			const newNode = new Node(shark.sharkID, shark.species, shark.age, shark.originLat, shark.originLon, shark.sharkGender);

			// Set the next and previous pointers
			newNode.prev = prevNode;
			if (prevNode !== null) {
				prevNode.next = newNode;
			}

			// Update the previous node
			prevNode = newNode;

			// Set the head to the first node if it's not set
			if (!head) {
				head = newNode;
			}

			nodes.push(newNode);
		}
		console.log("Data loaded from MongoDB into nodes array.");
	} catch (error) {
		console.error("Error loading data from MongoDB:", error);
	}
}


function filterListBySpecies(head, speciesChoice) {
	let current = head;
	let filteredHead = null;
	let filteredTail = null;

	while (current !== null) {
		if (current.species === speciesChoice) {
			const newNode = new Node(current.sharkID, current.species, current.age, current.originLat, current.originLon);
			if (filteredHead === null) {
				filteredHead = newNode;
				filteredTail = newNode;
			} else {
				filteredTail.next = newNode;
				newNode.prev = filteredTail;
				filteredTail = newNode;
			}
		}
		current = current.next;
	}

	return filteredHead;
}


async function main() {
	await loadDataFromMongoDB(); // Make sure data is loaded before sorting or printing
	console.log("sorting by age");
	sortListByChoice(1);
	console.log("\n");
	console.log("sorting by species");
	sortListByChoice(2);
	const filteredHead = filterListBySpecies(head, 3);
	print(filteredHead);
}


/*
console.log(
	"Sort by:\n1. Age\n2. Species\nEnter the number of your choice:"
);
*/
main();
