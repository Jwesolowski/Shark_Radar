import fs from "fs";
import esbuild from "esbuild";

const startTime = Date.now();

const buildString = `
const page = document.createElement("div");
document.body.appendChild(page);
page.innerHTML = "[${new Date().toLocaleTimeString()}] Build in progress...";
page.style = "color: #101010; font-style: italic; text-align: center; z-index: 9999; background-color: #30e050; position: absolute; top: 0; left: 0; width: 100%;";
`;

console.log(`[${new Date().toLocaleTimeString()}] Build Started...`);

fs.writeFileSync("public/build.js", buildString, "utf8");

esbuild.buildSync({
	entryPoints: ["src/index.jsx"],
	platform: "browser", //should this be "node"? Dr.Thomas
	bundle: true,
	target: "esnext",
	outfile: "public/main.js",
	external: ["*.png", "*.ttf"]
});

esbuild.buildSync({
	entryPoints: ["server/server.ts"],
	platform: "node",
	bundle: true,
	packages: "external",
	target: "esnext",
	format: "esm",
	outfile: "app.js"
});

fs.writeFileSync("public/build.js", "// Nothing to see here...", "utf8");

const endTime = Date.now();
const seconds = (endTime - startTime) / 1000;

console.log(`[${new Date().toLocaleTimeString()}] Build Complete (${seconds}s)`);
