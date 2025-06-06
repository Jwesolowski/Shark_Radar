import { Request } from "express";
import session from "express-session";
import SecurityManagerInstance from "../../src/utils/SecurityManager.ts";

interface ISessionData extends session.Session {
	user?: {
		username: string | null;
		userID: number | null;
		userTypeID: number;
		avatar: string | null;
		name: string | null;
	};
}

function sessionDefault(req: Request) {
	if (!(req.session as ISessionData).user) {
		(req.session as ISessionData).user = {
			username: null,
			userID: null,
			userTypeID: SecurityManagerInstance.UserTypes.NONE,
			avatar: null,
			name: null
		};
	}
}

export { sessionDefault, ISessionData };
