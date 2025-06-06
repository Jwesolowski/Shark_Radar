import PropTypes from "prop-types";
import React from "react";
import { IUser } from "../../models/index.ts";
import DataHandlerInstance from "../../utils/DataHandler.ts";
import SecurityManagerInstance from "../../utils/SecurityManager.ts";

const UserContext = React.createContext({
	user: {} as IUser,
	setUser: (user: IUser) => {},
	role: SecurityManagerInstance.UserTypes.NONE as number,
	setRole: (role: number) => {},
	loaded: false
});

function UserContextProvider(props: {
	children: React.ReactNode;
}) {
	const { children } = props;

	const [user, setUser] = React.useState({} as IUser);
	const [role, setRole] = React.useState(SecurityManagerInstance.UserTypes.NONE as number);
	const [loaded, setLoaded] = React.useState(false);

	React.useEffect(() => {
		(async () => {
			const user = await DataHandlerInstance.currentUser();
			if (user) {
				setRole(user.userTypeID ?? SecurityManagerInstance.UserTypes.NONE as number);
				setUser(user);
				setLoaded(true);
			}
		})();
	}, []);

	return (
		<UserContext.Provider value={{ user, role, setUser, setRole, loaded }}>
			{children}
		</UserContext.Provider>
	);
}

UserContextProvider.propTypes = {
	children: PropTypes.node.isRequired
};

export {
	UserContext,
	UserContextProvider
};
