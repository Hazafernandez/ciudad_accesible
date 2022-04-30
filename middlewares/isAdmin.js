async function isAdmin(req, res, next) {
  if (req.auth.role === 'admin') {
    next();
  } else {
    const error = new Error('No tienes privilegios de administración');
    error.httpStatus = 403;
    next(error);
  }
}

module.exports = isAdmin;
