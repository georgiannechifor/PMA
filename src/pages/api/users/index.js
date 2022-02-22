import {dbConnect} from 'utils/dbConnect';
import User from 'models/user';
import {authenticated} from 'service/index';

import {
  STATUS_METHOD_NOT_ALLOWED,
  STATUS_NOT_FOUND,
  STATUS_OK,
  STATUS_FORBIDDEN
} from 'constants/responseStatus';
import {USER_ROLES} from 'constants/userRoles';

dbConnect();

const usersHandler = authenticated(async (req, res) => {
  const {method} = req;

  switch (method) {
    case 'GET': {
      try {
        let query = {};
        const user = await User.findById(req.userIDFromToken);
    
        if(user.jobTitle === USER_ROLES.SUPER_ADMIN) {
            query = {}
        } else if(user.jobTitle === USER_ROLES.ADMIN && user.team) {
          query = {
            team : user.team
          }
        } else {
          return res.status(STATUS_FORBIDDEN).json({
            message : "Simple user cannot access this endpoint"
          })
        }

        const users = await User.find({...query, jobTitle : {$ne : USER_ROLES.SUPER_ADMIN}})
          .populate('team')
          .select(['-__v', '-password'])
          .exec();


        return res.status(STATUS_OK).json({
          data : users
        });
      } catch (error) {
        return res.status(STATUS_NOT_FOUND).json({
          error : error.message
        });
      }
    }
    default: {
      return res.status(STATUS_METHOD_NOT_ALLOWED).json({
        error : 'Method not allowed'
      });
    }
  }
});

export default usersHandler;
