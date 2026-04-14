import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (pool) return pool;
  pool = new Pool({
    host: process.env.AZURE_PG_HOST,
    port: Number(process.env.AZURE_PG_PORT ?? 5432),
    database: process.env.AZURE_PG_DATABASE,
    user: process.env.AZURE_PG_USER,
    password: process.env.AZURE_PG_PASSWORD,
    ssl: process.env.AZURE_PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: 10,
  });
  return pool;
}
