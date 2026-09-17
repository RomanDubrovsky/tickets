import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL.replace('?sslmode=require', '');
const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function cleanupAndCreateDb() {
  try {
    console.log('Cleaning up prevention_prod...');
    await pool.query('DROP TABLE IF EXISTS bookings CASCADE;');
    await pool.query('DROP TABLE IF EXISTS events CASCADE;');
    await pool.query('DROP TABLE IF EXISTS halls CASCADE;');
    await pool.query('DROP TABLE IF EXISTS agents CASCADE;');
    await pool.query('DROP TABLE IF EXISTS ships CASCADE;');
    console.log('Successfully dropped tables from prevention_prod.');

    console.log('Attempting to create ships_prod database...');
    // Postgres does not allow CREATE DATABASE inside a transaction block, so we execute it directly
    await pool.query('CREATE DATABASE ships_prod;');
    console.log('Successfully created ships_prod!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

cleanupAndCreateDb();
