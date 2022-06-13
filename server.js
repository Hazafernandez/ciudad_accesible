// utilizo modulo dotenv para leer variables de entorno desde .env
require('dotenv').config();

const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

const {
  newUserController,
  getUserController,
  loginController,
  getUserInfoController,
} = require('./controllers/users');

const {
  getIssuesController,
  getSingleIssueController,
  newIssueController,
  updateIssueController,
  getCitiesController,
  getHoodsControler,
} = require('./controllers/issues');

const { authUser } = require('./middlewares/auth');
//const { isAdmin } = require('./middlewares/isAdmin');

const app = express();

app.use(cors());

// para que compruebe si la petición tiene algún tipo de archivo binario (imagenes aquí) y lo prepare para leerlo
app.use(fileUpload());
// para que intente procesar los datos formato JSON de las peticiones postman
app.use(express.json());
// primer middleware es llamar a morgan
app.use(morgan('dev'));
// le decimos a express que sirva el directorio uploads como dir estatico
app.use('/uploads', express.static('./uploads'));

//--Rutas (controladores que gestionan las rutas: users e issues):
//--Rutas de usuario (users):
//1. end-point que registra un nuevo usuario.
app.post('/user', newUserController);
//2. end-point que obtiene usuario por id.
app.get('/user/:id', getUserController);
//3. end-point que logea usuario existente.
app.post('/login', loginController);
//4. end-point que obtiene información de usuario según token.
app.get('/user', authUser, getUserInfoController);

//--Rutas de incidencias (issues).
//1. end-point que registra una nueva incidencia.
app.post('/issue', authUser, newIssueController); // issue
//2. end-point que devuelve las issues
// En el caso de querer obtener por ciudad/barrio, Ej: http://localhost:3000/issues?city=madrid&hood=chueca&status=active
app.get('/issues', getIssuesController);
//3. end-point que devuelve una incidencia por id.
app.get('/issue/:id', getSingleIssueController);
//4. end-point que actualiza el estado de la incidencia(resuelto/pendiente)
app.put('/issue/:id', authUser, updateIssueController);
//5. end-point que devuelve todas las ciudades con incidencias registradas.
app.get(`/cities`, getCitiesController);
//6. end-point que devuelve los barrios de una ciudad en concreto.
app.get(`/hoods`, getHoodsControler);

// Like a una incidencia
// POST - /likes/:id/votes ✅
// Sólo usuarios registrados
//app.post("/issue/:id/likes", authUser, entryExists, voteEntry);

// Ver votos de una entrada
// GET - /entries/:id/votes ✅
// Público
//app.get("/entries/:id/votes", entryExists, getEntryVotes);

//--Middleware que se encarga de gestionar lo que no pasa por el resto de rutas
//1. Middleware de 404 - Not found.
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not found',
  });
});

//2. Middleware de error.
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    error: 'error',
    message: error.message,
  });
});

app.listen(3000, () => {
  console.log('Servidor funcionando...');
});
