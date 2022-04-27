const { generateError } = require('../helpers');
const { getConnection } = require('./db');

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
};
