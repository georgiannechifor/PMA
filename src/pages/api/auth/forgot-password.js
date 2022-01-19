import {dbConnect} from 'utils/dbConnect';
import User from 'models/user';


import {
  STATUS_BAD_REQUEST,
  STATUS_OK,
  STATUS_METHOD_NOT_ALLOWED,
  STATUS_NOT_FOUND
} from 'constants/responseStatus';

dbConnect();

const forgotPasswordHandler = async (req, res) => {
  const { method } = req;

  switch(method) {
    case "POST": {
      try {
        const { email, newPassword } = req.body;

        if(email && newPassword) {
          const user = await User.findOne({email});

          if(user) {
            user.password = newPassword;
            return user.save().then(doc => res.status(STATUS_OK).json({
              user : user,
              message: 'Password changed successfully'
            }))
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
};

export default forgotPasswordHandler;
