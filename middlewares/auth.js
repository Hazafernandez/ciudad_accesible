const jwt = require('jsonwebtoken');
const { generateError } = require('../helpers');

const authUser = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    console.log('Authorization del authUser', authorization);
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
    console.log('token id:', token.id); // a borrar si funciona (OK HASTA AQUI FUNCIONA)

    //Metemos la información del token en la request para usarla en el controlador
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
