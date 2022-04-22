require('dotenv').config();

const { getConnection } = require('./db');

async function main() {
  let connection;

  try {
    connection = await getConnection();
    console.log('creando tablas');
    await connection.query(`
        CREATE TABLE administrador (
            id INTEGET PRIMARY KEY AUTO_INCREMENT, 
            Título VARCHAR(255) NOT NULL,
            Descripción VARCHAR(255) NOT NULL,
            Foto LONGBLOB,
            Ciudad VARCHAR(50) NOT NULL,
            Barrio VARCHAR(50) NOT NULL,
            PRIMARY KEY (id)

        )
   ` );
   

  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

main();
