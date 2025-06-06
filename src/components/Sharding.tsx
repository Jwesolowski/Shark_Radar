import React from "react";
import { Assets } from "../utils/enums/index.ts";
import Image from "./Image.jsx";

function Sharding() {
	return (
		<Image
			src={Assets.SHARDING}
			alt="Sharding"
			width={96}
			height={96}
			sx={{ m: "auto" }}
		/>
	);
}

export default Sharding;
