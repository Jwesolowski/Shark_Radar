import mongoose from "mongoose";

//userSchema to contain google tokens
const userSchema = new mongoose.Schema({
	googleId: String,
	accessToken: String,
	refreshToken: String
});

const User = mongoose.model("User", userSchema);

export default User;
