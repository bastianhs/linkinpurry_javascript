import { Client } from 'pg';

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
      console.log('Connected to PostgreSQL');
    } catch (err) {
      console.error('Connection error', err.stack);
    }
  }

connectDB();


export default client;

