const bcrypt = require('bcrypt');
const { generateError } = require('../helpers');
const { getConnection } = require('./db');

// Crea un usuario en la base de datos y devuelve la id
const createUser = async (email, password) => {
  let connection;

  try {
    connection = await getConnection();
    //Comprobar que no exista otro usuario con ese email y nick
    const [user] = await connection.query(
      `
        SELECT id FROM users WHERE email = ?
      `,
      [email]
    );

    if (user.length > 0) {
      throw generateError(
        'Ya existe un usuario en la base de datos con ese email',
        409
      );
    }

    //Encriptar la password
    const passwordHash = await bcrypt.hash(password, 8);

    //Crear el usuario
    const [newUser] = await connection.query(
      `
        INSERT INTO users (email, password) VALUES(?, ?)
      `,
      [email, passwordHash]
    );

    //Devolver la id
    return newUser.insertId;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createUser,
};
