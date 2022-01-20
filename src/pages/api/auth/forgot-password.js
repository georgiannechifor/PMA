import {dbConnect} from 'utils/dbConnect';
import User from 'models/user';
import { verify } from 'jsonwebtoken';
import { getUserById } from 'service/index';
import {
  STATUS_BAD_REQUEST,
  STATUS_OK,
  STATUS_METHOD_NOT_ALLOWED,
  STATUS_NOT_FOUND,
  STATUS_UNAUTHORIZED
} from 'constants/responseStatus';

dbConnect();

const forgotPasswordHandler = async (req, res) => {
  if(req.query && req.query.hasOwnProperty('access_token')) { // eslint-disable-line no-prototype-builtins
    req.headers.authorization = `${req.query.access_token}`;
  }

  verify(req.headers.authorization, process.env.JWT_SECRET, async (error, decoded) => {
    if(!error && decoded) {
      const user = await getUserById(decoded.id);
      const { method } = req;

      switch(method) {
        case "POST": {
          try {
            const { email, newPassword } = req.body;
            if(email !== user.email) {
              return res.status(STATUS_BAD_REQUEST).json({
                message: 'You can not change other account\'s password'
              })
            }

            if(email && newPassword) {
              const user = await User.findOne({email});

              if(user) {
                user.password = newPassword;
                await user.save()

                return res.status(STATUS_OK).json({
                  user : user,
                  message: 'Password changed successfully'
                });

              } return res.status(STATUS_NOT_FOUND).json({
                error : 'User not found'
              })
            }
            return res.status(STATUS_BAD_REQUEST).json({
              error : 'Please enter your email address and a new password'
            })
          } catch(error) {
            return res.status(STATUS_BAD_REQUEST).json({
              error : error.message
            })
          }
        }
      }
    }

    // TODO: send an email with an auth token

    return res.status(STATUS_UNAUTHORIZED).json({
      message : 'You cannot access this endpoint without an auth token'
    })
  });
};

export default forgotPasswordHandler;
