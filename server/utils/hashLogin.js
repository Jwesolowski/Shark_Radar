import crypto from "crypto";
//import readline from "readline";
import { Collection } from "../../src/utils/enums/index.ts";
import { generateID } from "../../src/utils/global.ts";
import SecurityManagerInstance from "../../src/utils/SecurityManager.ts";
import db from "./connect-db.js";


class AVLNode {
	constructor(username, password, userTypeID, salt, userID, avatar, name) {
		this.username = username;
		this.password = password;
		this.userTypeID = userTypeID;
		this.salt = salt;
		this.userID = userID;
		this.avatar = avatar;
		this.name = name;
		this.height = 1; // Initialize height to 1
		this.left = null;
		this.right = null;
	}
}

class AVLTree {
	constructor() {
		this.root = null;
	}

	getHeight(node) {
		return node ? node.height : 0;
	}

	getBalanceFactor(node) {
		return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
	}

	updateHeight(node) {
		if (node) {
			const leftHeight = this.getHeight(node.left);
			const rightHeight = this.getHeight(node.right);
			node.height = Math.max(leftHeight, rightHeight) + 1;
		}
	}

	rotateRight(y) {
		const x = y.left;
		const T2 = x.right;

		x.right = y;
		y.left = T2;

		this.updateHeight(y);
		this.updateHeight(x);

		return x;
	}

	rotateLeft(x) {
		const y = x.right;
		const T2 = y.left;

		y.left = x;
		x.right = T2;

		this.updateHeight(x);
		this.updateHeight(y);

		return y;
	}

	insert(username, password, userTypeID, salt, userID, avatar, name) {
		this.root = this.insertNode(this.root, username, password, userTypeID, salt, userID, avatar, name);
	}

	insertNode(node, username, password, userTypeID, salt, userID, avatar, name) {
		if (!node) {
			return new AVLNode(username, password, userTypeID, salt, userID, avatar, name);
		}

		if (username < node.username) {
			node.left = this.insertNode(node.left, username, password, userTypeID, salt, userID, avatar, name);
		} else if (username > node.username) {
			node.right = this.insertNode(node.right, username, password, userTypeID, salt, userID, avatar, name);
		} else {
			// Duplicate username (handle as needed)
			return node;
		}

		// Update the height of the current node after insertion
		this.updateHeight(node);

		// Calculate the balance factor
		const balanceFactor = this.getBalanceFactor(node);

		// Perform rotations if necessary to rebalanced the tree
		if (balanceFactor > 1) {
			if (username < node.left.username) {
				return this.rotateRight(node);
			} else {
				node.left = this.rotateLeft(node.left);
				return this.rotateRight(node);
			}
		}

		if (balanceFactor < -1) {
			if (username > node.right.username) {
				return this.rotateLeft(node);
			} else {
				node.right = this.rotateRight(node.right);
				return this.rotateLeft(node);
			}
		}

		return node;
	}

	// Search for a node by username
	searchByUsername(username, node = this.root) {
		if (!node) {
			return null; // Username not found
		}

		if (username === node.username) {
			return node; // Username found
		} else if (username < node.username) {
			return this.searchByUsername(username, node.left); // Search in the left subtree
		} else {
			return this.searchByUsername(username, node.right); // Search in the right subtree
		}
	}

	// In-order traversal to print AVL tree contents
	inOrderTraversal(node) {
		if (node) {
			this.inOrderTraversal(node.left); // Traverse left subtree
			this.inOrderTraversal(node.right); // Traverse right subtree
		}

	}

}
// Function to generate a random salt
function generateSalt(length) {
	return crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
}

// Function to hash a password with a salt
function hashPassword(password, salt) {
	const hash = crypto.createHmac("sha512", salt);
	hash.update(password);
	const hashedPassword = hash.digest("hex");
	return {
		salt, hashedPassword
	};
}

const avlTree = new AVLTree();
// Function to load data from MongoDB into AVL tree
function searchUsername(username, password) {
	const searchResult = avlTree.searchByUsername(username);
	if (searchResult !== null) {
		const hashedInputPassword = hashPassword(password, searchResult.salt).hashedPassword;
		if (searchResult.password === hashedInputPassword) {
			return searchResult;
		} else {
			return null;
		}
	} else {
		return null;
	}
}

async function loadDataFromMongoDB() {
	const usersCollection = db.collection(Collection.USERS);
	avlTree.root = null;
	try {
		const users = await usersCollection.find({}).toArray();
		for (const user of users) {
			avlTree.insert(user.username, user.password, user.userTypeID, user.salt, user.userID, user.avatar, user.name);
		}
		//avlTree.inOrderTraversal(avlTree.root); // Print AVL tree contents
	} catch (error) {
		console.error("Error loading data from MongoDB:", error);
	}
}

async function createNewUser(username, password) {
	let newUser;
	await loadDataFromMongoDB();
	if (avlTree.searchByUsername(username)) {
		return null;
	} else {
	// Generate a random salt and hash the password
		const salt = generateSalt(16);
		const hashedPassword = hashPassword(password, salt).hashedPassword;

		// Create a new user object with the provided data
		newUser = {
			username: username,
			password: hashedPassword,
			userTypeID: SecurityManagerInstance.UserTypes.NORMAL,
			salt: salt,
			userID: generateID(),
			avatar: null,
			name: null
		};

		const usersCollection = db.collection(Collection.USERS);

		try {
		// Insert the new user data into the MongoDB collection
			await usersCollection.insertOne(newUser);
		} catch (error) {
			console.error("Error adding data to MongoDB:", error);
		} finally {
			//rl.close();
		}
		avlTree.insert(username, hashedPassword, 1, salt);

	}
	return newUser;
}

async function loginProcess(username, password) {

	try {
		await loadDataFromMongoDB(); // async

	} catch (error) {
		console.error("Error loading");
	}
	const result = searchUsername(username, password);
	if (result !== null) {
		//redirect to the main page
		return result;
	}
	return null;
}

async function resetPassword(username, newPassword) {
	try {
		await loadDataFromMongoDB(); // async
	} catch (error) {
		console.error("Error loading data from servers");
	}
	const result = avlTree.searchByUsername(username);

	if (result !== null) {
		const salt = generateSalt(16);
		const hashedPassword = hashPassword(newPassword, salt);

		result.salt = hashedPassword.salt;
		result.password = hashedPassword.hashedPassword;

		return {
			salt: hashedPassword.salt,
			hashedPassword: hashedPassword.hashedPassword,
			userID: result.userID
		};
	}

	return null;
}

async function startResetPassword(username) {
	try {
		await loadDataFromMongoDB(); // async
	} catch (error) {
		console.error("Error loading data from servers");
	}
	const result = avlTree.searchByUsername(username);
	if (result === null) {
		return false;
	} else {
		return true;
	}
}




export { loginProcess, createNewUser, startResetPassword, resetPassword };

/*
async function main() {
	const newUser = "newUser";
	const newPassword = "<PASSWORD>";
	const newUserType = "1";
	try {
		await loadDataFromMongoDB();


	} catch (error) {
		console.error("An error occurred:", error);
	}
	try {

		await addDataToMongoDB(newUser, newPassword, newUserType);

	} catch (error) {
		console.error("An error occurred:", error);
	}
	searchUsername(newUser, newPassword);
	console.log("\n");
	avlTree.inOrderTraversal(avlTree.root);
}

main();
*/
//export { avlTree, hashPassword, searchUsername, addDataToMongoDB, loginProcess };

/* TESTING USER CREATION AND SEARCHING
  for (let i = 1; i < 1000001; ++i) {
    const username = `User${i}`;
    const password = `Password${i}`;
    const salt = generateSalt(16);
    const hashedData = hashPassword(password, salt);
    avlTree.insert(username, hashedData.hashedPassword, hashedData.salt);
  }

function testS() {
  for (let i = 1; i < 1000001; ++i) {
    const username = `User${i}`;
    const password = `Password${i}`;
    console.log(`${username}`);
    console.time('Search Time'); // Start the timer

    const result = avlTree.searchByUsername(username);

    console.timeEnd('Search Time'); // End the timer and display the time

    if (result) {
      var hashedInputPassword = hashPassword(password, result.salt).hashedPassword;
      if (result.password === hashedInputPassword) {
        console.log("Success! Password is correct.");
        console.log('Height:', avlTree.getHeight(result)); // Print the height
        console.log('Salt:', result.salt);
        console.log('Hashed Password:', result.password);
      } else {
        console.log("Failure! Password is incorrect.");
      }
    } else {
      console.log('Username not found.');
    }
  }
}

testS();
*/
