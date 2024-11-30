import mysql from 'mysql2/promise';

async function initDB() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // No password
  });

  // Create the database if it doesn't exist
  await connection.query(`CREATE DATABASE IF NOT EXISTS kitchen`);

  // Connect to the newly created database
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // No password
    database: 'kitchen',
  });

  // Create the users table if it doesn't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
    )
  `);

  console.log('Database and table initialized');
  await connection.end();
  await pool.end();
}

initDB().catch((err) => {
  console.error('Error initializing database:', err);
});