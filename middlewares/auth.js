const jwt = require('jsonwebtoken');
const { generateError } = require('../helpers');

const authUser = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw generateError('Falta la cabezera de authorization', 404);
    }

    //Comprobamos que el token sea correcto
    let token;

    try {
      token = jwt.verify(authorization, process.env.SECRET);
    } catch {
      throw generateError('Token incorrecto', 401);
    }

    console.log('token------', token);

    //Metemos la información del token en la requesta para usarla en el controlador
    req.userId = token.id; // el nombre de "userId" lo decicimos nosotros. Al ser req objeto de js.

    //Saltamos al controlador
    next();

    console.log('pasamos al controlador');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authUser,
};
