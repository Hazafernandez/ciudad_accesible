require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

const {
  newUserController,
  getUserController,
  loginController,
} = require('./controllers/users');

const {
  getIssuesController,
  getSingleIssueController,
  newIssueController,
  updateIssueController,
  getIssuesByHoodController,
} = require('./controllers/issues');

const { authUser } = require('./middlewares/auth');

const app = express();

// para que compruebe si la petición tiene algún tipo de archivo binario (imagenes aquí) y lo prepare para leerlo
app.use(fileUpload());
// para que intente procesar los datos formato JSON de las peticiones postman
app.use(express.json());
// primer middleware es llamar a morgan
app.use(morgan('dev'));
// le decimos a express que sirva el directorio uploads como dir estatico
app.use('/uploads', express.static('./uploads'));

//Rutas (controladores que gestionan las rutas: users e issues):
//Rutas de usuario (users)
app.post('/user', newUserController);
app.get('/user/:id', getUserController);
app.post('/login', loginController);

//Rutas de incidencias (issues)
app.post('/issue', authUser, newIssueController); // issue
// end-point que devuelve las issues
// Ej: http://localhost:3000/issues?city=madrid&hood=chueca&status=active
app.get('/issues', getIssuesController); //issues
app.get('/issue/:id', getSingleIssueController);
/* app.get(
  '/issues/ciudad/:ciudad/barrio/:barrio',
  getIssuesByHoodController
);  */ //isues por barrio
app.put('/issue/:id', authUser, updateIssueController); // actualizar/dar por finalizado

//1. Middleware que se encarga de gestionar lo que no pasa por el resto de rutas
// Middleware de 404 - Not found.
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not found',
  });
});

// Middleware de error.
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    error: 'error',
    message: error.message,
  });
});

// Lanzamos el servidor --- Guardar mejor en el .env. Poner console.log(url)
app.listen(3000, () => {
  console.log('Servidor funcionando...');
});
