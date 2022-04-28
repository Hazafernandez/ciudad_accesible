const { createIssue, getAllIssues, getIssueById } = require('../db/issues');
const { generateError, createPathIfNotExists } = require('../helpers');
const path = require('path');
const sharp = require('sharp');
const { nanoid } = require('nanoid');

const getIssuesController = async (req, res, next) => {
  try {
    const issues = await getAllIssues();
    res.send({
      status: 'ok',
      data: issues,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleIssueController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const issue = await getIssueById(id);
    res.send({
      status: 'ok',
      message: issue,
    });
  } catch (error) {
    next(error);
  }
};

const newIssueController = async (req, res, next) => {
  // esto solo debe dejarlo al usuario que esté registrado (email y token) y <<además sea admin>>
  try {
    console.log(req.body);
    console.log(req.files);

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
    let imageFileName;

    if (req.files && req.files.image) {
      //Creamos path del directorio uploads
      const uploadsDir = path.join(__dirname, '../uploads');

      //Creamos directorio si no existe
      await createPathIfNotExists(uploadsDir);

      //Procesar imagen
      const image = sharp(req.files.image.data);
      //image.resize(800);

      // Guardamos la imagen con nombre aleatorio en uploads
      imageFileName = `${nanoid(25)}.jpg`;

      await image.toFile(path.join(uploadsDir, imageFileName));
    }

    const id = await createIssue(
      req.userId,
      title,
      description,
      city,
      hood,
      imageFileName
    );
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
  getSingleIssueController,
  newIssueController,
  deleteIssueController,
  updateIssueController,
};
