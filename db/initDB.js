require('dotenv').config();

const { getConnection } = require('./db');
const bcrypt = require('bcrypt');

async function main() {
  let connection;

  console.log('main');
  // Creacion de base de datos

  try {
    connection = await getConnection();

    console.log('Borrando tablas existentes');
    await connection.query('DROP TABLE IF EXISTS likes');
    await connection.query('DROP TABLE IF EXISTS issues');
    await connection.query('DROP TABLE IF EXISTS users');

    console.log('Creando tablas');
    await connection.query(`
        CREATE TABLE users (
          id INTEGER PRIMARY KEY AUTO_INCREMENT, 
          username VARCHAR(100) UNIQUE,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(100) NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          role ENUM('admin','normal') DEFAULT "normal" NOT NULL  
            )
   `);

    await connection.query(`
   CREATE TABLE issues (
       id INTEGER PRIMARY KEY AUTO_INCREMENT, 
       user_id INTEGER NOT NULL,
       title VARCHAR(200) NOT NULL,
       description VARCHAR(500) NOT NULL,
       image VARCHAR(100),
       city VARCHAR(200) NOT NULL,
       hood VARCHAR(200) NOT NULL,
       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
       status ENUM('resuelto','pendiente') DEFAULT "pendiente",
       FOREIGN KEY (user_id) REFERENCES users(id)        
       )
`);
    await connection.query(`
   CREATE TABLE likes (
       id INTEGER PRIMARY KEY AUTO_INCREMENT, 
       user_id INTEGER NOT NULL,
       issue_id INTEGER NOT NULL,
       likes TINYINT NOT NULL,
       FOREIGN KEY (user_id) REFERENCES users(id),
       FOREIGN KEY (issue_id) REFERENCES issues(id)      
       )
`);

    // Creamos el user "admin" automáticamente con email y password definida en el archivo .env.
    console.log('Creando usuario administrador');
    const passwordHash = await bcrypt.hash(
      process.env.DEFAULT_ADMIN_PASSWORD,
      8
    );

    await connection.query(
      `
  INSERT INTO users(username, email, password, role)
  VALUES("${process.env.DEFAULT_ADMIN_USERNAME}","${process.env.DEFAULT_ADMIN_EMAIL}", "${passwordHash}", "admin")
`
    );
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

main();
