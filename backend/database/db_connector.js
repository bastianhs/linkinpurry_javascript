import pkg from "pg";
const { Client } = pkg;

const client = new Client({
	user: process.env.POSTGRES_USER,
	host: process.env.POSTGRES_HOST,
	database: process.env.POSTGRES_DB,
	password: process.env.POSTGRES_PASSWORD,
	port: parseInt(process.env.POSTGRES_PORT),
});

async function connectDB() {
	let retries = 5;
	while (retries) {
		try {
			await client.connect();
			console.log("Connected to PostgreSQL via pg Client");
			break;
		} catch (err) {
			console.log(`Failed to connect, retries left: ${retries}`);
			retries -= 1;
			// Wait 5 seconds
			await new Promise((res) => setTimeout(res, 5000));
		}
	}
}

const database = { client, connectDB };
export default database;
