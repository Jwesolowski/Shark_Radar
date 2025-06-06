import express from "express";
import session from "express-session";
import { StatusCode } from "../src/utils/enums/index.ts";
import SecurityManagerInstance from "../src/utils/SecurityManager.ts";
import apiRouter from "./routes/api-router.js";
import { port, sessionSecret } from "./utils/load-env.js";
import { sessionDefault, ISessionData } from "./utils/session-default.ts";

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(session({
	secret: sessionSecret,
	resave: false,
	saveUninitialized: false
}));

// Routers
app.use("/api", apiRouter);

app.get("/auth/google/callback", (req, res) => {
	console.log("Google callback...");
	res.status(StatusCode.OK).sendFile("index.html", { root: "public" });
});

const pages = Object.values(SecurityManagerInstance.Routes);

// Status 200
app.get(pages, (req, res) => {
	sessionDefault(req);

	if (
		(req.session as ISessionData).user!.userTypeID !== undefined &&
		SecurityManagerInstance.hasPermission(req.path, (req.session as ISessionData).user!.userTypeID)
	) {
		res.status(StatusCode.OK).sendFile("index.html", { root: "public" });
	} else {
		res.redirect(SecurityManagerInstance.Routes.INDEX);
	}
});

// Status 400
app.get(SecurityManagerInstance.Routes.NOT_FOUND, (req, res) => {
	res.status(StatusCode.NOT_FOUND).sendFile("index.html", { root: "public" });
});

// All other status codes
app.get(SecurityManagerInstance.Routes.ALL, (req, res) => {
	res.status(StatusCode.NOT_FOUND).sendFile("index.html", { root: "public" });
});

app.listen(port, () => {
	console.log(`[${new Date().toLocaleTimeString()}] Server started on port ${port}`);
});
