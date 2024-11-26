import pkg from 'pg';

const { Client } = pkg;

const client = new Client({
  user: 'farid',
  host: 'localhost',
  database: 'wbd',
  password: 'fjfj',
  port: 5433,
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
