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

/////// ESCOGER BARRIO DE UNA CIUDAD Y VER INCIDENCIAS (TODAS)

const getIssueByHood = async (city, hood) => {
  let connection;
  try {
    connection = await getConnection();
    const prueba = req.body;

    const [result] = await connection.query(
      `
    SELECT * FROM ciudad_accesible.issues WHERE city=? AND hood=? 
    `,
      [city, hood]
    );

    if (result.length === 0) {
      generateError(
        `No hay incidencias de accesibilidad en el barrio ${hood} de la ciuidad ${city}`,
        404
      );
    }
    return result;
  } finally {
    if (connection) connection.release();
  }
};

/////////////

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
    if (current.length === 0) {
      generateError(
        `El problema de accesibilidad con id: ${id} no existe`,
        404
      );
    }

    //sacamos los datos
    //console.log(req.params.id);
    //console.log('1. req.body----', req.body);

    //const { status, issueId } = req.body;
    //const {id} = req.params.id;
    //console.log('Issue-id---', issueId);

    //seleccionar datos actuales de entrada

    /*     const [current] = await connection.query(
      `
      SELECT id, user_id, status
      FROM ciudad_accesible.issues
      WHERE id=?
      `,
      [issueId]
    ); */

    /*  if (currentEntry.user_id !== req.auth.id && req.auth.role !== 'admin') {
      throw generateError('No tienes permisos para editar esta entrada', 403);
    } */

    //Ejecutar la query de edicion del status

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

module.exports = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  getIssueByHood,
};
