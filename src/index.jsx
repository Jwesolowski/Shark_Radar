import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App.jsx";
import { CacheContextProvider } from "./components/Contexts/CacheContext.jsx";
import { UserContextProvider } from "./components/Contexts/UserContext.jsx";
import Status404Page from "./components/Pages/404.jsx";
import AboutPage from "./components/Pages/AboutPage.jsx";
import AdoptPage from "./components/Pages/Adopt/AdoptPage.jsx";
import DataManagerPage from "./components/Pages/DataManager/DataManagerPage.jsx";
import HomePage from "./components/Pages/Home/HomePage.jsx";
import LoginPage from "./components/Pages/LoginPage.jsx";
import LogoutPage from "./components/Pages/LogoutPage.jsx";
import MessagePage from "./components/Pages/Messages/MessagesPage.jsx";
import ProfilePage from "./components/Pages/Profile/ProfilePage.jsx";
import SecretPage from "./components/Pages/SecretPage.jsx";
import SignUpPage from "./components/Pages/SignUpPage.jsx";
import PageRoute from "./utils/PageRoute.js";
import SecurityManagerInstance from "./utils/SecurityManager.ts";
import GoogleAuthPage from "./components/Pages/GoogleAuthPage.tsx";

const Route = SecurityManagerInstance.Routes;

const tabs = ["Radar", "Adopt", "About", "Data"];

const routes = [
	new PageRoute(Route.INDEX, "Radar", HomePage, true),
	new PageRoute(Route.ADOPT, "Adopt", AdoptPage),
	new PageRoute(Route.ABOUT, "About", AboutPage),
	new PageRoute(Route.LOGIN, "Login", LoginPage),
	new PageRoute(Route.PROFILE, "Profile", ProfilePage),
	new PageRoute(Route.DATA_MANAGER, "Data", DataManagerPage),
	new PageRoute(Route.SECRET, "Secret", SecretPage),
	new PageRoute(Route.PROFILE, "Profile", ProfilePage),
	new PageRoute(Route.ALL, "404", Status404Page),
	new PageRoute(Route.NOT_FOUND, "404", Status404Page),
	new PageRoute(Route.SIGN_UP, "Sign Up", SignUpPage),
	new PageRoute(Route.MESSAGES, "Messages", MessagePage),
	new PageRoute(Route.LOGOUT, "Logout", LogoutPage),
	new PageRoute(Route.AUTH, "Auth", GoogleAuthPage)
];

const tabsWithPath = [];

for (const tab of tabs) {
	for (const route of routes) {
		if (route.name === tab) {
			tabsWithPath.push([tab, route.path]);
			break;
		}
	}
}

const root = document.getElementById("root");

if (!root) {
	throw new Error("Root element not found");
}

createRoot(root).render(
	<CacheContextProvider>
		<UserContextProvider>
			<App
				routes={routes}
				tabs={tabsWithPath}
			/>
		</UserContextProvider>
	</CacheContextProvider>
);
