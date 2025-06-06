import React from "react";
import DataHandlerInstance from "../../utils/DataHandler.ts";
import Sharding from "../Sharding.tsx";
import BasePage from "./BasePage.jsx";

function LogoutPage() {
	React.useEffect(() => {
		(async () => {
			const response = await DataHandlerInstance.logout();

			if (response.result) {
				window.location.href = "/";
			}
		})();
	}, []);

	return (
		<BasePage title="Logging you out">
			<Sharding />
		</BasePage>
	);
}

export default LogoutPage;
