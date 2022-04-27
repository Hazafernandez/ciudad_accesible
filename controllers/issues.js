const { createIssue } = require('../db/issues');
const { generateError } = require('../helpers');

const getIssuesController = async (req, res, next) => {
  try {
    res.send({
      status: 'error',
      message: 'Not implemented',
    });
  } catch (error) {
    next(error);
  }
};

const getIssueController = async (req, res, next) => {
  try {
    res.send({
      status: 'error',
      message: 'Not implemented',
    });
  } catch (error) {
    next(error);
  }
};

const newIssueController = async (req, res, next) => {
  // esto solo debe dejarlo al usuario que esté registrado (email y token) y <<además sea admin>>
  try {
    const { title } = req.body;
    if (!title || title.length > 200) {
      throw generateError(
        'El título debe existir y no puede tener más de 200 caracteres',
        400
      );
    }

    const { description } = req.body;
    if (!description || description.length > 500) {
      throw generateError(
        'La descripción debe existir y no puede tener más de 500 caracteres',
        400
      );
    }

    const { city } = req.body;
    if (!city || city.length > 200) {
      throw generateError(
        'La ciudad debe existir y no puede tener más de 200 caracteres',
        400
      );
    }

    const { hood } = req.body;
    if (!hood || hood.length > 200) {
      throw generateError(
        'El barrio debe existir y no puede tener más de 200 caracteres',
        400
      );
    }

    // pensar si se cambia por description / title
    // lo que tenía berto era lo siguiente
    /*  const {text} = req.body;
      if (!text || text.length > 500) {
      throw generateError(
        'La descripción debe existir y no puede tener más de 500 caracteres',
        400
      );
    } */

    const id = await createIssue(req.userId, title, description, city, hood);
    res.send({
      status: 'ok',
      message: `Nueva incidencia de accesibilidad creada con id: ${id}`,
    });
  } catch (error) {
    next(error);
  }
};

// borrar y actualizar

const deleteIssueController = async (req, res, next) => {
  try {
    res.send({
      status: 'error',
      message: 'Not implemented',
    });
  } catch (error) {
    next(error);
  }
};

const updateIssueController = async (req, res, next) => {
  try {
    res.send({
      status: 'error',
      message: 'Not implemented',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIssuesController,
  getIssueController,
  newIssueController,
  deleteIssueController,
  updateIssueController,
};
