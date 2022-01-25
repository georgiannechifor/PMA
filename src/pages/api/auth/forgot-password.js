import {dbConnect} from 'utils/dbConnect';
import User from 'models/user';
import {verify} from 'jsonwebtoken';
import {getUserById} from 'service/index';
import {
  STATUS_BAD_REQUEST,
  STATUS_OK,
  STATUS_NOT_FOUND,
  STATUS_UNAUTHORIZED,
  STATUS_METHOD_NOT_ALLOWED
} from 'constants/responseStatus';

dbConnect();

const forgotPasswordHandler = async (req, res) => {
  if (req.query && req.query.hasOwnProperty('access_token')) { // eslint-disable-line no-prototype-builtins
    req.headers.authorization = `${req.query.access_token}`;
  }

  await verify(req.headers.authorization, process.env.JWT_SECRET, async (error, decoded) => { // eslint-disable-line complexity, max-statements
    if (!error && decoded) {
      const user = await getUserById(decoded.id);
      const {method} = req;

      switch (method) {
        case 'POST': {
          try {
            const {email, newPassword} = req.body;

            if (email !== user.email) {
              return res.status(STATUS_BAD_REQUEST).json({
                message : 'You can not change other account\'s password'
              });
            }

            if (email && newPassword) {
              const foundUser = await User.findOne({email});

              if (foundUser) { // eslint-disable-line max-depth
                foundUser.password = newPassword;
                await foundUser.save();

                return res.status(STATUS_OK).json({
                  user    : foundUser,
                  message : 'Password changed successfully'
                });
              }

              return res.status(STATUS_NOT_FOUND).json({
                error : 'User not found'
              });
            }

            return res.status(STATUS_BAD_REQUEST).json({
              error : 'Please enter your email address and a new password'
            });
          } catch (err) {
            return res.status(STATUS_BAD_REQUEST).json({
              error : err.message
            });
          }
        }
        default : {
          return res.status(STATUS_METHOD_NOT_ALLOWED).json({
            error : 'Method not allowed'
          });
        }
      }
    }

    return res.status(STATUS_UNAUTHORIZED).json({
      message : 'You cannot access this endpoint without an auth token'
    });
  });
};

export default forgotPasswordHandler;
