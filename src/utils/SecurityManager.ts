const Routes = Object.freeze({
	INDEX: "/",
	ABOUT: "/about",
	ADOPT: "/adopt",
	LOGIN: "/login",
	DATA_MANAGER: "/data-manager",
	SECRET: "/secret",
	PROFILE: "/profile",
	NOT_FOUND: "/404",
	ALL: "*",
	SIGN_UP: "/sign-up",
	MESSAGES: "/messages",
	LOGOUT: "/logout",
	AUTH: "/auth/google/callback"
});

const UserType = Object.freeze({
	NONE: 0,
	NORMAL: 1,
	COAST_GUARD: 2,
	ADMIN: 3,
	RESEARCHER: 4,
	RESCUER: 5
});

type UserTypeType = typeof UserType[keyof typeof UserType];

const AllUserTypes = [UserType.NONE, UserType.NORMAL, UserType.COAST_GUARD, UserType.ADMIN, UserType.RESEARCHER, UserType.RESCUER];

function exclude(array: UserTypeType[], ...excluded: UserTypeType[]) {
	return array.filter(item => !excluded.includes(item));
}

const permissions: [string, UserTypeType[]][] = [
	[Routes.INDEX, AllUserTypes],
	[Routes.ABOUT, AllUserTypes],
	[Routes.ADOPT, AllUserTypes],
	[Routes.LOGIN, [UserType.NONE, UserType.ADMIN]],
	[Routes.LOGOUT, exclude(AllUserTypes, UserType.NONE)],
	[Routes.DATA_MANAGER, [UserType.ADMIN]],
	[Routes.SECRET, AllUserTypes],
	[Routes.PROFILE, exclude(AllUserTypes, UserType.NONE)],
	["change_role", [UserType.ADMIN]],
	["shark_edit", [UserType.ADMIN, UserType.RESCUER, UserType.RESEARCHER, UserType.COAST_GUARD]],
	["shark_delete", [UserType.ADMIN]],
	[Routes.NOT_FOUND, AllUserTypes],
	[Routes.ALL, AllUserTypes],
	[Routes.SIGN_UP, [UserType.NONE, UserType.ADMIN]],
	[Routes.MESSAGES, exclude(AllUserTypes, UserType.NONE)],
	[Routes.AUTH, [UserType.NONE]]
];

class SecurityManager {
	Routes = Routes;
	UserTypes = UserType;
	Permissions = permissions;

	hasPermission(permissionName: string, role: number | null) {
		const currentRole = role ?? UserType.NONE;

		const userPermissions = this.Permissions.find(permission => permission[0] === permissionName);

		if (!userPermissions) {
			return false;
		}

		const validUserPermissions = userPermissions[1];
		return validUserPermissions.includes(currentRole as never);
	}
}

const SecurityManagerInstance = Object.freeze(new SecurityManager());

export default SecurityManagerInstance;
