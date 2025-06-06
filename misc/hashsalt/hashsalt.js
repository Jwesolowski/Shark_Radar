
import crypto from "crypto";
import readline from "readline";
import { MongoClient } from "mongodb";
//import LoginPage from "../../src/components/Pages/Login/LoginPage.jsx";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
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


class AVLNode {
	constructor(username, password, userType, salt) {
		this.username = username;
		this.password = password;
		this.userType = userType;
		this.salt = salt;
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

	insert(username, password, userType, salt) {
		this.root = this.insertNode(this.root, username, password, userType, salt);
	}

	insertNode(node, username, password, userType, salt) {
		if (!node) {
			return new AVLNode(username, password, userType, salt);
		}

		if (username < node.username) {
			node.left = this.insertNode(node.left, username, password, userType, salt);
		} else if (username > node.username) {
			node.right = this.insertNode(node.right, username, password, userType, salt);
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
			console.log("Username:", node.username);
			console.log("Salt:", node.salt);
			console.log("Hashed Password:", node.password);
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
	if (searchResult) {
		console.log("Username found:", searchResult.username);
		console.log("User Type: ", searchResult.userType);
		console.log("Salt:", searchResult.salt);
		console.log("Hashed Password:", searchResult.password);
		const hashedInputPassword = hashPassword(password, searchResult.salt).hashedPassword;
		if (searchResult.password === hashedInputPassword) {
			console.log("Success! Password is correct.");
			return true;
		} else {
			console.log("Failure! Password is incorrect.");
			return false;
		}
	} else {
		console.log("Username not found.");
		return false;
	}
}


async function loadDataFromMongoDB() {
	const db = await dbPromise;
	const usersCollection = db.collection("userData");
	try {
		const users = await usersCollection.find({}).toArray();
		for (const user of users) {
			avlTree.insert(user.UserName, user.Password, user.UserType, user.salt);
		}
		console.log("Data loaded from MongoDB into AVL tree.");
		//avlTree.inOrderTraversal(avlTree.root); // Print AVL tree contents
	} catch (error) {
		console.error("Error loading data from MongoDB:", error);
	}
}


async function addDataToMongoDB(username, password, userType) {
	if (avlTree.searchByUsername(username)) {
		console.log("Username already exists.");
		// eslint-disable-next-line no-useless-return
		return;
	} else {
	// Generate a random salt and hash the password
		const salt = generateSalt(16);
		const hashedPassword = hashPassword(password, salt).hashedPassword;

		// Create a new user object with the provided data
		const newUser = {
			UserName: username,
			Password: hashedPassword,
			UserType: userType,
			salt: salt
		};

		const db = await dbPromise;
		const usersCollection = db.collection("userData");

		try {
		// Insert the new user data into the MongoDB collection
			await usersCollection.insertOne(newUser);
			console.log("Data added to MongoDB.");
		} catch (error) {
			console.error("Error adding data to MongoDB:", error);
		} finally {
			rl.close();
		}

	}
}

async function loginProcess(username, password) {
	try {
		await loadDataFromMongoDB(); // async

	} catch (error) {
		console.error("Error loading");
	}
	const result = avlTree.searchByUsername(username);
	const hashedPassword = hashPassword(password, result.salt);
	if (searchUsername(result.username, hashedPassword)){
		return true;
	} else {
		return false;
	}
}
async function main() {
	const newUser = "newUser";
	const newPassword = "<PASSWORD>";
	const newUserType = "1";
	try {
		await loadDataFromMongoDB();

		/*
		rl.question("Enter your username: ", (username) => {
			rl.question("Enter your password: ", (password) => {
				searchUsername(username, password);
				rl.close();
			});
		});
    */
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

export { avlTree, hashPassword, searchUsername, addDataToMongoDB, loginProcess };


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