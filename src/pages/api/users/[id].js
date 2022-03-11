import {dbConnect} from 'utils/dbConnect';
import User from 'models/user';
import Team from 'models/team';
import {
  STATUS_OK,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND
} from 'constants/responseStatus';
import {USER_ROLES} from 'constants/userRoles';

dbConnect();

const userHandler = async (req, res) => { // eslint-disable-line complexity, max-statements
  const {query : {id}, method} = req;

  switch (method) {
    case 'GET': {
      try {
        const user = await User.findById(id).select(['-__v', '-password']);

        if (user) {
          return res.status(STATUS_OK).json({
            data : user
          });
        }

        return res.status(STATUS_NOT_FOUND).json({
          message : 'User not found'
        });
      } catch (error) {
        return res.status(STATUS_BAD_REQUEST).json({
          message : error.message
        });
      }
    }
    case 'PUT': {
      try {
        const user = await User
          .findByIdAndUpdate(id, req.body, {
            new           : true,
            runValidators : true
          })
          .select(['-__v', '-password']);

        if (user.team && user.jobTitle === USER_ROLES.ADMIN) {
          await User.updateMany({
            _id      : {$ne : user._id}, // eslint-disable-line no-underscore-dangle
            team     : user.team,
            jobTitle : USER_ROLES.ADMIN
          }, {
            jobTitle : USER_ROLES.USER
          });
          await Team.findByIdAndUpdate(user.team, {
            admin : user._id // eslint-disable-line no-underscore-dangle
          });
        }

        if (!user) {
          return res.status(STATUS_NOT_FOUND).json({
            message : 'User not found'
          });
        }

        return res.status(STATUS_OK).json({
          data : user
        });
      } catch (error) {
        return res.status(STATUS_BAD_REQUEST).json({
          message : error.message
        });
      }
    }
    case 'DELETE': {
      try {
        const deletedUser = await User.deleteOne({_id : id});

        if (!deletedUser) {
          return res.status(STATUS_NOT_FOUND).json({
            message : 'User not deleted'
          });
        }

        return res.status(STATUS_OK).json({
          data : deletedUser
        });
      } catch (error) {
        return res.status(STATUS_OK).json({
          message : error.message
        });
      }
    }
    default: {
      return res.status(STATUS_BAD_REQUEST).json({
        message : 'Method not allowed'
      });
    }
  }
};

export default userHandler;
