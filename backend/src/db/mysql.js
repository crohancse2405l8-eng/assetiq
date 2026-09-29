import 'dotenv/config';
import mysql from 'mysql2/promise';

let pool;

function getPool() {
  if (pool) {
    return pool;
  }

  const { DB_NAME: database, DB_USER: user } = process.env;

  if (!database || !user) {
    throw new Error('DB_NAME and DB_USER must be configured');
  }

  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    database,
    user,
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

export async function query(sql, parameters = []) {
  const [result] = await getPool().execute(sql, parameters);
  return result;
}

export async function ping() {
  const connection = await getPool().getConnection();

  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}

export async function close() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}