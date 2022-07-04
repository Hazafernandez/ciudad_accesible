//const { query } = require('express');
const { generateError } = require('../helpers');
const { getConnection } = require('./db');

const getIssueById = async (id) => {
  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
    SELECT * FROM issues WHERE id=?
    `,
      [id]
    );
    if (result.length === 0) {
      generateError(
        `El problema de accesibilidad con id: ${id} no existe`,
        404
      );
    }
    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

const getAllIssues = async (req) => {
  let connection;
  try {
    connection = await getConnection();

    // saco el query string
    const { city, hood, status } = req.query;
    const validStatus = ['pendiente', 'resuelto'];
    let result;
    const statusIssue = validStatus.includes(status) ? status : '';

    if (city && hood) {
      result = await connection.query(
        `
      SELECT * FROM ciudad_accesible.issues 
      WHERE city=? AND hood=? ${
        statusIssue ? `AND status="${statusIssue}"` : ''
      } 
      ORDER BY created_at DESC`,
        [city, hood]
      );
    } else if (city) {
      result = await connection.query(
        `
      SELECT * FROM ciudad_accesible.issues WHERE city=? ${
        statusIssue ? `AND status="${statusIssue}"` : ''
      } 
      ORDER BY created_at DESC
      `,
        [city]
      );
    } else {
      result = await connection.query(
        `
      SELECT * FROM ciudad_accesible.issues 
      ${statusIssue ? `WHERE status="${statusIssue}"` : ''} 
      ORDER BY created_at DESC
      `,
        [city, hood]
      );
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

const createIssue = async (
  userId,
  title,
  description,
  city,
  hood,
  image = ``
) => {
  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
    INSERT INTO issues (user_id, title, description, city, hood, image) VALUES (?,?,?,?,?,?)
    `,
      [userId, title, description, city, hood, image]
    );
    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

const updateIssue = async (id, status) => {
  let connection;
  try {
    connection = await getConnection();
    //Obtenemos los datos que queremos modificar(status) por la id.
    const [current] = await connection.query(
      `
    SELECT * FROM issues WHERE id=?
    `,
      [id]
    );
    console.log('Antes del cambio', current);
    console.log('tamaño', current.length);
    if (current.length === 0) {
      generateError(
        `El problema de accesibilidad con id: ${id} no existe`,
        404
      );
    }

    await connection.query(
      `
      UPDATE ciudad_accesible.issues
      SET status = ?
      WHERE id = ?;
      `,
      [status, id]
    );
    const [currentEntry] = current;
    console.log('despues del cambio', currentEntry);

    return currentEntry;
  } finally {
    if (connection) connection.release();
  }
};

// get issue por city and hood
const getIssuesByCityAndHood = async (city, hood) => {
  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
    SELECT * FROM issues WHERE city=? AND hood=? 
    `,
      [city, hood]
    );
    if (result.length === 0) {
      generateError(
        `No hay incidencias de accesibilidad en el barrio ${hood} de la ciudad ${city}`,
        404
      );
    }
    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  getIssuesByCityAndHood,
};
