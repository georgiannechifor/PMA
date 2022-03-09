import {dbConnect} from 'utils/dbConnect';
import Team from 'models/team';
import User from 'models/user';
import {
  STATUS_OK,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND
} from 'constants/responseStatus';
import {USER_ROLES} from 'constants/userRoles';

dbConnect();

const teamHandler = async (req, res) => { // eslint-disable-line complexity, max-statements
  const {query : {id}, method} = req;

  switch (method) {
    case 'PUT': {
      try {
        const team = await Team
          .findByIdAndUpdate(id, req.body, {
            new           : true,
            runValidators : true
          });

        if (team.admin) {
          await User.findByIdAndUpdate(req.body.admin, {
            jobTitle : USER_ROLES.USER
          });

          await User.updateMany({
            _id      : {$ne : req.body.admin}, // eslint-disable-line no-underscore-dangle
            team     : team._id, // eslint-disable-line no-underscore-dangle
            jobTitle : USER_ROLES.ADMIN
          }, {
            jobTitle : USER_ROLES.USER
          });

          await User.findByIdAndUpdate(team.admin, {
            jobTitle : USER_ROLES.ADMIN
          });
        }

        if (!team) {
          return res.status(STATUS_NOT_FOUND).json({
            message : 'Team not found'
          });
        }

        return res.status(STATUS_OK).json({
          data : team
        });
      } catch (error) {
        return res.status(STATUS_BAD_REQUEST).json({
          message : error.message
        });
      }
    }
    case 'DELETE': {
      try {
        const deletedUser = await Team.deleteOne({_id : id});

        if (!deletedUser) {
          return res.status(STATUS_NOT_FOUND).json({
            message : 'Team not deleted'
          });
        }

        return res.status(STATUS_OK).json({
          data : {}
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

export default teamHandler;
