const bcrypt = require('bcrypt');
const { generateError } = require('../helpers');
const { getConnection } = require('./db');

// Obtener usuario por email.
const getUserByEmail = async (email) => {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.query(
      `
    SELECT * FROM users WHERE email = ? 
    `,
      [email]
    );

    if (result.length === 0) {
      throw generateError('No hay ningún usuario con esa email', 404);
    }
    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

// Devuelve la información pública de un usuario por su id
const getUserById = async (id) => {
  let connection;
  try {
    console.log('id del controlador', id); // a borrar si funciona.
    connection = await getConnection();
    const [result] = await connection.query(
      `
    SELECT id, username, email, created_at FROM users WHERE id = ? 
    `,
      [id]
    );

    if (result.length === 0) {
      throw generateError('No hay ningún usuario con esa id', 404);
    }
    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

// Devuelve la información pública de un usuario por su Pasword
const getUserByPassword = async (password) => {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.query(
      `
    SELECT id, username, email, created_at FROM users WHERE password = ? 
    `,
      [password]
    );

    if (result.length === 0) {
      throw generateError('No hay ningún usuario con ese Token', 404);
    }
    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

// Crea un usuario en la base de datos y devuelve la id
const createUser = async (username, email, password) => {
  let connection;

  try {
    connection = await getConnection();
    //Comprobar que no exista otro usuario con ese email y nick
    const [user] = await connection.query(
      `
        SELECT id, username FROM users WHERE email = ?
      `,
      [email]
    );

    if (user.length > 0) {
      throw generateError(
        'Ya existe un usuario en la base de datos con ese email',
        409
      );
    }
    if (user.username === username) {
      throw generateError(
        'Ya existe un usuario en la base de datos con ese username',
        409
      );
    }

    //Encriptar la password
    const passwordHash = await bcrypt.hash(password, 8);

    //Crear el usuario
    const [newUser] = await connection.query(
      `
        INSERT INTO users (username, email, password) VALUES(?, ?, ?)
      `,
      [username, email, passwordHash]
    );
    console.log('datos nuevo usuario regist', newUser);

    //Devolver la id
    return newUser.insertId;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByPassword,
};
