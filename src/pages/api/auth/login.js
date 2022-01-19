import {dbConnect} from 'utils/dbConnect';
import User from 'models/user';

import {
  STATUS_BAD_REQUEST,
  STATUS_OK,
  STATUS_METHOD_NOT_ALLOWED,
  STATUS_NOT_FOUND
} from 'constants/responseStatus';

dbConnect();

const loginHandler = async (req, res) => {
  const {method} = req;

  switch (method) {
    case 'POST': {
        const { email, password } = req.body;
        if(email && password) {
          const user = await User.findOne({ email }).select(['-__v']);

          if(user) {
            const matched = await user.validatePassword(password);
            user.password = undefined;

            if(matched) {
              const token = user.getJwtToken();
              
              return res.status(STATUS_OK).json({
                data : user,
                accessToken : token
              })
            }
            return res.status(STATUS_BAD_REQUEST).json({
              error : 'Password not matched'
            })
          }
          return res.status(STATUS_NOT_FOUND).json({
            error: 'User not found'
          })
        }
        return res.status(STATUS_BAD_REQUEST).json({
          error: 'Please enter email and password'
        });
    }
    default : {
      return res.status(STATUS_METHOD_NOT_ALLOWED).json({
        error : 'Method not allowed'
      });
    }
  }
};

export default loginHandler;
