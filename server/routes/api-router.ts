import express from "express";
import { Strings, Collection, StatusCode } from "../../src/utils/enums/index.ts";
import { modelMap } from "../../src/utils/global.ts";
import apiHandler from "../utils/ApiHandler.ts";
import { loginProcess } from "../utils/hashLogin.js";
import { ISessionData } from "../utils/session-default.ts";

const apiRouter = express.Router();

apiRouter.get("/list/*", (req, res) => {
	const path = req.path.split("/")[2];
	const model = modelMap(path);

	const user = apiHandler.getCurrentUser(req);

	if (model?.collection === Collection.MESSAGES && user) {
		req.body.userID = user.userID;
	}

	if (model) {
		apiHandler.validateAndList(req, res, model);
	} else {
		res.status(StatusCode.NOT_FOUND).json({
			error: Strings.INVALID_ENDPOINT
		});
	}
});

apiRouter.put("/insert/*", (req, res) => {
	const path = req.path.split("/")[2];
	const model = modelMap(path);

	if (model && req.session && (req.session as ISessionData).user) {
		apiHandler.validateAndInsert(req, res, model);
	} else {
		res.status(StatusCode.NOT_FOUND).json({
			error: Strings.INVALID_ENDPOINT
		});
	}
});

apiRouter.post("/update/*", (req, res) => {
	const path = req.path.split("/")[2];
	const model = modelMap(path);

	if (model && req.session && (req.session as ISessionData).user) {
		apiHandler.validateAndUpdate(req, res, model);
	} else {
		res.status(StatusCode.NOT_FOUND).json({
			error: Strings.INVALID_ENDPOINT
		});
	}
});

apiRouter.delete("/delete/*/:id", (req, res) => {
	const path = req.path.split("/")[2];
	const { id } = req.params;
	const model = modelMap(path);

	if (model && req.session && (req.session as ISessionData).user) {
		apiHandler.validateAndDelete(req, res, model, id);
	} else {
		res.status(StatusCode.NOT_FOUND).json({
			error: Strings.INVALID_ENDPOINT
		});
	}
});

apiRouter.post("/currentUser", (req, res) => {
	const user = apiHandler.getCurrentUser(req);

	res.json(user);
});

apiRouter.post("/messageUpdateRead", (req, res) => {
	apiHandler.messageUpdateRead(req.body.messageID, req.body.read);
	res.json({ success: true });
});

apiRouter.post("/messageUpdateDeleted", (req, res) => {
	apiHandler.messageUpdateDeleted(req.body.messageID, req.body.deleted);
	res.json({ success: true });
});

apiRouter.post("/postMessage", (req, res) => {
	apiHandler.postMessage(req);
	res.json({ success: true });
});

apiRouter.post("/login", async (req, res) => {
	const { username, password } = req.body;

	const attemptLogin = await loginProcess(username, password);

	if (attemptLogin) {
		if (!req.session || !(req.session as ISessionData).user) {
			throw new Error("Session not found");
		}

		(req.session as ISessionData).user!.username = attemptLogin.username;
		(req.session as ISessionData).user!.userID = attemptLogin.userID;
		(req.session as ISessionData).user!.userTypeID = attemptLogin.userTypeID;
		(req.session as ISessionData).user!.avatar = attemptLogin.avatar;
		(req.session as ISessionData).user!.name = attemptLogin.name;
	}

	res.status(StatusCode.OK).json({ result: attemptLogin });
});

apiRouter.post("/logout", (req, res) => {
	if (!req.session || !(req.session as ISessionData).user) {
		throw new Error("Session not found");
	}

	(req.session as ISessionData).user!.username = null;
	(req.session as ISessionData).user!.userID = null;
	(req.session as ISessionData).user!.userTypeID = 0;

	res.status(StatusCode.OK).json({ result: true });
});

apiRouter.post("/createUser", async (req, res) => {
	const result = await apiHandler.createUser(req);

	res.status(StatusCode.OK).json({ result: result });
});

apiRouter.post("/resetPassword", async (req, res) => {
	const result = await apiHandler.resetPassword(req);

	if (result) {
		res.json({ success: true });
	} else {
		res.json({ error: true });
	}
});

apiRouter.post("/updateAvatar", async (req, res) => {
	const result = await apiHandler.updateAvatar(req);

	if (result) {
		if (req.session && (req.session as ISessionData).user) {
			(req.session as ISessionData).user!.avatar = req.body.avatar;
		}

		res.json({ success: true });
	} else {
		res.json({ error: true });
	}
});

apiRouter.post("/updateName", async (req, res) => {
	const result = await apiHandler.updateName(req);

	if (result) {
		if (req.session && (req.session as ISessionData).user) {
			(req.session as ISessionData).user!.name = req.body.name;
		}

		res.json({ success: true });
	} else {
		res.json({ error: true });
	}
});

apiRouter.post("/createAdoption", async (req, res) => {
	const result = await apiHandler.createAdoption(req);

	res.status(StatusCode.OK).json({ result: result });
});

apiRouter.use("*", (req, res) => {
	res.status(StatusCode.NOT_FOUND).json({
		error: Strings.INVALID_ENDPOINT
	});
});

apiRouter.post("/sharkSelected/*/:id", (req, res) => {
	const path = req.path.split("/")[2];
	const { id } = req.params;
	//apiHandler.sharkSelected(res, req, id);

	res.send(id);
});

export default apiRouter;
