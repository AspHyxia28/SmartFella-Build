import mysql from 'mysql2/promise';

async function initDB() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // No password
  });

  // Create the database if it doesn't exist
  await connection.query(`CREATE DATABASE IF NOT EXISTS relic`);

  // Connect to the newly created database
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // No password
    database: 'relic',
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

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Playable_Characters (
      id VARCHAR(255) PRIMARY KEY,
      picture VARCHAR(256),
      name VARCHAR(255),
      rarity VARCHAR(255),
      path VARCHAR(255),
      combat_type VARCHAR(255)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Relic_Set (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255),
      head VARCHAR(255),
      hands VARCHAR(255),
      body VARCHAR(255),
      feet VARCHAR(255),
      sphere VARCHAR(255),
      rope VARCHAR(255)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Relic_Headpiece (
      id VARCHAR(255) PRIMARY KEY,
      main_stat VARCHAR(255),
      main_stat_num int,
      substat_1 VARCHAR(255),
      substat_1_num int,
      substat_2 VARCHAR(255),
      substat_2_num int,
      substat_3 VARCHAR(255),
      substat_3_num int,
      substat_4 VARCHAR(255),
      substat_4_num int,
      Relic_Set_id VARCHAR(255),
      FOREIGN KEY (Relic_Set_id) REFERENCES Relic_Set(id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Relic_Handpiece (
      id VARCHAR(255) PRIMARY KEY,
      main_stat VARCHAR(255),
      main_stat_num int,
      substat_1 VARCHAR(255),
      substat_1_num int,
      substat_2 VARCHAR(255),
      substat_2_num int,
      substat_3 VARCHAR(255),
      substat_3_num int,
      substat_4 VARCHAR(255),
      substat_4_num int,
      Relic_Set_id VARCHAR(255),
      FOREIGN KEY (Relic_Set_id) REFERENCES Relic_Set(id)
    )
  `);
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Relic_Bodypiece (
      id VARCHAR(255) PRIMARY KEY,
      main_stat VARCHAR(255),
      main_stat_num int,
      substat_1 VARCHAR(255),
      substat_1_num int,
      substat_2 VARCHAR(255),
      substat_2_num int,
      substat_3 VARCHAR(255),
      substat_3_num int,
      substat_4 VARCHAR(255),
      substat_4_num int,
      Relic_Set_id VARCHAR(255),
      FOREIGN KEY (Relic_Set_id) REFERENCES Relic_Set(id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Relic_Feetpiece (
      id VARCHAR(255) PRIMARY KEY,
      main_stat VARCHAR(255),
      main_stat_num int,
      substat_1 VARCHAR(255),
      substat_1_num int,
      substat_2 VARCHAR(255),
      substat_2_num int,
      substat_3 VARCHAR(255),
      substat_3_num int,
      substat_4 VARCHAR(255),
      substat_4_num int,
      Relic_Set_id VARCHAR(255),
      FOREIGN KEY (Relic_Set_id) REFERENCES Relic_Set(id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Relic_Planarsphere (
      id VARCHAR(255) PRIMARY KEY,
      main_stat VARCHAR(255),
      main_stat_num int,
      substat_1 VARCHAR(255),
      substat_1_num int,
      substat_2 VARCHAR(255),
      substat_2_num int,
      substat_3 VARCHAR(255),
      substat_3_num int,
      substat_4 VARCHAR(255),
      substat_4_num int,
      Relic_Set_id VARCHAR(255),
      FOREIGN KEY (Relic_Set_id) REFERENCES Relic_Set(id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Relic_Linkrope (
      id VARCHAR(255) PRIMARY KEY,
      main_stat VARCHAR(255),
      main_stat_num int,
      substat_1 VARCHAR(255),
      substat_1_num int,
      substat_2 VARCHAR(255),
      substat_2_num int,
      substat_3 VARCHAR(255),
      substat_3_num int,
      substat_4 VARCHAR(255),
      substat_4_num int,
      Relic_Set_id VARCHAR(255),
      FOREIGN KEY (Relic_Set_id) REFERENCES Relic_Set(id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Character_Build (
      id VARCHAR(255) PRIMARY KEY,
      Playable_Characters_id VARCHAR(255),
      Relic_Headpiece_id VARCHAR(255),
      Relic_Handpiece_id VARCHAR(255),
      Relic_Bodypiece_id VARCHAR(255),
      Relic_Feetpiece_id VARCHAR(255),
      Relic_Planarsphere_id VARCHAR(255),
      Relic_Linkrope_id VARCHAR(255),
      FOREIGN KEY (Playable_Characters_id) REFERENCES Playable_Characters(id),
      FOREIGN KEY (Relic_Headpiece_id) REFERENCES Relic_Headpiece(id),
      FOREIGN KEY (Relic_Handpiece_id) REFERENCES Relic_Handpiece(id),
      FOREIGN KEY (Relic_Bodypiece_id) REFERENCES Relic_Bodypiece(id),
      FOREIGN KEY (Relic_Feetpiece_id) REFERENCES Relic_Feetpiece(id),
      FOREIGN KEY (Relic_Planarsphere_id) REFERENCES Relic_Planarsphere(id),
      FOREIGN KEY (Relic_Linkrope_id) REFERENCES Relic_Linkrope(id)
    )
  `);

  console.log('Database and table initialized');
  await connection.end();
  await pool.end();
}

initDB().catch((err) => {
  console.error('Error initializing database:', err);
});