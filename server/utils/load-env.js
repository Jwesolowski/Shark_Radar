import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT ?? 3030;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const sessionSecret = process.env.SESSION_SECRET ?? "";
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY ?? "";

export { port, dbUsername, dbPassword, sessionSecret, googleMapsApiKey };
