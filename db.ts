import { Pool } from 'pg';

const config = {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: process.env.NODE_ENV === 'production' 
        ? { rejectUnauthorized: true } 
        : false
};

const pool = new Pool(config);

pool.on('error', (err) => {
    console.error('Unexpected error on PostgreSQL client', err);
    process.exit(-1);
  });

//Test Connection
const testConnection = async () => {
    try {
      const client = await pool.connect();
      console.log('Database connection established successfully');
      client.release();
    } catch (err) {
      console.error('Failed to connect to database:', err);
    }
  };
  
  testConnection();

export default pool;

