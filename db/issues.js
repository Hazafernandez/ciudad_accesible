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

const getAllIssues = async () => {
  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(`
    SELECT * FROM issues ORDER BY created_at DESC
    `);
    return result;
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
  // berto pone async (userId, text, image = ``) //
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

module.exports = {
  createIssue,
  getAllIssues,
  getIssueById,
};
