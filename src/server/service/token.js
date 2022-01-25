const jwt = require('jsonwebtoken');
const {STATUS_UNAUTHORIZED} = require('constants/index');

exports.authenticated = fn => async (req, res) => {
  if (req.query && req.query.hasOwnProperty('authToken')) { // eslint-disable-line no-prototype-builtins
    req.cookies.authToken = `${req.query.access_token}`;
  }

  await jwt.verify(req.cookies.authToken, process.env.JWT_SECRET, async (error, decoded) => {
    if (!error && decoded) {
      req.userIDFromToken = decoded.id;

      // eslint-disable-next-line no-return-await
      return await fn(req, res);
    }

    return res.status(STATUS_UNAUTHORIZED).json({
      error : 'You are not authenticated'
    });
  });
};
