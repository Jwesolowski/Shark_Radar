import esbuild from "esbuild";

const startTime = Date.now();

console.log(`[${new Date().toLocaleTimeString()}] Distribution Build Started...`);

esbuild.buildSync({
	entryPoints: ["src/index.jsx"],
	platform: "browser",
	bundle: true,
	minify: true,
	target: "esnext",
	outfile: "public/main.js",
	external: ["*.png", "*.ttf"]
});

esbuild.buildSync({
	entryPoints: ["server/server.ts"],
	platform: "node",
	bundle: true,
	minify: true,
	packages: "external",
	target: "esnext",
	format: "esm",
	outfile: "app.js"
});

const endTime = Date.now();
const seconds = (endTime - startTime) / 1000;

console.log(`[${new Date().toLocaleTimeString()}] Distribution Build Complete (${seconds}s)`);
