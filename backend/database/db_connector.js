import pkg from 'pg';

const { Client } = pkg;

const client = new Client({
  user: process.env.POSTGRES_USER || 'farid',
  host: process.env.POSTGRES_HOST  || 'db',
  database: process.env.POSTGRES_DB  || 'wbd',
  password: process.env.POSTGRES_PASSWORD || 'fjfj',
  port:process.env.PORT  || 5433,
});


async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL via pg Client');
  } catch (err) {
    console.error('Connection error', err.stack);
  }
}


const database = { client, connectDB };
export default database;
