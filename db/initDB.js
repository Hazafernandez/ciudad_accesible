require('dotenv').config();

const { getConnection } = require('./db');

async function main() {
  let connection;

  console.log('main');
  // Creacion de base de datos

  try {
    connection = await getConnection();

    console.log('Borrando tablas existentes');
    await connection.query('DROP TABLE IF EXISTS issues');
    await connection.query('DROP TABLE IF EXISTS users');

    console.log('Creando tablas');
    await connection.query(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTO_INCREMENT, 
            username VARCHAR(100) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP          
            )
   `);

    await connection.query(`
   CREATE TABLE issues (
       id INTEGER PRIMARY KEY AUTO_INCREMENT, 
       user_id INTEGER NOT NULL,
       tittle VARCHAR(200) NOT NULL,
       description VARCHAR(200) NOT NULL,
       image VARCHAR(100) NOT NULL,
       city VARCHAR(200) NOT NULL,
       hood VARCHAR(200) NOT NULL,
       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (user_id) REFERENCES users(id)        
       )
`);
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

main();
