const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {STATUS_UNAUTHORIZED} = require('constants/index');

exports.authenticated = fn => async (req, res) => {
  if(req.query && req.query.hasOwnProperty('access_token')) { // eslint-disable-line no-prototype-builtins
    req.headers.authorization = `${req.query.access_token}`;
  }

  jwt.verify(req.headers.authorization, process.env.JWT_SECRET, async (error, decoded) => {
    if(!error && decoded) {
      req.userIDFromToken = decoded.id;
      return await fn(req, res);
    }

    res.status(STATUS_UNAUTHORIZED).json({
      error : 'You are not authenticated'
    })
  })
}
