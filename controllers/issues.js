const {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
} = require('../db/issues');
const { generateError, createPathIfNotExists } = require('../helpers');
const path = require('path');
const sharp = require('sharp');
const { nanoid } = require('nanoid');
/* const { getConnection } = require('../db/db'); */
//const { editEntrySchema } = require('../validators/validators');
//const { status } = require('express/lib/response');

const getIssuesController = async (req, res, next) => {
  try {
    const issues = await getAllIssues(req);
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
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

const newIssueController = async (req, res, next) => {
  console.log('req HEADEEEEERS', req.headers);
  // esto solo debe dejarlo al usuario que esté registrado (email y token) y <<además sea admin>>
  try {
    console.log('REQBODY', req.body);

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

    const issue = await getIssueById(id);

    console.log('USER NUEVA INCIDENCIA', req.userId);
    res.send({
      status: 'ok',
      message: `Nueva incidencia de accesibilidad creada con id: ${id}`,
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

const updateIssueController = async (req, res, next) => {
  try {
    const idIssue = req.params.id;
    const statusIssue = req.body.status;
    let issues = await updateIssue(idIssue, statusIssue);
    issues.status = statusIssue; // mirar
    res.send({
      status: 'ok',
      message: `Se ha actualizado el estado de la incidencia ${idIssue} a ${statusIssue}`,
      data: issues,
    });
  } catch (error) {
    next(error);
  }
};

//obtener ciudades
const getCitiesController = async (req, res, next) => {
  try {
    const issues = await getAllIssues(req);
    const allCities = issues.map((issue) => issue.city);
    const cities = [...new Set(allCities)];
    cities.sort();

    res.send({
      status: 'ok',
      data: cities,
    });
  } catch (error) {
    next(error);
  }
};

//obtener barrios
const getHoodsControler = async (req, res, next) => {
  try {
    console.log('req.query', req.query);
    const issues = await getAllIssues(req);
    const allHoods = issues.map((issue) => issue.hood);
    const hoods = [...new Set(allHoods)];
    hoods.sort();

    res.send({
      status: 'ok',
      data: hoods,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIssuesController,
  getSingleIssueController,
  newIssueController,
  updateIssueController,
  getCitiesController,
  getHoodsControler,
};
